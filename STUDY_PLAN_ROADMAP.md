# 🎯 AI-Powered Adaptive Study Plan - Implementation Roadmap

## Overview

Build a comprehensive adaptive learning system that takes students from **novice to mastery** through personalized, AI-driven study paths with continuous assessment and knowledge graph tracking.

---

## 🏗️ System Architecture

### Core Learning Cycle

```
1. ASSESS → Identify knowledge gaps and current mastery
2. PLAN → Generate personalized study tasks
3. LEARN → Execute tasks (read materials, watch videos, practice)
4. VERIFY → Confirm understanding through quizzes
5. ADAPT → Update knowledge graph and regenerate plan
6. REPEAT → Continue until mastery achieved
```

---

## 📊 Current State Assessment

### ✅ What We Already Have

- **Database Schema**: `subject_progress`, `quiz_attempts`, `question_responses`
- **Quiz System**: Full quiz generation, taking, and result tracking
- **Mood Tracking**: Captures student emotional state during learning
- **AI Integration**: OpenAI service for content generation
- **UI Components**: StudyPlanPage with task management interface

### ❌ What We Need to Build

- **Knowledge Graph**: Topic-level mastery tracking
- **Study Plan Generation**: AI-powered task creation
- **Learning Path Engine**: Adaptive progression logic
- **Verification System**: Post-learning comprehension checks
- **Mastery Calculation**: Multi-factor skill assessment
- **Study Analytics**: Progress visualization and insights

---

## 🗺️ Implementation Phases

---

## **PHASE 1: Database Foundation** 📚

**Goal**: Create tables to store knowledge graph, learning paths, and mastery data

### 1.1 Create Knowledge Graph Tables

```sql
-- Topics: Hierarchical knowledge structure
CREATE TABLE topics (
  id UUID PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id),
  parent_topic_id UUID REFERENCES topics(id), -- For hierarchical topics
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  prerequisites UUID[], -- Array of topic IDs that must be learned first
  estimated_study_time INTEGER, -- minutes
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topic Mastery: User's mastery level per topic
CREATE TABLE topic_mastery (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  topic_id UUID REFERENCES topics(id),
  subject_id UUID REFERENCES subjects(id),

  -- Mastery metrics
  mastery_level DECIMAL(5,2) DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  confidence_score DECIMAL(5,2) DEFAULT 0, -- Self-reported confidence
  retention_score DECIMAL(5,2) DEFAULT 0, -- Based on time since last review

  -- Learning statistics
  total_quizzes_taken INTEGER DEFAULT 0,
  quizzes_passed INTEGER DEFAULT 0,
  average_quiz_score DECIMAL(5,2) DEFAULT 0,
  last_quiz_score DECIMAL(5,2),

  -- Study time tracking
  total_study_time INTEGER DEFAULT 0, -- minutes
  total_review_count INTEGER DEFAULT 0,

  -- Performance indicators
  consecutive_correct_answers INTEGER DEFAULT 0,
  consecutive_incorrect_answers INTEGER DEFAULT 0,
  trend TEXT CHECK (trend IN ('improving', 'stable', 'declining', 'unknown')),

  -- Timestamps
  first_studied_at TIMESTAMPTZ,
  last_studied_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ, -- Spaced repetition

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, topic_id)
);

-- Learning Paths: AI-generated study sequences
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  subject_id UUID REFERENCES subjects(id),

  -- Path metadata
  goal TEXT NOT NULL, -- e.g., "Pass final exam", "Master calculus"
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration INTEGER, -- days

  -- Progress tracking
  status TEXT CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0,

  -- AI context
  generation_context JSONB, -- Stores what AI considered when creating path

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning Path Steps: Individual tasks in a path
CREATE TABLE learning_path_steps (
  id UUID PRIMARY KEY,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id),

  -- Step details
  step_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('study', 'practice', 'quiz', 'review', 'flashcards', 'video', 'reading')),
  estimated_time INTEGER, -- minutes

  -- Content references
  material_ids UUID[], -- Related materials
  quiz_id UUID REFERENCES quizzes(id),

  -- Completion tracking
  status TEXT CHECK (status IN ('locked', 'available', 'in-progress', 'completed', 'skipped')),
  completed_at TIMESTAMPTZ,
  verification_required BOOLEAN DEFAULT false,
  verification_passed BOOLEAN,

  -- Performance data
  time_spent INTEGER DEFAULT 0, -- actual time spent
  attempts_count INTEGER DEFAULT 0,
  score DECIMAL(5,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study Task Queue: Daily/weekly recommended tasks
CREATE TABLE study_tasks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  subject_id UUID REFERENCES subjects(id),
  topic_id UUID REFERENCES topics(id),
  learning_path_step_id UUID REFERENCES learning_path_steps(id),

  -- Task details
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('review', 'practice', 'quiz', 'flashcards', 'material', 'video', 'reading')),
  priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')),

  -- Scheduling
  due_date DATE,
  scheduled_for TIMESTAMPTZ,
  estimated_time INTEGER, -- minutes

  -- Completion
  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed', 'skipped', 'failed')),
  completed_at TIMESTAMPTZ,
  time_spent INTEGER DEFAULT 0,

  -- Verification
  requires_verification BOOLEAN DEFAULT false,
  verification_status TEXT CHECK (verification_status IN ('pending', 'passed', 'failed', 'skipped')),
  verification_score DECIMAL(5,2),

  -- Metadata
  ai_generated BOOLEAN DEFAULT false,
  generation_reason TEXT, -- Why AI recommended this task

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification Quizzes: Short quizzes to verify learning
CREATE TABLE verification_quizzes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  topic_id UUID REFERENCES topics(id),
  study_task_id UUID REFERENCES study_tasks(id),

  -- Quiz details
  question_count INTEGER DEFAULT 3,
  passing_threshold DECIMAL(5,2) DEFAULT 70.0,

  -- Results
  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed')),
  score DECIMAL(5,2),
  passed BOOLEAN,
  completed_at TIMESTAMPTZ,
  time_spent INTEGER, -- seconds

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spaced Repetition Schedule: When to review topics
CREATE TABLE spaced_repetition_schedule (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  topic_id UUID REFERENCES topics(id),

  -- Spaced repetition algorithm data
  ease_factor DECIMAL(5,2) DEFAULT 2.5, -- SM-2 algorithm
  interval INTEGER DEFAULT 1, -- days until next review
  repetitions INTEGER DEFAULT 0,

  -- Schedule
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, topic_id)
);
```

