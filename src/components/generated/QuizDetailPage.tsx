import React, { useState } from 'react';
import { FileQuestion, Play, Clock, Target, TrendingUp, Trophy, Calendar, ChevronRight, Book, CheckCircle2, XCircle, AlertCircle, Zap, ArrowLeft, FileText, ChevronDown, Eye, Award, BarChart3 } from 'lucide-react';
import { QuizSession } from './QuizSession';
type QuizAttempt = {
  id: string;
  attemptNumber: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedDate: string;
  timeSpent: number; // in minutes
  status: 'completed' | 'in-progress';
};
type QuizMaterial = {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'notes' | 'textbook';
  uploadedDate: string;
};
type QuizQuestion = {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  topic: string;
};
type QuizDetailPageProps = {
  quizId?: string;
  onBack?: () => void;
  onStartQuiz?: () => void;
};
const mockAttempts: QuizAttempt[] = [{
  id: '1',
  attemptNumber: 2,
  score: 88,
  totalQuestions: 25,
  correctAnswers: 22,
  completedDate: '2 hours ago',
  timeSpent: 28,
  status: 'completed'
}, {
  id: '2',
  attemptNumber: 1,
  score: 82,
  totalQuestions: 25,
  correctAnswers: 20,
  completedDate: '3 days ago',
  timeSpent: 30,
  status: 'completed'
}];
const mockMaterials: QuizMaterial[] = [{
  id: '1',
  name: 'World War II Timeline.pdf',
  type: 'pdf',
  uploadedDate: '1 week ago'
}, {
  id: '2',
  name: 'WWII Documentary Notes',
  type: 'notes',
  uploadedDate: '1 week ago'
}, {
  id: '3',
  name: 'History Textbook Chapter 8',
  type: 'textbook',
  uploadedDate: '2 weeks ago'
}];
const mockQuestions: QuizQuestion[] = [{
  id: '1',
  question: 'What year did World War II begin?',
  userAnswer: '1939',
  correctAnswer: '1939',
  isCorrect: true,
  topic: 'Timeline'
}, {
  id: '2',
  question: 'Which country was NOT part of the Axis powers?',
  userAnswer: 'France',
  correctAnswer: 'Soviet Union',
  isCorrect: false,
  topic: 'Alliances'
}, {
  id: '3',
  question: 'What was the code name for the D-Day invasion?',
  userAnswer: 'Operation Overlord',
  correctAnswer: 'Operation Overlord',
  isCorrect: true,
  topic: 'Major Events'
}];
export const QuizDetailPage = (props: QuizDetailPageProps) => {
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
  const [showAttemptDetails, setShowAttemptDetails] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);

  // Mock quiz data - moved to top to be available before isQuizActive check
  const quiz = {
    id: '1',
    title: 'World War II Analysis',
    subject: 'History',
    subjectColor: 'from-blue-500 to-blue-600',
    questionsCount: 25,
    duration: 30,
    difficulty: 'medium' as const,
    description: 'Comprehensive quiz covering major events, key figures, and the impact of World War II on global politics.',
    topicsCount: 5,
    createdDate: '2 weeks ago'
  };

  // If quiz is active, show quiz session
  if (isQuizActive) {
    return <QuizSession quizId={quiz.id} quizTitle={quiz.title} subject={quiz.subject} subjectColor={quiz.subjectColor} totalQuestions={quiz.questionsCount} onExit={() => setIsQuizActive(false)} />;
  }

  // ... existing code ...
  const attempts = mockAttempts;
  const materials = mockMaterials;
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
      case 'notes':
        return Book;
      case 'textbook':
        return Book;
      default:
        return FileText;
    }
  };
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0;
  const averageScore = attempts.length > 0 ? Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length) : 0;
  return <div className="h-full overflow-y-auto pb-4">
      {/* Header Section */}
      <div className={`px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br ${quiz.subjectColor} border-b border-white/20`}>
        <div className="max-w-7xl mx-auto">
          <button onClick={props.onBack} className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors">
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
                  {quiz.subject}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white">
                  {quiz.questionsCount} Questions
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white">
                  {quiz.duration} min
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/90 text-sm lg:text-base mb-4 max-w-3xl">{quiz.description}</p>

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
            {/* Left Column - Attempts & Performance */}
            <div className="lg:col-span-2 space-y-6">
              {/* Score Progression Chart */}
              {attempts.length > 0 && <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg lg:text-xl font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Score Progression
                      </h2>
                      <p className="text-sm text-slate-600 mt-1">Your performance over time</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-xs text-slate-600 font-medium leading-none">Best</p>
                        <p className="text-lg font-bold text-emerald-600 leading-tight">{bestScore}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-48 lg:h-56">
                    <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="scoreGradientDetail" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {[0, 25, 50, 75, 100].map(val => <line key={val} x1="0" y1={200 - val * 2} x2="800" y2={200 - val * 2} stroke="rgb(226, 232, 240)" strokeWidth="1" strokeDasharray="4" />)}
                      
                      {attempts.length > 1 && <>
                          <path d={`M 0,${200 - attempts[attempts.length - 1].score * 2} ${attempts.slice().reverse().map((a, i) => `L ${i * 800 / (attempts.length - 1)},${200 - a.score * 2}`).join(' ')} L 800,200 L 0,200 Z`} fill="url(#scoreGradientDetail)" />
                          
                          <path d={`M 0,${200 - attempts[attempts.length - 1].score * 2} ${attempts.slice().reverse().map((a, i) => `L ${i * 800 / (attempts.length - 1)},${200 - a.score * 2}`).join(' ')}`} fill="none" stroke="rgb(59, 130, 246)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          
                          {attempts.slice().reverse().map((a, i) => <g key={i}>
                              <circle cx={i * 800 / (attempts.length - 1)} cy={200 - a.score * 2} r="6" fill="white" stroke="rgb(59, 130, 246)" strokeWidth="3" />
                              <title>{`Attempt ${a.attemptNumber}: ${a.score}%`}</title>
                            </g>)}
                        </>}
                    </svg>
                    
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs font-medium text-slate-500">
                      {attempts.slice().reverse().map((a, i) => <span key={i}>#{a.attemptNumber}</span>)}
                    </div>
                  </div>
                </section>}

              {/* Attempts History */}
              <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm">
                <h2 className="text-lg lg:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Attempt History
                  <span className="ml-auto text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                    {attempts.length} total
                  </span>
                </h2>

                {attempts.length === 0 ? <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileQuestion className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium">No attempts yet</p>
                    <p className="text-sm text-slate-500 mt-1">Start the quiz to see your progress</p>
                  </div> : <div className="space-y-3">
                    {attempts.map(attempt => <div key={attempt.id} onClick={() => {
                  setSelectedAttempt(attempt);
                  setShowAttemptDetails(true);
                }} className="border-2 border-slate-200 hover:border-blue-400 rounded-xl p-4 transition-all cursor-pointer hover:shadow-md active:scale-[0.98] group">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                              Attempt #{attempt.attemptNumber}
                            </h3>
                            <p className="text-xs text-slate-600">{attempt.completedDate}</p>
                          </div>
                          <div className={`text-right ${attempt.attemptNumber === attempts[0].attemptNumber ? 'px-2 py-1 bg-blue-50 rounded-lg' : ''}`}>
                            <p className={`text-2xl font-bold ${getScoreColor(attempt.score)}`}>
                              {attempt.score}%
                            </p>
                            {attempt.attemptNumber === attempts[0].attemptNumber && <p className="text-xs text-blue-600 font-semibold">Latest</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-2 bg-slate-50 rounded-lg">
                            <p className="text-xs text-slate-600 font-medium mb-0.5">Correct</p>
                            <p className="text-lg font-bold text-emerald-600">{attempt.correctAnswers}/{attempt.totalQuestions}</p>
                          </div>
                          <div className="text-center p-2 bg-slate-50 rounded-lg">
                            <p className="text-xs text-slate-600 font-medium mb-0.5">Time</p>
                            <p className="text-lg font-bold text-slate-900">{attempt.timeSpent}m</p>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-600 font-medium mb-0.5">View</p>
                            <Eye className="w-5 h-5 text-blue-600 mx-auto" />
                          </div>
                        </div>
                      </div>)}
                  </div>}
              </section>
            </div>

            {/* Right Column - Materials & Info */}
            <div className="space-y-6">
              {/* Quiz Materials */}
              <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-base lg:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Book className="w-5 h-5 text-blue-600" />
                  Study Materials
                </h2>

                <div className="space-y-2">
                  {materials.map(material => {
                  const Icon = getMaterialIcon(material.type);
                  return <div key={material.id} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{material.name}</p>
                          <p className="text-xs text-slate-600">{material.uploadedDate}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      </div>;
                })}
                </div>

                <button className="w-full mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm">
                  View All Materials
                </button>
              </section>

              {/* Quiz Info */}
              <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-base lg:text-lg font-bold text-slate-900 mb-4">Quiz Details</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-medium">Created</span>
                    <span className="text-sm font-semibold text-slate-900">{quiz.createdDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-medium">Topics Covered</span>
                    <span className="text-sm font-semibold text-slate-900">{quiz.topicsCount}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-medium">Time Limit</span>
                    <span className="text-sm font-semibold text-slate-900">{quiz.duration} minutes</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600 font-medium">Subject</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-lg bg-gradient-to-r ${quiz.subjectColor} text-white`}>
                      {quiz.subject}
                    </span>
                  </div>
                </div>
              </section>

              {/* Action Button */}
              <button onClick={() => setIsQuizActive(true)} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all">
                <Play className="w-5 h-5" />
                <span>{attempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attempt Detail Modal */}
      {showAttemptDetails && selectedAttempt && <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowAttemptDetails(false)}>
          <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-3xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={`flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-gradient-to-br ${quiz.subjectColor}`}>
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden"></div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">Attempt #{selectedAttempt.attemptNumber}</h2>
                  <p className="text-white/90 text-sm">{selectedAttempt.completedDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/80 font-medium mb-1">Score</p>
                  <p className="text-3xl font-bold text-white">{selectedAttempt.score}%</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-600 mb-1">{selectedAttempt.correctAnswers}</p>
                  <p className="text-xs text-slate-600 font-medium">Correct</p>
                </div>
                <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl">
                  <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600 mb-1">
                    {selectedAttempt.totalQuestions - selectedAttempt.correctAnswers}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">Wrong</p>
                </div>
                <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900 mb-1">{selectedAttempt.timeSpent}m</p>
                  <p className="text-xs text-slate-600 font-medium">Time Spent</p>
                </div>
              </div>

              {/* Questions Review */}
              <h3 className="text-lg font-bold text-slate-900 mb-4">Question Review</h3>
              <div className="space-y-3">
                {mockQuestions.map((q, idx) => <div key={q.id} className={`p-4 rounded-xl border-2 ${q.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3 mb-2">
                      {q.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 mb-1">Question {idx + 1}</p>
                        <p className="text-sm text-slate-700 mb-3">{q.question}</p>
                        
                        <div className="space-y-2">
                          <div className={`p-2 rounded-lg ${q.isCorrect ? 'bg-white' : 'bg-red-100'}`}>
                            <p className="text-xs font-semibold text-slate-600 mb-0.5">Your Answer:</p>
                            <p className="text-sm font-medium text-slate-900">{q.userAnswer}</p>
                          </div>
                          
                          {!q.isCorrect && <div className="p-2 rounded-lg bg-emerald-100">
                              <p className="text-xs font-semibold text-slate-600 mb-0.5">Correct Answer:</p>
                              <p className="text-sm font-medium text-emerald-900">{q.correctAnswer}</p>
                            </div>}
                        </div>

                        <span className="inline-block mt-2 text-xs font-semibold text-slate-600 bg-white px-2 py-1 rounded">
                          Topic: {q.topic}
                        </span>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button onClick={() => setShowAttemptDetails(false)} className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-xl active:scale-95 transition-all">
                Close
              </button>
            </div>
          </div>
        </div>}
    </div>;
};