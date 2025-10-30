"use client";

import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Trophy, TrendingUp, RotateCcw, BookOpen, Target, Sparkles } from 'lucide-react';
type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
};
type VerificationQuizProps = {
  taskTitle: string;
  topic: string;
  questions: QuizQuestion[];
  onComplete: (passed: boolean, score: number) => void;
  onCancel: () => void;
};
export const VerificationQuiz = ({
  taskTitle,
  topic,
  questions,
  onComplete,
  onCancel
}: VerificationQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [isComplete, setIsComplete] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = (currentQuestionIndex + 1) / questions.length * 100;
  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(optionIndex);
  };
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };
  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate score and complete
      const correctCount = answers.filter((answer, idx) => answer === questions[idx].correctAnswer).length;
      const score = Math.round(correctCount / questions.length * 100);
      const passed = score >= 70; // 70% threshold
      setIsComplete(true);

      // Show results briefly before completing
      setTimeout(() => {
        onComplete(passed, score);
      }, 3000);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };
  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers(Array(questions.length).fill(null));
    setIsComplete(false);
  };
  const calculateScore = () => {
    const correctCount = answers.filter((answer, idx) => answer === questions[idx].correctAnswer).length;
    return Math.round(correctCount / questions.length * 100);
  };
  if (isComplete) {
    const score = calculateScore();
    const passed = score >= 70;
    return <div className="p-6 lg:p-8 text-center" data-magicpath-id="0" data-magicpath-path="VerificationQuiz.tsx">
        <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${passed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`} data-magicpath-id="1" data-magicpath-path="VerificationQuiz.tsx">
          {passed ? <Trophy className="w-10 h-10 text-white" data-magicpath-id="2" data-magicpath-path="VerificationQuiz.tsx" /> : <Target className="w-10 h-10 text-white" data-magicpath-id="3" data-magicpath-path="VerificationQuiz.tsx" />}
        </div>

        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2" data-magicpath-id="4" data-magicpath-path="VerificationQuiz.tsx">
          {passed ? 'Great Job!' : 'Keep Practicing'}
        </h2>
        <p className="text-slate-600 mb-6" data-magicpath-id="5" data-magicpath-path="VerificationQuiz.tsx">
          {passed ? 'You demonstrated solid understanding of this topic!' : 'Review the material and try again to improve your mastery.'}
        </p>

        <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 mb-6" data-magicpath-id="6" data-magicpath-path="VerificationQuiz.tsx">
          <div data-magicpath-id="7" data-magicpath-path="VerificationQuiz.tsx">
            <p className="text-sm font-semibold text-slate-600 mb-1" data-magicpath-id="8" data-magicpath-path="VerificationQuiz.tsx">Your Score</p>
            <p className="text-4xl font-bold text-blue-600" data-magicpath-id="9" data-magicpath-path="VerificationQuiz.tsx">{score}%</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-6" data-magicpath-id="10" data-magicpath-path="VerificationQuiz.tsx">
          <CheckCircle2 className="w-4 h-4 text-green-600" data-magicpath-id="11" data-magicpath-path="VerificationQuiz.tsx" />
          <span data-magicpath-id="12" data-magicpath-path="VerificationQuiz.tsx">
            {answers.filter((a, i) => a === questions[i].correctAnswer).length} of{' '}
            {questions.length} correct
          </span>
        </div>

        {!passed && <button onClick={handleRetry} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 mx-auto" data-magicpath-id="13" data-magicpath-path="VerificationQuiz.tsx">
            <RotateCcw className="w-4 h-4" data-magicpath-id="14" data-magicpath-path="VerificationQuiz.tsx" />
            Try Again
          </button>}
      </div>;
  }
  return <div className="p-4 lg:p-6" data-magicpath-id="15" data-magicpath-path="VerificationQuiz.tsx">
      {/* Header */}
      <div className="mb-6" data-magicpath-id="16" data-magicpath-path="VerificationQuiz.tsx">
        <div className="flex items-center justify-between mb-4" data-magicpath-id="17" data-magicpath-path="VerificationQuiz.tsx">
          <div data-magicpath-id="18" data-magicpath-path="VerificationQuiz.tsx">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900" data-magicpath-id="19" data-magicpath-path="VerificationQuiz.tsx">
              Verification Quiz
            </h2>
            <p className="text-sm text-slate-600 mt-1" data-magicpath-id="20" data-magicpath-path="VerificationQuiz.tsx">{taskTitle}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg" data-magicpath-id="21" data-magicpath-path="VerificationQuiz.tsx">
            <BookOpen className="w-4 h-4 text-blue-600" data-magicpath-id="22" data-magicpath-path="VerificationQuiz.tsx" />
            <span className="text-sm font-semibold text-blue-600" data-magicpath-id="23" data-magicpath-path="VerificationQuiz.tsx">{topic}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2" data-magicpath-id="24" data-magicpath-path="VerificationQuiz.tsx">
          <div className="flex items-center justify-between text-sm" data-magicpath-id="25" data-magicpath-path="VerificationQuiz.tsx">
            <span className="font-semibold text-slate-700" data-magicpath-id="26" data-magicpath-path="VerificationQuiz.tsx">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-slate-600" data-magicpath-id="27" data-magicpath-path="VerificationQuiz.tsx">{progress.toFixed(0)}% Complete</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden" data-magicpath-id="28" data-magicpath-path="VerificationQuiz.tsx">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500" style={{
            width: `${progress}%`
          }} data-magicpath-id="29" data-magicpath-path="VerificationQuiz.tsx" />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6" data-magicpath-id="30" data-magicpath-path="VerificationQuiz.tsx">
        <div className="p-5 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 mb-4" data-magicpath-id="31" data-magicpath-path="VerificationQuiz.tsx">
          <p className="text-base lg:text-lg font-semibold text-slate-900 leading-relaxed" data-magicpath-id="32" data-magicpath-path="VerificationQuiz.tsx">
            {currentQuestion.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3" data-magicpath-id="33" data-magicpath-path="VerificationQuiz.tsx">
          {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correctAnswer;
          const showResult = showExplanation;
          let buttonStyle = 'bg-white border-2 border-slate-200 hover:border-blue-400';
          if (showResult) {
            if (isCorrect) {
              buttonStyle = 'bg-green-50 border-2 border-green-500 ring-2 ring-green-100';
            } else if (isSelected && !isCorrect) {
              buttonStyle = 'bg-red-50 border-2 border-red-500 ring-2 ring-red-100';
            } else {
              buttonStyle = 'bg-white border-2 border-slate-200 opacity-60';
            }
          } else if (isSelected) {
            buttonStyle = 'bg-blue-50 border-2 border-blue-500 ring-2 ring-blue-100';
          }
          return <button key={index} onClick={() => handleAnswerSelect(index)} disabled={showResult} className={`w-full p-4 rounded-xl text-left transition-all active:scale-[0.98] ${buttonStyle} ${showResult ? 'cursor-default' : 'cursor-pointer'}`} data-magicpath-id="34" data-magicpath-path="VerificationQuiz.tsx">
                <div className="flex items-center gap-3" data-magicpath-id="35" data-magicpath-path="VerificationQuiz.tsx">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${showResult ? isCorrect ? 'border-green-600 bg-green-600' : isSelected ? 'border-red-600 bg-red-600' : 'border-slate-300 bg-white' : isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`} data-magicpath-id="36" data-magicpath-path="VerificationQuiz.tsx">
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-white" data-magicpath-id="37" data-magicpath-path="VerificationQuiz.tsx" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white" data-magicpath-id="38" data-magicpath-path="VerificationQuiz.tsx" />}
                    {!showResult && isSelected && <div className="w-2 h-2 rounded-full bg-white" data-magicpath-id="39" data-magicpath-path="VerificationQuiz.tsx" />}
                  </div>
                  <span className={`text-sm lg:text-base font-medium ${showResult ? isCorrect ? 'text-green-900' : isSelected ? 'text-red-900' : 'text-slate-600' : 'text-slate-900'}`} data-magicpath-id="40" data-magicpath-path="VerificationQuiz.tsx">
                    {option}
                  </span>
                </div>
              </button>;
        })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl animate-in slide-in-from-bottom duration-300" data-magicpath-id="41" data-magicpath-path="VerificationQuiz.tsx">
          <div className="flex items-start gap-3" data-magicpath-id="42" data-magicpath-path="VerificationQuiz.tsx">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0" data-magicpath-id="43" data-magicpath-path="VerificationQuiz.tsx">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div data-magicpath-id="44" data-magicpath-path="VerificationQuiz.tsx">
              <p className="text-sm font-bold text-amber-900 mb-1" data-magicpath-id="45" data-magicpath-path="VerificationQuiz.tsx">Explanation</p>
              <p className="text-sm text-amber-800" data-magicpath-id="46" data-magicpath-path="VerificationQuiz.tsx">{currentQuestion.explanation}</p>
            </div>
          </div>
        </div>}

      {/* Action Buttons */}
      <div className="flex gap-3" data-magicpath-id="47" data-magicpath-path="VerificationQuiz.tsx">
        {!showExplanation ? <>
            <button onClick={onCancel} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all active:scale-95" data-magicpath-id="48" data-magicpath-path="VerificationQuiz.tsx">
              Cancel
            </button>
            <button onClick={handleSubmitAnswer} disabled={selectedAnswer === null} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" data-magicpath-id="49" data-magicpath-path="VerificationQuiz.tsx">
              Submit Answer
              <ArrowRight className="w-4 h-4" data-magicpath-id="50" data-magicpath-path="VerificationQuiz.tsx" />
            </button>
          </> : <button onClick={handleNext} className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2" data-magicpath-id="51" data-magicpath-path="VerificationQuiz.tsx">
            {isLastQuestion ? 'See Results' : 'Next Question'}
            <ArrowRight className="w-4 h-4" data-magicpath-id="52" data-magicpath-path="VerificationQuiz.tsx" />
          </button>}
      </div>
    </div>;
};