"use client";

import React, { useState, useEffect } from 'react';
import { Clock, ThumbsUp, ThumbsDown, BookOpen, CheckCircle2, XCircle, ArrowRight, AlertCircle, FileText, Eye, X, ChevronLeft, ChevronRight, Flag, Lightbulb } from 'lucide-react';
import { MoodCheckModal } from './MoodCheckModal';
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
const mockQuestions: Question[] = [{
  id: '1',
  question: 'What year did World War II begin?',
  type: 'multiple-choice',
  options: ['1937', '1938', '1939', '1940'],
  correctAnswer: '1939',
  explanation: 'World War II began on September 1, 1939, when Nazi Germany invaded Poland. This prompted Britain and France to declare war on Germany two days later.',
  topic: 'World War II Timeline',
  difficulty: 'easy',
  sourceSnippet: {
    material: 'World War II Timeline.pdf',
    page: 3,
    excerpt: 'The war began with the German invasion of Poland on September 1, 1939. Britain and France declared war on Germany on September 3...'
  }
}, {
  id: '2',
  question: 'The Allied Powers won World War II.',
  type: 'true-false',
  options: ['True', 'False'],
  correctAnswer: 'True',
  explanation: 'The Allied Powers (primarily the United States, Soviet Union, United Kingdom, and France) defeated the Axis Powers (Germany, Italy, and Japan) in 1945.',
  topic: 'War Outcomes',
  difficulty: 'easy',
  sourceSnippet: {
    material: 'WWII Documentary Notes',
    page: 15,
    excerpt: 'After years of fierce battles, the Allied forces achieved victory in 1945. Germany surrendered in May, followed by Japan in August...'
  }
}, {
  id: '3',
  question: 'What was the code name for the D-Day invasion of Normandy?',
  type: 'multiple-choice',
  options: ['Operation Barbarossa', 'Operation Overlord', 'Operation Market Garden', 'Operation Torch'],
  correctAnswer: 'Operation Overlord',
  explanation: 'Operation Overlord was the codename for the Allied invasion of Normandy on June 6, 1944 (D-Day). It was the largest amphibious invasion in history and marked a turning point in World War II.',
  topic: 'Major Military Operations',
  difficulty: 'medium',
  sourceSnippet: {
    material: 'History Textbook Chapter 8',
    page: 142,
    excerpt: 'Operation Overlord, the code name for the Allied invasion of Normandy, began on June 6, 1944. Over 150,000 troops landed on five beaches...'
  }
}, {
  id: '4',
  question: 'Which country was NOT part of the Axis Powers?',
  type: 'multiple-choice',
  options: ['Germany', 'Italy', 'Soviet Union', 'Japan'],
  correctAnswer: 'Soviet Union',
  explanation: 'The Soviet Union was part of the Allied Powers, not the Axis. The main Axis Powers were Germany, Italy, and Japan. The Soviet Union initially had a non-aggression pact with Germany but joined the Allies after Germany invaded in 1941.',
  topic: 'Alliances',
  difficulty: 'medium',
  sourceSnippet: {
    material: 'World War II Timeline.pdf',
    page: 8,
    excerpt: 'The Axis Powers consisted of Germany, Italy, and Japan, while the Allied Powers included Britain, France, the Soviet Union, and the United States...'
  }
}, {
  id: '5',
  question: 'What event led to the United States entering World War II?',
  type: 'multiple-choice',
  options: ['Battle of Britain', 'Pearl Harbor Attack', 'D-Day Invasion', 'Battle of Stalingrad'],
  correctAnswer: 'Pearl Harbor Attack',
  explanation: 'The surprise attack on Pearl Harbor by Japan on December 7, 1941, led to the United States declaring war on Japan the next day, officially entering World War II.',
  topic: 'American Involvement',
  difficulty: 'easy',
  sourceSnippet: {
    material: 'History Textbook Chapter 8',
    page: 156,
    excerpt: 'On December 7, 1941, Japanese forces launched a surprise attack on the U.S. naval base at Pearl Harbor, Hawaii. This attack brought America into the war...'
  }
}];
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
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isMidpoint = currentQuestionIndex === Math.floor(questions.length / 2) && !showMoodCheck && results.length === Math.floor(questions.length / 2);

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
  }, [hasSubmitted, currentQuestionIndex, isQuizComplete]);

  // Check for midpoint
  useEffect(() => {
    if (isMidpoint) {
      setShowMoodCheck(true);
    }
  }, [currentQuestionIndex, results.length]);
  const handleTimeUp = () => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer: '',
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: false,
      timeSpent,
      wasAnswered: false
    };
    setResults(prev => [...prev, result]);
    setHasSubmitted(true);
  };
  const handleSubmitAnswer = () => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent,
      wasAnswered: true
    };
    setResults(prev => [...prev, result]);
    setHasSubmitted(true);
  };
  const handleQuestionFeedback = (feedback: 'thumbs-up' | 'thumbs-down') => {
    setResults(prev => prev.map((r, idx) => idx === results.length - 1 ? {
      ...r,
      feedback
    } : r));
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
    return <QuizResultsPage quizTitle={props.quizTitle} subject={props.subject} subjectColor={props.subjectColor} results={results} questions={questions} onExit={props.onExit} data-magicpath-id="0" data-magicpath-path="QuizSession.tsx" />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pb-20 lg:pb-8" data-magicpath-id="1" data-magicpath-path="QuizSession.tsx">
      {/* Header */}
      <div className={`px-4 py-3 lg:px-8 lg:py-4 bg-gradient-to-br ${props.subjectColor} border-b border-white/20 sticky top-0 z-30`} data-magicpath-id="2" data-magicpath-path="QuizSession.tsx">
        <div className="max-w-4xl mx-auto" data-magicpath-id="3" data-magicpath-path="QuizSession.tsx">
          <div className="flex items-center justify-between mb-3" data-magicpath-id="4" data-magicpath-path="QuizSession.tsx">
            <button onClick={props.onExit} className="flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-semibold" data-magicpath-id="5" data-magicpath-path="QuizSession.tsx">
              <ChevronLeft className="w-4 h-4" data-magicpath-id="6" data-magicpath-path="QuizSession.tsx" />
              <span className="hidden sm:inline" data-magicpath-id="7" data-magicpath-path="QuizSession.tsx">Exit Quiz</span>
            </button>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTimeColor()} border-2 border-current`} data-magicpath-id="8" data-magicpath-path="QuizSession.tsx">
              <Clock className="w-4 h-4" data-magicpath-id="9" data-magicpath-path="QuizSession.tsx" />
              <span className="text-sm font-bold" data-magicpath-id="10" data-magicpath-path="QuizSession.tsx">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-2 overflow-hidden" data-magicpath-id="11" data-magicpath-path="QuizSession.tsx">
            <div className="h-full bg-white rounded-full transition-all duration-300" style={{
            width: `${(currentQuestionIndex + (hasSubmitted ? 1 : 0)) / questions.length * 100}%`
          }} data-magicpath-id="12" data-magicpath-path="QuizSession.tsx" />
          </div>
          <p className="text-white/90 text-xs font-medium mt-2" data-magicpath-id="13" data-magicpath-path="QuizSession.tsx">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8" data-magicpath-id="14" data-magicpath-path="QuizSession.tsx">
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-5 lg:p-8" data-magicpath-id="15" data-magicpath-path="QuizSession.tsx">
          {/* Topic Badge */}
          <div className="flex items-center justify-between mb-4" data-magicpath-id="16" data-magicpath-path="QuizSession.tsx">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-200" data-magicpath-id="17" data-magicpath-path="QuizSession.tsx">
              {currentQuestion.topic}
            </span>
            
            {/* Question Feedback - Subtle Corner Buttons */}
            {!hasSubmitted && <div className="flex items-center gap-1" data-magicpath-id="18" data-magicpath-path="QuizSession.tsx">
                <button onClick={() => handleQuestionFeedback('thumbs-up')} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors group" title="Good question" data-magicpath-id="19" data-magicpath-path="QuizSession.tsx">
                  <ThumbsUp className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" data-magicpath-id="20" data-magicpath-path="QuizSession.tsx" />
                </button>
                <button onClick={() => handleQuestionFeedback('thumbs-down')} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors group" title="Report issue" data-magicpath-id="21" data-magicpath-path="QuizSession.tsx">
                  <ThumbsDown className="w-4 h-4 text-slate-400 group-hover:text-red-600" data-magicpath-id="22" data-magicpath-path="QuizSession.tsx" />
                </button>
              </div>}
          </div>

          {/* Question */}
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-6" data-magicpath-id="23" data-magicpath-path="QuizSession.tsx">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3 mb-6" data-magicpath-id="24" data-magicpath-path="QuizSession.tsx">
            {currentQuestion.options?.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const showResult = hasSubmitted;
            let optionClass = 'bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-900';
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
            return <button key={idx} onClick={() => !hasSubmitted && setSelectedAnswer(option)} disabled={hasSubmitted} className={`w-full text-left px-4 lg:px-5 py-3 lg:py-4 rounded-xl font-semibold transition-all active:scale-[0.98] ${optionClass} ${hasSubmitted ? 'cursor-default' : 'cursor-pointer'}`} data-magicpath-id="25" data-magicpath-path="QuizSession.tsx">
                  <div className="flex items-center gap-3" data-magicpath-id="26" data-magicpath-path="QuizSession.tsx">
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/50 flex items-center justify-center text-sm font-bold" data-magicpath-id="27" data-magicpath-path="QuizSession.tsx">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1" data-magicpath-id="28" data-magicpath-path="QuizSession.tsx">{option}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" data-magicpath-id="29" data-magicpath-path="QuizSession.tsx" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" data-magicpath-id="30" data-magicpath-path="QuizSession.tsx" />}
                  </div>
                </button>;
          })}
          </div>

          {/* Feedback Section (After Submission) */}
          {hasSubmitted && <div className={`p-4 lg:p-5 rounded-xl border-2 mb-6 ${results[results.length - 1]?.isCorrect ? 'bg-emerald-50 border-emerald-200' : results[results.length - 1]?.wasAnswered ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`} data-magicpath-id="31" data-magicpath-path="QuizSession.tsx">
              <div className="flex items-start gap-3 mb-3" data-magicpath-id="32" data-magicpath-path="QuizSession.tsx">
                {results[results.length - 1]?.isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" data-magicpath-id="33" data-magicpath-path="QuizSession.tsx" /> : results[results.length - 1]?.wasAnswered ? <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" data-magicpath-id="34" data-magicpath-path="QuizSession.tsx" /> : <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" data-magicpath-id="35" data-magicpath-path="QuizSession.tsx" />}
                <div className="flex-1" data-magicpath-id="36" data-magicpath-path="QuizSession.tsx">
                  <h3 className="font-bold text-slate-900 mb-1" data-magicpath-id="37" data-magicpath-path="QuizSession.tsx">
                    {results[results.length - 1]?.isCorrect ? '✓ Correct!' : results[results.length - 1]?.wasAnswered ? '✗ Incorrect' : '⏱ Time\'s Up!'}
                  </h3>
                  {!results[results.length - 1]?.isCorrect && <p className="text-sm font-semibold text-slate-700 mb-2" data-magicpath-id="38" data-magicpath-path="QuizSession.tsx">
                      Correct answer: <span className="text-emerald-700" data-magicpath-id="39" data-magicpath-path="QuizSession.tsx">{currentQuestion.correctAnswer}</span>
                    </p>}
                  <p className="text-sm text-slate-700 leading-relaxed" data-magicpath-id="40" data-magicpath-path="QuizSession.tsx">
                    <span className="font-semibold flex items-center gap-1.5 mb-1" data-magicpath-id="41" data-magicpath-path="QuizSession.tsx">
                      <Lightbulb className="w-4 h-4" data-magicpath-id="42" data-magicpath-path="QuizSession.tsx" />
                      Explanation:
                    </span>
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>}

          {/* Source Snippet Preview */}
          <button onClick={() => setShowSourceModal(true)} className="w-full mb-6 p-3 lg:p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-left group" data-magicpath-id="43" data-magicpath-path="QuizSession.tsx">
            <div className="flex items-start gap-3" data-magicpath-id="44" data-magicpath-path="QuizSession.tsx">
              <BookOpen className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" data-magicpath-id="45" data-magicpath-path="QuizSession.tsx" />
              <div className="flex-1 min-w-0" data-magicpath-id="46" data-magicpath-path="QuizSession.tsx">
                <p className="text-xs font-semibold text-slate-600 mb-1" data-magicpath-id="47" data-magicpath-path="QuizSession.tsx">Source Material</p>
                <p className="text-sm font-bold text-slate-900 truncate" data-magicpath-id="48" data-magicpath-path="QuizSession.tsx">{currentQuestion.sourceSnippet.material}</p>
                <p className="text-xs text-slate-600 mt-1" data-magicpath-id="49" data-magicpath-path="QuizSession.tsx">Page {currentQuestion.sourceSnippet.page} • Click to review</p>
              </div>
              <Eye className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" data-magicpath-id="50" data-magicpath-path="QuizSession.tsx" />
            </div>
          </button>

          {/* Action Buttons */}
          <div className="flex gap-3" data-magicpath-id="51" data-magicpath-path="QuizSession.tsx">
            {!hasSubmitted ? <button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100" data-magicpath-id="52" data-magicpath-path="QuizSession.tsx">
                <span data-magicpath-id="53" data-magicpath-path="QuizSession.tsx">Submit Answer</span>
                <ArrowRight className="w-5 h-5" data-magicpath-id="54" data-magicpath-path="QuizSession.tsx" />
              </button> : <button onClick={handleNextQuestion} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 lg:py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all" data-magicpath-id="55" data-magicpath-path="QuizSession.tsx">
                <span data-magicpath-id="56" data-magicpath-path="QuizSession.tsx">{isLastQuestion ? 'View Results' : 'Next Question'}</span>
                {isLastQuestion ? <Flag className="w-5 h-5" data-magicpath-id="57" data-magicpath-path="QuizSession.tsx" /> : <ChevronRight className="w-5 h-5" data-magicpath-id="58" data-magicpath-path="QuizSession.tsx" />}
              </button>}
          </div>
        </div>
      </div>

      {/* Source Material Modal */}
      {showSourceModal && <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowSourceModal(false)} data-magicpath-id="59" data-magicpath-path="QuizSession.tsx">
          <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()} data-magicpath-id="60" data-magicpath-path="QuizSession.tsx">
            <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200" data-magicpath-id="61" data-magicpath-path="QuizSession.tsx">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 md:hidden" data-magicpath-id="62" data-magicpath-path="QuizSession.tsx"></div>
              <div className="flex items-center justify-between" data-magicpath-id="63" data-magicpath-path="QuizSession.tsx">
                <div className="flex items-center gap-3" data-magicpath-id="64" data-magicpath-path="QuizSession.tsx">
                  <FileText className="w-6 h-6 text-blue-600" data-magicpath-id="65" data-magicpath-path="QuizSession.tsx" />
                  <div data-magicpath-id="66" data-magicpath-path="QuizSession.tsx">
                    <h3 className="font-bold text-slate-900" data-magicpath-id="67" data-magicpath-path="QuizSession.tsx">{currentQuestion.sourceSnippet.material}</h3>
                    <p className="text-xs text-slate-600" data-magicpath-id="68" data-magicpath-path="QuizSession.tsx">Page {currentQuestion.sourceSnippet.page}</p>
                  </div>
                </div>
                <button onClick={() => setShowSourceModal(false)} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors" data-magicpath-id="69" data-magicpath-path="QuizSession.tsx">
                  <X className="w-5 h-5" data-magicpath-id="70" data-magicpath-path="QuizSession.tsx" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6" data-magicpath-id="71" data-magicpath-path="QuizSession.tsx">
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200" data-magicpath-id="72" data-magicpath-path="QuizSession.tsx">
                {currentQuestion.sourceSnippet.excerpt}
              </p>
            </div>
          </div>
        </div>}

      {/* Mood Check Modal */}
      {showMoodCheck && <MoodCheckModal onComplete={() => setShowMoodCheck(false)} currentScore={Math.round(results.filter(r => r.isCorrect).length / results.length * 100)} data-magicpath-id="73" data-magicpath-path="QuizSession.tsx" />}
    </div>;
};