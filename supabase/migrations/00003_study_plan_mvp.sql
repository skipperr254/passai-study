-- =====================================================
-- PassAI Study Plan MVP - Migration
-- Version: 00003
-- Date: 2025-11-04
-- Description: Core tables for adaptive study plan system (MVP)
-- =====================================================

-- =====================================================
-- TOPICS TABLE
-- Stores individual topics within subjects
-- =====================================================

CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_study_time INTEGER DEFAULT 30, -- minutes
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for topics
CREATE POLICY "Users can view topics for their subjects"
  ON public.topics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.subjects
      WHERE subjects.id = topics.subject_id
      AND subjects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create topics for their subjects"
  ON public.topics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.subjects
      WHERE subjects.id = topics.subject_id
      AND subjects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update topics for their subjects"
  ON public.topics FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.subjects
      WHERE subjects.id = topics.subject_id
      AND subjects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete topics for their subjects"
  ON public.topics FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.subjects
      WHERE subjects.id = topics.subject_id
      AND subjects.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_topics_subject_id ON public.topics(subject_id);

-- =====================================================
-- TOPIC_MASTERY TABLE
-- Tracks user's mastery level for each topic
-- =====================================================

CREATE TABLE public.topic_mastery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  
  -- Mastery metrics
  mastery_level DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  
  -- Learning statistics
  total_quizzes_taken INTEGER NOT NULL DEFAULT 0,
  quizzes_passed INTEGER NOT NULL DEFAULT 0,
  average_quiz_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  last_quiz_score DECIMAL(5,2),
  
  -- Performance trend
  trend TEXT NOT NULL DEFAULT 'unknown' CHECK (trend IN ('up', 'down', 'stable', 'unknown')),
  
  -- Timestamps
  last_studied_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(user_id, topic_id)
);

-- Enable RLS
ALTER TABLE public.topic_mastery ENABLE ROW LEVEL SECURITY;

-- RLS Policies for topic_mastery
CREATE POLICY "Users can view own topic mastery"
  ON public.topic_mastery FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own topic mastery"
  ON public.topic_mastery FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own topic mastery"
  ON public.topic_mastery FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own topic mastery"
  ON public.topic_mastery FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_topic_mastery_user_id ON public.topic_mastery(user_id);
CREATE INDEX idx_topic_mastery_topic_id ON public.topic_mastery(topic_id);
CREATE INDEX idx_topic_mastery_subject_id ON public.topic_mastery(subject_id);
CREATE INDEX idx_topic_mastery_user_subject ON public.topic_mastery(user_id, subject_id);

-- =====================================================
-- STUDY_TASKS TABLE
-- Daily study tasks for users
-- =====================================================

CREATE TABLE public.study_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  
  -- Task details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('review', 'practice', 'quiz', 'flashcards', 'material')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  
  -- Time estimation
  estimated_time INTEGER NOT NULL DEFAULT 15, -- minutes
  time_spent INTEGER NOT NULL DEFAULT 0, -- actual minutes spent
  
  -- Completion tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'skipped')),
  completed_at TIMESTAMPTZ,
  
  -- Verification
  requires_verification BOOLEAN NOT NULL DEFAULT false,
  verification_status TEXT CHECK (verification_status IN ('pending', 'passed', 'failed', 'skipped')),
  verification_quiz_id UUID REFERENCES public.quizzes(id) ON DELETE SET NULL,
  
  -- Scheduling
  due_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_tasks
CREATE POLICY "Users can view own study tasks"
  ON public.study_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own study tasks"
  ON public.study_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study tasks"
  ON public.study_tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study tasks"
  ON public.study_tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_study_tasks_user_id ON public.study_tasks(user_id);
CREATE INDEX idx_study_tasks_subject_id ON public.study_tasks(subject_id);
CREATE INDEX idx_study_tasks_topic_id ON public.study_tasks(topic_id);
CREATE INDEX idx_study_tasks_status ON public.study_tasks(status);
CREATE INDEX idx_study_tasks_due_date ON public.study_tasks(due_date);
CREATE INDEX idx_study_tasks_user_status ON public.study_tasks(user_id, status);

-- =====================================================
-- Link questions to topics (enhance existing questions table)
-- =====================================================

-- Add topic_id column to questions table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' 
    AND column_name = 'topic_id'
  ) THEN
    ALTER TABLE public.questions ADD COLUMN topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL;
    CREATE INDEX idx_questions_topic_id ON public.questions(topic_id);
  END IF;
END $$;

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Update updated_at trigger for new tables
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON public.topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_mastery_updated_at BEFORE UPDATE ON public.topic_mastery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_tasks_updated_at BEFORE UPDATE ON public.study_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Function to update topic mastery after quiz completion
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_topic_mastery_after_quiz()
RETURNS TRIGGER AS $$
DECLARE
  v_topic_id UUID;
  v_question_topic_ids UUID[];
  v_topic_score DECIMAL(5,2);
  v_topic_questions_count INTEGER;
  v_topic_correct_count INTEGER;
  v_existing_mastery DECIMAL(5,2);
  v_new_mastery DECIMAL(5,2);
  v_total_quizzes INTEGER;
  v_avg_score DECIMAL(5,2);
  v_prev_score DECIMAL(5,2);
  v_trend TEXT;
