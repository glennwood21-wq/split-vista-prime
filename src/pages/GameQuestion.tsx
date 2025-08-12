
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';

const GameQuestion: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [game, setGame] = useState<any>(null);
  const [question, setQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchGameAndQuestion = async () => {
      try {
        setLoading(true);
        
        // Fetch game details
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single();

        if (gameError) throw gameError;
        setGame(gameData);

        // Fetch current round question
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .select('*')
          .eq('game_id', gameId)
          .eq('round_number', gameData.current_round)
          .single();

        if (questionError) {
          if (questionError.code === 'PGRST116') {
            toast.error(`No question found for round ${gameData.current_round}`);
            return;
          }
          throw questionError;
        }
        setQuestion(questionData);

        // Check if user has already answered this question
        const { data: userAnswerData, error: userAnswerError } = await supabase
          .from('user_answers')
          .select('*')
          .eq('user_id', user.id)
          .eq('game_id', gameId)
          .eq('question_id', questionData.id)
          .single();

        if (userAnswerError && userAnswerError.code !== 'PGRST116') throw userAnswerError;
        
        if (userAnswerData) {
          setHasAnswered(true);
          setAnswer(userAnswerData.selected_answer);
        }

      } catch (error: any) {
        console.error('Error fetching data:', error.message);
        toast.error('Failed to load game question');
      } finally {
        setLoading(false);
      }
    };

    fetchGameAndQuestion();
  }, [gameId, user, navigate]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !gameId || !question || !answer) {
      toast.error('Please select an answer');
      return;
    }

    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('user_answers')
        .insert({
          user_id: user.id,
          game_id: gameId,
          question_id: question.id,
          round_number: game.current_round,
          selected_answer: answer,
          is_correct: null, // Will be evaluated later by admin/system
          eliminated: false
        });
        
      if (error) throw error;
      
      toast.success('Your answer has been submitted!');
      setHasAnswered(true);
      
    } catch (error: any) {
      console.error('Error submitting answer:', error.message);
      toast.error('Failed to submit your answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theSplit-navy text-theSplit-white">
        <Header />
        <div className="container mx-auto pt-32 pb-20 px-4">
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="text-theSplit-light/70">Loading question...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!game || !question) {
    return (
      <div className="min-h-screen bg-theSplit-navy text-theSplit-white">
        <Header />
        <div className="container mx-auto pt-32 pb-20 px-4">
          <div className="flex flex-col justify-center items-center min-h-[50vh]">
            <p className="text-xl text-theSplit-light/70 mb-4">Question not available</p>
            <Button 
              onClick={() => navigate(`/game/${gameId}`)} 
              className="bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy"
            >
              Back to Game Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theSplit-navy text-theSplit-white">
      <Header />
      <div className="container mx-auto pt-32 pb-20 px-4">
        <Button 
          onClick={() => navigate(`/game/${gameId}`)} 
          variant="outline"
          className="mb-6 border-theSplit-teal/50 text-theSplit-aqua hover:bg-theSplit-teal/10"
        >
          ← Back to Game
        </Button>

        <Card className="max-w-2xl mx-auto bg-theSplit-navy/80 border-theSplit-teal/20 text-theSplit-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-gradient mb-2">{game.name}</CardTitle>
                <p className="text-theSplit-light/70">
                  Round {game.current_round} of {game.total_rounds}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="glass-card rounded-lg p-6 mb-6 relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-theSplit-teal to-theSplit-aqua rounded-lg blur-sm opacity-30 -z-10"></div>
              <h2 className="text-xl font-semibold mb-4">Question:</h2>
              <p className="text-lg">{question.question_text}</p>
            </div>

            <form onSubmit={handleSubmitAnswer}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-theSplit-light/70 mb-4">
                    Select your answer:
                  </label>
                  <RadioGroup
                    value={answer}
                    onValueChange={setAnswer}
                    disabled={hasAnswered}
                    className="space-y-3"
                  >
                    {question.answer_options?.map((option: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-theSplit-navy/30 border border-theSplit-teal/20 hover:border-theSplit-teal/40 transition-colors">
                        <RadioGroupItem 
                          value={option} 
                          id={`option-${index}`}
                          className="text-theSplit-teal"
                        />
                        <Label 
                          htmlFor={`option-${index}`} 
                          className="text-theSplit-white cursor-pointer flex-1"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                {hasAnswered ? (
                  <div className="bg-theSplit-teal/20 border border-theSplit-teal/30 rounded-lg p-4 text-center">
                    <p className="text-theSplit-aqua">You've already submitted your answer!</p>
                  </div>
                ) : (
                  <Button 
                    type="submit"
                    disabled={submitting || !answer}
                    className="w-full bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy"
                  >
                    {submitting ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="border-t border-theSplit-teal/20 pt-4 text-theSplit-light/60 text-xs">
            Answers are final and cannot be changed once submitted.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default GameQuestion;
