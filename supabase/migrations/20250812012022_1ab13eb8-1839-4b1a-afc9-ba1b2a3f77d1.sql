-- Add answer_options column to questions table for multiple choice options
ALTER TABLE public.questions 
ADD COLUMN answer_options JSONB;