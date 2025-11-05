# AI-Powered Personalized Study Plan

## Overview

The AI-Powered Study Plan feature uses OpenAI's GPT-4 to analyze student quiz performance and generate personalized, actionable study recommendations. It examines quiz attempts, identifies weak areas, recognizes mistake patterns, and creates a customized learning path to help students improve their performance.

## Features

### 1. **Performance Analysis**

- Analyzes recent quiz attempts and question responses
- Identifies weak topics and strong areas
- Detects common mistake patterns
- Tracks learning trends (improving/stable/declining)
- Evaluates performance by question type

### 2. **AI-Generated Insights**

- **Strengths**: Topics and skills the student excels at
- **Weaknesses**: Areas requiring immediate attention
- **Focus Areas**: Priority topics for maximum improvement
- **Confidence Level**: AI-calculated passing likelihood

### 3. **Personalized Recommendations**

- **Immediate**: What to focus on in the next 1-2 days
- **Short-term**: Strategy for the next 1-2 weeks
- **Long-term**: Overall approach to master the subject

### 4. **Smart Task Generation**

- Creates 8-12 specific, actionable study tasks
- Mix of task types:
  - **Review** (40%): Go through materials and notes
  - **Practice** (30%): Solve problems and exercises
  - **Quiz** (20%): Test knowledge with quizzes
  - **Flashcards** (10%): Quick review and memorization
- Each task includes:
  - Clear title and description
  - Estimated time (15-45 minutes)
  - Priority level (high/medium/low)
  - AI reasoning for why it's recommended
  - Optional verification requirement

### 5. **Study Schedule**

- Recommended daily study time
- Weekly study hours
- Breakdown of how to allocate time across topics

## How It Works

### Data Collection

The system analyzes:

1. **Quiz Attempts**: Recent quiz scores, completion times, mood at midpoint
2. **Question Responses**: Individual answers, correctness, time spent
3. **Topic Performance**: Success rate per topic, mastery levels
4. **Mistake Patterns**: Common errors, frequently missed concepts
5. **Question Types**: Performance on multiple-choice, true-false, etc.
6. **Subject Context**: Test dates, teacher emphasis, student goals

### AI Processing

The OpenAI GPT-4 model:

1. Receives comprehensive performance data
2. Identifies learning gaps and patterns
3. Prioritizes topics based on:
   - Urgency (test dates, importance)
   - Impact (potential score improvement)
   - Difficulty (mastery requirements)
   - Dependencies (prerequisite knowledge)
4. Generates personalized tasks and recommendations
5. Creates a balanced study schedule

### Database Storage

Generated tasks are saved to `study_tasks` table with:

- Task details (title, description, type)
- Time estimates and priority
- Verification requirements
- Due dates (if applicable)
- Topic associations

## Usage

### Prerequisites

1. **OpenAI API Key**: Set `VITE_OPENAI_API_KEY` in your `.env` file
2. **Quiz Attempts**: Student must have completed at least one quiz
3. **Question Responses**: Quiz must have recorded answers

### Generating a Study Plan

```typescript
import { createPersonalizedStudyPlan } from '@/services/study-plan.service';

// Generate plan
const result = await createPersonalizedStudyPlan(userId, subjectId, {
  availableHoursPerWeek: 10,
  focusArea: 'weakTopics', // or 'balanced' or 'testPrep'
  daysUntilTest: 14, // optional
});

// Access results
const { analysis, plan, tasks } = result;
```

### Accessing Analysis Data

```typescript
import { analyzeStudyPerformance } from '@/services/study-plan.service';

const analysis = await analyzeStudyPerformance(userId, subjectId);

console.log('Overall Performance:', analysis.overallPerformance);
console.log('Weak Topics:', analysis.weakTopics);
console.log('Common Mistakes:', analysis.commonMistakes);
```

### Generating Only the Plan (without saving)

```typescript
import { analyzeStudyPerformance, generateStudyPlan } from '@/services/study-plan.service';

// 1. Analyze performance
const analysis = await analyzeStudyPerformance(userId, subjectId);

// 2. Generate plan
const plan = await generateStudyPlan(analysis, {
  availableHoursPerWeek: 10,
  focusArea: 'weakTopics',
});

// 3. Use plan data without saving
console.log(plan.overview);
console.log(plan.recommendations);
console.log(plan.tasks);
```

## UI Integration

### Study Plan Page

The `StudyPlanPage` component integrates the AI study plan:

1. **Empty State**: Shows when no quizzes have been taken
2. **Generate Button**: Triggers AI analysis and plan generation
3. **AI Insights Section**: Displays:
   - Strengths, weaknesses, focus areas
   - Immediate, short-term, long-term recommendations
   - Study schedule breakdown
4. **Task List**: Shows personalized tasks with:
   - Task details and reasoning
   - Progress tracking
   - Verification status

### User Flow

```
1. User takes quizzes → Data collected
2. User navigates to Study Plan page
3. System checks for quiz attempts
4. User clicks "Generate AI Plan"
5. System analyzes performance (2-3 seconds)
6. AI generates personalized plan (3-5 seconds)
7. Plan displayed with insights and tasks
8. Tasks saved to database
9. User can start tasks immediately
```

## Data Structures

