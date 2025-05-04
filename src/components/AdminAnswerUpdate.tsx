
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  useEffect(() => {
    fetchQuestions();
  }, [gameId]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, round_number, correct_answer')
        .eq('game_id', gameId)
        .order('round_number', { ascending: true });

      if (error) throw error;

      const questionsByRound: Record<number, Question> = {};
      const initialAnswers: Record<number, string> = {};
      
      data.forEach(question => {
        questionsByRound[question.round_number] = question;
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
      
      // 2. Update all user answers for this question to set is_correct based on if they match
      const { error: answersError } = await supabase
        .rpc('update_user_answers_correctness', { 
          question_id_param: questions[roundNumber].id,
          correct_answer_param: correctAnswers[roundNumber]
        });
        
      if (answersError) throw answersError;
      
      toast.success(`Correct answer for round ${roundNumber} updated successfully!`);
      
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
                  
                  <div className="space-y-2">
                    <label htmlFor={`answer-${round}`} className="block text-sm font-medium text-theSplit-light">
                      Correct Answer
                    </label>
                    <div className="flex gap-4">
                      <Input
                        id={`answer-${round}`}
                        value={correctAnswers[round] || ''}
                        onChange={(e) => setCorrectAnswers(prev => ({ ...prev, [round]: e.target.value }))}
                        className="bg-theSplit-navy/50 border-theSplit-teal/30 text-theSplit-white"
                        placeholder="Enter the correct answer"
                      />
                      <Button
                        onClick={() => updateCorrectAnswer(round)}
                        disabled={loading[round]}
                        className="bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy"
                      >
                        {loading[round] ? 'Updating...' : 'Update'}
                      </Button>
                    </div>
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