### 1.2 Add Indexes

```sql
-- Performance indexes
CREATE INDEX idx_topic_mastery_user_subject ON topic_mastery(user_id, subject_id);
CREATE INDEX idx_topic_mastery_trend ON topic_mastery(trend) WHERE mastery_level < 80;
CREATE INDEX idx_learning_paths_user_status ON learning_paths(user_id, status);
CREATE INDEX idx_study_tasks_user_status ON study_tasks(user_id, status);
CREATE INDEX idx_study_tasks_due_date ON study_tasks(due_date) WHERE status = 'pending';
CREATE INDEX idx_spaced_repetition_next_review ON spaced_repetition_schedule(user_id, next_review_at);
```

### 1.3 Add RLS Policies

```sql
-- Row Level Security for all new tables
-- (Similar to existing tables, users can only access their own data)
```

**Deliverables**:

- Migration file: `00003_knowledge_graph_schema.sql`
- Updated TypeScript types in `src/types/learning.ts`

---

## **PHASE 2: Knowledge Graph Engine** 🧠

**Goal**: Build the core system that tracks and calculates mastery

### 2.1 Create Learning Service (`src/services/learning.service.ts`)

**Functions**:

```typescript
// Topic Management
- extractTopicsFromMaterials(materialIds: string[]): Promise<Topic[]>
- createTopicsForSubject(subjectId: string, materials: Material[]): Promise<Topic[]>
- getTopicHierarchy(subjectId: string): Promise<TopicTree>

// Mastery Calculation
- calculateTopicMastery(userId: string, topicId: string): Promise<number>
- updateMasteryAfterQuiz(userId: string, topicId: string, score: number): Promise<void>
- getMasteryTrend(userId: string, topicId: string): Promise<'improving' | 'stable' | 'declining'>

// Weak Area Detection
- identifyWeakTopics(userId: string, subjectId: string): Promise<TopicMastery[]>
- getPrerequisiteGaps(userId: string, topicId: string): Promise<Topic[]>
```

### 2.2 Mastery Calculation Algorithm

