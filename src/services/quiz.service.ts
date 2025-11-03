import { supabase } from '@/lib/supabase';
import type { Quiz, QuizSettings } from '@/types/quiz';
import type { Question, DifficultyLevel, QuestionType } from '@/types/question';
import { generateQuizQuestions } from './ai.service';

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface CreateQuizDto {
  subjectId: string;
  title: string;
  description?: string;
  materialIds: string[];
  settings: QuizSettings;
  scheduledFor?: string;
}

export interface UpdateQuizDto {
  title?: string;
  description?: string;
  status?: 'draft' | 'scheduled' | 'active' | 'completed';
  scheduledFor?: string;
}

interface QuizSettingsDbRow {
  description?: string;
  mode?: string;
  materialIds?: string[];
  passingScore?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showExplanations?: boolean;
  allowReview?: boolean;
}

interface QuizDbRow {
  id: string;
  user_id: string;
  subject_id: string;
  title: string;
  question_count: number;
  difficulty: string;
  time_limit: number;
  status: string;
  scheduled_at: string | null;
  created_at: string;
  settings: QuizSettingsDbRow;
}

interface QuestionDbRow {
  id: string;
  quiz_id: string;
  question_text: string;
  type: string;
  options: string | null;
  correct_answer: string;
  explanation: string;
  topic: string;
  difficulty: string;
  source_material_id: string | null;
  source_page: number | null;
  source_excerpt: string | null;
  order_index: number;
  created_at: string;
}

// =====================================================
// MAPPING FUNCTIONS
// =====================================================

function mapQuizFromDb(row: QuizDbRow): Quiz {
  return {
    id: row.id,
    userId: row.user_id,
    subjectId: row.subject_id,
    title: row.title,
    description: row.settings?.description,
    mode: (row.settings?.mode as Quiz['mode']) || 'practice',
    status: mapQuizStatus(row.status),
    difficulty: row.difficulty as DifficultyLevel,
    timeLimit: row.time_limit,
    passingScore: row.settings?.passingScore,
    materialIds: row.settings?.materialIds || [],
    questionCount: row.question_count,
    totalPoints: row.question_count * 10, // Assuming 10 points per question
    createdAt: row.created_at,
    updatedAt: row.created_at,
    scheduledFor: row.scheduled_at || undefined,
  };
}

function mapQuizStatus(dbStatus: string): Quiz['status'] {
  const statusMap: Record<string, Quiz['status']> = {
    draft: 'draft',
    scheduled: 'ready',
    active: 'in-progress',
    completed: 'completed',
  };
  return statusMap[dbStatus] || 'draft';
}

function mapQuestionFromDb(row: QuestionDbRow): Question {
  return {
    id: row.id,
    quizId: row.quiz_id,
    type: row.type as QuestionType,
    difficulty: row.difficulty as DifficultyLevel,
    question: row.question_text,
    options: row.options ? JSON.parse(row.options) : undefined,
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
    points: 10, // Default 10 points per question
    order: row.order_index,
    tags: row.topic ? [row.topic] : undefined,
    materialReferences: row.source_material_id ? [row.source_material_id] : undefined,
  };
}

// =====================================================
// QUIZ CRUD OPERATIONS
// =====================================================

/**
 * Create a new quiz
 * @param userId - The authenticated user's ID
 * @param dto - Quiz creation data
 * @returns Created quiz
 */
