'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
  FileText,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Flag,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import { MoodCheckModal } from '../common';
import { QuizResultsPage } from './QuizResultsPage';
import { useAuth } from '@/hooks/useAuth';
import { getQuizById } from '@/services/quiz.service';
import {
  startAttempt,
  saveResponse,
  submitAttempt,
  updateAttemptProgress,
  abandonAttempt,
  updateMoodData,
} from '@/services/quiz-attempt.service';
import toast from 'react-hot-toast';
import type { Question } from '@/types/question';
import type { QuizAttempt } from '@/types/quiz';

type QuestionResult = {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  wasAnswered: boolean;
  feedback?: 'thumbs-up' | 'thumbs-down';
};

type QuizSessionProps = {
  quizId: string;
  quizTitle: string;
  subject: string;
  subjectColor: string;
  totalQuestions?: number;
  onExit?: () => void;
};
export const QuizSession = (props: QuizSessionProps) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [moodData, setMoodData] = useState<{ mood: string; energyLevel: number } | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Check if we've reached the midpoint (50% of questions answered)
  const midpointIndex = Math.floor(questions.length / 2);
  const shouldShowMoodCheck = hasSubmitted && currentQuestionIndex === midpointIndex && !moodData;

  // Initialize quiz - fetch questions and start attempt
  useEffect(() => {
    let mounted = true;

    const initializeQuiz = async () => {
      if (!user) {
        setError('User not authenticated');
        toast.error('Please sign in to take quizzes');
        return;
      }

      try {
        setLoading(true);

        // Fetch quiz and questions
        const quizData = await getQuizById(props.quizId, user.id);
        if (!mounted) return;

        if (!quizData) {
          throw new Error('Failed to load quiz');
        }

        if (!quizData.questions || quizData.questions.length === 0) {
          throw new Error('No questions found for this quiz');
        }

        setQuestions(quizData.questions);

        // Start attempt
        const newAttempt = await startAttempt(props.quizId, user.id);
        if (!mounted) return;

        if (!newAttempt) {
          throw new Error('Failed to start quiz attempt');
        }

        setAttempt(newAttempt);
        setQuestionStartTime(Date.now());
        toast.success('Quiz started! Good luck! 🚀');
      } catch (err) {
        if (!mounted) return;
        console.error('Error initializing quiz:', err);
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
        toast.error('Failed to load quiz');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeQuiz();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.quizId]);

  // Auto-save progress periodically
  useEffect(() => {
    if (!attempt || !user) return;

    const interval = setInterval(async () => {
      const currentTotalTime = totalTimeSpent + Math.floor((Date.now() - questionStartTime) / 1000);
      await updateAttemptProgress(attempt.id, user.id, currentTotalTime);
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [attempt, user, totalTimeSpent, questionStartTime]);

  // Timer effect
  useEffect(() => {
    if (hasSubmitted || isQuizComplete || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - auto-submit as unanswered
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSubmitted, currentQuestionIndex, isQuizComplete, loading]);

  // Check for midpoint - show mood check after answering the midpoint question
  useEffect(() => {
    if (shouldShowMoodCheck) {
      setShowMoodCheck(true);
    }
  }, [shouldShowMoodCheck]);

  const handleTimeUp = async () => {
    if (!attempt || !user) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer: '',
      correctAnswer: String(currentQuestion.correctAnswer),
      isCorrect: false,
      timeSpent,
      wasAnswered: false,
    };

    // Save response to backend
    await saveResponse(attempt.id, currentQuestion.id, '', false, timeSpent, 0);

    setResults(prev => [...prev, result]);
    setTotalTimeSpent(prev => prev + timeSpent);
    setHasSubmitted(true);
  };

  const handleSubmitAnswer = async () => {
    if (!attempt || !user) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const correctAnswer = currentQuestion.correctAnswer;
    const userAnswerStr = String(selectedAnswer);
    const correctAnswerStr =
      typeof correctAnswer === 'string'
        ? correctAnswer
        : Array.isArray(correctAnswer)
          ? correctAnswer.join(', ')
          : JSON.stringify(correctAnswer);

    // For essay and short-answer, consider them "correct" by default (manual grading needed)
    let isCorrect = false;
    if (currentQuestion.type === 'essay' || currentQuestion.type === 'short-answer') {
      // Accept any non-empty answer for now
      isCorrect = userAnswerStr.trim().length > 0;
    } else {
      // Check if correct (case-insensitive comparison for multiple choice/true-false)
      isCorrect = userAnswerStr.trim().toLowerCase() === correctAnswerStr.trim().toLowerCase();
    }

    // Use actual points from question
    const pointsEarned = isCorrect ? currentQuestion.points || 1 : 0;

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer: userAnswerStr,
      correctAnswer: correctAnswerStr,
      isCorrect,
      timeSpent,
      wasAnswered: true,
    };

    // Save response to backend
    await saveResponse(
      attempt.id,
      currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
      pointsEarned
    );

    setResults(prev => [...prev, result]);
    setTotalTimeSpent(prev => prev + timeSpent);
    setHasSubmitted(true);
  };
  const handleQuestionFeedback = (feedback: 'thumbs-up' | 'thumbs-down') => {
    setResults(prev =>
      prev.map((r, idx) =>
        idx === results.length - 1
          ? {
              ...r,
              feedback,
            }
          : r
      )
    );
  };
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setHasSubmitted(false);
      setTimeLeft(120);
      setQuestionStartTime(Date.now());
    }
  };

  const handleSubmitQuiz = async () => {
    if (!attempt || !user) return;

    try {
      const finalTimeSpent = totalTimeSpent + Math.floor((Date.now() - questionStartTime) / 1000);
      const submittedAttempt = await submitAttempt(attempt.id, user.id, finalTimeSpent);

      if (submittedAttempt) {
        toast.success('Quiz completed! 🎉');
        setIsQuizComplete(true);
      } else {
        toast.error('Failed to submit quiz');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      toast.error('Failed to submit quiz');
    }
  };

  const handleExitQuiz = async () => {
    if (attempt && user && !isQuizComplete) {
      // Abandon the attempt if quiz is incomplete
      await abandonAttempt(attempt.id, user.id);
      toast('Quiz abandoned', { icon: '👋' });
    }
    props.onExit?.();
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const getTimeColor = () => {
    if (timeLeft > 60) return 'text-green-600 bg-green-50';
    if (timeLeft > 30) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50 animate-pulse';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-slate-700">Loading quiz...</p>
          <p className="text-sm text-slate-500 mt-2">Preparing your questions</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border-2 border-red-200 shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Unable to Load Quiz</h2>
          <p className="text-slate-600 mb-6">{error || 'No questions found for this quiz'}</p>
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

  // Show results page
  if (isQuizComplete && attempt) {
    return <QuizResultsPage attemptId={attempt.id} onExit={props.onExit} />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pb-20 lg:pb-8">
      {/* Header */}
      <div
        className={`px-4 py-3 lg:px-8 lg:py-4 bg-gradient-to-br ${props.subjectColor} border-b border-white/20 sticky top-0 z-30`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleExitQuiz}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Quiz</span>
            </button>

            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTimeColor()} border-2 border-current`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + (hasSubmitted ? 1 : 0)) / questions.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-white/90 text-xs font-medium mt-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8">
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-5 lg:p-8">
          {/* Topic Badge */}
          <div className="flex items-center justify-between mb-4">
            {currentQuestion.tags && currentQuestion.tags.length > 0 && (
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-200">
                {currentQuestion.tags[0]}
              </span>
            )}

            {/* Question Feedback - Subtle Corner Buttons */}
            {!hasSubmitted && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleQuestionFeedback('thumbs-up')}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors group"
                  title="Good question"
                >
                  <ThumbsUp className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </button>
                <button
                  onClick={() => handleQuestionFeedback('thumbs-down')}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors group"
                  title="Report issue"
                >
                  <ThumbsDown className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                </button>
              </div>
            )}
          </div>

          {/* Question */}
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-6">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {/* Multiple Choice / True-False Questions */}
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const showResult = hasSubmitted;
                let optionClass =
                  'bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-900';
                if (showResult) {
                  if (isCorrect) {
                    optionClass = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-900';
                  } else if (isSelected && !isCorrect) {
                    optionClass = 'bg-red-50 border-2 border-red-500 text-red-900';
                  } else {
                    optionClass = 'bg-slate-50 border-2 border-slate-200 text-slate-600';
                  }
                } else if (isSelected) {
                  optionClass = 'bg-blue-50 border-2 border-blue-500 text-blue-900';
                }
                return (
                  <button
                    key={idx}
                    onClick={() => !hasSubmitted && setSelectedAnswer(option)}
                    disabled={hasSubmitted}
                    className={`w-full text-left px-4 lg:px-5 py-3 lg:py-4 rounded-xl font-semibold transition-all active:scale-[0.98] ${optionClass} ${hasSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/50 flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showResult && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              /* Short Answer / Essay Questions */
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {currentQuestion.type === 'essay' ? 'Your Answer (Essay):' : 'Your Answer:'}
                </label>
                {currentQuestion.type === 'essay' ? (
                  <textarea
                    value={selectedAnswer}
                    onChange={e => !hasSubmitted && setSelectedAnswer(e.target.value)}
                    disabled={hasSubmitted}
                    rows={8}
                    placeholder="Type your answer here..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={e => !hasSubmitted && setSelectedAnswer(e.target.value)}
                    disabled={hasSubmitted}
                    placeholder="Type your answer here..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                  />
                )}
                {hasSubmitted && (
                  <p className="text-xs text-slate-600 mt-2">
                    <span className="font-semibold">Note:</span> Your answer has been recorded and
                    will be reviewed.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Feedback Section (After Submission) */}
          {hasSubmitted && (
            <div
              className={`p-4 lg:p-5 rounded-xl border-2 mb-6 ${results[results.length - 1]?.isCorrect ? 'bg-emerald-50 border-emerald-200' : results[results.length - 1]?.wasAnswered ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}
            >
              <div className="flex items-start gap-3 mb-3">
                {results[results.length - 1]?.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                ) : results[results.length - 1]?.wasAnswered ? (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">
                    {results[results.length - 1]?.isCorrect
                      ? '✓ Correct!'
                      : results[results.length - 1]?.wasAnswered
                        ? currentQuestion.type === 'essay' ||
                          currentQuestion.type === 'short-answer'
                          ? '✓ Answer Recorded'
                          : '✗ Incorrect'
                        : "⏱ Time's Up!"}
                  </h3>
                  {!results[results.length - 1]?.isCorrect &&
                    currentQuestion.type !== 'essay' &&
                    currentQuestion.type !== 'short-answer' && (
                      <p className="text-sm font-semibold text-slate-700 mb-2">
                        Correct answer:{' '}
                        <span className="text-emerald-700">
                          {typeof currentQuestion.correctAnswer === 'string'
                            ? currentQuestion.correctAnswer
                            : Array.isArray(currentQuestion.correctAnswer)
                              ? currentQuestion.correctAnswer.join(', ')
                              : JSON.stringify(currentQuestion.correctAnswer)}
                        </span>
                      </p>
                    )}
                  {(currentQuestion.type === 'essay' ||
                    currentQuestion.type === 'short-answer') && (
                    <div className="mb-3 p-3 bg-white/50 rounded-lg">
                      <p className="text-xs font-semibold text-slate-600 mb-1">Your Answer:</p>
                      <p className="text-sm text-slate-800">
                        {selectedAnswer || '(No answer provided)'}
                      </p>
                    </div>
                  )}
                  {(currentQuestion.type === 'essay' || currentQuestion.type === 'short-answer') &&
                    currentQuestion.correctAnswer && (
                      <div className="mb-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <p className="text-xs font-semibold text-emerald-700 mb-1">
                          Expected Answer:
                        </p>
                        <p className="text-sm text-slate-800">
                          {typeof currentQuestion.correctAnswer === 'string'
                            ? currentQuestion.correctAnswer
                            : JSON.stringify(currentQuestion.correctAnswer)}
                        </p>
                      </div>
                    )}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-semibold flex items-center gap-1.5 mb-1">
                      <Lightbulb className="w-4 h-4" />
                      Explanation:
                    </span>
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Source Snippet Preview */}
          {currentQuestion.materialReferences && currentQuestion.materialReferences.length > 0 && (
            <button
              onClick={() => setShowSourceModal(true)}
              className="w-full mb-6 p-3 lg:p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-left group"
            >
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Source Material</p>
                  <p className="text-sm font-bold text-slate-900">
                    {currentQuestion.tags?.[0] || 'Study Material'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">Click to review</p>
                </div>
                <Eye className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
              </div>
            </button>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!hasSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 lg:py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all"
              >
                <span>{isLastQuestion ? 'View Results' : 'Next Question'}</span>
                {isLastQuestion ? (
                  <Flag className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Source Material Modal */}
      {showSourceModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowSourceModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 md:hidden"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {currentQuestion.tags?.[0] || 'Source Material'}
                    </h3>
                    <p className="text-xs text-slate-600">Reference for this question</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSourceModal(false)}
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Question</p>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                    {currentQuestion.question}
                  </p>
                </div>
                {currentQuestion.explanation && (
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Explanation</p>
                    <p className="text-sm text-slate-600 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-200">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mood Check Modal */}
      {showMoodCheck && (
        <MoodCheckModal
          onComplete={async (mood, energyLevel) => {
            setMoodData({ mood, energyLevel });
            setShowMoodCheck(false);

            // Save mood data to database
            if (attempt && user) {
              const success = await updateMoodData(
                attempt.id,
                user.id,
                mood as 'confident' | 'okay' | 'struggling' | 'confused',
                energyLevel
              );

              if (success) {
                toast.success('Mood data saved!');
              } else {
                toast.error('Failed to save mood data');
              }
            }
          }}
          currentScore={
            results.length > 0
              ? Math.round((results.filter(r => r.isCorrect).length / results.length) * 100)
              : 0
          }
        />
      )}
    </div>
  );
};