**Multi-Factor Mastery Score**:

```
Mastery = (
  Quiz Performance (40%) +
  Consistency (20%) +
  Retention (15%) +
  Time Efficiency (10%) +
  Verification Success (15%)
)

Where:
- Quiz Performance = weighted average of recent quiz scores
- Consistency = consecutive correct answers / total attempts
- Retention = score decay based on time since last study
- Time Efficiency = actual time vs estimated time
- Verification Success = passed verification quizzes / total
```

### 2.3 Create Mastery Service (`src/services/mastery.service.ts`)

**Functions**:

```typescript
- calculateMasteryScore(userId: string, topicId: string): Promise<MasteryScore>
- updateMasteryAfterActivity(userId: string, topicId: string, activity: Activity): Promise<void>
- getMasteryReport(userId: string, subjectId: string): Promise<MasteryReport>
- predictTimeToMastery(userId: string, topicId: string): Promise<number> // days
```

**Deliverables**:

- `src/services/learning.service.ts`
- `src/services/mastery.service.ts`
- `src/types/learning.ts`
- Unit tests for mastery calculations

---

## **PHASE 3: AI Study Plan Generation** 🤖

**Goal**: Use AI to create personalized learning paths

### 3.1 Enhance AI Service (`src/services/ai.service.ts`)

**New Functions**:

```typescript
// Study Plan Generation
- generateLearningPath(context: StudyContext): Promise<LearningPath>
- generateStudyTasks(context: TaskContext): Promise<StudyTask[]>
- refineStudyPlan(currentPath: LearningPath, performance: Performance): Promise<LearningPath>

// Verification Quiz Generation
- generateVerificationQuiz(topic: Topic, difficulty: string): Promise<Question[]>

// Smart Recommendations
- analyzeWeakAreas(masteryData: TopicMastery[]): Promise<Recommendation[]>
- suggestNextTopic(userId: string, subjectId: string): Promise<Topic>
```

### 3.2 Study Plan Generation Prompt

**Context to provide to AI**:

```typescript
{
  subject: Subject,
  goal: string, // "Pass exam in 2 weeks"
  currentMastery: TopicMastery[], // What they know
  weakTopics: Topic[], // What they struggle with
  availableTime: number, // hours per day
  testDate: Date,
  studentProfile: {
    learningStyle: string,
    strengths: string[],
    recentPerformance: QuizAttempt[]
  },
  materials: Material[] // Available resources
}
```

**AI Prompt Structure**:

```
You are an expert education AI creating a personalized study plan.

STUDENT PROFILE:
- Subject: {subject}
- Goal: {goal}
- Days until test: {daysUntilTest}
- Available study time: {hoursPerDay} hours/day

CURRENT MASTERY:
{topicMasteryList}

WEAK AREAS (Priority):
{weakTopicsList}

AVAILABLE MATERIALS:
{materialsList}

TASK:
Create a day-by-day study plan that:
1. Prioritizes weak areas while maintaining strong topics
2. Includes variety (reading, practice, quizzes, review)
3. Uses spaced repetition for retention
4. Builds progressively from basics to advanced
5. Includes verification checkpoints
6. Fits within available time

OUTPUT FORMAT (JSON):
{
  "overview": "Brief explanation of approach",
  "estimatedDays": number,
  "dailySchedule": [
    {
      "day": number,
      "focus": "Topic name",
      "tasks": [
        {
          "title": "Task title",
          "type": "study|practice|quiz|review",
          "topic": "Topic name",
          "description": "What to do",
          "estimatedTime": minutes,
          "materials": ["material IDs"],
          "requiresVerification": boolean
        }
      ]
    }
  ]
}
```

### 3.3 Create Study Plan Service (`src/services/study-plan.service.ts`)

**Functions**:

```typescript
// Path Management
- createLearningPath(userId: string, subjectId: string, goal: string): Promise<LearningPath>
- getCurrentLearningPath(userId: string, subjectId: string): Promise<LearningPath>
- regenerateLearningPath(pathId: string, reason: string): Promise<LearningPath>

// Task Management
- generateDailyTasks(userId: string, date: Date): Promise<StudyTask[]>
- scheduleTask(task: StudyTask): Promise<void>
- completeTask(taskId: string, performance: TaskPerformance): Promise<void>

// Adaptation
- adaptPathBasedOnPerformance(pathId: string, performance: Performance): Promise<void>
- skipToAdvancedContent(userId: string, topicId: string): Promise<void>
```