BEGIN
  -- Only run when quiz attempt is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Get all topic IDs from questions in this quiz
    SELECT ARRAY_AGG(DISTINCT topic_id) INTO v_question_topic_ids
    FROM public.questions
    WHERE quiz_id = NEW.quiz_id AND topic_id IS NOT NULL;
    
    -- If there are topics, update mastery for each
    IF v_question_topic_ids IS NOT NULL THEN
      FOREACH v_topic_id IN ARRAY v_question_topic_ids
      LOOP
        -- Calculate score for this specific topic
        SELECT 
          COUNT(*)::INTEGER,
          COUNT(*) FILTER (WHERE qr.is_correct = true)::INTEGER
        INTO v_topic_questions_count, v_topic_correct_count
        FROM public.question_responses qr
        JOIN public.questions q ON q.id = qr.question_id
        WHERE qr.attempt_id = NEW.id
          AND q.topic_id = v_topic_id;
        
        -- Calculate percentage for this topic
        IF v_topic_questions_count > 0 THEN
          v_topic_score := (v_topic_correct_count::DECIMAL / v_topic_questions_count * 100);
        ELSE
          v_topic_score := 0;
        END IF;
        
        -- Get existing mastery
        SELECT mastery_level, last_quiz_score 
        INTO v_existing_mastery, v_prev_score
        FROM public.topic_mastery
        WHERE user_id = NEW.user_id AND topic_id = v_topic_id;
        
        -- Calculate new mastery (weighted average: 70% existing, 30% new score)
        IF v_existing_mastery IS NOT NULL THEN
          v_new_mastery := (v_existing_mastery * 0.7) + (v_topic_score * 0.3);
        ELSE
          v_new_mastery := v_topic_score;
          v_existing_mastery := 0;
        END IF;
        
        -- Determine trend
        IF v_prev_score IS NULL THEN
          v_trend := 'unknown';
        ELSIF v_topic_score > v_prev_score + 5 THEN
          v_trend := 'up';
        ELSIF v_topic_score < v_prev_score - 5 THEN
          v_trend := 'down';
        ELSE
          v_trend := 'stable';
        END IF;
        
        -- Calculate total quizzes and average for this topic
        SELECT 
          COUNT(DISTINCT qa.id)::INTEGER,
          AVG(
            (COUNT(*) FILTER (WHERE qr.is_correct = true)::DECIMAL / 
             COUNT(*)::DECIMAL * 100)
          )
        INTO v_total_quizzes, v_avg_score
        FROM public.quiz_attempts qa
        JOIN public.question_responses qr ON qr.attempt_id = qa.id
        JOIN public.questions q ON q.id = qr.question_id
        WHERE qa.user_id = NEW.user_id
          AND qa.status = 'completed'
          AND q.topic_id = v_topic_id
        GROUP BY qa.id;
        
        -- Upsert topic mastery
        INSERT INTO public.topic_mastery (
          user_id,
          topic_id,
          subject_id,
          mastery_level,
          total_quizzes_taken,
          quizzes_passed,
          average_quiz_score,
          last_quiz_score,
          trend,
          last_studied_at,
          updated_at
        ) VALUES (
          NEW.user_id,
          v_topic_id,
          (SELECT subject_id FROM public.topics WHERE id = v_topic_id),
          v_new_mastery,
          COALESCE(v_total_quizzes, 1),
          CASE WHEN v_topic_score >= 70 THEN 1 ELSE 0 END,
          COALESCE(v_avg_score, v_topic_score),
          v_topic_score,
          v_trend,
          NOW(),
          NOW()
        )
        ON CONFLICT (user_id, topic_id)
        DO UPDATE SET
          mastery_level = v_new_mastery,
          total_quizzes_taken = topic_mastery.total_quizzes_taken + 1,
          quizzes_passed = topic_mastery.quizzes_passed + 
            CASE WHEN v_topic_score >= 70 THEN 1 ELSE 0 END,
          average_quiz_score = COALESCE(v_avg_score, v_topic_score),
          last_quiz_score = v_topic_score,
          trend = v_trend,
          last_studied_at = NOW(),
          updated_at = NOW();
      END LOOP;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update topic mastery
CREATE TRIGGER on_quiz_attempt_completed_update_topic_mastery
  AFTER INSERT OR UPDATE ON public.quiz_attempts
  FOR EACH ROW EXECUTE FUNCTION public.update_topic_mastery_after_quiz();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.topics IS 'Individual topics within subjects for granular mastery tracking';
COMMENT ON TABLE public.topic_mastery IS 'User mastery level tracking per topic';
COMMENT ON TABLE public.study_tasks IS 'Daily study tasks generated for users';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN ('topics', 'topic_mastery', 'study_tasks');
  
  RAISE NOTICE 'Study Plan MVP Migration complete! Created % new tables.', table_count;
END $$;
