-- Enable Row Level Security on all tables

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can view profiles
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Questions RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Everyone can view questions
CREATE POLICY "questions_select_all" ON public.questions
  FOR SELECT USING (true);

-- Authenticated users can insert questions
CREATE POLICY "questions_insert_auth" ON public.questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own questions
CREATE POLICY "questions_update_own" ON public.questions
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own questions
CREATE POLICY "questions_delete_own" ON public.questions
  FOR DELETE USING (auth.uid() = user_id);

-- Answers RLS
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Everyone can view answers
CREATE POLICY "answers_select_all" ON public.answers
  FOR SELECT USING (true);

-- Authenticated users can insert answers
CREATE POLICY "answers_insert_auth" ON public.answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own answers
CREATE POLICY "answers_update_own" ON public.answers
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own answers
CREATE POLICY "answers_delete_own" ON public.answers
  FOR DELETE USING (auth.uid() = user_id);

-- Votes RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Everyone can view votes
CREATE POLICY "votes_select_all" ON public.votes
  FOR SELECT USING (true);

-- Authenticated users can insert votes
CREATE POLICY "votes_insert_auth" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own votes
CREATE POLICY "votes_update_own" ON public.votes
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "votes_delete_own" ON public.votes
  FOR DELETE USING (auth.uid() = user_id);