**Deliverables**:

- Enhanced `src/services/ai.service.ts`
- New `src/services/study-plan.service.ts`
- AI prompt templates in `src/prompts/study-plan.prompts.ts`

---

## **PHASE 4: Verification System** ✅

**Goal**: Confirm learning through targeted quizzes

### 4.1 Create Verification Service (`src/services/verification.service.ts`)

**Functions**:

```typescript
// Quiz Generation
- generateVerificationQuiz(topicId: string, difficulty: string): Promise<VerificationQuiz>
- getVerificationQuestions(topicId: string, count: number): Promise<Question[]>

// Evaluation
- evaluateVerification(quizId: string, answers: Answer[]): Promise<VerificationResult>
- updateMasteryFromVerification(userId: string, result: VerificationResult): Promise<void>

// Requirements
- requiresVerification(userId: string, topicId: string): boolean
- getVerificationThreshold(topicId: string): number
```

### 4.2 Verification Quiz Component

**Enhance existing VerificationQuiz**:

- Short (3-5 questions)
- Focused on single topic
- Immediate feedback
- Mastery-based difficulty (harder questions for higher mastery)

### 4.3 Verification Rules

```typescript
// When to require verification:
1. After completing study task with requiresVerification=true
2. Before advancing to next topic
3. Periodically for spaced repetition
4. When mastery drops below threshold

// Passing criteria:
- Score ≥ 70% for basic mastery
- Score ≥ 85% for advanced topics
- Time spent within reasonable bounds (not rushed/guessed)
```

**Deliverables**:

- `src/services/verification.service.ts`
- Updated `VerificationQuiz.tsx` component
- Verification rules engine

---

## **PHASE 5: Adaptive Learning Engine** 🔄

**Goal**: Continuously adjust study plan based on performance

### 5.1 Create Adaptation Service (`src/services/adaptation.service.ts`)

**Functions**:

```typescript
// Performance Analysis
- analyzeStudySession(userId: string, sessionData: StudySession): Promise<Analysis>
- detectLearningPatterns(userId: string, subjectId: string): Promise<Pattern[]>
- identifyStrugglePoints(userId: string, topicId: string): Promise<StrugglePoint[]>

// Path Adjustment
- adjustLearningPath(pathId: string, analysis: Analysis): Promise<void>
- accelerateProgress(userId: string, topicId: string): Promise<void>
- provideAdditionalSupport(userId: string, topicId: string): Promise<StudyTask[]>

// Recommendations
- suggestNextAction(userId: string): Promise<Recommendation>
- recommendReviewTopics(userId: string): Promise<Topic[]>
```

### 5.2 Adaptation Rules

**Triggers for adaptation**:

```typescript
1. POOR QUIZ PERFORMANCE (Score < 60%)
   → Add review tasks
   → Simplify next steps
   → Add prerequisite topics

2. EXCELLENT PERFORMANCE (Score > 90%, 3+ times)
   → Skip intermediate steps
   → Increase difficulty
   → Accelerate timeline

3. INCONSISTENT RESULTS (High variance)
   → Add more practice
   → Focus on fundamentals
   → Reduce complexity

4. SLOW PROGRESS
   → Break tasks into smaller chunks
   → Add motivation elements
   → Adjust time estimates

5. VERIFICATION FAILURES
   → Mandatory review
   → Lock next topics
   → Add supplementary materials
```

### 5.3 Spaced Repetition Service (`src/services/spaced-repetition.service.ts`)

**Implement SM-2 Algorithm**:

```typescript
// Core functions
- calculateNextReview(userId: string, topicId: string, performance: number): Promise<Date>
- scheduleReview(userId: string, topicId: string): Promise<void>
- getReviewsDue(userId: string, date: Date): Promise<Topic[]>

// Interval calculation (SM-2)
- updateEaseFactor(currentEase: number, quality: number): number
- calculateInterval(repetitions: number, ease: number): number
```

**Deliverables**:

- `src/services/adaptation.service.ts`
- `src/services/spaced-repetition.service.ts`
- Adaptation rules engine
- Review scheduler

---