### StudyPlanAnalysis

```typescript
{
  subjectId: string;
  subjectName: string;
  recentAttempts: QuizAttemptAnalysis[];
  overallPerformance: {
    averageScore: number;
    totalAttempts: number;
    passingRate: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  weakTopics: TopicAnalysis[];
  strongTopics: TopicAnalysis[];
  commonMistakes: MistakePattern[];
  questionTypes: QuestionTypePerformance[];
  testDate?: string;
  teacherEmphasis?: string;
}
```

### AIStudyPlan

```typescript
{
  overview: {
    strengths: string[];
    weaknesses: string[];
    focusAreas: string[];
    estimatedTimeToMastery: number; // hours
    confidenceLevel: number; // 0-100
  };
  recommendations: {
    immediate: string;
    shortTerm: string;
    longTerm: string;
  };
  tasks: GeneratedTask[];
  studySchedule?: {
    daily: number; // minutes
    weekly: number; // minutes
    breakdown: string;
  };
}
```

## API Costs

The AI study plan uses OpenAI's GPT-4 Turbo API:

- **Model**: `gpt-4-turbo-preview`
- **Average Tokens**: ~2000-3000 input, ~1500-2500 output
- **Estimated Cost**: $0.03-0.05 per plan generation
- **Retry Logic**: Up to 2 attempts with exponential backoff

## Error Handling

The system handles various error scenarios:

1. **No Quiz Data**: Shows empty state prompting user to take a quiz
2. **API Errors**: Retries with exponential backoff (2 attempts)
3. **Invalid API Key**: Clear error message to user
4. **Rate Limits**: Graceful error with retry suggestion
5. **Quota Exceeded**: Informs user to check OpenAI billing
6. **Malformed Response**: Falls back gracefully, logs error

## Best Practices

1. **Frequency**: Regenerate plan after every 2-3 quiz attempts
2. **Context**: Include teacher emphasis and test dates for better recommendations
3. **Time Commitment**: Provide realistic available study time
4. **Task Completion**: Mark tasks as completed to track progress
5. **Verification**: Complete verification quizzes to ensure understanding

## Future Enhancements

Potential improvements:

1. **Adaptive Learning**: Adjust task difficulty based on completion success
2. **Spaced Repetition**: Optimal scheduling based on forgetting curve
3. **Multi-Subject**: Cross-subject analysis for time management
4. **Progress Tracking**: Visualize mastery improvement over time
5. **Collaboration**: Share study plans with study groups
6. **Gamification**: Achievements and streaks for motivation
7. **Voice Integration**: Audio study recommendations
8. **Mobile Optimization**: Push notifications for study reminders

## Troubleshooting

### "No quizzes found"

- Ensure user has created quizzes for the subject
- Verify quizzes are marked as completed

### "Failed to generate study plan"

- Check OpenAI API key is valid
- Verify internet connection
- Check OpenAI service status
- Review browser console for detailed error

### Tasks not showing

- Verify database connection
- Check study_tasks table has correct RLS policies
- Ensure user authentication is working

### AI recommendations seem off

- Ensure sufficient quiz attempts (minimum 2-3)
- Verify question responses are recorded correctly
- Check topic associations on questions
- Review input data for completeness

## Database Schema

### study_tasks

```sql
CREATE TABLE study_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  topic_id UUID REFERENCES topics(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('review', 'practice', 'quiz', 'flashcards', 'material')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  estimated_time INTEGER NOT NULL DEFAULT 15,
  time_spent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'skipped')),
  requires_verification BOOLEAN NOT NULL DEFAULT false,
  verification_status TEXT CHECK (verification_status IN ('pending', 'passed', 'failed', 'skipped')),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Security Considerations

1. **API Key**: Never expose OpenAI API key in client-side code (use environment variables)
2. **RLS Policies**: Ensure study_tasks has proper Row Level Security
3. **Rate Limiting**: Implement user-level rate limiting to prevent abuse
4. **Data Privacy**: Quiz responses and analysis data should be encrypted
5. **Cost Control**: Monitor API usage and set budget alerts

## Testing

### Unit Tests

```typescript
// Test analysis
describe('analyzeStudyPerformance', () => {
  it('should calculate correct average score', async () => {
    const analysis = await analyzeStudyPerformance(userId, subjectId);
    expect(analysis.overallPerformance.averageScore).toBeGreaterThan(0);
  });
});

// Test plan generation
describe('generateStudyPlan', () => {
  it('should generate tasks', async () => {
    const plan = await generateStudyPlan(mockAnalysis);
    expect(plan.tasks.length).toBeGreaterThan(0);
  });
});
```

### Integration Tests

```typescript
describe('createPersonalizedStudyPlan', () => {
  it('should save tasks to database', async () => {
    const result = await createPersonalizedStudyPlan(userId, subjectId);
    expect(result.tasks.length).toBeGreaterThan(0);

    // Verify in database
    const { data } = await supabase
      .from('study_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('subject_id', subjectId);

    expect(data?.length).toBe(result.tasks.length);
  });
});
```

## Support

For issues or questions:

1. Check browser console for errors
2. Review this guide for troubleshooting steps
3. Verify OpenAI API configuration
4. Check database schema and RLS policies
5. Contact development team with error logs

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
