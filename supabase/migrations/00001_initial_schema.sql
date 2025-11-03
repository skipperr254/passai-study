-- =====================================================
-- PassAI Database Schema - Initial Migration
-- Version: 00001
-- Date: 2025-11-02
-- Description: Initial database schema for PassAI study platform
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- Extends Supabase auth.users with additional profile info
-- =====================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  study_goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- SUBJECTS TABLE
-- Stores user's study subjects
-- =====================================================

CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  description TEXT,
  test_date DATE,
  teacher_emphasis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subjects
CREATE POLICY "Users can view own subjects"
  ON public.subjects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subjects"
  ON public.subjects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subjects"
  ON public.subjects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subjects"
  ON public.subjects FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_subjects_user_id ON public.subjects(user_id);
CREATE INDEX idx_subjects_created_at ON public.subjects(created_at DESC);

-- =====================================================
-- MATERIALS TABLE
-- Stores uploaded study materials
-- =====================================================

CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'video', 'image', 'document', 'notes')),
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  metadata JSONB,
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for materials
CREATE POLICY "Users can view own materials"
  ON public.materials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own materials"
  ON public.materials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own materials"
  ON public.materials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own materials"
  ON public.materials FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_materials_user_id ON public.materials(user_id);
CREATE INDEX idx_materials_subject_id ON public.materials(subject_id);
CREATE INDEX idx_materials_status ON public.materials(status);
CREATE INDEX idx_materials_uploaded_at ON public.materials(uploaded_at DESC);

-- =====================================================
-- QUIZZES TABLE
-- Stores quiz definitions
-- =====================================================

CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  mode TEXT NOT NULL DEFAULT 'practice' CHECK (mode IN ('practice', 'test', 'timed', 'adaptive')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'in-progress', 'completed', 'archived')),
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER, -- minutes
  passing_score INTEGER, -- percentage
  question_count INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes
CREATE POLICY "Users can view own quizzes"
  ON public.quizzes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quizzes"
  ON public.quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quizzes"
  ON public.quizzes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quizzes"
  ON public.quizzes FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_quizzes_user_id ON public.quizzes(user_id);
CREATE INDEX idx_quizzes_subject_id ON public.quizzes(subject_id);
CREATE INDEX idx_quizzes_status ON public.quizzes(status);
CREATE INDEX idx_quizzes_created_at ON public.quizzes(created_at DESC);

-- =====================================================
-- QUIZ_MATERIALS JUNCTION TABLE
-- Links quizzes to source materials
-- =====================================================

CREATE TABLE public.quiz_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(quiz_id, material_id)
);

-- Enable RLS
ALTER TABLE public.quiz_materials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_materials
CREATE POLICY "Users can view own quiz_materials"
  ON public.quiz_materials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = quiz_materials.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own quiz_materials"
  ON public.quiz_materials FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = quiz_materials.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own quiz_materials"
  ON public.quiz_materials FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = quiz_materials.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_quiz_materials_quiz_id ON public.quiz_materials(quiz_id);
CREATE INDEX idx_quiz_materials_material_id ON public.quiz_materials(material_id);

-- =====================================================
-- QUESTIONS TABLE
-- Stores individual quiz questions
-- =====================================================

CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('multiple-choice', 'true-false', 'short-answer', 'essay')),
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question TEXT NOT NULL,
  options JSONB, -- Array of options for multiple choice
  correct_answer JSONB NOT NULL, -- Can be string or array for multi-select
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL,
  tags TEXT[],
  material_references UUID[], -- Array of material IDs
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questions
CREATE POLICY "Users can view own questions"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own questions"
  ON public.questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own questions"
  ON public.questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own questions"
  ON public.questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX idx_questions_order_index ON public.questions(order_index);

-- =====================================================
-- QUIZ_ATTEMPTS TABLE
-- Stores user attempts at quizzes
-- =====================================================

CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed', 'abandoned')),
  score INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0, -- seconds
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_attempts
CREATE POLICY "Users can view own attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attempts"
  ON public.quiz_attempts FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_status ON public.quiz_attempts(status);
CREATE INDEX idx_quiz_attempts_started_at ON public.quiz_attempts(started_at DESC);

-- =====================================================
-- QUESTION_RESPONSES TABLE
-- Stores individual question answers within attempts
-- =====================================================

CREATE TABLE public.question_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answer JSONB NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  points_earned INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0, -- seconds
  answered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.question_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for question_responses
CREATE POLICY "Users can view own responses"
  ON public.question_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts
      WHERE quiz_attempts.id = question_responses.attempt_id
      AND quiz_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own responses"
  ON public.question_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts
      WHERE quiz_attempts.id = question_responses.attempt_id
      AND quiz_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own responses"
  ON public.question_responses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts
      WHERE quiz_attempts.id = question_responses.attempt_id
      AND quiz_attempts.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_question_responses_attempt_id ON public.question_responses(attempt_id);
CREATE INDEX idx_question_responses_question_id ON public.question_responses(question_id);

-- =====================================================
-- STUDY_SESSIONS TABLE
-- Tracks study session activity
-- =====================================================

