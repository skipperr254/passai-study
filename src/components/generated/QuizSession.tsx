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
} from 'lucide-react';
import { MoodCheckModal } from '../common/MoodCheckModal';
import { QuizResultsPage } from './QuizResultsPage';
type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'matching';
type Question = {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sourceSnippet: {
    material: string;
    page: number;
    excerpt: string;
  };
};
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
  totalQuestions: number;
  onExit?: () => void;
};
const mockQuestions: Question[] = [
  {
    id: '1',
    question: 'What year did World War II begin?',
    type: 'multiple-choice',
    options: ['1937', '1938', '1939', '1940'],
    correctAnswer: '1939',
    explanation:
      'World War II began on September 1, 1939, when Nazi Germany invaded Poland. This prompted Britain and France to declare war on Germany two days later.',
    topic: 'World War II Timeline',
    difficulty: 'easy',
    sourceSnippet: {
      material: 'World War II Timeline.pdf',
      page: 3,
      excerpt:
        'The war began with the German invasion of Poland on September 1, 1939. Britain and France declared war on Germany on September 3...',
    },
  },
  {
    id: '2',
    question: 'The Allied Powers won World War II.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation:
      'The Allied Powers (primarily the United States, Soviet Union, United Kingdom, and France) defeated the Axis Powers (Germany, Italy, and Japan) in 1945.',
    topic: 'War Outcomes',
    difficulty: 'easy',
    sourceSnippet: {
      material: 'WWII Documentary Notes',
      page: 15,
      excerpt:
        'After years of fierce battles, the Allied forces achieved victory in 1945. Germany surrendered in May, followed by Japan in August...',
    },
  },
  {
    id: '3',
    question: 'What was the code name for the D-Day invasion of Normandy?',
    type: 'multiple-choice',
    options: [
      'Operation Barbarossa',
      'Operation Overlord',
      'Operation Market Garden',
      'Operation Torch',
    ],
    correctAnswer: 'Operation Overlord',
    explanation:
      'Operation Overlord was the codename for the Allied invasion of Normandy on June 6, 1944 (D-Day). It was the largest amphibious invasion in history and marked a turning point in World War II.',
    topic: 'Major Military Operations',
    difficulty: 'medium',
    sourceSnippet: {
      material: 'History Textbook Chapter 8',
      page: 142,
      excerpt:
        'Operation Overlord, the code name for the Allied invasion of Normandy, began on June 6, 1944. Over 150,000 troops landed on five beaches...',
    },
  },
  {
    id: '4',
    question: 'Which country was NOT part of the Axis Powers?',
    type: 'multiple-choice',
    options: ['Germany', 'Italy', 'Soviet Union', 'Japan'],
    correctAnswer: 'Soviet Union',
    explanation:
      'The Soviet Union was part of the Allied Powers, not the Axis. The main Axis Powers were Germany, Italy, and Japan. The Soviet Union initially had a non-aggression pact with Germany but joined the Allies after Germany invaded in 1941.',
    topic: 'Alliances',
    difficulty: 'medium',
    sourceSnippet: {
      material: 'World War II Timeline.pdf',
      page: 8,
      excerpt:
        'The Axis Powers consisted of Germany, Italy, and Japan, while the Allied Powers included Britain, France, the Soviet Union, and the United States...',
    },
  },
  {
    id: '5',
    question: 'What event led to the United States entering World War II?',
    type: 'multiple-choice',
    options: ['Battle of Britain', 'Pearl Harbor Attack', 'D-Day Invasion', 'Battle of Stalingrad'],
    correctAnswer: 'Pearl Harbor Attack',
    explanation:
      'The surprise attack on Pearl Harbor by Japan on December 7, 1941, led to the United States declaring war on Japan the next day, officially entering World War II.',
    topic: 'American Involvement',
    difficulty: 'easy',
    sourceSnippet: {
      material: 'History Textbook Chapter 8',
      page: 156,
      excerpt:
        'On December 7, 1941, Japanese forces launched a surprise attack on the U.S. naval base at Pearl Harbor, Hawaii. This attack brought America into the war...',
    },
  },
];
export const QuizSession = (props: QuizSessionProps) => {
  const [questions] = useState<Question[]>(mockQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [questionStartTime] = useState(Date.now());
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

  const handleTimeUp = React.useCallback(() => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer: '',
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: false,
      timeSpent,
      wasAnswered: false,
    };
    setResults(prev => [...prev, result]);
    setHasSubmitted(true);
  }, [questionStartTime, currentQuestion.id, currentQuestion.correctAnswer]);

  // Timer effect
  useEffect(() => {
    if (hasSubmitted || isQuizComplete) return;
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
  }, [hasSubmitted, currentQuestionIndex, isQuizComplete, handleTimeUp]);

  // Check for midpoint - show mood check after answering the midpoint question
  useEffect(() => {
    if (shouldShowMoodCheck) {
      setShowMoodCheck(true);
    }
  }, [shouldShowMoodCheck]);
  const handleSubmitAnswer = () => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect =
      selectedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent,
      wasAnswered: true,
    };
    setResults(prev => [...prev, result]);
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
      setIsQuizComplete(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setHasSubmitted(false);
      setTimeLeft(120);
    }
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

  // Show results page
  if (isQuizComplete) {
    return (
      <QuizResultsPage
        quizTitle={props.quizTitle}
        subject={props.subject}
        subjectColor={props.subjectColor}
        results={results}
        questions={questions}
        onExit={props.onExit}
      />
    );
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
              onClick={props.onExit}
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
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-200">
              {currentQuestion.topic}
            </span>

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
              /* Short Answer Questions */
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Answer:
                </label>
                <input
                  type="text"
                  value={selectedAnswer}
                  onChange={e => !hasSubmitted && setSelectedAnswer(e.target.value)}
                  disabled={hasSubmitted}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                />
                {hasSubmitted && (
                  <p className="text-xs text-slate-600 mt-2">
                    <span className="font-semibold">Note:</span> Your answer has been recorded.
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
                        ? '✗ Incorrect'
                        : "⏱ Time's Up!"}
                  </h3>
                  {!results[results.length - 1]?.isCorrect && (
                    <p className="text-sm font-semibold text-slate-700 mb-2">
                      Correct answer:{' '}
                      <span className="text-emerald-700">{currentQuestion.correctAnswer}</span>
                    </p>
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
          <button
            onClick={() => setShowSourceModal(true)}
            className="w-full mb-6 p-3 lg:p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-left group"
          >
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-600 mb-1">Source Material</p>
                <p className="text-sm font-bold text-slate-900 truncate">
                  {currentQuestion.sourceSnippet.material}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Page {currentQuestion.sourceSnippet.page} • Click to review
                </p>
              </div>
              <Eye className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
            </div>
          </button>

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
                      {currentQuestion.sourceSnippet.material}
                    </h3>
                    <p className="text-xs text-slate-600">
                      Page {currentQuestion.sourceSnippet.page}
                    </p>
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
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                {currentQuestion.sourceSnippet.excerpt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mood Check Modal */}
      {showMoodCheck && (
        <MoodCheckModal
          onComplete={(mood, energyLevel) => {
            setMoodData({ mood, energyLevel });
            setShowMoodCheck(false);
            // TODO: Save mood data to database via quiz-attempt.service
            console.log('Mood data:', { mood, energyLevel });
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
