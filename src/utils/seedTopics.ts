import { createTopic } from '../services/topic.service';

/**
 * Seed topics for a subject for testing
 * This creates sample topics based on common subjects
 */
export const seedTopicsForSubject = async (
  subjectId: string,
  subjectName: string
): Promise<void> => {
  const topicTemplates: Record<
    string,
    Array<{
      name: string;
      description: string;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      estimatedTime: number;
    }>
  > = {
    History: [
      {
        name: 'World War II',
        description: 'Major events, causes, and consequences of WWII',
        difficulty: 'intermediate',
        estimatedTime: 45,
      },
      {
        name: 'Renaissance Era',
        description: 'Cultural rebirth in Europe, art, science, and philosophy',
        difficulty: 'intermediate',
        estimatedTime: 40,
      },
      {
        name: 'Industrial Revolution',
        description: 'Technological advances and societal changes',
        difficulty: 'advanced',
        estimatedTime: 50,
      },
      {
        name: 'American Revolution',
        description: "Colonial America's fight for independence",
        difficulty: 'beginner',
        estimatedTime: 35,
      },
      {
        name: 'Ancient Civilizations',
        description: 'Egypt, Greece, Rome, and Mesopotamia',
        difficulty: 'beginner',
        estimatedTime: 30,
      },
    ],
    Mathematics: [
      {
        name: 'Algebra Fundamentals',
        description: 'Variables, equations, and basic operations',
        difficulty: 'beginner',
        estimatedTime: 30,
      },
      {
        name: 'Calculus',
        description: 'Derivatives, integrals, and limits',
        difficulty: 'advanced',
        estimatedTime: 60,
      },
      {
        name: 'Trigonometry',
        description: 'Sine, cosine, tangent, and their applications',
        difficulty: 'intermediate',
        estimatedTime: 40,
      },
      {
        name: 'Geometry',
        description: 'Shapes, angles, and spatial reasoning',
        difficulty: 'intermediate',
        estimatedTime: 35,
      },
      {
        name: 'Statistics',
        description: 'Mean, median, mode, and probability',
        difficulty: 'intermediate',
        estimatedTime: 40,
      },
    ],
    Science: [
      {
        name: 'Cell Biology',
        description: 'Cell structure, organelles, and cellular processes',
        difficulty: 'intermediate',
        estimatedTime: 45,
      },
      {
        name: 'Organic Chemistry',
        description: 'Carbon compounds, reactions, and mechanisms',
        difficulty: 'advanced',
        estimatedTime: 60,
      },
      {
        name: 'Thermodynamics',
        description: 'Energy, heat, and the laws of thermodynamics',
        difficulty: 'advanced',
        estimatedTime: 50,
      },
      {
        name: "Newton's Laws",
        description: 'Motion, force, and fundamental physics principles',
        difficulty: 'beginner',
        estimatedTime: 30,
      },
      {
        name: 'Genetics',
        description: 'DNA, inheritance, and genetic variation',
        difficulty: 'intermediate',
        estimatedTime: 40,
      },
    ],
    English: [
      {
        name: 'Grammar Basics',
        description: 'Parts of speech, sentence structure, punctuation',
        difficulty: 'beginner',
        estimatedTime: 25,
      },
      {
        name: 'Literary Analysis',
        description: 'Themes, symbols, and critical reading',
        difficulty: 'intermediate',
        estimatedTime: 40,
      },
      {
        name: 'Essay Writing',
        description: 'Structure, argumentation, and persuasive writing',
        difficulty: 'intermediate',
        estimatedTime: 45,
      },
      {
        name: 'Poetry Analysis',
        description: 'Meter, rhyme, imagery, and poetic devices',
        difficulty: 'advanced',
        estimatedTime: 35,
      },
      {
        name: 'Vocabulary Building',
        description: 'Advanced words, roots, and context clues',
        difficulty: 'beginner',
        estimatedTime: 20,
      },
    ],
  };

  // Find matching template or use generic topics
  const topics = topicTemplates[subjectName] || [
    {
      name: 'Fundamentals',
      description: `Basic concepts in ${subjectName}`,
      difficulty: 'beginner' as const,
      estimatedTime: 30,
    },
    {
      name: 'Intermediate Topics',
      description: `Core principles of ${subjectName}`,
      difficulty: 'intermediate' as const,
      estimatedTime: 40,
    },
    {
      name: 'Advanced Concepts',
      description: `Complex topics in ${subjectName}`,
      difficulty: 'advanced' as const,
      estimatedTime: 50,
    },
  ];

  // Create topics
  for (const topic of topics) {
    await createTopic(
      subjectId,
      topic.name,
      topic.description,
      topic.difficulty,
      topic.estimatedTime
    );
  }

  console.log(`✅ Seeded ${topics.length} topics for ${subjectName}`);
};

/**
 * Quick helper to seed topics via console
 * Usage: Open browser console and run:
 * window.seedTopics('subject-uuid', 'History')
 */
if (typeof window !== 'undefined') {
  (window as unknown as { seedTopics: typeof seedTopicsForSubject }).seedTopics =
    seedTopicsForSubject;
}
