-- =====================================================
-- Study Plans Table
-- Stores AI-generated study plan metadata
-- Version: 00004
-- Date: 2025-11-05
-- =====================================================

-- Create study_plans table to store AI-generated plan metadata
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  
  -- AI Analysis Metadata
  analysis_version TEXT NOT NULL DEFAULT 'v1', -- For tracking AI model versions
  confidence_level INTEGER NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 100),
  
  -- Plan Overview (stored as JSONB for flexibility)
  overview JSONB NOT NULL, -- { strengths, weaknesses, focusAreas, estimatedTimeToMastery }
  recommendations JSONB NOT NULL, -- { immediate, shortTerm, longTerm }
  study_schedule JSONB, -- { daily, weekly, breakdown }
  
  -- Performance Data Snapshot (for reference)
  performance_snapshot JSONB, -- Snapshot of quiz performance at generation time
  
  -- Validity tracking
  is_active BOOLEAN NOT NULL DEFAULT true, -- Only one active plan per subject
  invalidated_at TIMESTAMPTZ, -- When the plan was replaced/invalidated
  invalidation_reason TEXT, -- Why it was invalidated (e.g., 'new_quiz_completed', 'manual_regeneration')
  
  -- Timestamps
  generated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ, -- Optional expiration (e.g., test date)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure only one active plan per user per subject
  UNIQUE(user_id, subject_id, is_active) WHERE is_active = true
);

-- Add study_plan_id to study_tasks to link tasks to plans
ALTER TABLE public.study_tasks 
ADD COLUMN IF NOT EXISTS study_plan_id UUID REFERENCES public.study_plans(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_study_tasks_plan_id ON public.study_tasks(study_plan_id);

-- Enable RLS
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_plans
CREATE POLICY "Users can view own study plans"
  ON public.study_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own study plans"
  ON public.study_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study plans"
  ON public.study_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study plans"
  ON public.study_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_study_plans_user_id ON public.study_plans(user_id);
CREATE INDEX idx_study_plans_subject_id ON public.study_plans(subject_id);
CREATE INDEX idx_study_plans_is_active ON public.study_plans(is_active) WHERE is_active = true;
CREATE INDEX idx_study_plans_generated_at ON public.study_plans(generated_at DESC);

-- Function to auto-update updated_at
CREATE TRIGGER update_study_plans_updated_at 
  BEFORE UPDATE ON public.study_plans
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to invalidate old study plans when creating a new one
CREATE OR REPLACE FUNCTION invalidate_old_study_plans()
RETURNS TRIGGER AS $$
BEGIN
  -- Invalidate all previous active plans for this user/subject combination
  IF NEW.is_active = true THEN
    UPDATE public.study_plans
    SET 
      is_active = false,
      invalidated_at = NOW(),
      invalidation_reason = CASE 
        WHEN NEW.invalidation_reason IS NOT NULL THEN NEW.invalidation_reason
        ELSE 'new_plan_generated'
      END
    WHERE user_id = NEW.user_id
      AND subject_id = NEW.subject_id
      AND id != NEW.id
      AND is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to invalidate old plans
CREATE TRIGGER on_study_plan_created
  AFTER INSERT ON public.study_plans
  FOR EACH ROW 
  EXECUTE FUNCTION invalidate_old_study_plans();

-- Comments
COMMENT ON TABLE public.study_plans IS 'AI-generated study plans with metadata and recommendations';
COMMENT ON COLUMN public.study_plans.overview IS 'JSON containing strengths, weaknesses, focus areas, and mastery estimates';
COMMENT ON COLUMN public.study_plans.recommendations IS 'JSON containing immediate, short-term, and long-term recommendations';
COMMENT ON COLUMN public.study_plans.study_schedule IS 'JSON containing daily/weekly time recommendations';
COMMENT ON COLUMN public.study_plans.performance_snapshot IS 'Snapshot of performance data used to generate this plan';
COMMENT ON COLUMN public.study_plans.is_active IS 'Only one active plan per user per subject';
