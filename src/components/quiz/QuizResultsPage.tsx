'use client';

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  Sparkles,
  ChevronRight,
  Home,
  RotateCcw,
  Award,
  Brain,
  Zap,
  ArrowRight,
  Leaf,
  Sprout,
  Sun,
  Loader2,
} from 'lucide-react';
import { GardenProgress } from '../dashboard';
import { useAuth } from '@/hooks/useAuth';
import { useSubjects } from '@/hooks/useSubjects';
import { getQuizResults } from '@/services/quiz-attempt.service';
import toast from 'react-hot-toast';
import type { QuizResults } from '@/types/quiz';

type QuizResultsPageProps = {
  attemptId: string;
  onExit?: () => void;
};

export const QuizResultsPage = (props: QuizResultsPageProps) => {
  const { user } = useAuth();
  const { subjects } = useSubjects();
  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGarden, setShowGarden] = useState(false);
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  // Fetch quiz results
  useEffect(() => {
    let mounted = true;

    const fetchResults = async () => {
      if (!user) {
        toast.error('User not authenticated');
        return;
      }

      try {
        setLoading(true);
        const quizResults = await getQuizResults(props.attemptId, user.id);
        if (!mounted) return;

        if (!quizResults) {
          throw new Error('Failed to load quiz results');
        }

        setResults(quizResults);
      } catch (err) {
        if (!mounted) return;
        console.error('Error fetching quiz results:', err);
        toast.error('Failed to load quiz results');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-slate-700">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border-2 border-red-200 shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Unable to Load Results</h2>
          <p className="text-slate-600 mb-6">Failed to load quiz results</p>
          <button
            onClick={props.onExit}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Get subject data
  const subject = subjects.find(s => s.id === results.quiz.subjectId);
  const subjectColor = subject?.color || 'from-blue-500 to-indigo-600';
  const subjectName = subject?.name || 'Unknown Subject';

  // Calculate stats from results
  const totalQuestions = results.analytics.totalQuestions;
  const correctAnswers = results.analytics.correctAnswers;
  const wrongAnswers = results.analytics.incorrectAnswers;
  const unanswered = results.analytics.skippedAnswers;
  const score = results.attempt.percentage;
  const totalTimeSpent = results.attempt.timeSpent;
  const averageTimePerQuestion = Math.round(results.analytics.averageTimePerQuestion);

  // Calculate garden growth
  const pointsEarned = correctAnswers * 10 + Math.floor(score / 10) * 5;
  const previousLevel = 3; // Mock - would come from backend
  const previousProgress = 65; // Mock
  const newProgress = Math.min(previousProgress + pointsEarned / 10, 100);
  const leveledUp = newProgress >= 100;
  const getScoreColor = () => {
    if (score >= 90) return 'from-emerald-500 to-green-600';
    if (score >= 75) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };
  const getScoreMessage = () => {
    if (score >= 90)
      return {
        title: 'Outstanding! 🌟',
        message: "You've mastered this material!",
      };
    if (score >= 75)
      return {
        title: 'Great Job! 💪',
        message: "You're well on your way to mastery!",
      };
    if (score >= 60)
      return {
        title: 'Good Effort! 👍',
        message: 'Keep practicing to improve!',
      };
    return {
      title: 'Keep Going! 🚀',
      message: 'Review the material and try again!',
    };
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };
  const scoreMsg = getScoreMessage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pb-8">
      {/* Header */}
      <div
        className={`px-4 py-6 lg:px-8 lg:py-8 bg-gradient-to-br ${subjectColor} border-b border-white/20`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Trophy className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Quiz Complete!</h1>
          <p className="text-white/90 text-base lg:text-lg font-medium">{results.quiz.title}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8 space-y-6">
        {/* Score Card */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
          <div className={`p-6 lg:p-8 bg-gradient-to-br ${getScoreColor()}`}>
            <div className="text-center text-white">
              <p className="text-sm lg:text-base font-semibold mb-2 text-white/90">Your Score</p>
              <p className="text-6xl lg:text-7xl font-bold mb-3">{score}%</p>
              <p className="text-xl lg:text-2xl font-bold mb-1">{scoreMsg.title}</p>
              <p className="text-sm lg:text-base text-white/90">{scoreMsg.message}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 divide-x divide-slate-200 bg-slate-50">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <p className="text-2xl font-bold text-emerald-600">{correctAnswers}</p>
              </div>
              <p className="text-xs font-medium text-slate-600">Correct</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <XCircle className="w-4 h-4 text-red-600" />
                <p className="text-2xl font-bold text-red-600">{wrongAnswers}</p>
              </div>
              <p className="text-xs font-medium text-slate-600">Wrong</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <p className="text-2xl font-bold text-amber-600">{unanswered}</p>
              </div>
              <p className="text-xs font-medium text-slate-600">Skipped</p>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-600 font-medium">Total Time</p>
                <p className="text-2xl font-bold text-slate-900">{formatTime(totalTimeSpent)}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Avg: <span className="font-bold text-slate-900">{averageTimePerQuestion}s</span> per
              question
            </p>
          </div>

          <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-600 font-medium">Accuracy</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round((correctAnswers / (totalQuestions - unanswered)) * 100) || 0}%
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Answered:{' '}
              <span className="font-bold text-slate-900">
                {totalQuestions - unanswered}/{totalQuestions}
              </span>
            </p>
          </div>
        </div>

        {/* Garden Progress Teaser */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl border-2 border-emerald-400 p-6 lg:p-8 text-white shadow-xl">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Your Garden Grew! 🌱</h2>
              <p className="text-white/90 text-sm lg:text-base">
                You earned <span className="font-bold text-white">{pointsEarned} points</span> for
                your {subjectName} garden!
              </p>
            </div>
          </div>

          {/* Mini Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white/90">
                Level {previousLevel} Progress
              </span>
              <span className="text-sm font-bold text-white">{Math.round(newProgress)}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${newProgress}%`,
                }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowGarden(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-white/90 active:scale-95 transition-all"
          >
            <Leaf className="w-5 h-5" />
            <span>View Your Garden</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Review Answers */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 lg:p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Question Review
          </h3>

          <div className="space-y-2 mb-4">
            {results.responses.map((response, idx) => {
              const question = results.questions.find(q => q.id === response.questionId);
              if (!question) return null;

              return (
                <div
                  key={response.id}
                  className={`p-3 rounded-xl border-2 ${response.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}
                >
                  <div className="flex items-center gap-3">
                    {response.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        Question {idx + 1}
                      </p>
                      <p className="text-xs text-slate-600">{question.tags?.[0] || 'Question'}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${response.isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
                    >
                      {response.isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowDetailedReview(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-xl transition-colors border-2 border-blue-200"
          >
            <span>View Detailed Review</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={props.onExit}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              /* Retake quiz logic */
            }}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retake</span>
          </button>
        </div>
      </div>

      {/* Garden Progress Modal */}
      {showGarden && (
        <GardenProgress
          subject={subjectName}
          subjectColor={subjectColor}
          level={previousLevel}
          progress={newProgress}
          pointsEarned={pointsEarned}
          plantHealth={85}
          onClose={() => setShowGarden(false)}
        />
      )}
    </div>
  );
};
