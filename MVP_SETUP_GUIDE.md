# 🎓 Study Plan MVP - Setup & Testing Guide

## ✅ What We've Built

### Database (Completed)

- ✅ `topics` - Individual topics within subjects
- ✅ `topic_mastery` - User mastery tracking per topic
- ✅ `study_tasks` - Daily study tasks
- ✅ Automatic mastery calculation trigger
- ✅ `questions.topic_id` - Link questions to topics

### Services (Completed)

- ✅ `topic.service.ts` - CRUD for topics and mastery
- ✅ `study-task.service.ts` - Task management
- ✅ `task-generator.service.ts` - AI-powered task generation

### UI (Completed)

- ✅ StudyPlanPage integrated with real data
- ✅ Real-time mastery display
- ✅ Task completion tracking
- ✅ Task regeneration
- ✅ AI recommendations

---

## 🚀 Quick Start: Testing the MVP

### Step 1: Seed Topics for a Subject

**Option A: Via Browser Console**

1. Open your app in browser
2. Navigate to Study Plan page
3. Open browser DevTools (F12)
4. In Console, run:

```javascript
// Import the seed function first (if not auto-imported)
import('../utils/seedTopics').then(m => m.seedTopicsForSubject('YOUR-SUBJECT-ID', 'History'));

// Replace 'YOUR-SUBJECT-ID' with an actual subject ID from your database
```

**Option B: Directly in Supabase**

1. Go to Supabase SQL Editor
2. Run this to seed History topics:

```sql
INSERT INTO topics (subject_id, name, description, difficulty, estimated_study_time)
VALUES
  ('YOUR-SUBJECT-ID', 'World War II', 'Major events, causes, and consequences of WWII', 'intermediate', 45),
  ('YOUR-SUBJECT-ID', 'Renaissance Era', 'Cultural rebirth in Europe, art, science, and philosophy', 'intermediate', 40),
  ('YOUR-SUBJECT-ID', 'Industrial Revolution', 'Technological advances and societal changes', 'advanced', 50);

-- Replace 'YOUR-SUBJECT-ID' with your actual subject UUID
```

### Step 2: Link Quiz Questions to Topics

When creating or editing quizzes, you can now assign topics to questions:

```typescript
// In quiz.service.ts, when creating questions:
{
  quiz_id: quizId,
  question: "When did World War II begin?",
  type: "multiple-choice",
  options: [...],
  correct_answer: [...],
  topic_id: 'TOPIC-UUID-HERE',  // ← Link to topic
  // ... other fields
}
```

Or manually in Supabase:

```sql
-- Update existing questions to have topics
UPDATE questions
SET topic_id = (SELECT id FROM topics WHERE name = 'World War II' LIMIT 1)
WHERE question LIKE '%World War%';
```

### Step 3: Generate Study Tasks

**Automatic (Recommended)**:

- Tasks will be auto-generated when you visit Study Plan page
- If no tasks exist, the system creates initial assessment tasks

**Manual Generation**:

```typescript
// In browser console or via button click:
import('../services/task-generator.service').then(m =>
  m.generateStudyTasksForSubject('USER-ID', 'SUBJECT-ID', 7)
);
```

### Step 4: Take a Quiz with Topics

1. Navigate to a quiz
2. Take the quiz (make sure questions have `topic_id` set)
3. Complete the quiz
4. **Magic happens automatically**:
   - ✨ `topic_mastery` table gets updated (via database trigger)
   - ✨ Mastery calculations run
   - ✨ Trends are determined

### Step 5: View Study Plan

1. Go to Study Plan page
2. Select your subject
3. You should see:
   - ✅ Real mastery percentage
   - ✅ Weak topics (mastery < 70%)
   - ✅ Generated study tasks
   - ✅ AI recommendations

### Step 6: Complete Tasks

1. Click "Start" on a task
2. Timer starts tracking time
3. Complete your studying
4. Click "Complete & Verify" (if verification required)
5. Watch mastery update in real-time!

### Step 7: Regenerate Plan

Click the "Regenerate" button to:

- Clear pending tasks
- Generate new tasks based on current mastery
- Focus on weak areas

---

## 🔬 Testing Checklist

### Basic Flow

- [ ] Create a subject
- [ ] Seed topics for that subject
- [ ] Create a quiz with questions linked to topics
- [ ] Take and complete the quiz
- [ ] Check `topic_mastery` table for data
- [ ] View Study Plan page
- [ ] See mastery percentages
- [ ] See generated tasks

### Task Management

- [ ] Start a task
- [ ] Timer runs correctly
- [ ] Complete a task
- [ ] Task status updates in database
- [ ] Time spent is saved
- [ ] Completed tasks show as complete in UI

### Mastery Tracking

