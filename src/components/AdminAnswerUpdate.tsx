
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Question {
  id: string;
  question_text: string;
  round_number: number;
  correct_answer: string | null;
  answer_options: string[] | null;
}

interface AdminAnswerUpdateProps {
  gameId: string;
  currentRound: number;
  totalRounds: number;
  onAnswerUpdated?: () => void;
}

const AdminAnswerUpdate: React.FC<AdminAnswerUpdateProps> = ({ 
  gameId, 
  currentRound, 
  totalRounds,
  onAnswerUpdated 
}) => {
  const [questions, setQuestions] = useState<Record<number, Question>>({});
  const [correctAnswers, setCorrectAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>(currentRound.toString());
  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    fetchQuestions();
    fetchGame();
  }, [gameId]);

  const fetchGame = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (error) throw error;
      setGame(data);
    } catch (error: any) {
      console.error('Error fetching game:', error.message);
    }
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, round_number, correct_answer, answer_options')
        .eq('game_id', gameId)
        .order('round_number', { ascending: true });

      if (error) throw error;

      const questionsByRound: Record<number, Question> = {};
      const initialAnswers: Record<number, string> = {};
      
      data.forEach(question => {
        questionsByRound[question.round_number] = {
          ...question,
          answer_options: question.answer_options as string[] | null
        };
        initialAnswers[question.round_number] = question.correct_answer || '';
      });
      
      setQuestions(questionsByRound);
      setCorrectAnswers(initialAnswers);
    } catch (error: any) {
      console.error('Error fetching questions:', error.message);
      toast.error('Failed to load questions');
    }
  };

  const updateCorrectAnswer = async (roundNumber: number) => {
    if (!questions[roundNumber]) return;
    
    setLoading(prev => ({ ...prev, [roundNumber]: true }));
    
    try {
      // 1. Update the correct answer in the questions table
      const { error: questionError } = await supabase
        .from('questions')
        .update({ correct_answer: correctAnswers[roundNumber] })
        .eq('id', questions[roundNumber].id);
        
      if (questionError) throw questionError;
      
      // 2. Get all user answers for this question and update each one
      const { data: userAnswers, error: fetchError } = await supabase
        .from('user_answers')
        .select('id, selected_answer')
        .eq('question_id', questions[roundNumber].id);
        
      if (fetchError) throw fetchError;
      
      // Update each answer's correctness and elimination status
      for (const userAnswer of userAnswers || []) {
        const isCorrect = userAnswer.selected_answer === correctAnswers[roundNumber];
        const { error: updateError } = await supabase
          .from('user_answers')
          .update({ 
            is_correct: isCorrect,
            eliminated: !isCorrect
          })
          .eq('id', userAnswer.id);
          
        if (updateError) throw updateError;
      }
      
      // 3. Check if we should advance to the next round
      if (roundNumber === game.current_round && roundNumber < game.total_rounds) {
        const { error: gameUpdateError } = await supabase
          .from('games')
          .update({ current_round: roundNumber + 1 })
          .eq('id', gameId);
          
        if (gameUpdateError) throw gameUpdateError;
      }
      
      toast.success(`Round ${roundNumber} completed! ${roundNumber === game?.current_round && roundNumber < game?.total_rounds ? 'Game advanced to next round.' : 'Results updated.'}`);
      
      // Refresh game data
      await fetchGame();
      
      if (onAnswerUpdated) {
        onAnswerUpdated();
      }
    } catch (error: any) {
      console.error('Error updating answer:', error.message);
      toast.error('Failed to update answer: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, [roundNumber]: false }));
    }
  };

  return (
    <Card className="bg-theSplit-navy/80 border-theSplit-teal/20">
      <CardHeader>
        <CardTitle className="text-xl text-gradient">Update Correct Answers</CardTitle>
        <CardDescription className="text-theSplit-light/70">
          Set the correct answer for each round and automatically update participant results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 sm:grid-cols-5 bg-theSplit-navy/90 border border-theSplit-teal/20 mb-4">
            {Array.from({ length: totalRounds }, (_, i) => i + 1).map(round => (
              <TabsTrigger
                key={round}
                value={round.toString()}
                className="data-[state=active]:bg-theSplit-teal/20 data-[state=active]:text-theSplit-aqua"
              >
                Round {round}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Array.from({ length: totalRounds }, (_, i) => i + 1).map(round => (
            <TabsContent key={round} value={round.toString()}>
              {questions[round] ? (
                <div className="space-y-4">
                  <div className="p-4 bg-theSplit-navy/60 rounded-md">
                    <h3 className="text-lg font-medium text-theSplit-aqua mb-2">Question:</h3>
                    <p className="text-theSplit-white">{questions[round].question_text}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-theSplit-light">
                      Select Correct Answer
                    </label>
                    <RadioGroup
                      value={correctAnswers[round] || ''}
                      onValueChange={(value) => setCorrectAnswers(prev => ({ ...prev, [round]: value }))}
                      className="space-y-3"
                    >
                      {questions[round].answer_options?.map((option: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-theSplit-navy/30 border border-theSplit-teal/20">
                          <RadioGroupItem 
                            value={option} 
                            id={`round-${round}-option-${index}`}
                            className="text-theSplit-teal"
                          />
                          <Label 
                            htmlFor={`round-${round}-option-${index}`} 
                            className="text-theSplit-white cursor-pointer flex-1"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button
                      onClick={() => updateCorrectAnswer(round)}
                      disabled={loading[round] || !correctAnswers[round]}
                      className="w-full bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy"
                    >
                      {loading[round] ? 'Updating...' : 'Update Correct Answer'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-theSplit-light/70">
                  <p>No question found for round {round}</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminAnswerUpdate;
