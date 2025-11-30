-- SMVITM Technical Forum Database Schema
-- This script creates all necessary tables for the forum

-- Profiles table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  reputation INTEGER DEFAULT 1,
  badges JSONB DEFAULT '[]'::jsonb,
  joined_at TIMESTAMPTZ DEFAULT now(),
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT
);

-- Questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ,
  vote_count INTEGER DEFAULT 0,
  answer_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  accepted_answer_id UUID
);

-- Answers table
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ,
  vote_count INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE
);

-- Add foreign key for accepted_answer_id after answers table exists
ALTER TABLE public.questions 
  ADD CONSTRAINT fk_accepted_answer 
  FOREIGN KEY (accepted_answer_id) 
  REFERENCES public.answers(id) 
  ON DELETE SET NULL;

-- Votes table
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL,
  content_type VARCHAR(10) NOT NULL CHECK (content_type IN ('question', 'answer')),
  vote_value SMALLINT NOT NULL CHECK (vote_value IN (1, -1)),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON public.questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_tags ON public.questions USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_user_id ON public.answers(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_content_id ON public.votes(content_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);