CREATE TABLE public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL DEFAULT 0, -- minutes
  activities_completed INTEGER NOT NULL DEFAULT 0,
  focus_score INTEGER CHECK (focus_score >= 0 AND focus_score <= 100),
  mood TEXT CHECK (mood IN ('happy', 'neutral', 'frustrated', 'tired')),
  notes TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_sessions
CREATE POLICY "Users can view own study sessions"
  ON public.study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own study sessions"
  ON public.study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study sessions"
  ON public.study_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study sessions"
  ON public.study_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX idx_study_sessions_subject_id ON public.study_sessions(subject_id);
CREATE INDEX idx_study_sessions_started_at ON public.study_sessions(started_at DESC);

-- =====================================================
-- SUBJECT_PROGRESS TABLE
-- Tracks progress and stats per subject
-- =====================================================

CREATE TABLE public.subject_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  total_quizzes INTEGER NOT NULL DEFAULT 0,
  completed_quizzes INTEGER NOT NULL DEFAULT 0,
  average_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  mastery_level INTEGER NOT NULL DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  last_studied_at TIMESTAMPTZ,
  weak_topics TEXT[],
  strong_topics TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, subject_id)
);

-- Enable RLS
ALTER TABLE public.subject_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subject_progress
CREATE POLICY "Users can view own subject progress"
  ON public.subject_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subject progress"
  ON public.subject_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subject progress"
  ON public.subject_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_subject_progress_user_id ON public.subject_progress(user_id);
CREATE INDEX idx_subject_progress_subject_id ON public.subject_progress(subject_id);

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_attempts_updated_at BEFORE UPDATE ON public.quiz_attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_sessions_updated_at BEFORE UPDATE ON public.study_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subject_progress_updated_at BEFORE UPDATE ON public.subject_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Function to create user profile on signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- Function to update subject progress after quiz completion
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_subject_progress_after_quiz()
RETURNS TRIGGER AS $$
DECLARE
  v_subject_id UUID;
  v_user_id UUID;
  v_avg_score DECIMAL(5,2);
  v_total_quizzes INTEGER;
  v_completed_quizzes INTEGER;
BEGIN
  -- Only run when quiz attempt is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Get quiz subject and user
    SELECT subject_id, user_id INTO v_subject_id, v_user_id
    FROM public.quizzes
    WHERE id = NEW.quiz_id;

    -- Calculate stats
    SELECT 
      COUNT(*)::INTEGER,
      COUNT(*) FILTER (WHERE status = 'completed')::INTEGER,
      COALESCE(AVG(percentage) FILTER (WHERE status = 'completed'), 0)
    INTO v_total_quizzes, v_completed_quizzes, v_avg_score
    FROM public.quiz_attempts
    WHERE quiz_id IN (
      SELECT id FROM public.quizzes WHERE subject_id = v_subject_id AND user_id = v_user_id
    )
    AND user_id = v_user_id;

    -- Upsert subject progress
    INSERT INTO public.subject_progress (
      user_id,
      subject_id,
      total_quizzes,
      completed_quizzes,
      average_score,
      mastery_level,
      last_studied_at,
      updated_at
    ) VALUES (
      v_user_id,
      v_subject_id,
      v_total_quizzes,
      v_completed_quizzes,
      v_avg_score,
      LEAST(100, (v_avg_score * v_completed_quizzes / 10)::INTEGER), -- Simple mastery calculation
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id, subject_id)
    DO UPDATE SET
      total_quizzes = v_total_quizzes,
      completed_quizzes = v_completed_quizzes,
      average_score = v_avg_score,
      mastery_level = LEAST(100, (v_avg_score * v_completed_quizzes / 10)::INTEGER),
      last_studied_at = NOW(),
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update subject progress
CREATE TRIGGER on_quiz_attempt_completed
  AFTER INSERT OR UPDATE ON public.quiz_attempts
  FOR EACH ROW EXECUTE FUNCTION public.update_subject_progress_after_quiz();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.subjects IS 'Study subjects created by users';
COMMENT ON TABLE public.materials IS 'Uploaded study materials (PDFs, videos, etc.)';
COMMENT ON TABLE public.quizzes IS 'Quiz definitions with settings';
COMMENT ON TABLE public.quiz_materials IS 'Junction table linking quizzes to source materials';
COMMENT ON TABLE public.questions IS 'Individual questions within quizzes';
COMMENT ON TABLE public.quiz_attempts IS 'User attempts at taking quizzes';
COMMENT ON TABLE public.question_responses IS 'Individual question answers within attempts';
COMMENT ON TABLE public.study_sessions IS 'Study session tracking for analytics';
COMMENT ON TABLE public.subject_progress IS 'Progress tracking per subject per user';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Verify tables were created
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN (
    'users', 'subjects', 'materials', 'quizzes', 'quiz_materials',
    'questions', 'quiz_attempts', 'question_responses',
    'study_sessions', 'subject_progress'
  );
  
  RAISE NOTICE 'Migration complete! Created % tables.', table_count;
END $$;