## **PHASE 6: UI/UX Implementation** 🎨

**Goal**: Create intuitive interfaces for the learning system

### 6.1 Enhanced Study Plan Page

**New Features**:

- **Knowledge Map Visualization**: Interactive graph showing topic dependencies
- **Mastery Dashboard**: Visual representation of mastery levels
- **Daily Study Plan**: Today's recommended tasks with priorities
- **Progress Timeline**: Visual journey from start to goal
- **Smart Notifications**: Reminders for reviews and scheduled tasks

### 6.2 New Components

**Components to create**:

```typescript
// src/components/learning/
-KnowledgeGraph.tsx - // Interactive topic map
  MasteryDashboard.tsx - // Mastery visualization
  LearningPathTimeline.tsx - // Progress timeline
  StudyTaskCard.tsx - // Enhanced task display
  VerificationQuizModal.tsx - // Inline verification
  TopicDetailModal.tsx - // Deep dive into topic
  ProgressInsights.tsx - // Analytics and predictions
  SpacedRepetitionCard.tsx; // Review reminders
```

### 6.3 Study Session Flow

**User Journey**:

```
1. LAND ON STUDY PLAN PAGE
   → See today's recommended tasks
   → View overall progress
   → Check mastery dashboard

2. START A TASK
   → Timer starts
   → Material opens (reading/video)
   → Take notes (optional)

3. COMPLETE TASK
   → Mark as complete
   → If verification required → Mini quiz (3-5 questions)
   → Get immediate feedback

4. VERIFICATION RESULT
   → Pass (≥70%) → Task verified, mastery updated, next task unlocked
   → Fail (<70%) → Additional study recommended, retry available

5. POST-TASK
   → Mastery graph updates
   → Next recommended task appears
   → Progress bar advances
```

### 6.4 Analytics Dashboard

**Display**:

- Study time over time
- Mastery progression graphs
- Topics mastered vs remaining
- Estimated time to goal
- Weak areas heatmap
- Study streak calendar
- Comparison to similar students (optional)

**Deliverables**:

- Updated `StudyPlanPage.tsx`
- New learning components
- Study session flow
- Analytics dashboard

---

## **PHASE 7: Integration & Polish** ✨

**Goal**: Connect everything and ensure smooth operation

### 7.1 Integration Points

**Connect systems**:

- Quiz results → Update topic mastery
- Task completion → Update learning path progress
- Verification results → Trigger adaptation
- Spaced repetition → Generate review tasks
- Study sessions → Update analytics

### 7.2 Background Jobs (Optional)

**Automated tasks**:

```typescript
// Daily/periodic jobs:
- Generate daily study tasks
- Send review reminders
- Update mastery calculations
- Generate weekly reports
- Clean up old data
```

### 7.3 Error Handling & Edge Cases

**Handle scenarios**:

- No materials available for topic
- Student progresses too fast/slow
- Verification quiz generation fails
- Subject has minimal data
- Conflicting schedules
- Test date is too soon

### 7.4 Performance Optimization

**Optimize**:

- Cache mastery calculations
- Lazy-load learning path steps
- Batch AI requests
- Optimize database queries
- Implement pagination for large datasets

**Deliverables**:

- Full system integration
- Background job setup (if needed)
- Error handling
- Performance optimizations
- Testing suite

---

## **PHASE 8: Testing & Refinement** 🧪

**Goal**: Ensure system works correctly and provides value

### 8.1 Testing Strategy

**Unit Tests**:

- Mastery calculation algorithm
- Spaced repetition scheduler
- Adaptation rules engine
- AI prompt formatting

**Integration Tests**:

- Complete learning cycle (assess → plan → learn → verify → adapt)
- Quiz results updating mastery
- Path adaptation after poor performance
- Verification requirement logic

**User Testing**:

- Create test subject with materials
- Go through complete study cycle
- Verify mastery updates correctly
- Check task generation makes sense
- Ensure verification works

### 8.2 AI Prompt Refinement

**Iteratively improve**:

- Study plan generation quality
- Task descriptions clarity
- Verification question relevance
- Recommendation helpfulness

### 8.3 Performance Monitoring

**Track metrics**:

- Time to complete learning paths
- Verification pass rates
- Student satisfaction (mood tracking)
- Mastery improvement rates
- Task completion rates

