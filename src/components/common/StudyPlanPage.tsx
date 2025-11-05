'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Book,
  Target,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  TrendingUp,
  Brain,
  Zap,
  Award,
  AlertCircle,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  FlaskConical,
  BookOpen,
  FileText,
  MessageSquare,
  CheckCheck,
  Timer,
  X,
  ArrowRight,
  Trophy,
  Flame,
  Star,
  Info,
  BarChart3,
  Lightbulb,
  Flag,
  Plus,
} from 'lucide-react';
import { VerificationQuiz } from '@/components/quiz';
import { useAuth } from '@/components/common/AuthContext';
import { useSubjects } from '@/hooks/useSubjects';
import { useNavigate } from 'react-router-dom';
import {
  getTodaysTasks,
  startTask,
  completeTask as completeTaskService,
  updateTaskTime,
} from '../../services/study-task.service';
import {
  getTopicMasteryBySubject,
  getWeakTopics,
  calculateSubjectMastery,
} from '../../services/topic.service';
import {
  regenerateStudyPlan,
  getStudyRecommendations,
} from '../../services/task-generator.service';
import type {
  StudyTask as RealStudyTask,
  TopicMastery as RealTopicMastery,
} from '../../types/learning';
type Subject = {
  id: string;
  name: string;
  color: string;
  mastery: number;
  passingChance: number;
  weakTopics: string[];
  testDate: string;
  daysUntilTest: number;
};
type TopicMastery = {
  id: string;
  name: string;
  mastery: number;
  quizzesTaken: number;
  lastQuizScore: number;
  trend: 'up' | 'down' | 'stable';
};
type StudyTaskType = 'review' | 'practice' | 'quiz' | 'flashcards' | 'material';
type StudyTask = {
  id: string;
  title: string;
  type: StudyTaskType;
  topic: string;
  estimatedTime: number; // minutes
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  verified: boolean;
  description: string;
  requiresVerification: boolean;
};
type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
};
type FlashCard = {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: number;
  confidence: 'low' | 'medium' | 'high' | null;
};
const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'History',
    color: 'from-blue-500 to-blue-600',
    mastery: 72,
    passingChance: 78,
    weakTopics: ['World War II', 'Renaissance Era', 'Industrial Revolution'],
    testDate: 'Dec 15, 2024',
    daysUntilTest: 8,
  },
  {
    id: '2',
    name: 'Mathematics',
    color: 'from-green-500 to-green-600',
    mastery: 85,
    passingChance: 92,
    weakTopics: ['Calculus', 'Trigonometry'],
    testDate: 'Dec 18, 2024',
    daysUntilTest: 11,
  },
  {
    id: '3',
    name: 'Science',
    color: 'from-orange-500 to-orange-600',
    mastery: 65,
    passingChance: 68,
    weakTopics: ['Organic Chemistry', 'Thermodynamics', 'Cell Biology'],
    testDate: 'Dec 12, 2024',
    daysUntilTest: 5,
  },
];
const mockTopics: TopicMastery[] = [
  {
    id: '1',
    name: 'World War II',
    mastery: 45,
    quizzesTaken: 3,
    lastQuizScore: 52,
    trend: 'up',
  },
  {
    id: '2',
    name: 'Renaissance Era',
    mastery: 68,
    quizzesTaken: 4,
    lastQuizScore: 75,
    trend: 'up',
  },
  {
    id: '3',
    name: 'American Revolution',
    mastery: 88,
    quizzesTaken: 5,
    lastQuizScore: 92,
    trend: 'stable',
  },
  {
    id: '4',
    name: 'Industrial Revolution',
    mastery: 58,
    quizzesTaken: 2,
    lastQuizScore: 60,
    trend: 'down',
  },
];
const mockTasks: StudyTask[] = [
  {
    id: '1',
    title: 'Review WWII Timeline',
    type: 'material',
    topic: 'World War II',
    estimatedTime: 25,
    priority: 'high',
    completed: false,
    verified: false,
    description: 'Go through uploaded materials on WWII major events',
    requiresVerification: true,
  },
  {
    id: '2',
    title: 'Practice Quiz: Renaissance',
    type: 'quiz',
    topic: 'Renaissance Era',
    estimatedTime: 15,
    priority: 'high',
    completed: false,
    verified: false,
    description: 'Take a 10-question quiz on Renaissance key figures',
    requiresVerification: false,
  },
  {
    id: '3',
    title: 'Flashcard Review',
    type: 'flashcards',
    topic: 'World War II',
    estimatedTime: 10,
    priority: 'medium',
    completed: true,
    verified: true,
    description: 'Review 15 key terms and dates',
    requiresVerification: true,
  },
  {
    id: '4',
    title: 'Deep Dive: Industrial Revolution',
    type: 'review',
    topic: 'Industrial Revolution',
    estimatedTime: 30,
    priority: 'medium',
    completed: false,
    verified: false,
    description: 'Study causes and effects in detail',
    requiresVerification: true,
  },
];
const mockFlashcards: FlashCard[] = [
  {
    id: '1',
    front: 'When did World War II begin?',
    back: 'September 1, 1939 - when Germany invaded Poland',
    difficulty: 'easy',
    confidence: null,
  },
  {
    id: '2',
    front: 'What were the main Axis powers?',
    back: 'Germany, Italy, and Japan',
    difficulty: 'easy',
    confidence: null,
  },
  {
    id: '3',
    front: 'What was Operation Overlord?',
    back: 'The codename for the Battle of Normandy (D-Day), the Allied invasion of German-occupied Western Europe during WWII, launched on June 6, 1944.',
    difficulty: 'medium',
    confidence: null,
  },
];
const mockVerificationQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'When did World War II officially begin in Europe?',
    options: ['September 1, 1939', 'December 7, 1941', 'June 6, 1944', 'May 8, 1945'],
    correctAnswer: 0,
    explanation:
      'World War II began in Europe on September 1, 1939, when Germany invaded Poland, leading Britain and France to declare war on Germany.',
    topic: 'World War II',
  },
  {
    id: '2',
    question: 'What were the main Allied powers in World War II?',
    options: [
      'Germany, Italy, Japan',
      'USA, UK, Soviet Union, France, China',
      'USA, Germany, UK',
      'Soviet Union, Italy, Japan',
    ],
    correctAnswer: 1,
    explanation:
      'The main Allied powers were the United States, United Kingdom, Soviet Union, France, and China, who fought against the Axis powers.',
    topic: 'World War II',
  },
  {
    id: '3',
    question: 'What was the significance of D-Day?',
    options: [
      'The day Japan surrendered',
      'The Allied invasion of Nazi-occupied France',
      'The bombing of Pearl Harbor',
      'The liberation of concentration camps',
    ],
    correctAnswer: 1,
    explanation:
      'D-Day (June 6, 1944) was the Allied invasion of Normandy, France, marking the beginning of the liberation of Western Europe from Nazi occupation.',
    topic: 'World War II',
  },
];
type StudyPlanPageProps = {
  preSelectedSubjectId?: string;
};
export const StudyPlanPage = ({ preSelectedSubjectId }: StudyPlanPageProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subjects: dbSubjects, loading: subjectsLoading } = useSubjects();
  const [selectedSubject, setSelectedSubject] = useState<Subject>(
    preSelectedSubjectId
      ? mockSubjects.find(s => s.id === preSelectedSubjectId) || mockSubjects[0]
      : mockSubjects[0]
  );
  const [tasks, setTasks] = useState<StudyTask[]>(mockTasks);
  const [activeTask, setActiveTask] = useState<StudyTask | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showFlashcardsModal, setShowFlashcardsModal] = useState(false);
  const [showVerificationQuiz, setShowVerificationQuiz] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashCard[]>(mockFlashcards);

  // Real data states
  const [realTasks, setRealTasks] = useState<RealStudyTask[]>([]);
  const [topicMastery, setTopicMastery] = useState<RealTopicMastery[]>([]);
  const [subjectMastery, setSubjectMastery] = useState<number>(0);
  const [loadingData, setLoadingData] = useState(true);
  const [recommendation, setRecommendation] = useState<{
    focusTopic: string;
    recommendation: string;
    estimatedTime: number;
  } | null>(null);

  // Timer state - each task has its own timer
  const [taskTimers, setTaskTimers] = useState<Record<string, number>>({});
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use real tasks if available, fallback to mock
  const displayTasks =
    realTasks.length > 0
      ? realTasks.map(rt => ({
          id: rt.id,
          title: rt.title,
          type: rt.type,
          topic: rt.topic?.name || 'General',
          estimatedTime: rt.estimatedTime,
          priority: rt.priority,
          completed: rt.status === 'completed',
          verified: rt.verificationStatus === 'passed',
          description: rt.description,
          requiresVerification: rt.requiresVerification,
        }))
      : tasks;

  const completedTasks = displayTasks.filter(t => t.completed).length;
  const totalTasks = displayTasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const estimatedTimeRemaining = displayTasks
    .filter(t => !t.completed)
    .reduce((acc, t) => acc + t.estimatedTime, 0);

  // Fetch real data
  useEffect(() => {
    const fetchStudyData = async () => {
      if (!user || !selectedSubject.id) return;

      try {
        setLoadingData(true);

        // Fetch tasks for selected subject
        const tasksData = await getTodaysTasks(user.id, selectedSubject.id);
        setRealTasks(tasksData);

        // Fetch topic mastery
        const masteryData = await getTopicMasteryBySubject(user.id, selectedSubject.id);
        setTopicMastery(masteryData);

        // Calculate overall subject mastery
        const overallMastery = await calculateSubjectMastery(user.id, selectedSubject.id);
        setSubjectMastery(overallMastery);

        // Get AI recommendations
        const rec = await getStudyRecommendations(user.id, selectedSubject.id);
        setRecommendation(rec);
      } catch (error) {
        console.error('Error fetching study data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchStudyData();
  }, [user, selectedSubject.id]);

  // Display mastery: use real data if available, fallback to mock
  const displayMastery = realTasks.length > 0 ? subjectMastery : selectedSubject.mastery;
  const displayWeakTopics = topicMastery.filter(tm => tm.masteryLevel < 70).slice(0, 3);

  // Get current task's timer value
  const currentTimerValue = activeTask ? taskTimers[activeTask.id] || 0 : 0;

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && activeTask) {
      timerIntervalRef.current = setInterval(() => {
        setTaskTimers(prev => ({
          ...prev,
          [activeTask.id]: (prev[activeTask.id] || 0) + 1,
        }));
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, activeTask]);
  const handleStartTask = async (task: StudyTask) => {
    setActiveTask(task);
    setShowTaskModal(true);

    // Mark task as in-progress in database if real task
    const realTask = realTasks.find(t => t.id === task.id);
    if (realTask && user) {
      await startTask(task.id);
    }

    if (task.type === 'flashcards') {
      setShowFlashcardsModal(true);
      setCurrentFlashcardIndex(0);
      setShowAnswer(false);
    } else if (task.type === 'quiz') {
      // For quiz tasks, go directly to verification
      setShowVerificationQuiz(true);
    }
  };
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };
  const resetTimer = () => {
    if (activeTask) {
      setTaskTimers(prev => ({
        ...prev,
        [activeTask.id]: 0,
      }));
      setIsTimerRunning(false);
    }
  };
  const handleMarkCompleteAndVerify = () => {
    if (!activeTask) return;

    // Pause timer
    setIsTimerRunning(false);

    // Show verification quiz if required
    if (activeTask.requiresVerification) {
      setShowVerificationQuiz(true);
    } else {
      // Complete without verification
      handleCompleteTask(activeTask.id, false);
    }
  };
  const handleVerificationComplete = (passed: boolean, score: number) => {
    if (activeTask) {
      // Update task as completed and verified
      setTasks(prev =>
        prev.map(t =>
          t.id === activeTask.id
            ? {
                ...t,
                completed: true,
                verified: passed,
              }
            : t
        )
      );

      // Close all modals
      setShowVerificationQuiz(false);
      setShowTaskModal(false);
      setActiveTask(null);
      setIsTimerRunning(false);
    }
  };
  const handleCompleteTask = async (taskId: string, verified: boolean = false) => {
    // Update in database if real task
    const realTask = realTasks.find(t => t.id === taskId);
    if (realTask && user) {
      const timeSpent = Math.floor((taskTimers[taskId] || 0) / 60); // convert seconds to minutes
      await completeTaskService(taskId, timeSpent);

      // Refresh tasks
      const tasksData = await getTodaysTasks(user.id, selectedSubject.id);
      setRealTasks(tasksData);

      // Refresh mastery data
      const masteryData = await getTopicMasteryBySubject(user.id, selectedSubject.id);
      setTopicMastery(masteryData);

      const overallMastery = await calculateSubjectMastery(user.id, selectedSubject.id);
      setSubjectMastery(overallMastery);
    } else {
      // Update mock data
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId
            ? {
                ...t,
                completed: true,
                verified,
              }
            : t
        )
      );
    }

    setShowTaskModal(false);
    setShowVerificationQuiz(false);
    setActiveTask(null);
    setIsTimerRunning(false);
  };
  const handleFlashcardConfidence = (confidence: 'low' | 'medium' | 'high') => {
    const updatedCards = [...flashcards];
    updatedCards[currentFlashcardIndex].confidence = confidence;
    setFlashcards(updatedCards);
    if (currentFlashcardIndex < flashcards.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
      setShowAnswer(false);
    } else {
      // All cards reviewed - complete task
      if (activeTask) {
        handleCompleteTask(activeTask.id, true);
      }
      setShowFlashcardsModal(false);
    }
  };
  const getTaskIcon = (type: StudyTaskType) => {
    switch (type) {
      case 'review':
        return BookOpen;
      case 'practice':
        return Brain;
      case 'quiz':
        return FlaskConical;
      case 'flashcards':
        return Zap;
      case 'material':
        return FileText;
      default:
        return Circle;
    }
  };
  const getTaskColor = (type: StudyTaskType) => {
    switch (type) {
      case 'review':
        return 'from-blue-500 to-blue-600';
      case 'practice':
        return 'from-purple-500 to-purple-600';
      case 'quiz':
        return 'from-red-500 to-red-600';
      case 'flashcards':
        return 'from-amber-500 to-amber-600';
      case 'material':
        return 'from-green-500 to-green-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-emerald-600';
    if (mastery >= 60) return 'text-green-600';
    if (mastery >= 40) return 'text-amber-600';
    return 'text-red-600';
  };
  const getMasteryBg = (mastery: number) => {
    if (mastery >= 80) return 'from-emerald-500 to-green-600';
    if (mastery >= 60) return 'from-green-500 to-emerald-600';
    if (mastery >= 40) return 'from-amber-500 to-yellow-600';
    return 'from-red-500 to-orange-600';
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading state
  if (subjectsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Book className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600">Loading study plan...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no subjects exist
  if (dbSubjects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">No subjects yet</h3>
          <p className="text-slate-600 mb-6">
            Please create a subject first to access your personalized study plan and track your
            progress.
          </p>
          <button
            onClick={() => navigate('/app/subjects')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <Book className="w-5 h-5" />
            <span>Create Your First Subject</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Header Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br from-slate-50 to-indigo-50/30 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          {/* Subject Selector - Mobile Horizontal Scroll */}
          <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 pb-1">
              {mockSubjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl transition-all active:scale-95 ${selectedSubject.id === subject.id ? `bg-gradient-to-r ${subject.color} text-white shadow-md` : 'bg-white border-2 border-slate-200 text-slate-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <Book className="w-4 h-4" />
                    <span className="text-sm font-semibold whitespace-nowrap">{subject.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2">
                Study Plan
              </h1>
              <p className="text-sm lg:text-base text-slate-600">
                {selectedSubject.name} • {selectedSubject.daysUntilTest} days until test
              </p>
            </div>

            {/* Desktop Subject Selector */}
            <div className="hidden lg:block">
              <select
                value={selectedSubject.id}
                onChange={e => setSelectedSubject(mockSubjects.find(s => s.id === e.target.value)!)}
                className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-semibold text-slate-900 cursor-pointer hover:border-blue-400 transition-all"
              >
                {mockSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Mastery */}
            <div className="bg-white rounded-xl p-3 lg:p-4 border-2 border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getMasteryBg(displayMastery)} flex items-center justify-center`}
                >
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-semibold text-slate-600">Mastery</p>
              </div>
              <p className={`text-2xl lg:text-3xl font-bold ${getMasteryColor(displayMastery)}`}>
                {displayMastery}%
              </p>
            </div>

            {/* Passing Chance */}
            <div className="bg-white rounded-xl p-3 lg:p-4 border-2 border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-semibold text-slate-600">Pass %</p>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-green-600">
                {selectedSubject.passingChance}%
              </p>
            </div>

            {/* Days Until Test */}
            <div className="bg-white rounded-xl p-3 lg:p-4 border-2 border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-semibold text-slate-600">Days Left</p>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-orange-600">
                {selectedSubject.daysUntilTest}
              </p>
            </div>

            {/* Time Remaining */}
            <div className="bg-white rounded-xl p-3 lg:p-4 border-2 border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-semibold text-slate-600">Est. Time</p>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-blue-600">
                {estimatedTimeRemaining}m
              </p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-1">
                  Today's Progress
                </h3>
                <p className="text-sm text-slate-600">
                  {completedTasks} of {totalTasks} tasks completed
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-blue-200">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="text-lg font-bold text-slate-900">{completedTasks}</span>
              </div>
            </div>

            <div className="relative h-3 bg-blue-100 rounded-full overflow-hidden mb-2">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {progressPercentage.toFixed(0)}% Complete
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 lg:px-8 lg:py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Weak Topics Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h2 className="text-lg lg:text-xl font-bold text-slate-900">Focus Areas</h2>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {displayWeakTopics.length > 0
                ? displayWeakTopics.map(
                    mastery =>
                      mastery.topic && (
                        <div
                          key={mastery.id}
                          className="bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-blue-300 transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-slate-900 text-sm">
                              {mastery.topic.name}
                            </h3>
                            <div
                              className={`px-2 py-1 rounded-lg text-xs font-bold ${mastery.trend === 'up' ? 'bg-green-100 text-green-700' : mastery.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}
                            >
                              {mastery.trend === 'up'
                                ? '↗'
                                : mastery.trend === 'down'
                                  ? '↘'
                                  : '→'}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Mastery</span>
                              <span
                                className={`font-bold ${getMasteryColor(mastery.masteryLevel)}`}
                              >
                                {Math.round(mastery.masteryLevel)}%
                              </span>
                            </div>

                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${getMasteryBg(mastery.masteryLevel)} rounded-full transition-all`}
                                style={{
                                  width: `${mastery.masteryLevel}%`,
                                }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>{mastery.totalQuizzesTaken} quizzes</span>
                              <span>
                                Last:{' '}
                                {mastery.lastQuizScore ? Math.round(mastery.lastQuizScore) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                  )
                : mockTopics
                    .filter(t => t.mastery < 75)
                    .slice(0, 3)
                    .map(topic => (
                      <div
                        key={topic.id}
                        className="bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-slate-900 text-sm">{topic.name}</h3>
                          <div
                            className={`px-2 py-1 rounded-lg text-xs font-bold ${topic.trend === 'up' ? 'bg-green-100 text-green-700' : topic.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}
                          >
                            {topic.trend === 'up' ? '↗' : topic.trend === 'down' ? '↘' : '→'}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Mastery</span>
                            <span className={`font-bold ${getMasteryColor(topic.mastery)}`}>
                              {topic.mastery}%
                            </span>
                          </div>

                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getMasteryBg(topic.mastery)} rounded-full transition-all`}
                              style={{
                                width: `${topic.mastery}%`,
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{topic.quizzesTaken} quizzes</span>
                            <span>Last: {topic.lastQuizScore}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
            </div>
          </section>

          {/* Study Tasks */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg lg:text-xl font-bold text-slate-900">Study Tasks</h2>
              </div>
              <button
                onClick={async () => {
                  if (!user) return;
                  setLoadingData(true);
                  const newTasks = await regenerateStudyPlan(user.id, selectedSubject.id);
                  setRealTasks(newTasks);
                  setLoadingData(false);
                }}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                disabled={loadingData}
              >
                Regenerate
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {displayTasks.map(task => {
                const TaskIcon = getTaskIcon(task.type);
                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-xl border-2 p-4 lg:p-5 transition-all ${task.completed ? 'border-green-200 bg-green-50/30' : 'border-slate-200 hover:border-blue-300 hover:shadow-md'}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() =>
                          task.completed
                            ? null
                            : handleCompleteTask(task.id, !task.requiresVerification)
                        }
                        disabled={task.completed}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${task.completed ? 'bg-green-600 border-green-600 cursor-default' : 'border-slate-300 hover:border-blue-500'}`}
                      >
                        {task.completed && <CheckCircle2 className="w-5 h-5 text-white" />}
                      </button>

                      {/* Task Icon */}
                      <div
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${getTaskColor(task.type)} flex items-center justify-center flex-shrink-0 shadow-sm`}
                      >
                        <TaskIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <h3
                            className={`font-bold text-slate-900 text-sm lg:text-base ${task.completed ? 'line-through text-slate-500' : ''}`}
                          >
                            {task.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold border ${getPriorityColor(task.priority)} flex-shrink-0`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 mb-3">{task.description}</p>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="flex items-center gap-1 text-slate-600">
                            <Clock className="w-3.5 h-3.5" />
                            {task.estimatedTime} min
                          </span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <BookOpen className="w-3.5 h-3.5" />
                            {task.topic}
                          </span>
                          {task.verified && (
                            <span className="flex items-center gap-1 text-green-600 font-semibold">
                              <CheckCheck className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          )}
                          {taskTimers[task.id] > 0 && (
                            <span className="flex items-center gap-1 text-blue-600 font-semibold">
                              <Timer className="w-3.5 h-3.5" />
                              {formatTime(taskTimers[task.id])}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      {!task.completed && (
                        <button
                          onClick={() => handleStartTask(task)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
                        >
                          <Play className="w-4 h-4" />
                          <span className="hidden sm:inline">Start</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Study Tips */}
          <section className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-5 lg:p-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Study Tip</h3>
                <p className="text-sm text-slate-700 mb-3">
                  {recommendation ? (
                    <>
                      {recommendation.recommendation
                        .split(recommendation.focusTopic)
                        .map((part, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && <strong>{recommendation.focusTopic}</strong>}
                            {part}
                          </React.Fragment>
                        ))}
                    </>
                  ) : (
                    <>
                      Based on your quiz performance, focus on <strong>World War II</strong> today.
                      Spend 30-45 minutes reviewing key events and dates. Your mastery increased by
                      12% after the last study session!
                    </>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-800">
                    AI-Generated Recommendation
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Flashcards Modal */}
      {showFlashcardsModal && activeTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300 p-4"
          onClick={() => setShowFlashcardsModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Flashcard Review</h2>
                  <p className="text-sm text-slate-600 mt-1">{activeTask.topic}</p>
                </div>
                <button
                  onClick={() => setShowFlashcardsModal(false)}
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">
                  Card {currentFlashcardIndex + 1} of {flashcards.length}
                </span>
                <div className="flex gap-1">
                  {flashcards.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${idx === currentFlashcardIndex ? 'bg-blue-600' : idx < currentFlashcardIndex ? 'bg-green-600' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Flashcard */}
            <div className="p-6 lg:p-8">
              <div
                className="relative min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 cursor-pointer transition-all hover:shadow-lg"
                onClick={() => setShowAnswer(!showAnswer)}
              >
                <div className="text-center">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-4">
                    {showAnswer ? 'Answer' : 'Question'}
                  </p>
                  <p className="text-lg lg:text-xl font-semibold text-slate-900 leading-relaxed">
                    {showAnswer
                      ? flashcards[currentFlashcardIndex].back
                      : flashcards[currentFlashcardIndex].front}
                  </p>
                </div>

                <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-medium">
                  {showAnswer ? 'Click to see question' : 'Click to reveal answer'}
                </div>
              </div>

              {/* Confidence Buttons */}
              {showAnswer && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold text-slate-700 text-center">
                    How confident are you?
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleFlashcardConfidence('low')}
                      className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-all active:scale-95"
                    >
                      😰 Need Review
                    </button>
                    <button
                      onClick={() => handleFlashcardConfidence('medium')}
                      className="px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold rounded-xl transition-all active:scale-95"
                    >
                      🤔 Somewhat
                    </button>
                    <button
                      onClick={() => handleFlashcardConfidence('high')}
                      className="px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-xl transition-all active:scale-95"
                    >
                      ✅ Got it!
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Modal (for material review and other tasks) */}
      {showTaskModal &&
        activeTask &&
        activeTask.type !== 'flashcards' &&
        activeTask.type !== 'quiz' &&
        !showVerificationQuiz && (
          <div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => {
              setShowTaskModal(false);
              setActiveTask(null);
              setIsTimerRunning(false);
            }}
          >
            <div
              className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 lg:p-6">
                <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 md:hidden"></div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
                      {activeTask.title}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">{activeTask.topic}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowTaskModal(false);
                      setActiveTask(null);
                      setIsTimerRunning(false);
                    }}
                    className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Task Description */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-slate-700">{activeTask.description}</p>
                  </div>

                  {/* Study Timer */}
                  <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
                    <div className="text-center mb-4">
                      <p className="text-sm font-semibold text-slate-600 mb-2">Study Time</p>
                      <p className="text-5xl font-bold text-slate-900 font-mono">
                        {formatTime(currentTimerValue)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={toggleTimer}
                        className={`flex-1 px-4 py-3 ${isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2`}
                      >
                        {isTimerRunning ? (
                          <>
                            <Pause className="w-4 h-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            {currentTimerValue > 0 ? 'Resume' : 'Start'}
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetTimer}
                        className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all active:scale-95"
                        title="Reset timer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Completion Section */}
                  <div className="space-y-3">
                    {activeTask.requiresVerification && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-start gap-2">
                          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-amber-900 mb-1">
                              Verification Required
                            </p>
                            <p className="text-sm text-amber-800">
                              After studying, we'll ask you a few quick questions to verify your
                              understanding.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleMarkCompleteAndVerify}
                      className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      {activeTask.requiresVerification ? 'Complete & Verify' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Verification Quiz Modal */}
      {showVerificationQuiz && activeTask && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={e => e.stopPropagation()}
        >
          <div
            className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <VerificationQuiz
              taskTitle={activeTask.title}
              topic={activeTask.topic}
              questions={mockVerificationQuestions}
              onComplete={handleVerificationComplete}
              onCancel={() => {
                setShowVerificationQuiz(false);
                // Go back to task modal if not a quiz type
                if (activeTask.type !== 'quiz') {
                  setShowTaskModal(true);
                } else {
                  setShowTaskModal(false);
                  setActiveTask(null);
                }
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
