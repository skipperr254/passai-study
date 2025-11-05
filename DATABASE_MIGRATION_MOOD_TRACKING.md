# Database Migration: Add Mood Tracking to Quiz Attempts

## Overview

This migration adds mood tracking functionality to the `quiz_attempts` table, allowing the system to capture student mood and energy levels at the midpoint (50%) of each quiz.

## Schema Changes Required

### Table: `quiz_attempts`

Add the following columns to track mood data:

```sql
-- Add mood tracking columns to quiz_attempts table
ALTER TABLE quiz_attempts
ADD COLUMN mood_at_midpoint VARCHAR(20) CHECK (mood_at_midpoint IN ('confident', 'okay', 'struggling', 'confused')),
ADD COLUMN energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10);

-- Add comment for documentation
COMMENT ON COLUMN quiz_attempts.mood_at_midpoint IS 'Student mood captured at quiz midpoint (50% completion)';
COMMENT ON COLUMN quiz_attempts.energy_level IS 'Student energy level (1-10 scale) captured at quiz midpoint';
```

## Column Specifications

### `mood_at_midpoint`

- **Type**: `VARCHAR(20)`
- **Nullable**: `TRUE` (optional, only captured if student reaches midpoint)
- **Constraint**: Must be one of: `confident`, `okay`, `struggling`, `confused`
- **Description**: Captures the student's self-reported mood at the 50% point of the quiz

### `energy_level`

- **Type**: `INTEGER`
- **Nullable**: `TRUE` (optional, captured alongside mood)
- **Constraint**: Value between 1 and 10 (inclusive)
- **Description**: Captures the student's self-reported energy level on a 1-10 scale

## Implementation Notes

### When Data is Captured

- Mood check modal appears after the student answers the question at the 50% mark
- For a 10-question quiz, modal shows after question 5 is answered
- Data is immediately saved to the database via `updateMoodData()` service function

### Service Function

Location: `src/services/quiz-attempt.service.ts`

```typescript
export const updateMoodData = async (
  attemptId: string,
  userId: string,
  mood: 'confident' | 'okay' | 'struggling' | 'confused',
  energyLevel: number
): Promise<boolean>
```

### Component Integration

- `QuizSession.tsx`: Triggers modal at midpoint, calls service to save data
- `MoodCheckModal.tsx`: Collects mood and energy level from user
- Data saved even if quiz is abandoned mid-way

## Supabase Migration Steps

### Option 1: Via Supabase Dashboard (SQL Editor)

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Create a new query
4. Paste and run the SQL above
5. Verify changes in **Table Editor** → `quiz_attempts`

### Option 2: Via Supabase CLI (Recommended for version control)

```bash
# Create new migration file
supabase migration new add_mood_tracking_to_quiz_attempts

# Edit the generated migration file and add the SQL
# Then apply the migration
supabase db push
```

### Option 3: Manual via Table Editor

1. Go to **Table Editor** → `quiz_attempts`
2. Click **+ New Column**
3. Add `mood_at_midpoint`:
   - Name: `mood_at_midpoint`
   - Type: `text`
   - Is Nullable: ✓ (checked)
   - Default Value: NULL
4. Add `energy_level`:
   - Name: `energy_level`
   - Type: `int4`
   - Is Nullable: ✓ (checked)
   - Default Value: NULL

## Row Level Security (RLS)

If RLS is enabled on `quiz_attempts`, no changes needed. The existing policies should cover these new columns since they're part of the same table.

Verify existing policies allow:

```sql
-- Users can update their own attempts
CREATE POLICY "Users can update own attempts"
ON quiz_attempts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

## Testing Checklist

After applying the migration:

- [ ] Column `mood_at_midpoint` exists in `quiz_attempts` table
- [ ] Column `energy_level` exists in `quiz_attempts` table
- [ ] Can insert NULL values (for pre-existing attempts)
- [ ] Can update with valid mood values (`confident`, `okay`, `struggling`, `confused`)
- [ ] Can update with energy levels 1-10
- [ ] Invalid values are rejected (e.g., `mood_at_midpoint = 'happy'` or `energy_level = 11`)
- [ ] Quiz session saves mood data successfully
- [ ] Toast notification appears on successful save

## Future Enhancements

### Analytics Opportunities

With this data, you can:

1. **Mood vs Performance**: Correlate mood with final quiz scores
2. **Energy Tracking**: Identify optimal study times based on energy patterns
3. **Adaptive Difficulty**: Adjust remaining questions based on mood/energy
4. **Student Insights**: Show students their mood trends over time
5. **Early Intervention**: Flag students who consistently report low mood/energy

### Example Analytics Queries

```sql
-- Average score by mood
SELECT
  mood_at_midpoint,
  AVG(percentage) as avg_score,
  COUNT(*) as attempts
FROM quiz_attempts
WHERE mood_at_midpoint IS NOT NULL
GROUP BY mood_at_midpoint
ORDER BY avg_score DESC;

-- Energy level correlation with completion
SELECT
  energy_level,
  AVG(percentage) as avg_score,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*) as completion_rate
FROM quiz_attempts
WHERE energy_level IS NOT NULL
GROUP BY energy_level
ORDER BY energy_level;

-- Mood trends for specific user
SELECT
  DATE(started_at) as quiz_date,
  mood_at_midpoint,
  energy_level,
  percentage as final_score
FROM quiz_attempts
WHERE user_id = 'user-uuid-here'
  AND mood_at_midpoint IS NOT NULL
ORDER BY started_at DESC;
```

## Rollback

If needed, to rollback this migration:

```sql
-- Remove columns
ALTER TABLE quiz_attempts
DROP COLUMN IF EXISTS mood_at_midpoint,
DROP COLUMN IF EXISTS energy_level;
```

## Version Control

- Migration created: 2024-11-04
- Related PR: (add PR number when ready)
- Related issue: Mood tracking at quiz midpoint
- Files modified:
  - `src/services/quiz-attempt.service.ts` (added `updateMoodData` function)
  - `src/components/quiz/QuizSession.tsx` (integrated mood modal)
  - `src/components/generated/MoodCheckModal.tsx` (UI improvements)