**Deliverables**:

- Comprehensive test suite
- Refined AI prompts
- Performance benchmarks
- Documentation

---

## 📈 Success Metrics

**How we'll measure success**:

1. **Learning Effectiveness**

   - Average mastery improvement over time
   - Verification pass rate ≥ 75%
   - Final exam pass rate increase

2. **Engagement**

   - Task completion rate ≥ 80%
   - Average study time per day
   - Return rate (students coming back daily)

3. **System Performance**

   - Study plan generation time < 5s
   - Mastery calculation time < 1s
   - AI prompt response time < 3s

4. **User Satisfaction**
   - Mood tracking: positive moods ≥ 70%
   - Study plan relevance rating
   - Verification quiz difficulty rating

---

## 🛠️ Technical Stack Summary

### Backend

- **Database**: PostgreSQL (Supabase)
- **Services**: TypeScript service layer
- **AI**: OpenAI GPT-3.5/4 for content generation

### Frontend

- **Framework**: React 19 + TypeScript
- **State**: React hooks + local state
- **Styling**: Tailwind CSS
- **Charts**: Recharts or Chart.js (for analytics)
- **Icons**: Lucide React

### Algorithms

- **Mastery**: Multi-factor weighted calculation
- **Spaced Repetition**: SM-2 algorithm
- **Adaptation**: Rule-based + AI recommendations

---

## 📋 Implementation Checklist

### Phase 1: Database (1-2 days)

- [ ] Create migration file with all tables
- [ ] Add indexes and RLS policies
- [ ] Run migration on Supabase
- [ ] Create TypeScript types
- [ ] Test database schema

### Phase 2: Knowledge Graph (2-3 days)

- [ ] Build learning.service.ts
- [ ] Build mastery.service.ts
- [ ] Implement mastery calculation
- [ ] Create topic extraction logic
- [ ] Write unit tests

### Phase 3: AI Study Plan (3-4 days)

- [ ] Enhance ai.service.ts
- [ ] Create study plan prompts
- [ ] Build study-plan.service.ts
- [ ] Test plan generation
- [ ] Refine AI outputs

### Phase 4: Verification (2-3 days)

- [ ] Build verification.service.ts
- [ ] Generate verification quizzes
- [ ] Create verification rules
- [ ] Update VerificationQuiz component
- [ ] Test verification flow

### Phase 5: Adaptation (2-3 days)

- [ ] Build adaptation.service.ts
- [ ] Build spaced-repetition.service.ts
- [ ] Implement adaptation rules
- [ ] Create SM-2 algorithm
- [ ] Test adaptation triggers

### Phase 6: UI/UX (3-5 days)

- [ ] Create KnowledgeGraph component
- [ ] Create MasteryDashboard component
- [ ] Update StudyPlanPage
- [ ] Build analytics dashboard
- [ ] Polish and refine UI

### Phase 7: Integration (2-3 days)

- [ ] Connect all services
- [ ] Handle edge cases
- [ ] Optimize performance
- [ ] Add error handling
- [ ] Integration testing

### Phase 8: Testing (2-3 days)

- [ ] Write comprehensive tests
- [ ] User testing session
- [ ] Refine AI prompts
- [ ] Performance testing
- [ ] Fix bugs and polish

**Total Estimated Time**: 17-26 days (3-5 weeks)

---

## 🚀 Quick Start Path

If you want to start with **minimum viable product (MVP)**:

### MVP Focus (1 week)

1. **Database**: Create `topics`, `topic_mastery`, `study_tasks` tables only
2. **Mastery**: Simple mastery calculation (just quiz scores)
3. **Tasks**: Manual task creation (no AI generation yet)
4. **Verification**: Use existing quiz system
5. **UI**: Basic task list with mastery bars

### Then iterate:

- Week 2: Add AI study plan generation
- Week 3: Add adaptation and spaced repetition
- Week 4: Add analytics and polish

---

## 📞 Next Steps

**Choose your approach**:

1. **Full Implementation**: Follow all 8 phases sequentially
2. **MVP First**: Build minimal version, then iterate
3. **Hybrid**: Build database + services first, then UI later

**What would you like to do?**

- Start with Phase 1 (Database)?
- Build MVP first?
- Discuss and refine roadmap?
- Something else?

Let me know and we'll begin! 🎯
