import React, { useState, useEffect } from 'react';
import {
  FileQuestion,
  Play,
  Clock,
  Target,
  TrendingUp,
  Trophy,
  Calendar,
  ChevronRight,
  Book,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  ArrowLeft,
  FileText,
  ChevronDown,
  Eye,
  Award,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { QuizSession } from './QuizSession';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useSubjects } from '@/hooks/useSubjects';
import { useMaterials } from '@/hooks/useMaterials';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import type { Quiz } from '@/types/quiz';
import type { Material } from '@/types/material';
type QuizDetailPageProps = {
  quizId: string;
  onBack?: () => void;
  onStartQuiz?: () => void;
};

export const QuizDetailPage = ({ quizId, onBack, onStartQuiz }: QuizDetailPageProps) => {
  const { user } = useAuth();
  const { getQuiz } = useQuizzes();
  const { subjects } = useSubjects();
  const { materials } = useMaterials();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAttemptDetails, setShowAttemptDetails] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);

  // Fetch quiz data on mount
  useEffect(() => {
    let mounted = true;

    const fetchQuizData = async () => {
      if (!mounted) return;

      setLoading(true);
      try {
        const quizData = await getQuiz(quizId);
        if (!mounted) return;

        if (quizData && quizData.quiz) {
          setQuiz(quizData.quiz);
        } else {
          toast.error('Quiz not found');
          onBack?.();
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Failed to fetch quiz:', error);
        toast.error('Failed to load quiz');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (quizId) {
      fetchQuizData();
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  // Show loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  // Show error state if quiz not found
  if (!quiz) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileQuestion className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Quiz Not Found</h3>
          <p className="text-slate-600 mb-4">This quiz may have been deleted or doesn't exist.</p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Get subject for quiz
  const subject = subjects.find(s => s.id === quiz.subjectId);
  const subjectColor = subject?.color || 'from-slate-500 to-slate-600';
  const subjectName = subject?.name || 'Unknown';

  // Get materials for quiz
  const quizMaterials = materials.filter(m => quiz.materialIds.includes(m.id));

  // If quiz is active, show quiz session
  if (isQuizActive) {
    return (
      <QuizSession
        quizId={quiz.id}
        quizTitle={quiz.title}
        subject={subjectName}
        subjectColor={subjectColor}
        totalQuestions={quiz.questionCount}
        onExit={() => setIsQuizActive(false)}
      />
    );
  }

  // TODO: Fetch quiz attempts from database (Phase 4.4)
  const attempts: never[] = []; // Will be populated with real attempts later
  const bestScore = 0; // TODO: Calculate from attempts
  const averageScore = 0; // TODO: Calculate from attempts
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'hard':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };
  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'document':
        return FileText;
      case 'text':
        return Book;
      default:
        return FileText;
    }
  };
  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Header Section */}
      <div
        className={`px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br ${subjectColor} border-b border-white/20`}
      >
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Back to Quizzes</span>
          </button>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <FileQuestion className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">{quiz.title}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white">
                  {subjectName}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white">
                  {quiz.questionCount} Questions
                </span>
                {quiz.timeLimit && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white">
                    {quiz.timeLimit} min
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {quiz.description && (
            <p className="text-white/90 text-sm lg:text-base mb-4 max-w-3xl">{quiz.description}</p>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs text-white/80 font-medium mb-1">Attempts</p>
              <p className="text-2xl lg:text-3xl font-bold text-white">{attempts.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs text-white/80 font-medium mb-1">Best Score</p>
              <p className="text-2xl lg:text-3xl font-bold text-white">{bestScore}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs text-white/80 font-medium mb-1">Average</p>
              <p className="text-2xl lg:text-3xl font-bold text-white">{averageScore}%</p>
            </div>
            <div className={`rounded-xl p-4 border ${getDifficultyColor(quiz.difficulty)}`}>
              <p className="text-xs font-medium mb-1">Difficulty</p>
              <p className="text-2xl lg:text-3xl font-bold capitalize">{quiz.difficulty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 lg:px-8 lg:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Quiz Description & Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quiz Description Section */}
              <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm">
                <h2 className="text-lg lg:text-xl font-bold text-slate-900 mb-4">
                  About This Quiz
                </h2>
                {quiz.description ? (
                  <p className="text-slate-700 leading-relaxed">{quiz.description}</p>
                ) : (
                  <p className="text-slate-500 italic">No description available</p>
                )}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Quiz Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-600 font-medium mb-1">Question Count</p>
                      <p className="text-lg font-bold text-slate-900">{quiz.questionCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium mb-1">Difficulty</p>
                      <p className="text-lg font-bold text-slate-900 capitalize">
                        {quiz.difficulty}
                      </p>
                    </div>
                    {quiz.timeLimit && (
                      <div>
                        <p className="text-xs text-slate-600 font-medium mb-1">Time Limit</p>
                        <p className="text-lg font-bold text-slate-900">{quiz.timeLimit} min</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-600 font-medium mb-1">Mode</p>
                      <p className="text-lg font-bold text-slate-900 capitalize">{quiz.mode}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Attempts History - Will be implemented in Phase 4.4 */}
              <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm">
                <h2 className="text-lg lg:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Attempt History
                  <span className="ml-auto text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                    0 total
                  </span>
                </h2>

                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileQuestion className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">No attempts yet</p>
                  <p className="text-sm text-slate-500 mt-1">Start the quiz to see your progress</p>
                </div>
              </section>
            </div>

            {/* Right Column - Materials & Info */}
            <div className="space-y-6">
              {/* Quiz Materials */}
              <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-base lg:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Book className="w-5 h-5 text-blue-600" />
                  Study Materials
                  <span className="ml-auto text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {quizMaterials.length}
                  </span>
                </h2>

                {quizMaterials.length === 0 ? (
                  <div className="text-center py-6">
                    <Book className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">No materials attached</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {quizMaterials.map(material => {
                      const Icon = getMaterialIcon(material.fileType);
                      return (
                        <div
                          key={material.id}
                          className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                        >
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {material.name}
                            </p>
                            <p className="text-xs text-slate-600">
                              {new Date(material.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Quiz Info */}
              <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-base lg:text-lg font-bold text-slate-900 mb-4">Quiz Details</h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-medium">Created</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-medium">Status</span>
                    <span className="text-sm font-semibold text-slate-900 capitalize">
                      {quiz.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-medium">Difficulty</span>
                    <span className="text-sm font-semibold text-slate-900 capitalize">
                      {quiz.difficulty}
                    </span>
                  </div>
                  {quiz.timeLimit && (
                    <div className="flex items-center justify-between py-2 border-b border-slate-200">
                      <span className="text-sm text-slate-600 font-medium">Time Limit</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {quiz.timeLimit} minutes
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600 font-medium">Subject</span>
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-lg bg-gradient-to-r ${subjectColor} text-white`}
                    >
                      {subjectName}
                    </span>
                  </div>
                </div>
              </section>

              {/* Action Button */}
              <button
                onClick={() => setIsQuizActive(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
              >
                <Play className="w-5 h-5" />
                <span>{attempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TODO: Attempt Detail Modal will be implemented in Phase 4.4 when quiz_attempts table is integrated */}
    </div>
  );
};
