
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Upload, FileText } from 'lucide-react';

interface QuestionFormProps {
  gameId: string;
  totalRounds: number;
  onQuestionAdded?: () => void;
}

interface Question {
  question_text: string;
  answer_options: string[];
  round_number: number;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ gameId, totalRounds, onQuestionAdded }) => {
  const [questionText, setQuestionText] = useState('');
  const [answerOptions, setAnswerOptions] = useState(['', '']);
  const [roundNumber, setRoundNumber] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addAnswerOption = () => {
    if (answerOptions.length < 6) {
      setAnswerOptions([...answerOptions, '']);
    }
  };

  const removeAnswerOption = (index: number) => {
    if (answerOptions.length > 2) {
      setAnswerOptions(answerOptions.filter((_, i) => i !== index));
    }
  };

  const updateAnswerOption = (index: number, value: string) => {
    const updated = [...answerOptions];
    updated[index] = value;
    setAnswerOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionText.trim()) {
      toast.error('Please enter a question');
      return;
    }

    const validOptions = answerOptions.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 answer options');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('questions')
        .insert({
          game_id: gameId,
          question_text: questionText,
          answer_options: validOptions,
          round_number: roundNumber
        });
        
      if (error) throw error;
      
      toast.success('Question added successfully');
      setQuestionText('');
      setAnswerOptions(['', '']);
      
      if (onQuestionAdded) {
        onQuestionAdded();
      }
    } catch (error: any) {
      console.error('Error adding question:', error.message);
      toast.error('Failed to add question: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/json') {
      toast.error('Please upload a JSON file');
      return;
    }
    
    try {
      setIsUploading(true);
      const text = await file.text();
      const questions = JSON.parse(text) as Question[];
      
      // Validate the JSON structure
      if (!Array.isArray(questions)) {
        toast.error('Invalid JSON format. Expected an array of questions.');
        return;
      }
      
      // Check if each question has required fields
      const isValid = questions.every(q => 
        typeof q.question_text === 'string' && 
        q.question_text.trim() !== '' &&
        Array.isArray(q.answer_options) &&
        q.answer_options.length >= 2 &&
        q.answer_options.every(option => typeof option === 'string' && option.trim() !== '') &&
        typeof q.round_number === 'number' &&
        q.round_number > 0 &&
        q.round_number <= totalRounds
      );
      
      if (!isValid) {
        toast.error('Invalid question format. Each question must have question_text, at least 2 answer_options, and a valid round_number');
        return;
      }
      
      // Insert questions into database
      const { error } = await supabase
        .from('questions')
        .insert(questions.map(q => ({
          game_id: gameId,
          question_text: q.question_text,
          answer_options: q.answer_options,
          round_number: q.round_number
        })));
        
      if (error) throw error;
      
      toast.success(`${questions.length} questions imported successfully`);
      
      if (onQuestionAdded) {
        onQuestionAdded();
      }
      
    } catch (error: any) {
      console.error('Error uploading questions:', error.message);
      toast.error('Failed to upload questions: ' + error.message);
    } finally {
      setIsUploading(false);
      // Clear the input
      e.target.value = '';
    }
  };

  return (
    <Card className="p-4 bg-theSplit-navy/80 border-theSplit-teal/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roundNumber">Round Number</Label>
          <Input
            id="roundNumber"
            type="number"
            min={1}
            max={totalRounds}
            value={roundNumber}
            onChange={(e) => setRoundNumber(parseInt(e.target.value))}
            required
            className="bg-theSplit-navy/50 border-theSplit-teal/30 text-theSplit-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="questionText">Question</Label>
          <Textarea
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question here"
            required
            className="bg-theSplit-navy/50 border-theSplit-teal/30 text-theSplit-white h-24"
          />
        </div>

        <div className="space-y-2">
          <Label>Answer Options</Label>
          {answerOptions.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option}
                onChange={(e) => updateAnswerOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="bg-theSplit-navy/50 border-theSplit-teal/30 text-theSplit-white flex-1"
              />
              {answerOptions.length > 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeAnswerOption(index)}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          {answerOptions.length < 6 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAnswerOption}
              className="border-theSplit-teal/50 text-theSplit-aqua hover:bg-theSplit-teal/10"
            >
              Add Option
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-theSplit-teal hover:bg-theSplit-aqua text-theSplit-navy"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Question'}
          </Button>

          <div className="flex items-center w-full sm:w-auto">
            <label htmlFor="question-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 bg-theSplit-navy/70 hover:bg-theSplit-navy border border-theSplit-teal/30 text-theSplit-aqua rounded-md px-4 py-2">
                <Upload size={18} />
                <span>Upload JSON</span>
              </div>
              <input
                id="question-upload"
                type="file"
                accept="application/json"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
            {isUploading && <span className="ml-2 text-sm text-theSplit-light">Uploading...</span>}
          </div>
        </div>
        
        <div className="mt-2 text-sm text-theSplit-light/70">
          <p className="flex items-center gap-1">
            <FileText size={14} />
            JSON format: [&#123;"question_text": "Question here", "answer_options": ["Option 1", "Option 2"], "round_number": 1&#125;, ...]
          </p>
        </div>
      </form>
    </Card>
  );
};

export default QuestionForm;
