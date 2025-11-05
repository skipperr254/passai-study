import OpenAI from 'openai';
import type { QuizSettings } from '@/types/quiz';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, call OpenAI from backend
});

export interface AIQuestionSchema {
  question: string;
  type: 'multiple-choice' | 'true-false';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  points: number;
}

/**
 * Generate quiz questions using OpenAI based on material content with retry logic
 */
export async function generateQuizQuestions(
  materialContent: string,
  settings: QuizSettings,
  subjectName?: string
): Promise<AIQuestionSchema[]> {
  const maxRetries = 2;
  let lastError: Error | null = null;

  // Try up to maxRetries times
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} to generate quiz questions`);
      const result = await generateQuizQuestionsAttempt(materialContent, settings, subjectName);
      console.log(`Successfully generated ${result.length} questions on attempt ${attempt}`);
      return result;
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, lastError.message);

      if (attempt < maxRetries) {
        // Wait a bit before retrying (exponential backoff)
        const waitTime = attempt * 1000; // 1s, 2s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // All retries failed
  throw new Error(
    `Failed to communicate with AI after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Internal function to attempt question generation once
 */
async function generateQuizQuestionsAttempt(
  materialContent: string,
  settings: QuizSettings,
  subjectName?: string
): Promise<AIQuestionSchema[]> {
  const { questionCount = 10, difficulty = 'medium', mode = 'practice' } = settings;

  // Validate API key
  if (
    !import.meta.env.VITE_OPENAI_API_KEY ||
    import.meta.env.VITE_OPENAI_API_KEY === 'your-openai-api-key-here'
  ) {
    throw new Error(
      'OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.'
    );
  }

  // Truncate material content if too long (keep under ~6000 tokens for safety)
  const maxContentLength = 20000; // ~5000 tokens
  const truncatedContent =
    materialContent.length > maxContentLength
      ? materialContent.substring(0, maxContentLength) + '\n\n[Content truncated...]'
      : materialContent;

  // Build system prompt
  const systemPrompt = `You are an expert educational quiz generator. Your task is to create high-quality, engaging quiz questions based on study materials.

CRITICAL REQUIREMENTS:
1. You MUST respond with a valid JSON object containing a "questions" array
2. The response format MUST be: {"questions": [... array of question objects ...]}
3. NEVER return a single question object - ALWAYS return an array even if generating just one question
4. No additional text, explanations, or markdown formatting outside the JSON
5. ONLY generate "multiple-choice" and "true-false" questions
6. NEVER add letter prefixes (A., B., C., D.) to options - provide plain text only

Generate questions that:
1. Test understanding, not just memorization
2. Are clear, concise, and unambiguous
3. Have accurate answers with helpful explanations
4. Match the requested difficulty level
5. Cover key concepts from the material

Question types ALLOWED:
- multiple-choice: Exactly 4 plain text options with one correct answer (NO "A. ", "B. " prefixes)
- true-false: Statement with exactly 2 options: ["True", "False"]

Question types NOT ALLOWED:
- short-answer
- essay
- fill-in-the-blank
- matching

Difficulty levels:
- easy: Basic recall and comprehension
- medium: Application and analysis
- hard: Synthesis and evaluation`;

  // Build user prompt
  const userPrompt = `Generate ${questionCount} ${difficulty} quiz questions from the following study material.

${subjectName ? `Subject: ${subjectName}` : ''}
Mode: ${mode}

Study Material:
${truncatedContent}

Response format - you MUST use this EXACT structure:
{
  "questions": [
    {
      "question": "The question text",
      "type": "multiple-choice" | "true-false",
      "options": ["First option", "Second option", "Third option", "Fourth option"], // ONLY for multiple-choice, 4 options, NO "A. ", "B. " prefixes
      "correctAnswer": "The correct answer text", // Must match one of the options exactly
      "explanation": "Why this answer is correct and what concept it tests",
      "difficulty": "easy" | "medium" | "hard",
      "tags": ["concept1", "concept2"], // Key topics/concepts covered
      "points": 1-5 // Points based on difficulty: easy=1, medium=2-3, hard=4-5
    }
    // ... ${questionCount} total questions
  ]
}

CRITICAL INSTRUCTIONS:
1. ONLY generate "multiple-choice" and "true-false" questions
2. For multiple-choice: provide exactly 4 options WITHOUT any prefixes (no "A. ", "B. ", "C. ", "D. ")
3. For true-false: provide exactly 2 options: ["True", "False"]
4. The correctAnswer MUST match one of the options exactly (word for word)
5. Options should be plain text without any numbering or lettering

Question type distribution:
- 70% multiple-choice (4 options each)
- 30% true-false (2 options each)

CRITICAL: Your response MUST be a JSON object with a "questions" array containing ${questionCount} question objects. DO NOT return anything else.`;

  try {
    // Call OpenAI API with JSON mode for reliable structured output
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106', // Supports JSON mode
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7, // Balance creativity and accuracy
      max_tokens: 3000, // Allow for detailed questions
    });

    const responseText = completion.choices[0]?.message?.content;

    console.log('Response text: ', responseText);

    if (!responseText) {
      throw new Error('No response from OpenAI API');
    }

    // Parse JSON response
    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
      console.log('Parsed: ', parsed);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Handle various response formats and ensure we get an array
    let questions: unknown[] = [];

    if (Array.isArray(parsed)) {
      // Direct array response
      questions = parsed;
    } else if (parsed && typeof parsed === 'object') {
      // Object wrapper - try common property names
      const parsedObj = parsed as Record<string, unknown>;

      if (Array.isArray(parsedObj.questions)) {
        questions = parsedObj.questions;
      } else if (Array.isArray(parsedObj.data)) {
        questions = parsedObj.data;
      } else if (Array.isArray(parsedObj.items)) {
        questions = parsedObj.items;
      } else if (Array.isArray(parsedObj.quiz)) {
        questions = parsedObj.quiz;
      } else {
        // If the object itself looks like a question (has 'question' property), wrap it in an array
        if (parsedObj.question && typeof parsedObj.question === 'string') {
          console.warn('AI returned a single question object instead of an array, wrapping it');
          questions = [parsedObj];
        } else {
          // Try to extract any array property
          const arrayValues = Object.values(parsedObj).filter(Array.isArray);
          if (arrayValues.length > 0) {
            questions = arrayValues[0] as unknown[];
          }
        }
      }
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions array found in AI response');
    }

    // Validate and clean questions
    const validatedQuestions = questions.map((q, index) => validateQuestion(q, index));

    if (validatedQuestions.length === 0) {
      throw new Error('No valid questions after validation');
    }

    return validatedQuestions.slice(0, questionCount); // Ensure we return exactly questionCount
  } catch (error) {
    console.error('OpenAI API error:', error);

    // Provide helpful error messages
    const err = error as { code?: string; message?: string };
    if (err.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }

    if (err.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your billing.');
    }

    if (err.code === 'rate_limit_exceeded') {
      throw new Error('OpenAI rate limit exceeded. Please try again in a moment.');
    }

    throw new Error(`Failed to generate questions: ${err.message || 'Unknown error'}`);
  }
}

