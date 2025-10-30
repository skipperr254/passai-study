"use client";

import React, { useState } from 'react';
import { Trophy, TrendingUp, Clock, Target, CheckCircle2, XCircle, AlertCircle, Star, Sparkles, ChevronRight, Home, RotateCcw, Award, Brain, Zap, ArrowRight, Leaf, Sprout, Sun } from 'lucide-react';
import { GardenProgress } from './GardenProgress';
type Question = {
  id: string;
  question: string;
  correctAnswer: string;
  explanation: string;
  topic: string;
};
type QuestionResult = {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  wasAnswered: boolean;
};
type QuizResultsPageProps = {
  quizTitle: string;
  subject: string;
  subjectColor: string;
  results: QuestionResult[];
  questions: Question[];
  onExit?: () => void;
};
export const QuizResultsPage = (props: QuizResultsPageProps) => {
  const [showGarden, setShowGarden] = useState(false);
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  // Calculate stats
  const totalQuestions = props.results.length;
  const correctAnswers = props.results.filter(r => r.isCorrect).length;
  const wrongAnswers = props.results.filter(r => !r.isCorrect && r.wasAnswered).length;
  const unanswered = props.results.filter(r => !r.wasAnswered).length;
  const score = Math.round(correctAnswers / totalQuestions * 100);
  const totalTimeSpent = props.results.reduce((acc, r) => acc + r.timeSpent, 0);
  const averageTimePerQuestion = Math.round(totalTimeSpent / totalQuestions);

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
    if (score >= 90) return {
      title: 'Outstanding! 🌟',
      message: 'You\'ve mastered this material!'
    };
    if (score >= 75) return {
      title: 'Great Job! 💪',
      message: 'You\'re well on your way to mastery!'
    };
    if (score >= 60) return {
      title: 'Good Effort! 👍',
      message: 'Keep practicing to improve!'
    };
    return {
      title: 'Keep Going! 🚀',
      message: 'Review the material and try again!'
    };
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };
  const scoreMsg = getScoreMessage();
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pb-8" data-magicpath-id="0" data-magicpath-path="QuizResultsPage.tsx">
      {/* Header */}
      <div className={`px-4 py-6 lg:px-8 lg:py-8 bg-gradient-to-br ${props.subjectColor} border-b border-white/20`} data-magicpath-id="1" data-magicpath-path="QuizResultsPage.tsx">
        <div className="max-w-4xl mx-auto text-center" data-magicpath-id="2" data-magicpath-path="QuizResultsPage.tsx">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg" data-magicpath-id="3" data-magicpath-path="QuizResultsPage.tsx">
            <Trophy className="w-10 h-10 lg:w-12 lg:h-12 text-white" data-magicpath-id="4" data-magicpath-path="QuizResultsPage.tsx" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2" data-magicpath-id="5" data-magicpath-path="QuizResultsPage.tsx">Quiz Complete!</h1>
          <p className="text-white/90 text-base lg:text-lg font-medium" data-magicpath-id="6" data-magicpath-path="QuizResultsPage.tsx">{props.quizTitle}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8 space-y-6" data-magicpath-id="7" data-magicpath-path="QuizResultsPage.tsx">
        {/* Score Card */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden" data-magicpath-id="8" data-magicpath-path="QuizResultsPage.tsx">
          <div className={`p-6 lg:p-8 bg-gradient-to-br ${getScoreColor()}`} data-magicpath-id="9" data-magicpath-path="QuizResultsPage.tsx">
            <div className="text-center text-white" data-magicpath-id="10" data-magicpath-path="QuizResultsPage.tsx">
              <p className="text-sm lg:text-base font-semibold mb-2 text-white/90" data-magicpath-id="11" data-magicpath-path="QuizResultsPage.tsx">Your Score</p>
              <p className="text-6xl lg:text-7xl font-bold mb-3" data-magicpath-id="12" data-magicpath-path="QuizResultsPage.tsx">{score}%</p>
              <p className="text-xl lg:text-2xl font-bold mb-1" data-magicpath-id="13" data-magicpath-path="QuizResultsPage.tsx">{scoreMsg.title}</p>
              <p className="text-sm lg:text-base text-white/90" data-magicpath-id="14" data-magicpath-path="QuizResultsPage.tsx">{scoreMsg.message}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 divide-x divide-slate-200 bg-slate-50" data-magicpath-id="15" data-magicpath-path="QuizResultsPage.tsx">
            <div className="p-4 text-center" data-magicpath-id="16" data-magicpath-path="QuizResultsPage.tsx">
              <div className="flex items-center justify-center gap-1 mb-1" data-magicpath-id="17" data-magicpath-path="QuizResultsPage.tsx">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" data-magicpath-id="18" data-magicpath-path="QuizResultsPage.tsx" />
                <p className="text-2xl font-bold text-emerald-600" data-magicpath-id="19" data-magicpath-path="QuizResultsPage.tsx">{correctAnswers}</p>
              </div>
              <p className="text-xs font-medium text-slate-600" data-magicpath-id="20" data-magicpath-path="QuizResultsPage.tsx">Correct</p>
            </div>
            <div className="p-4 text-center" data-magicpath-id="21" data-magicpath-path="QuizResultsPage.tsx">
              <div className="flex items-center justify-center gap-1 mb-1" data-magicpath-id="22" data-magicpath-path="QuizResultsPage.tsx">
                <XCircle className="w-4 h-4 text-red-600" data-magicpath-id="23" data-magicpath-path="QuizResultsPage.tsx" />
                <p className="text-2xl font-bold text-red-600" data-magicpath-id="24" data-magicpath-path="QuizResultsPage.tsx">{wrongAnswers}</p>
              </div>
              <p className="text-xs font-medium text-slate-600" data-magicpath-id="25" data-magicpath-path="QuizResultsPage.tsx">Wrong</p>
            </div>
            <div className="p-4 text-center" data-magicpath-id="26" data-magicpath-path="QuizResultsPage.tsx">
              <div className="flex items-center justify-center gap-1 mb-1" data-magicpath-id="27" data-magicpath-path="QuizResultsPage.tsx">
                <AlertCircle className="w-4 h-4 text-amber-600" data-magicpath-id="28" data-magicpath-path="QuizResultsPage.tsx" />
                <p className="text-2xl font-bold text-amber-600" data-magicpath-id="29" data-magicpath-path="QuizResultsPage.tsx">{unanswered}</p>
              </div>
              <p className="text-xs font-medium text-slate-600" data-magicpath-id="30" data-magicpath-path="QuizResultsPage.tsx">Skipped</p>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4" data-magicpath-id="31" data-magicpath-path="QuizResultsPage.tsx">
          <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm" data-magicpath-id="32" data-magicpath-path="QuizResultsPage.tsx">
            <div className="flex items-center gap-3 mb-3" data-magicpath-id="33" data-magicpath-path="QuizResultsPage.tsx">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center" data-magicpath-id="34" data-magicpath-path="QuizResultsPage.tsx">
                <Clock className="w-6 h-6 text-white" data-magicpath-id="35" data-magicpath-path="QuizResultsPage.tsx" />
              </div>
              <div className="flex-1" data-magicpath-id="36" data-magicpath-path="QuizResultsPage.tsx">
                <p className="text-xs text-slate-600 font-medium" data-magicpath-id="37" data-magicpath-path="QuizResultsPage.tsx">Total Time</p>
                <p className="text-2xl font-bold text-slate-900" data-magicpath-id="38" data-magicpath-path="QuizResultsPage.tsx">{formatTime(totalTimeSpent)}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600" data-magicpath-id="39" data-magicpath-path="QuizResultsPage.tsx">
              Avg: <span className="font-bold text-slate-900" data-magicpath-id="40" data-magicpath-path="QuizResultsPage.tsx">{averageTimePerQuestion}s</span> per question
            </p>
          </div>

          <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm" data-magicpath-id="41" data-magicpath-path="QuizResultsPage.tsx">
            <div className="flex items-center gap-3 mb-3" data-magicpath-id="42" data-magicpath-path="QuizResultsPage.tsx">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center" data-magicpath-id="43" data-magicpath-path="QuizResultsPage.tsx">
                <Target className="w-6 h-6 text-white" data-magicpath-id="44" data-magicpath-path="QuizResultsPage.tsx" />
              </div>
              <div className="flex-1" data-magicpath-id="45" data-magicpath-path="QuizResultsPage.tsx">
                <p className="text-xs text-slate-600 font-medium" data-magicpath-id="46" data-magicpath-path="QuizResultsPage.tsx">Accuracy</p>
                <p className="text-2xl font-bold text-slate-900" data-magicpath-id="47" data-magicpath-path="QuizResultsPage.tsx">{Math.round(correctAnswers / (totalQuestions - unanswered) * 100) || 0}%</p>
              </div>
            </div>
            <p className="text-xs text-slate-600" data-magicpath-id="48" data-magicpath-path="QuizResultsPage.tsx">
              Answered: <span className="font-bold text-slate-900" data-magicpath-id="49" data-magicpath-path="QuizResultsPage.tsx">{totalQuestions - unanswered}/{totalQuestions}</span>
            </p>
          </div>
        </div>

        {/* Garden Progress Teaser */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl border-2 border-emerald-400 p-6 lg:p-8 text-white shadow-xl" data-magicpath-id="50" data-magicpath-path="QuizResultsPage.tsx">
          <div className="flex items-start gap-4 mb-4" data-magicpath-id="51" data-magicpath-path="QuizResultsPage.tsx">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0" data-magicpath-id="52" data-magicpath-path="QuizResultsPage.tsx">
              <Sprout className="w-8 h-8 text-white" data-magicpath-id="53" data-magicpath-path="QuizResultsPage.tsx" />
            </div>
            <div className="flex-1" data-magicpath-id="54" data-magicpath-path="QuizResultsPage.tsx">
              <h2 className="text-2xl font-bold mb-2" data-magicpath-id="55" data-magicpath-path="QuizResultsPage.tsx">Your Garden Grew! 🌱</h2>
              <p className="text-white/90 text-sm lg:text-base" data-magicpath-id="56" data-magicpath-path="QuizResultsPage.tsx">
                You earned <span className="font-bold text-white" data-magicpath-id="57" data-magicpath-path="QuizResultsPage.tsx">{pointsEarned} points</span> for your {props.subject} garden!
              </p>
            </div>
          </div>

          {/* Mini Progress Bar */}
          <div className="mb-4" data-magicpath-id="58" data-magicpath-path="QuizResultsPage.tsx">
            <div className="flex items-center justify-between mb-2" data-magicpath-id="59" data-magicpath-path="QuizResultsPage.tsx">
              <span className="text-sm font-semibold text-white/90" data-magicpath-id="60" data-magicpath-path="QuizResultsPage.tsx">Level {previousLevel} Progress</span>
              <span className="text-sm font-bold text-white" data-magicpath-id="61" data-magicpath-path="QuizResultsPage.tsx">{Math.round(newProgress)}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden" data-magicpath-id="62" data-magicpath-path="QuizResultsPage.tsx">
              <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{
              width: `${newProgress}%`
            }} data-magicpath-id="63" data-magicpath-path="QuizResultsPage.tsx" />
            </div>
          </div>

          <button onClick={() => setShowGarden(true)} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-white/90 active:scale-95 transition-all" data-magicpath-id="64" data-magicpath-path="QuizResultsPage.tsx">
            <Leaf className="w-5 h-5" data-magicpath-id="65" data-magicpath-path="QuizResultsPage.tsx" />
            <span data-magicpath-id="66" data-magicpath-path="QuizResultsPage.tsx">View Your Garden</span>
            <ArrowRight className="w-5 h-5" data-magicpath-id="67" data-magicpath-path="QuizResultsPage.tsx" />
          </button>
        </div>

        {/* Review Answers */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 lg:p-6 shadow-sm" data-magicpath-id="68" data-magicpath-path="QuizResultsPage.tsx">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2" data-magicpath-id="69" data-magicpath-path="QuizResultsPage.tsx">
            <Brain className="w-5 h-5 text-blue-600" data-magicpath-id="70" data-magicpath-path="QuizResultsPage.tsx" />
            Question Review
          </h3>
          
          <div className="space-y-2 mb-4" data-magicpath-id="71" data-magicpath-path="QuizResultsPage.tsx">
            {props.results.map((result, idx) => {
            const question = props.questions.find(q => q.id === result.questionId);
            if (!question) return null;
            return <div key={result.questionId} className={`p-3 rounded-xl border-2 ${result.isCorrect ? 'bg-emerald-50 border-emerald-200' : result.wasAnswered ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`} data-magicpath-id="72" data-magicpath-path="QuizResultsPage.tsx">
                  <div className="flex items-center gap-3" data-magicpath-id="73" data-magicpath-path="QuizResultsPage.tsx">
                    {result.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" data-magicpath-id="74" data-magicpath-path="QuizResultsPage.tsx" /> : result.wasAnswered ? <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" data-magicpath-id="75" data-magicpath-path="QuizResultsPage.tsx" /> : <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" data-magicpath-id="76" data-magicpath-path="QuizResultsPage.tsx" />}
                    <div className="flex-1 min-w-0" data-magicpath-id="77" data-magicpath-path="QuizResultsPage.tsx">
                      <p className="text-sm font-semibold text-slate-900 truncate" data-magicpath-id="78" data-magicpath-path="QuizResultsPage.tsx">Question {idx + 1}</p>
                      <p className="text-xs text-slate-600" data-magicpath-id="79" data-magicpath-path="QuizResultsPage.tsx">{question.topic}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${result.isCorrect ? 'bg-emerald-600 text-white' : result.wasAnswered ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'}`} data-magicpath-id="80" data-magicpath-path="QuizResultsPage.tsx">
                      {result.isCorrect ? '✓' : result.wasAnswered ? '✗' : '—'}
                    </span>
                  </div>
                </div>;
          })}
          </div>

          <button onClick={() => setShowDetailedReview(true)} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-xl transition-colors border-2 border-blue-200" data-magicpath-id="81" data-magicpath-path="QuizResultsPage.tsx">
            <span data-magicpath-id="82" data-magicpath-path="QuizResultsPage.tsx">View Detailed Review</span>
            <ChevronRight className="w-5 h-5" data-magicpath-id="83" data-magicpath-path="QuizResultsPage.tsx" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4" data-magicpath-id="84" data-magicpath-path="QuizResultsPage.tsx">
          <button onClick={props.onExit} className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all" data-magicpath-id="85" data-magicpath-path="QuizResultsPage.tsx">
            <Home className="w-5 h-5" data-magicpath-id="86" data-magicpath-path="QuizResultsPage.tsx" />
            <span data-magicpath-id="87" data-magicpath-path="QuizResultsPage.tsx">Home</span>
          </button>
          <button onClick={() => {/* Retake quiz logic */}} className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all" data-magicpath-id="88" data-magicpath-path="QuizResultsPage.tsx">
            <RotateCcw className="w-5 h-5" data-magicpath-id="89" data-magicpath-path="QuizResultsPage.tsx" />
            <span data-magicpath-id="90" data-magicpath-path="QuizResultsPage.tsx">Retake</span>
          </button>
        </div>
      </div>

      {/* Garden Progress Modal */}
      {showGarden && <GardenProgress subject={props.subject} subjectColor={props.subjectColor} level={previousLevel} progress={newProgress} pointsEarned={pointsEarned} plantHealth={85} onClose={() => setShowGarden(false)} data-magicpath-id="91" data-magicpath-path="QuizResultsPage.tsx" />}
    </div>;
};