export async function createQuiz(userId: string, dto: CreateQuizDto): Promise<Quiz> {
  const { data, error } = await supabase
    .from('quizzes')
    .insert({
      user_id: userId,
      subject_id: dto.subjectId,
      title: dto.title,
      question_count: dto.settings.questionCount,
      difficulty: dto.settings.difficulty,
      time_limit: dto.settings.timeLimit || 30,
      status: dto.scheduledFor ? 'scheduled' : 'draft',
      scheduled_for: dto.scheduledFor || null,
      settings: {
        description: dto.description,
        mode: dto.settings.mode,
        materialIds: dto.materialIds,
        passingScore: 70, // Default passing score
        shuffleQuestions: dto.settings.shuffleQuestions,
        shuffleOptions: dto.settings.shuffleOptions,
        showExplanations: dto.settings.showExplanations,
        allowReview: dto.settings.allowReview,
      },
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating quiz:', error);
    throw new Error(`Failed to create quiz: ${error.message}`);
  }

  // Create quiz_materials junction records
  if (dto.materialIds.length > 0) {
    const junctionRecords = dto.materialIds.map(materialId => ({
      quiz_id: data.id,
      material_id: materialId,
    }));

    const { error: junctionError } = await supabase.from('quiz_materials').insert(junctionRecords);

    if (junctionError) {
      console.error('Error linking materials to quiz:', junctionError);
      // Don't throw, quiz is created, just log the error
    }
  }

  return mapQuizFromDb(data);
}

/**
 * Get all quizzes for a user, optionally filtered by subject
 * @param userId - The authenticated user's ID
 * @param subjectId - Optional subject ID to filter by
 * @returns Array of quizzes
 */
export async function getQuizzes(userId: string, subjectId?: string): Promise<Quiz[]> {
  let query = supabase
    .from('quizzes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (subjectId) {
    query = query.eq('subject_id', subjectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching quizzes:', error);
    throw new Error(`Failed to fetch quizzes: ${error.message}`);
  }

  return (data || []).map(mapQuizFromDb);
}

/**
 * Get a single quiz by ID with its questions
 * @param quizId - The quiz ID
 * @param userId - The authenticated user's ID
 * @returns Quiz with questions or null if not found
 */
export async function getQuizById(
  quizId: string,
  userId: string
): Promise<{ quiz: Quiz; questions: Question[] } | null> {
  // Fetch quiz
  const { data: quizData, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .eq('user_id', userId)
    .single();

  if (quizError || !quizData) {
    console.error('Error fetching quiz:', quizError);
    return null;
  }

  // Fetch questions for this quiz
  const { data: questionsData, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: true });

  if (questionsError) {
    console.error('Error fetching questions:', questionsError);
    throw new Error(`Failed to fetch questions: ${questionsError.message}`);
  }

  return {
    quiz: mapQuizFromDb(quizData),
    questions: (questionsData || []).map(mapQuestionFromDb),
  };
}

/**
 * Update a quiz
 * @param quizId - The quiz ID
 * @param userId - The authenticated user's ID
 * @param dto - Quiz update data
 * @returns Updated quiz
 */
export async function updateQuiz(
  quizId: string,
  userId: string,
  dto: UpdateQuizDto
): Promise<Quiz> {
  const updateData: Record<string, string | QuizSettingsDbRow | null> = {};

  if (dto.title !== undefined) updateData.title = dto.title;
  if (dto.status !== undefined) updateData.status = dto.status;
  if (dto.scheduledFor !== undefined) {
    updateData.scheduled_at = dto.scheduledFor || null;
  }

  // Update settings if description is provided
  if (dto.description !== undefined) {
    const { data: currentQuiz } = await supabase
      .from('quizzes')
      .select('settings')
      .eq('id', quizId)
      .single();

    if (currentQuiz) {
      updateData.settings = {
        ...currentQuiz.settings,
        description: dto.description,
      };
    }
  }

  const { data, error } = await supabase
    .from('quizzes')
    .update(updateData)
    .eq('id', quizId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating quiz:', error);
    throw new Error(`Failed to update quiz: ${error.message}`);
  }

  return mapQuizFromDb(data);
}

/**
 * Delete a quiz and all its questions
 * @param quizId - The quiz ID
 * @param userId - The authenticated user's ID
 */
export async function deleteQuiz(quizId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('quizzes').delete().eq('id', quizId).eq('user_id', userId);

  if (error) {
    console.error('Error deleting quiz:', error);
    throw new Error(`Failed to delete quiz: ${error.message}`);
  }
}

// =====================================================
// QUESTION GENERATION (MOCK FOR NOW)
// =====================================================

/**
 * Generate questions for a quiz using AI
 * Uses OpenAI to analyze material content and generate relevant questions
 *
 * @param quizId - The quiz ID
 * @param userId - The authenticated user's ID
 * @param materialIds - Source materials for question generation
 * @param settings - Quiz settings
 * @returns Array of generated questions
 */
export async function generateQuestions(
  quizId: string,
  userId: string,
  materialIds: string[],
  settings: QuizSettings
): Promise<Question[]> {
  const useAI = import.meta.env.VITE_ENABLE_AI_GENERATION === 'true';

  if (useAI && materialIds.length > 0) {
    try {
      // Fetch material content from database
      const { data: materials, error: materialsError } = await supabase
        .from('materials')
        .select('id, title, type, content, extracted_text, subject_id')
        .in('id', materialIds);

      if (materialsError) {
        console.error('Error fetching materials:', materialsError);
        throw new Error('Failed to fetch materials for quiz generation');
      }

      // Get subject name for context
      let subjectName: string | undefined;
      if (materials && materials.length > 0) {
        const { data: subject } = await supabase
          .from('subjects')
          .select('name')
          .eq('id', materials[0].subject_id)
          .single();

        subjectName = subject?.name;
      }

      // Combine material content (prioritize extracted_text for PDFs)
      const combinedContent =
        materials
          ?.map(m => {
            const content = m.extracted_text || m.content || '';
            return `=== ${m.title} ===\n${content}`;
          })
          .join('\n\n') || '';

      if (!combinedContent.trim()) {
        throw new Error('No content available from materials for question generation');
      }

      // Generate questions using AI
      console.log('Generating questions with AI for quiz:', quizId);
      const aiQuestions = await generateQuizQuestions(combinedContent, settings, subjectName);

      // Map AI questions to database format and insert
      const questionsToInsert = aiQuestions.map((q, index) => ({
        quiz_id: quizId,
        question: q.question,
        type: q.type,
        options: q.options ? JSON.stringify(q.options) : null,
        correct_answer: Array.isArray(q.correctAnswer)
          ? q.correctAnswer.join(', ')
          : q.correctAnswer,
        explanation: q.explanation,
        topic: q.tags.join(', '),
        difficulty: q.difficulty,
        points: q.points,
        source_material_id: materialIds[index % materialIds.length] || null,
        source_page: null,
        source_excerpt: null,
        order_index: index,
      }));

      const { data, error } = await supabase.from('questions').insert(questionsToInsert).select();

      if (error) {
        console.error('Error inserting AI-generated questions:', error);
        throw new Error(`Failed to save AI-generated questions: ${error.message}`);
      }

      // Update quiz question count
      await supabase
        .from('quizzes')
        .update({ question_count: aiQuestions.length })
        .eq('id', quizId)
        .eq('user_id', userId);

      console.log(`Successfully generated ${aiQuestions.length} AI questions for quiz ${quizId}`);
      return (data || []).map(mapQuestionFromDb);
    } catch (aiError) {
      console.error('AI generation failed, falling back to template:', aiError);
      // Fall back to template generation if AI fails
      return generateTemplateQuestions(quizId, userId, materialIds, settings);
    }
  }

  // Use template generation if AI is disabled or no materials
  return generateTemplateQuestions(quizId, userId, materialIds, settings);
}

/**
 * Generate template-based questions (fallback)
 */
async function generateTemplateQuestions(
  quizId: string,
  userId: string,
  materialIds: string[],
  settings: QuizSettings
): Promise<Question[]> {
  console.log('Generating template questions for quiz:', quizId);

  const questions: Omit<QuestionDbRow, 'created_at'>[] = [];
  const topics = [
    'Core Concepts',
    'Fundamentals',
    'Key Principles',
    'Applications',
    'Advanced Topics',
  ];

  for (let i = 0; i < settings.questionCount; i++) {
    const topic = topics[i % topics.length];
    const difficulty = settings.difficulty;

    questions.push({
      id: '',
      quiz_id: quizId,
      question_text: `Question ${i + 1}: This is a ${difficulty} question about ${topic}. (Template question - add materials and enable AI for better questions)`,
      type: 'multiple-choice',
      options: JSON.stringify([
        'This is a placeholder option A',
        'This is a placeholder option B',
        'This is a placeholder option C',
        'This is a placeholder option D',
      ]),
      correct_answer: 'This is a placeholder option A',
      explanation: `This is a template question. Enable AI generation (VITE_ENABLE_AI_GENERATION=true) and add study materials to generate real questions.`,
      topic: topic,
      difficulty: difficulty,
      source_material_id: materialIds[i % materialIds.length] || null,
      source_page: null,
      source_excerpt: null,
      order_index: i,
    });
  }

  const { data, error } = await supabase
    .from('questions')
    .insert(
      questions.map(q => ({
        quiz_id: q.quiz_id,
        question: q.question_text,
        type: q.type,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        topic: q.topic,
        difficulty: q.difficulty,
        source_material_id: q.source_material_id,
        source_page: q.source_page,
        source_excerpt: q.source_excerpt,
        order_index: q.order_index,
      }))
    )
    .select();

  if (error) {
    console.error('Error generating template questions:', error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }

  await supabase
    .from('quizzes')
    .update({ question_count: settings.questionCount })
    .eq('id', quizId)
    .eq('user_id', userId);

  return (data || []).map(mapQuestionFromDb);
}

/**
 * Get questions for a quiz
 * @param quizId - The quiz ID
 * @returns Array of questions
 */
export async function getQuestions(quizId: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching questions:', error);
    throw new Error(`Failed to fetch questions: ${error.message}`);
  }

  return (data || []).map(mapQuestionFromDb);
}