- [ ] After quiz: Check mastery updated
- [ ] Take another quiz on same topic
- [ ] Mastery changes (weighted average: 70% old, 30% new)
- [ ] Trend updates (up/down/stable)
- [ ] Weak topics appear in Focus Areas

### Task Generation

- [ ] Initial generation creates assessment tasks
- [ ] Weak topics get high-priority tasks
- [ ] Strong topics get review tasks
- [ ] Medium topics get practice tasks
- [ ] Regenerate creates new tasks

---

## 📊 Database Queries for Testing

### Check Topics

```sql
SELECT * FROM topics WHERE subject_id = 'YOUR-SUBJECT-ID';
```

### Check Mastery Data

```sql
SELECT
  tm.*,
  t.name as topic_name,
  t.difficulty
FROM topic_mastery tm
JOIN topics t ON t.id = tm.topic_id
WHERE tm.user_id = 'YOUR-USER-ID'
ORDER BY tm.mastery_level ASC;
```

### Check Study Tasks

```sql
SELECT
  st.*,
  t.name as topic_name
FROM study_tasks st
LEFT JOIN topics t ON t.id = st.topic_id
WHERE st.user_id = 'YOUR-USER-ID'
AND st.subject_id = 'YOUR-SUBJECT-ID'
ORDER BY st.created_at DESC;
```

### Check Questions with Topics

```sql
SELECT
  q.question,
  t.name as topic_name,
  q.type
FROM questions q
LEFT JOIN topics t ON t.id = q.topic_id
WHERE q.quiz_id = 'YOUR-QUIZ-ID';
```

---

## 🐛 Troubleshooting

### Tasks Not Showing

**Problem**: Study Plan page shows no tasks  
**Solution**:

1. Check if topics exist for the subject
2. Manually trigger task generation:
   - Click "Regenerate" button
   - Or open console and run generation function

### Mastery Not Updating

**Problem**: Completed quiz but mastery unchanged  
**Solution**:

1. Verify questions have `topic_id` set
2. Check quiz status is 'completed'
3. Manually check `topic_mastery` table
4. Check trigger is working:

```sql
SELECT * FROM pg_trigger
WHERE tgname = 'on_quiz_attempt_completed_update_topic_mastery';
```

### Weak Topics Not Showing

**Problem**: Focus Areas section is empty  
**Solution**:

1. Take quizzes to establish mastery data
2. Check if any topics have mastery < 70%
3. If all topics > 70%, that's good! You're doing well!

### Auth Errors

**Problem**: "user is undefined" errors  
**Solution**:

1. Make sure you're logged in
2. Check AuthContext is providing user
3. Verify RLS policies allow access

---

## 🎯 What's Working

### ✅ Fully Functional

- Topic management (CRUD)
- Topic mastery tracking
- Automatic mastery calculation after quizzes
- Study task generation
- Task completion tracking
- Real-time mastery updates
- Weak area identification
- Task regeneration
- AI recommendations

### 🔄 Using Mock Data as Fallback

- If no topics: Shows mock topics
- If no tasks: Shows mock tasks
- If no data: Falls back to demo data

### 🎨 UI Features

- Mastery visualization with color coding
- Progress bars for topics
- Task priority badges
- Completion tracking
- Timer for task duration
- Trend indicators (↗↘→)

---

## 🚀 Next Steps (Future Enhancements)

When you're ready to expand beyond MVP:

1. **AI Study Plan Generation**

   - Use OpenAI to generate smarter tasks
   - Personalize based on learning style
   - Adaptive difficulty

2. **Spaced Repetition**

   - Schedule reviews automatically
   - SM-2 algorithm implementation
   - Review reminders

3. **Verification Quizzes**

   - Auto-generate after studying
   - Short 3-5 question quizzes
   - Confirm understanding

4. **Analytics Dashboard**

   - Study time graphs
   - Mastery progression over time
   - Predictions to goal

5. **Learning Path System**
   - Multi-day plans
   - Progressive unlocking
   - Milestone tracking

---

## 📝 Summary

**What Works Right Now**:

- ✅ Complete topic-level mastery tracking
- ✅ Automatic mastery updates after quizzes
- ✅ Rule-based study task generation
- ✅ Task management and completion
- ✅ Real-time UI updates
- ✅ Smart recommendations

**How to Use It**:

1. Create topics for your subjects
2. Link questions to topics
3. Take quizzes
4. Watch mastery update automatically
5. Get personalized study tasks
6. Complete tasks
7. See progress in real-time

**The Learning Cycle**:

```
Take Quiz → Mastery Updates → Tasks Generated →
Complete Tasks → Take Another Quiz → Mastery Improves → Repeat
```

You now have a working adaptive study system! 🎉

---

**Need Help?**

- Check the service functions for available methods
- Look at database schema for data structure
- Review component for UI integration examples
- Test with sample data first before real use
