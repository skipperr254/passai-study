import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';
import type { StudyTask, StudyTaskType, TaskPriority } from '@/types/learning';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Analysis data for AI study plan generation
 */
export interface StudyPlanAnalysis {
  subjectId: string;
  subjectName: string;

  // Quiz performance data
  recentAttempts: QuizAttemptAnalysis[];
  overallPerformance: {
    averageScore: number;
    totalAttempts: number;
    passingRate: number;
    trend: 'improving' | 'stable' | 'declining';
  };

  // Topic-level insights
  weakTopics: TopicAnalysis[];
  strongTopics: TopicAnalysis[];

  // Question-level insights
  commonMistakes: MistakePattern[];
  questionTypes: QuestionTypePerformance[];

  // Learning context
  testDate?: string;
  teacherEmphasis?: string;
  studyGoal?: string;
  availableStudyTime?: number; // hours per week
}

export interface QuizAttemptAnalysis {
  attemptId: string;
  quizTitle: string;
  score: number;
  percentage: number;
  completedAt: string;
  timeSpent: number;
  mood?: string;
  questionsAnalysis: {
    correct: number;
    incorrect: number;
    skipped: number;
  };
}

export interface TopicAnalysis {
  topicId: string;
  topicName: string;
  masteryLevel: number;
  questionsAttempted: number;
  correctAnswers: number;
  averageScore: number;
  lastAttemptDate?: string;
}

export interface MistakePattern {
  concept: string;
  frequency: number;
  examples: string[];
  severity: 'high' | 'medium' | 'low';
  incorrectAnswers?: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

export interface QuestionTypePerformance {
  type: string;
  totalAttempted: number;
  correctAnswers: number;
  averageScore: number;
}

/**
 * AI-generated study plan
 */
export interface AIStudyPlan {
  overview: {
    strengths: string[];
    weaknesses: string[];
    focusAreas: string[];
    estimatedTimeToMastery: number; // hours
    confidenceLevel: number; // 0-100
  };

  recommendations: {
    immediate: string; // What to focus on now
    shortTerm: string; // Next 1-2 weeks
    longTerm: string; // Overall strategy
  };

  tasks: GeneratedTask[];

