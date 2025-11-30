-- Stored functions for atomic voting operations

-- Function to handle voting on questions
CREATE OR REPLACE FUNCTION public.vote_on_question(
  p_user_id UUID,
  p_question_id UUID,
  p_vote_value SMALLINT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_vote SMALLINT;
  v_question_owner_id UUID;
  v_vote_diff INTEGER;
  v_rep_change INTEGER;
BEGIN
  -- Get existing vote if any
  SELECT vote_value INTO v_existing_vote
  FROM public.votes
  WHERE user_id = p_user_id AND content_id = p_question_id AND content_type = 'question';
  
  -- Get question owner
  SELECT user_id INTO v_question_owner_id
  FROM public.questions
  WHERE id = p_question_id;
  
  IF v_question_owner_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Question not found');
  END IF;
  
  -- Prevent self-voting
  IF v_question_owner_id = p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot vote on your own question');
  END IF;
  
  IF v_existing_vote IS NOT NULL THEN
    IF v_existing_vote = p_vote_value THEN
      -- Remove vote (toggle off)
      DELETE FROM public.votes WHERE user_id = p_user_id AND content_id = p_question_id;
      v_vote_diff := -p_vote_value;
      v_rep_change := CASE WHEN p_vote_value = 1 THEN -5 ELSE 0 END;
    ELSE
      -- Change vote direction
      UPDATE public.votes SET vote_value = p_vote_value WHERE user_id = p_user_id AND content_id = p_question_id;
      v_vote_diff := p_vote_value * 2;
      v_rep_change := CASE WHEN p_vote_value = 1 THEN 10 ELSE -5 END;
    END IF;
  ELSE
    -- New vote
    INSERT INTO public.votes (user_id, content_id, content_type, vote_value)
    VALUES (p_user_id, p_question_id, 'question', p_vote_value);
    v_vote_diff := p_vote_value;
    v_rep_change := CASE WHEN p_vote_value = 1 THEN 5 ELSE 0 END;
  END IF;
  
  -- Update question vote count
  UPDATE public.questions SET vote_count = vote_count + v_vote_diff WHERE id = p_question_id;
  
  -- Update question owner's reputation
  UPDATE public.profiles SET reputation = GREATEST(1, reputation + v_rep_change) WHERE id = v_question_owner_id;
  
  RETURN jsonb_build_object('success', true, 'vote_diff', v_vote_diff);
END;
$$;

-- Function to handle voting on answers
CREATE OR REPLACE FUNCTION public.vote_on_answer(
  p_user_id UUID,
  p_answer_id UUID,
  p_vote_value SMALLINT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_vote SMALLINT;
  v_answer_owner_id UUID;
  v_vote_diff INTEGER;
  v_rep_change INTEGER;
BEGIN
  -- Get existing vote if any
  SELECT vote_value INTO v_existing_vote
  FROM public.votes
  WHERE user_id = p_user_id AND content_id = p_answer_id AND content_type = 'answer';
  
  -- Get answer owner
  SELECT user_id INTO v_answer_owner_id
  FROM public.answers
  WHERE id = p_answer_id;
  
  IF v_answer_owner_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Answer not found');
  END IF;
  
  -- Prevent self-voting
  IF v_answer_owner_id = p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot vote on your own answer');
  END IF;
  
  IF v_existing_vote IS NOT NULL THEN
    IF v_existing_vote = p_vote_value THEN
      -- Remove vote (toggle off)
      DELETE FROM public.votes WHERE user_id = p_user_id AND content_id = p_answer_id;
      v_vote_diff := -p_vote_value;
      v_rep_change := CASE WHEN p_vote_value = 1 THEN -10 ELSE 2 END;
    ELSE
      -- Change vote direction
      UPDATE public.votes SET vote_value = p_vote_value WHERE user_id = p_user_id AND content_id = p_answer_id;
      v_vote_diff := p_vote_value * 2;
      v_rep_change := CASE WHEN p_vote_value = 1 THEN 20 ELSE -12 END;
    END IF;
  ELSE
    -- New vote
    INSERT INTO public.votes (user_id, content_id, content_type, vote_value)
    VALUES (p_user_id, p_answer_id, 'answer', p_vote_value);
    v_vote_diff := p_vote_value;
    v_rep_change := CASE WHEN p_vote_value = 1 THEN 10 ELSE -2 END;
  END IF;
  
  -- Update answer vote count
  UPDATE public.answers SET vote_count = vote_count + v_vote_diff WHERE id = p_answer_id;
  
  -- Update answer owner's reputation
  UPDATE public.profiles SET reputation = GREATEST(1, reputation + v_rep_change) WHERE id = v_answer_owner_id;
  
  RETURN jsonb_build_object('success', true, 'vote_diff', v_vote_diff);
END;
$$;

-- Function to accept an answer
CREATE OR REPLACE FUNCTION public.accept_answer(
  p_user_id UUID,
  p_answer_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_question_id UUID;
  v_question_owner_id UUID;
  v_answer_owner_id UUID;
  v_current_accepted_id UUID;
BEGIN
  -- Get answer and question info
  SELECT a.question_id, a.user_id, q.user_id, q.accepted_answer_id
  INTO v_question_id, v_answer_owner_id, v_question_owner_id, v_current_accepted_id
  FROM public.answers a
  JOIN public.questions q ON q.id = a.question_id
  WHERE a.id = p_answer_id;
  
  IF v_question_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Answer not found');
  END IF;
  
  -- Only question owner can accept
  IF v_question_owner_id != p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only the question owner can accept an answer');
  END IF;
  
  -- Unaccept current accepted answer if exists
  IF v_current_accepted_id IS NOT NULL THEN
    UPDATE public.answers SET is_accepted = FALSE WHERE id = v_current_accepted_id;
    -- Remove reputation from previously accepted answer owner
    UPDATE public.profiles SET reputation = GREATEST(1, reputation - 15)
    WHERE id = (SELECT user_id FROM public.answers WHERE id = v_current_accepted_id);
  END IF;
  
  -- Accept the new answer
  UPDATE public.answers SET is_accepted = TRUE WHERE id = p_answer_id;
  UPDATE public.questions SET accepted_answer_id = p_answer_id WHERE id = v_question_id;
  
  -- Add reputation to answer owner (+15) and question asker (+2)
  UPDATE public.profiles SET reputation = reputation + 15 WHERE id = v_answer_owner_id;
  UPDATE public.profiles SET reputation = reputation + 2 WHERE id = v_question_owner_id;
  
  RETURN jsonb_build_object('success', true);
END;
$$;