/**
 * Validate and clean a question object
 */
function validateQuestion(question: unknown, index: number): AIQuestionSchema {
  const q = question as Record<string, unknown>;

  // Validate required fields
  if (!q.question || typeof q.question !== 'string') {
    throw new Error(`Question ${index + 1}: Missing or invalid 'question' field`);
  }

  // Validate type - ONLY allow multiple-choice and true-false
  const validTypes = ['multiple-choice', 'true-false'];
  if (!q.type || !validTypes.includes(q.type as string)) {
    q.type = 'multiple-choice'; // Default to multiple-choice
  }

  // Reject short-answer and essay types
  if (q.type === 'short-answer' || q.type === 'essay') {
    throw new Error(
      `Question ${index + 1}: Only multiple-choice and true-false questions are allowed`
    );
  }

  // Validate and clean options
  if (q.type === 'multiple-choice') {
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(
        `Question ${index + 1}: Multiple-choice questions must have at least 2 options`
      );
    }
  }

  // Validate true-false options
  if (q.type === 'true-false') {
    if (!Array.isArray(q.options)) {
      q.options = ['True', 'False'];
    }
  }

  // Clean options - remove any "A. ", "B. ", "C. ", "D. " prefixes or numbering
  const cleanOptions = (options: unknown[]): string[] => {
    return options.map((opt: unknown) => {
      let cleaned = String(opt).trim();
      // Remove patterns like "A. ", "B. ", "1. ", "2) ", etc.
      cleaned = cleaned.replace(/^[A-D][.)]\s*/i, '');
      cleaned = cleaned.replace(/^[1-4][.)]\s*/, '');
      return cleaned;
    });
  };

  // Validate correct answer
  if (!q.correctAnswer) {
    throw new Error(`Question ${index + 1}: Missing 'correctAnswer' field`);
  }

  // Clean correct answer as well
  let cleanedCorrectAnswer = String(q.correctAnswer).trim();
  cleanedCorrectAnswer = cleanedCorrectAnswer.replace(/^[A-D][.)]\s*/i, '');
  cleanedCorrectAnswer = cleanedCorrectAnswer.replace(/^[1-4][.)]\s*/, '');

  // Validate difficulty
  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!q.difficulty || !validDifficulties.includes(q.difficulty as string)) {
    q.difficulty = 'medium'; // Default to medium
  }

  // Set default points based on difficulty if not provided
  if (!q.points || typeof q.points !== 'number') {
    q.points = q.difficulty === 'easy' ? 1 : q.difficulty === 'hard' ? 4 : 2;
  }

  // Ensure explanation exists
  if (!q.explanation || typeof q.explanation !== 'string') {
    q.explanation = 'Correct answer provided.';
  }

  // Ensure tags array exists
  if (!Array.isArray(q.tags)) {
    q.tags = [];
  }

  const cleanedOptions = Array.isArray(q.options) ? cleanOptions(q.options) : undefined;

  return {
    question: (q.question as string).trim(),
    type: q.type as 'multiple-choice' | 'true-false',
    options: cleanedOptions,
    correctAnswer: cleanedCorrectAnswer,
    explanation: (q.explanation as string).trim(),
    difficulty: q.difficulty as AIQuestionSchema['difficulty'],
    tags: q.tags as string[],
    points: q.points as number,
  };
}

/**
 * Test OpenAI API connection
 */
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    await openai.models.list();
    return true;
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    return false;
  }
}