  studySchedule?: {
    daily: number; // minutes per day
    weekly: number; // minutes per week
    breakdown: string; // How to split time
  };
}

export interface GeneratedTask {
  title: string;
  description: string;
  type: StudyTaskType;
  priority: TaskPriority;
  estimatedTime: number; // minutes
  topicId?: string;
  topicName?: string;
  requiresVerification: boolean;
  reasoning: string; // Why this task is recommended
  dueDate?: string;
}

/**
 * Analyze quiz performance to prepare data for AI
 */
export async function analyzeStudyPerformance(
  userId: string,
  subjectId: string
): Promise<StudyPlanAnalysis> {
  try {
    // 1. Get subject info
    const { data: subject, error: subjectError } = await supabase
      .from('subjects')
      .select('name, test_date, teacher_emphasis')
      .eq('id', subjectId)
      .single();

    if (subjectError) throw subjectError;

    // 2. Get all quizzes for this subject
    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('id, title')
      .eq('subject_id', subjectId)
      .eq('user_id', userId);

    if (quizzesError) throw quizzesError;

    const quizIds = quizzes?.map(q => q.id) || [];

    if (quizIds.length === 0) {
      throw new Error('No quizzes found for this subject');
    }

    // 3. Get recent quiz attempts (last 10)
    const { data: attempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('id, quiz_id, score, percentage, time_spent, completed_at, mood_at_midpoint')
      .in('quiz_id', quizIds)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(10);

    if (attemptsError) throw attemptsError;

    // 4. Get question responses for these attempts (including user answers)
    const attemptIds = attempts?.map(a => a.id) || [];
    const { data: responses, error: responsesError } = await supabase
      .from('question_responses')
      .select(
        `
        id,
        attempt_id,
        question_id,
        user_answer,
        is_correct,
        time_spent,
        questions (
          id,
          question,
          type,
          correct_answer,
          options,
          topic_id,
          topics (
            id,
            name
          )
        )
      `
      )
      .in('attempt_id', attemptIds);

    if (responsesError) throw responsesError;

    // 5. Calculate overall performance
    const scores = attempts?.map(a => a.percentage) || [];
    const averageScore =
      scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

    const passingRate =
      scores.length > 0 ? (scores.filter(s => s >= 70).length / scores.length) * 100 : 0;

    // Calculate trend
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (scores.length >= 3) {
      const recent = scores.slice(0, 3).reduce((sum, s) => sum + s, 0) / 3;
      const older =
        scores.slice(3, 6).reduce((sum, s) => sum + s, 0) / Math.max(1, scores.slice(3, 6).length);
      if (recent > older + 5) trend = 'improving';
      else if (recent < older - 5) trend = 'declining';
    }

    // 6. Analyze topics
    interface TopicPerformanceData {
      topicId: string;
      topicName: string;
      correct: number;
      total: number;
      lastAttempt?: string;
    }

    const topicPerformance = new Map<string, TopicPerformanceData>();

    responses?.forEach(response => {
      const topic = (response as Record<string, unknown>).questions as
        | Record<string, unknown>
        | undefined;
      const topicData = topic?.topics as { id: string; name: string } | undefined;

      if (topicData) {
        const key = topicData.id;
        const existing = topicPerformance.get(key) || {
          topicId: topicData.id,
          topicName: topicData.name,
          correct: 0,
          total: 0,
        };

        existing.total++;
        if ((response as Record<string, unknown>).is_correct) existing.correct++;
        topicPerformance.set(key, existing);
      }
    });

    // Convert to TopicAnalysis arrays
    const topicAnalyses: TopicAnalysis[] = Array.from(topicPerformance.values()).map(t => ({
      topicId: t.topicId,
      topicName: t.topicName,
      masteryLevel: (t.correct / t.total) * 100,
      questionsAttempted: t.total,
      correctAnswers: t.correct,
      averageScore: (t.correct / t.total) * 100,
    }));

    const weakTopics = topicAnalyses
      .filter(t => t.masteryLevel < 70)
      .sort((a, b) => a.masteryLevel - b.masteryLevel)
      .slice(0, 5);

    const strongTopics = topicAnalyses
      .filter(t => t.masteryLevel >= 80)
      .sort((a, b) => b.masteryLevel - a.masteryLevel)
      .slice(0, 5);

    // 7. Analyze question types
    const questionTypeMap = new Map<string, { correct: number; total: number }>();

    responses?.forEach(response => {
      const questions = (response as Record<string, unknown>).questions as
        | Record<string, unknown>
        | undefined;
      const type = (questions?.type as string) || 'unknown';
      const existing = questionTypeMap.get(type) || { correct: 0, total: 0 };
      existing.total++;
      if ((response as Record<string, unknown>).is_correct) existing.correct++;
      questionTypeMap.set(type, existing);
    });

    const questionTypes: QuestionTypePerformance[] = Array.from(questionTypeMap.entries()).map(
      ([type, data]) => ({
        type,
        totalAttempted: data.total,
        correctAnswers: data.correct,
        averageScore: (data.correct / data.total) * 100,
      })
    );

    // 8. Identify mistake patterns with user answers
    const incorrectResponses =
      responses?.filter(r => !(r as Record<string, unknown>).is_correct) || [];
    const mistakesByTopic = new Map<
      string,
      Array<{
        question: string;
        userAnswer: string;
        correctAnswer: string;
      }>
    >();

    incorrectResponses.forEach(response => {
      const responseData = response as Record<string, unknown>;
      const questions = responseData.questions as Record<string, unknown> | undefined;
      const topics = questions?.topics as { name?: string } | undefined;
      const topicName = topics?.name || 'Unknown';

      const question = (questions?.question as string) || '';
      const userAnswer = JSON.stringify(responseData.answer);
      const correctAnswer = JSON.stringify(questions?.correct_answer);

      const existing = mistakesByTopic.get(topicName) || [];
      existing.push({
        question,
        userAnswer,
        correctAnswer,
      });
      mistakesByTopic.set(topicName, existing);
    });

    const commonMistakes: MistakePattern[] = Array.from(mistakesByTopic.entries())
      .map(([concept, mistakes]) => ({
        concept,
        frequency: mistakes.length,
        examples: mistakes.slice(0, 3).map(m => m.question), // Top 3 example questions
        incorrectAnswers: mistakes.slice(0, 3), // Include full answer details for AI analysis
        severity: (mistakes.length >= 5 ? 'high' : mistakes.length >= 3 ? 'medium' : 'low') as
          | 'high'
          | 'medium'
          | 'low',
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    // 9. Format recent attempts
    interface AttemptRecord {
      id: string;
      quiz_id: string;
      score: number;
      percentage: number;
      completed_at: string;
      time_spent: number;
      mood_at_midpoint?: string;
    }

    const quizMap = new Map(quizzes?.map(q => [q.id, q.title]) || []);
    const recentAttempts: QuizAttemptAnalysis[] = (attempts || []).map(attempt => {
      const attemptData = attempt as unknown as AttemptRecord;
      const attemptResponses =
        responses?.filter(r => (r as Record<string, unknown>).attempt_id === attemptData.id) || [];
      return {
        attemptId: attemptData.id,
        quizTitle: quizMap.get(attemptData.quiz_id) || 'Unknown Quiz',
        score: attemptData.score,
        percentage: attemptData.percentage,
        completedAt: attemptData.completed_at,
        timeSpent: attemptData.time_spent,
        mood: attemptData.mood_at_midpoint,
        questionsAnalysis: {
          correct: attemptResponses.filter(r => (r as Record<string, unknown>).is_correct).length,
          incorrect: attemptResponses.filter(r => !(r as Record<string, unknown>).is_correct)
            .length,
          skipped: 0,
        },
      };
    });

    return {
      subjectId,
      subjectName: subject.name,
      recentAttempts,
      overallPerformance: {
        averageScore,
        totalAttempts: attempts?.length || 0,
        passingRate,
        trend,
      },
      weakTopics,
      strongTopics,
      commonMistakes,
      questionTypes,
      testDate: subject.test_date,
      teacherEmphasis: subject.teacher_emphasis,
    };
  } catch (error) {
    console.error('Error analyzing study performance:', error);
    throw error;
  }
}

/**
 * Generate AI-powered personalized study plan
 */
export async function generateStudyPlan(
  analysis: StudyPlanAnalysis,
  options?: {
    availableHoursPerWeek?: number;
    focusArea?: 'weakTopics' | 'balanced' | 'testPrep';
    daysUntilTest?: number;
  }
): Promise<AIStudyPlan> {
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Generating study plan, attempt ${attempt}/${maxRetries}`);
      const result = await generateStudyPlanAttempt(analysis, options);
      console.log('Successfully generated study plan');
      return result;
    } catch (error) {
      lastError = error as Error;
      console.error(`Study plan generation attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw new Error(`Failed to generate study plan: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Internal function to attempt study plan generation once
 */
async function generateStudyPlanAttempt(
  analysis: StudyPlanAnalysis,
  options?: {
    availableHoursPerWeek?: number;
    focusArea?: 'weakTopics' | 'balanced' | 'testPrep';
    daysUntilTest?: number;
  }
): Promise<AIStudyPlan> {
  // Validate API key
  if (
    !import.meta.env.VITE_OPENAI_API_KEY ||
    import.meta.env.VITE_OPENAI_API_KEY === 'your-openai-api-key-here'
  ) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = `You are an expert educational advisor specializing in personalized study plan creation. Your goal is to analyze student performance data and create an actionable, effective study plan that maximizes learning outcomes.

Key Principles:
1. Focus on weak areas while maintaining strong areas
2. Provide variety in study activities (review, practice, quizzes, flashcards)
3. Space out similar tasks for better retention (spaced repetition)
4. Prioritize based on urgency and impact
5. Set realistic, achievable goals
6. Build confidence through progressive difficulty
7. Include verification to ensure learning is happening

You MUST respond with a valid JSON object following the exact structure provided.`;

  const userPrompt = `Analyze the following student performance data and create a personalized study plan.

SUBJECT: ${analysis.subjectName}

OVERALL PERFORMANCE:
- Average Score: ${analysis.overallPerformance.averageScore.toFixed(1)}%
- Total Attempts: ${analysis.overallPerformance.totalAttempts}
- Passing Rate: ${analysis.overallPerformance.passingRate.toFixed(1)}%
- Trend: ${analysis.overallPerformance.trend}

WEAK TOPICS (Need Focus):
${analysis.weakTopics.map(t => `- ${t.topicName}: ${t.masteryLevel.toFixed(1)}% mastery (${t.correctAnswers}/${t.questionsAttempted} correct)`).join('\n')}

STRONG TOPICS (Maintain):
${analysis.strongTopics.map(t => `- ${t.topicName}: ${t.masteryLevel.toFixed(1)}% mastery`).join('\n')}

COMMON MISTAKES (with actual answers):
${analysis.commonMistakes
  .map(m => {
    let result = `- ${m.concept}: ${m.frequency} errors (${m.severity} severity)`;
    if (m.incorrectAnswers && m.incorrectAnswers.length > 0) {
      result += '\n  Examples:';
      m.incorrectAnswers.forEach((ia, idx) => {
        result += `\n  ${idx + 1}. Q: "${ia.question}"`;
        result += `\n     Student answered: ${ia.userAnswer}`;
        result += `\n     Correct answer: ${ia.correctAnswer}`;
      });
    }
    return result;
  })
  .join('\n')}

QUESTION TYPE PERFORMANCE:
${analysis.questionTypes.map(qt => `- ${qt.type}: ${qt.averageScore.toFixed(1)}% (${qt.correctAnswers}/${qt.totalAttempted})`).join('\n')}

RECENT QUIZ HISTORY:
${analysis.recentAttempts
  .slice(0, 5)
  .map(
    a =>
      `- ${a.quizTitle}: ${a.percentage.toFixed(1)}% (${a.questionsAnalysis.correct}/${a.questionsAnalysis.correct + a.questionsAnalysis.incorrect} correct)${a.mood ? ` - Mood: ${a.mood}` : ''}`
  )
  .join('\n')}

CONTEXT:
${analysis.testDate ? `- Test Date: ${analysis.testDate}` : ''}
${options?.daysUntilTest ? `- Days Until Test: ${options.daysUntilTest}` : ''}
${analysis.teacherEmphasis ? `- Teacher Emphasis: ${analysis.teacherEmphasis}` : ''}
${options?.availableHoursPerWeek ? `- Available Study Time: ${options.availableHoursPerWeek} hours/week` : ''}
${options?.focusArea ? `- Focus Area: ${options.focusArea}` : ''}

TASK REQUIREMENTS:
- Generate 8-12 specific, actionable study tasks
- Prioritize weak topics but don't neglect strong ones
- Include a mix of task types: review (40%), practice (30%), quiz (20%), flashcards (10%)
- Tasks should build on each other logically
- Include verification tasks for key weak areas
- Set realistic time estimates (15-45 minutes per task)
- Provide clear reasoning for each task

Response format (MUST be valid JSON):
{
  "overview": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
    "focusAreas": ["area 1", "area 2", "area 3"],
    "estimatedTimeToMastery": 20,
    "confidenceLevel": 75
  },
  "recommendations": {
    "immediate": "What to focus on in the next 1-2 days",
    "shortTerm": "Strategy for the next 1-2 weeks",
    "longTerm": "Overall approach to master this subject"
  },
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed description of what to do",
      "type": "review" | "practice" | "quiz" | "flashcards" | "material",
      "priority": "high" | "medium" | "low",
      "estimatedTime": 30,
      "topicId": "topic_id_if_available",
      "topicName": "Topic Name",
      "requiresVerification": true,
      "reasoning": "Why this task is important now",
      "dueDate": "YYYY-MM-DD or null"
    }
  ],
  "studySchedule": {
    "daily": 45,
    "weekly": 315,
    "breakdown": "How to split study time across topics"
  }
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(responseText);

    // Validate structure
    if (!parsed.overview || !parsed.recommendations || !Array.isArray(parsed.tasks)) {
      throw new Error('Invalid study plan structure from AI');
    }

    // Ensure tasks have required fields
    interface ParsedTask {
      title?: string;
      description?: string;
      type?: string;
      priority?: string;
      estimatedTime?: number;
      topicId?: string;
      topicName?: string;
      requiresVerification?: boolean;
      reasoning?: string;
      dueDate?: string;
    }

    const validatedTasks: GeneratedTask[] = parsed.tasks.map((task, index: number) => {
      const taskData = task as ParsedTask;
      if (!taskData.title || !taskData.description || !taskData.type || !taskData.priority) {
        throw new Error(`Task ${index + 1} missing required fields`);
      }

      return {
        title: taskData.title,
        description: taskData.description,
        type: taskData.type as StudyTaskType,
        priority: taskData.priority as TaskPriority,
        estimatedTime: taskData.estimatedTime || 30,
        topicId: taskData.topicId,
        topicName: taskData.topicName,
        requiresVerification: taskData.requiresVerification || false,
        reasoning: taskData.reasoning || 'Recommended for your learning progress',
        dueDate: taskData.dueDate,
      };
    });

    return {
      overview: {
        strengths: parsed.overview.strengths || [],
        weaknesses: parsed.overview.weaknesses || [],
        focusAreas: parsed.overview.focusAreas || [],
        estimatedTimeToMastery: parsed.overview.estimatedTimeToMastery || 20,
        confidenceLevel: parsed.overview.confidenceLevel || 50,
      },
      recommendations: {
        immediate: parsed.recommendations.immediate || 'Start with reviewing weak topics',
        shortTerm: parsed.recommendations.shortTerm || 'Focus on consistent practice',
        longTerm: parsed.recommendations.longTerm || 'Build mastery through regular study',
      },
      tasks: validatedTasks,
      studySchedule: parsed.studySchedule,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * Save generated study plan to database (both plan metadata and tasks)
 */
export async function saveStudyPlan(
  userId: string,
  subjectId: string,
  studyPlan: AIStudyPlan,
  analysis: StudyPlanAnalysis
): Promise<StudyTask[]> {
  try {
    // First, save the study plan metadata
    const { data: planData, error: planError } = await supabase
      .from('study_plans')
      .insert({
        user_id: userId,
        subject_id: subjectId,
        analysis_version: 'v1',
        confidence_level: studyPlan.overview.confidenceLevel,
        overview: studyPlan.overview,
        recommendations: studyPlan.recommendations,
        study_schedule: studyPlan.studySchedule || null,
        performance_snapshot: {
          overallPerformance: analysis.overallPerformance,
          weakTopics: analysis.weakTopics,
          strongTopics: analysis.strongTopics,
          recentAttempts: analysis.recentAttempts.slice(0, 5), // Save last 5 attempts
        },
        is_active: true,
      })
      .select()
      .single();

    if (planError) throw planError;

    // Insert tasks into database, linking them to the study plan
    const tasksToInsert = studyPlan.tasks.map(task => ({
      user_id: userId,
      subject_id: subjectId,
      study_plan_id: planData.id, // Link to the study plan
      topic_id: task.topicId || null,
      title: task.title,
      description: `${task.description}\n\nReasoning: ${task.reasoning}`,
      type: task.type,
      priority: task.priority,
      estimated_time: task.estimatedTime,
      time_spent: 0,
      status: 'pending',
      requires_verification: task.requiresVerification,
      due_date: task.dueDate || null,
    }));

    const { data, error } = await supabase.from('study_tasks').insert(tasksToInsert).select();

    if (error) throw error;

    // Map back to StudyTask type
    const studyTasks: StudyTask[] = (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      subjectId: row.subject_id,
      topicId: row.topic_id,
      title: row.title,
      description: row.description,
      type: row.type as StudyTaskType,
      priority: row.priority as TaskPriority,
      estimatedTime: row.estimated_time,
      timeSpent: row.time_spent,
      status: row.status as 'pending' | 'in-progress' | 'completed' | 'skipped',
      completedAt: row.completed_at,
      requiresVerification: row.requires_verification,
      verificationStatus: row.verification_status as
        | 'pending'
        | 'passed'
        | 'failed'
        | 'skipped'
        | undefined,
      verificationQuizId: row.verification_quiz_id,
      dueDate: row.due_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return studyTasks;
  } catch (error) {
    console.error('Error saving study plan:', error);
    throw error;
  }
}

/**
 * Get existing active study plan for a subject
 */
export async function getActiveStudyPlan(
  userId: string,
  subjectId: string
): Promise<{ analysis: StudyPlanAnalysis | null; plan: AIStudyPlan | null; tasks: StudyTask[] }> {
  try {
    // Get active study plan
    const { data: planData, error: planError } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('subject_id', subjectId)
      .eq('is_active', true)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (planError) throw planError;

    // If no active plan, return empty
    if (!planData) {
      return { analysis: null, plan: null, tasks: [] };
    }

    // Get tasks for this plan
    const { data: tasksData, error: tasksError } = await supabase
      .from('study_tasks')
      .select('*, topics(id, name)')
      .eq('study_plan_id', planData.id)
      .order('created_at', { ascending: true });

    if (tasksError) throw tasksError;

    // Map tasks to StudyTask type
    const tasks: StudyTask[] = (tasksData || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      subjectId: row.subject_id,
      topicId: row.topic_id,
      topic: row.topics
        ? {
            id: row.topics.id,
            name: row.topics.name,
            subjectId: row.subject_id,
            difficulty: 'intermediate' as const,
            estimatedStudyTime: 0,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }
        : undefined,
      title: row.title,
      description: row.description,
      type: row.type as StudyTaskType,
      priority: row.priority as TaskPriority,
      estimatedTime: row.estimated_time,
      timeSpent: row.time_spent,
      status: row.status as 'pending' | 'in-progress' | 'completed' | 'skipped',
      completedAt: row.completed_at,
      requiresVerification: row.requires_verification,
      verificationStatus: row.verification_status as
        | 'pending'
        | 'passed'
        | 'failed'
        | 'skipped'
        | undefined,
      verificationQuizId: row.verification_quiz_id,
      dueDate: row.due_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    // Reconstruct analysis from snapshot
    const analysis: StudyPlanAnalysis = {
      subjectId: planData.subject_id,
      subjectName: '', // Will need to fetch subject name if needed
      ...planData.performance_snapshot,
    };

    // Reconstruct AI study plan
    const plan: AIStudyPlan = {
      overview: planData.overview,
      recommendations: planData.recommendations,
      tasks: [], // Tasks are stored separately in study_tasks
      studySchedule: planData.study_schedule,
    };

    return { analysis, plan, tasks };
  } catch (error) {
    console.error('Error fetching active study plan:', error);
    return { analysis: null, plan: null, tasks: [] };
  }
}

/**
 * Full workflow: Analyze performance and generate study plan
 */
export async function createPersonalizedStudyPlan(
  userId: string,
  subjectId: string,
  options?: {
    availableHoursPerWeek?: number;
    focusArea?: 'weakTopics' | 'balanced' | 'testPrep';
    daysUntilTest?: number;
    forceRegenerate?: boolean; // Force regeneration even if active plan exists
  }
): Promise<{ analysis: StudyPlanAnalysis; plan: AIStudyPlan; tasks: StudyTask[] }> {
  // 1. Check if there's an existing active plan (unless force regenerate)
  if (!options?.forceRegenerate) {
    const existing = await getActiveStudyPlan(userId, subjectId);
    if (existing.plan && existing.tasks.length > 0) {
      console.log('Returning existing active study plan');
      // Fetch fresh analysis for completeness
      const freshAnalysis = await analyzeStudyPerformance(userId, subjectId);
      return { analysis: freshAnalysis, plan: existing.plan, tasks: existing.tasks };
    }
  }

  // 2. Analyze performance
  const analysis = await analyzeStudyPerformance(userId, subjectId);

  // 3. Generate AI study plan
  const plan = await generateStudyPlan(analysis, options);

  // 4. Save to database (this will automatically invalidate old plans)
  const tasks = await saveStudyPlan(userId, subjectId, plan, analysis);

  return { analysis, plan, tasks };
}
