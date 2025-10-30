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
    return <QuizSession quizId={quiz.id} quizTitle={quiz.title} subject={quiz.subject} subjectColor={quiz.subjectColor} totalQuestions={quiz.questionsCount} onExit={() => setIsQuizActive(false)} data-magicpath-id="0" data-magicpath-path="QuizDetailPage.tsx" />;
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
  return <div className="h-full overflow-y-auto pb-4" data-magicpath-id="1" data-magicpath-path="QuizDetailPage.tsx">
      {/* Header Section */}
      <div className={`px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br ${quiz.subjectColor} border-b border-white/20`} data-magicpath-id="2" data-magicpath-path="QuizDetailPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="3" data-magicpath-path="QuizDetailPage.tsx">
          <button onClick={props.onBack} className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors" data-magicpath-id="4" data-magicpath-path="QuizDetailPage.tsx">
            <ArrowLeft className="w-5 h-5" data-magicpath-id="5" data-magicpath-path="QuizDetailPage.tsx" />
            <span className="text-sm font-semibold" data-magicpath-id="6" data-magicpath-path="QuizDetailPage.tsx">Back to Quizzes</span>
          </button>

          <div className="flex items-start gap-4 mb-6" data-magicpath-id="7" data-magicpath-path="QuizDetailPage.tsx">
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0" data-magicpath-id="8" data-magicpath-path="QuizDetailPage.tsx">
              <FileQuestion className="w-7 h-7 lg:w-8 lg:h-8 text-white" data-magicpath-id="9" data-magicpath-path="QuizDetailPage.tsx" />
            </div>
            <div className="flex-1" data-magicpath-id="10" data-magicpath-path="QuizDetailPage.tsx">
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2" data-magicpath-id="11" data-magicpath-path="QuizDetailPage.tsx">{quiz.title}</h1>
              <div className="flex items-center gap-2 flex-wrap" data-magicpath-id="12" data-magicpath-path="QuizDetailPage.tsx">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white" data-magicpath-id="13" data-magicpath-path="QuizDetailPage.tsx">
                  {quiz.subject}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white" data-magicpath-id="14" data-magicpath-path="QuizDetailPage.tsx">
                  {quiz.questionsCount} Questions
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white" data-magicpath-id="15" data-magicpath-path="QuizDetailPage.tsx">
                  {quiz.duration} min
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/90 text-sm lg:text-base mb-4 max-w-3xl" data-magicpath-id="16" data-magicpath-path="QuizDetailPage.tsx">{quiz.description}</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-magicpath-id="17" data-magicpath-path="QuizDetailPage.tsx">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20" data-magicpath-id="18" data-magicpath-path="QuizDetailPage.tsx">
              <p className="text-xs text-white/80 font-medium mb-1" data-magicpath-id="19" data-magicpath-path="QuizDetailPage.tsx">Attempts</p>
              <p className="text-2xl lg:text-3xl font-bold text-white" data-magicpath-id="20" data-magicpath-path="QuizDetailPage.tsx">{attempts.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20" data-magicpath-id="21" data-magicpath-path="QuizDetailPage.tsx">
              <p className="text-xs text-white/80 font-medium mb-1" data-magicpath-id="22" data-magicpath-path="QuizDetailPage.tsx">Best Score</p>
              <p className="text-2xl lg:text-3xl font-bold text-white" data-magicpath-id="23" data-magicpath-path="QuizDetailPage.tsx">{bestScore}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20" data-magicpath-id="24" data-magicpath-path="QuizDetailPage.tsx">
              <p className="text-xs text-white/80 font-medium mb-1" data-magicpath-id="25" data-magicpath-path="QuizDetailPage.tsx">Average</p>
              <p className="text-2xl lg:text-3xl font-bold text-white" data-magicpath-id="26" data-magicpath-path="QuizDetailPage.tsx">{averageScore}%</p>
            </div>
            <div className={`rounded-xl p-4 border ${getDifficultyColor(quiz.difficulty)}`} data-magicpath-id="27" data-magicpath-path="QuizDetailPage.tsx">
              <p className="text-xs font-medium mb-1" data-magicpath-id="28" data-magicpath-path="QuizDetailPage.tsx">Difficulty</p>
              <p className="text-2xl lg:text-3xl font-bold capitalize" data-magicpath-id="29" data-magicpath-path="QuizDetailPage.tsx">{quiz.difficulty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 lg:px-8 lg:py-6" data-magicpath-id="30" data-magicpath-path="QuizDetailPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="31" data-magicpath-path="QuizDetailPage.tsx">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-magicpath-id="32" data-magicpath-path="QuizDetailPage.tsx">
            {/* Left Column - Attempts & Performance */}
            <div className="lg:col-span-2 space-y-6" data-magicpath-id="33" data-magicpath-path="QuizDetailPage.tsx">
              {/* Score Progression Chart */}
              {attempts.length > 0 && <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm" data-magicpath-id="34" data-magicpath-path="QuizDetailPage.tsx">
                  <div className="flex items-center justify-between mb-4" data-magicpath-id="35" data-magicpath-path="QuizDetailPage.tsx">
                    <div data-magicpath-id="36" data-magicpath-path="QuizDetailPage.tsx">
                      <h2 className="text-lg lg:text-xl font-bold text-slate-900 flex items-center gap-2" data-magicpath-id="37" data-magicpath-path="QuizDetailPage.tsx">
                        <TrendingUp className="w-5 h-5 text-blue-600" data-magicpath-id="38" data-magicpath-path="QuizDetailPage.tsx" />
                        Score Progression
                      </h2>
                      <p className="text-sm text-slate-600 mt-1" data-magicpath-id="39" data-magicpath-path="QuizDetailPage.tsx">Your performance over time</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg" data-magicpath-id="40" data-magicpath-path="QuizDetailPage.tsx">
                      <Award className="w-4 h-4 text-emerald-600" data-magicpath-id="41" data-magicpath-path="QuizDetailPage.tsx" />
                      <div data-magicpath-id="42" data-magicpath-path="QuizDetailPage.tsx">
                        <p className="text-xs text-slate-600 font-medium leading-none" data-magicpath-id="43" data-magicpath-path="QuizDetailPage.tsx">Best</p>
                        <p className="text-lg font-bold text-emerald-600 leading-tight" data-magicpath-id="44" data-magicpath-path="QuizDetailPage.tsx">{bestScore}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-48 lg:h-56" data-magicpath-id="45" data-magicpath-path="QuizDetailPage.tsx">
                    <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none" data-magicpath-id="46" data-magicpath-path="QuizDetailPage.tsx">
                      <defs data-magicpath-id="47" data-magicpath-path="QuizDetailPage.tsx">
                        <linearGradient id="scoreGradientDetail" x1="0%" y1="0%" x2="0%" y2="100%" data-magicpath-id="48" data-magicpath-path="QuizDetailPage.tsx">
                          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {[0, 25, 50, 75, 100].map(val => <line key={val} x1="0" y1={200 - val * 2} x2="800" y2={200 - val * 2} stroke="rgb(226, 232, 240)" strokeWidth="1" strokeDasharray="4" />)}
                      
                      {attempts.length > 1 && <>
                          <path d={`M 0,${200 - attempts[attempts.length - 1].score * 2} ${attempts.slice().reverse().map((a, i) => `L ${i * 800 / (attempts.length - 1)},${200 - a.score * 2}`).join(' ')} L 800,200 L 0,200 Z`} fill="url(#scoreGradientDetail)" data-magicpath-id="49" data-magicpath-path="QuizDetailPage.tsx" />
                          
                          <path d={`M 0,${200 - attempts[attempts.length - 1].score * 2} ${attempts.slice().reverse().map((a, i) => `L ${i * 800 / (attempts.length - 1)},${200 - a.score * 2}`).join(' ')}`} fill="none" stroke="rgb(59, 130, 246)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" data-magicpath-id="50" data-magicpath-path="QuizDetailPage.tsx" />
                          
                          {attempts.slice().reverse().map((a, i) => <g key={i} data-magicpath-id="51" data-magicpath-path="QuizDetailPage.tsx">
                              <circle cx={i * 800 / (attempts.length - 1)} cy={200 - a.score * 2} r="6" fill="white" stroke="rgb(59, 130, 246)" strokeWidth="3" data-magicpath-id="52" data-magicpath-path="QuizDetailPage.tsx" />
                              <title data-magicpath-id="53" data-magicpath-path="QuizDetailPage.tsx">{`Attempt ${a.attemptNumber}: ${a.score}%`}</title>
                            </g>)}
                        </>}
                    </svg>
                    
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs font-medium text-slate-500" data-magicpath-id="54" data-magicpath-path="QuizDetailPage.tsx">
                      {attempts.slice().reverse().map((a, i) => <span key={i} data-magicpath-id="55" data-magicpath-path="QuizDetailPage.tsx">#{a.attemptNumber}</span>)}
                    </div>
                  </div>
                </section>}

              {/* Attempts History */}
              <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm" data-magicpath-id="56" data-magicpath-path="QuizDetailPage.tsx">
                <h2 className="text-lg lg:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2" data-magicpath-id="57" data-magicpath-path="QuizDetailPage.tsx">
                  <BarChart3 className="w-5 h-5 text-blue-600" data-magicpath-id="58" data-magicpath-path="QuizDetailPage.tsx" />
                  Attempt History
                  <span className="ml-auto text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg" data-magicpath-id="59" data-magicpath-path="QuizDetailPage.tsx">
                    {attempts.length} total
                  </span>
                </h2>

                {attempts.length === 0 ? <div className="text-center py-8" data-magicpath-id="60" data-magicpath-path="QuizDetailPage.tsx">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3" data-magicpath-id="61" data-magicpath-path="QuizDetailPage.tsx">
                      <FileQuestion className="w-8 h-8 text-slate-400" data-magicpath-id="62" data-magicpath-path="QuizDetailPage.tsx" />
                    </div>
                    <p className="text-slate-600 font-medium" data-magicpath-id="63" data-magicpath-path="QuizDetailPage.tsx">No attempts yet</p>
                    <p className="text-sm text-slate-500 mt-1" data-magicpath-id="64" data-magicpath-path="QuizDetailPage.tsx">Start the quiz to see your progress</p>
                  </div> : <div className="space-y-3" data-magicpath-id="65" data-magicpath-path="QuizDetailPage.tsx">
                    {attempts.map(attempt => <div key={attempt.id} onClick={() => {
                  setSelectedAttempt(attempt);
                  setShowAttemptDetails(true);
                }} className="border-2 border-slate-200 hover:border-blue-400 rounded-xl p-4 transition-all cursor-pointer hover:shadow-md active:scale-[0.98] group" data-magicpath-id="66" data-magicpath-path="QuizDetailPage.tsx">
                        <div className="flex items-start justify-between mb-3" data-magicpath-id="67" data-magicpath-path="QuizDetailPage.tsx">
                          <div data-magicpath-id="68" data-magicpath-path="QuizDetailPage.tsx">
                            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors" data-magicpath-id="69" data-magicpath-path="QuizDetailPage.tsx">
                              Attempt #{attempt.attemptNumber}
                            </h3>
                            <p className="text-xs text-slate-600" data-magicpath-id="70" data-magicpath-path="QuizDetailPage.tsx">{attempt.completedDate}</p>
                          </div>
                          <div className={`text-right ${attempt.attemptNumber === attempts[0].attemptNumber ? 'px-2 py-1 bg-blue-50 rounded-lg' : ''}`} data-magicpath-id="71" data-magicpath-path="QuizDetailPage.tsx">
                            <p className={`text-2xl font-bold ${getScoreColor(attempt.score)}`} data-magicpath-id="72" data-magicpath-path="QuizDetailPage.tsx">
                              {attempt.score}%
                            </p>
                            {attempt.attemptNumber === attempts[0].attemptNumber && <p className="text-xs text-blue-600 font-semibold" data-magicpath-id="73" data-magicpath-path="QuizDetailPage.tsx">Latest</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3" data-magicpath-id="74" data-magicpath-path="QuizDetailPage.tsx">
                          <div className="text-center p-2 bg-slate-50 rounded-lg" data-magicpath-id="75" data-magicpath-path="QuizDetailPage.tsx">
                            <p className="text-xs text-slate-600 font-medium mb-0.5" data-magicpath-id="76" data-magicpath-path="QuizDetailPage.tsx">Correct</p>
                            <p className="text-lg font-bold text-emerald-600" data-magicpath-id="77" data-magicpath-path="QuizDetailPage.tsx">{attempt.correctAnswers}/{attempt.totalQuestions}</p>
                          </div>
                          <div className="text-center p-2 bg-slate-50 rounded-lg" data-magicpath-id="78" data-magicpath-path="QuizDetailPage.tsx">
                            <p className="text-xs text-slate-600 font-medium mb-0.5" data-magicpath-id="79" data-magicpath-path="QuizDetailPage.tsx">Time</p>
                            <p className="text-lg font-bold text-slate-900" data-magicpath-id="80" data-magicpath-path="QuizDetailPage.tsx">{attempt.timeSpent}m</p>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded-lg" data-magicpath-id="81" data-magicpath-path="QuizDetailPage.tsx">
                            <p className="text-xs text-blue-600 font-medium mb-0.5" data-magicpath-id="82" data-magicpath-path="QuizDetailPage.tsx">View</p>
                            <Eye className="w-5 h-5 text-blue-600 mx-auto" data-magicpath-id="83" data-magicpath-path="QuizDetailPage.tsx" />
                          </div>
                        </div>
                      </div>)}
                  </div>}
              </section>
            </div>

            {/* Right Column - Materials & Info */}
            <div className="space-y-6" data-magicpath-id="84" data-magicpath-path="QuizDetailPage.tsx">
              {/* Quiz Materials */}
              <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 shadow-sm" data-magicpath-id="85" data-magicpath-path="QuizDetailPage.tsx">
                <h2 className="text-base lg:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2" data-magicpath-id="86" data-magicpath-path="QuizDetailPage.tsx">
                  <Book className="w-5 h-5 text-blue-600" data-magicpath-id="87" data-magicpath-path="QuizDetailPage.tsx" />
                  Study Materials
                </h2>

                <div className="space-y-2" data-magicpath-id="88" data-magicpath-path="QuizDetailPage.tsx">
                  {materials.map(material => {
                  const Icon = getMaterialIcon(material.type);
                  return <div key={material.id} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200" data-magicpath-id="89" data-magicpath-path="QuizDetailPage.tsx">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0" data-magicpath-id="90" data-magicpath-path="QuizDetailPage.tsx">
                          <Icon className="w-5 h-5 text-blue-600" data-magicpath-id="91" data-magicpath-path="QuizDetailPage.tsx" />
                        </div>
                        <div className="flex-1 min-w-0" data-magicpath-id="92" data-magicpath-path="QuizDetailPage.tsx">
                          <p className="text-sm font-semibold text-slate-900 truncate" data-magicpath-id="93" data-magicpath-path="QuizDetailPage.tsx">{material.name}</p>
                          <p className="text-xs text-slate-600" data-magicpath-id="94" data-magicpath-path="QuizDetailPage.tsx">{material.uploadedDate}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" data-magicpath-id="95" data-magicpath-path="QuizDetailPage.tsx" />
                      </div>;
                })}
                </div>

                <button className="w-full mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm" data-magicpath-id="96" data-magicpath-path="QuizDetailPage.tsx">
                  View All Materials
                </button>
              </section>

              {/* Quiz Info */}
              <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 shadow-sm" data-magicpath-id="97" data-magicpath-path="QuizDetailPage.tsx">
                <h2 className="text-base lg:text-lg font-bold text-slate-900 mb-4" data-magicpath-id="98" data-magicpath-path="QuizDetailPage.tsx">Quiz Details</h2>
                
                <div className="space-y-3" data-magicpath-id="99" data-magicpath-path="QuizDetailPage.tsx">
                  <div className="flex items-center justify-between py-2 border-b border-slate-200" data-magicpath-id="100" data-magicpath-path="QuizDetailPage.tsx">
                    <span className="text-sm text-slate-600 font-medium" data-magicpath-id="101" data-magicpath-path="QuizDetailPage.tsx">Created</span>
                    <span className="text-sm font-semibold text-slate-900" data-magicpath-id="102" data-magicpath-path="QuizDetailPage.tsx">{quiz.createdDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-200" data-magicpath-id="103" data-magicpath-path="QuizDetailPage.tsx">
                    <span className="text-sm text-slate-600 font-medium" data-magicpath-id="104" data-magicpath-path="QuizDetailPage.tsx">Topics Covered</span>
                    <span className="text-sm font-semibold text-slate-900" data-magicpath-id="105" data-magicpath-path="QuizDetailPage.tsx">{quiz.topicsCount}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-200" data-magicpath-id="106" data-magicpath-path="QuizDetailPage.tsx">
                    <span className="text-sm text-slate-600 font-medium" data-magicpath-id="107" data-magicpath-path="QuizDetailPage.tsx">Time Limit</span>
                    <span className="text-sm font-semibold text-slate-900" data-magicpath-id="108" data-magicpath-path="QuizDetailPage.tsx">{quiz.duration} minutes</span>
                  </div>
                  <div className="flex items-center justify-between py-2" data-magicpath-id="109" data-magicpath-path="QuizDetailPage.tsx">
                    <span className="text-sm text-slate-600 font-medium" data-magicpath-id="110" data-magicpath-path="QuizDetailPage.tsx">Subject</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-lg bg-gradient-to-r ${quiz.subjectColor} text-white`} data-magicpath-id="111" data-magicpath-path="QuizDetailPage.tsx">
                      {quiz.subject}
                    </span>
                  </div>
                </div>
              </section>

              {/* Action Button */}
              <button onClick={() => setIsQuizActive(true)} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all" data-magicpath-id="112" data-magicpath-path="QuizDetailPage.tsx">
                <Play className="w-5 h-5" data-magicpath-id="113" data-magicpath-path="QuizDetailPage.tsx" />
                <span data-magicpath-id="114" data-magicpath-path="QuizDetailPage.tsx">{attempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attempt Detail Modal */}
      {showAttemptDetails && selectedAttempt && <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowAttemptDetails(false)} data-magicpath-id="115" data-magicpath-path="QuizDetailPage.tsx">
          <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-3xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()} data-magicpath-id="116" data-magicpath-path="QuizDetailPage.tsx">
            {/* Modal Header */}
            <div className={`flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-gradient-to-br ${quiz.subjectColor}`} data-magicpath-id="117" data-magicpath-path="QuizDetailPage.tsx">
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden" data-magicpath-id="118" data-magicpath-path="QuizDetailPage.tsx"></div>
              <div className="flex items-center justify-between" data-magicpath-id="119" data-magicpath-path="QuizDetailPage.tsx">
                <div data-magicpath-id="120" data-magicpath-path="QuizDetailPage.tsx">
                  <h2 className="text-xl lg:text-2xl font-bold text-white mb-1" data-magicpath-id="121" data-magicpath-path="QuizDetailPage.tsx">Attempt #{selectedAttempt.attemptNumber}</h2>
                  <p className="text-white/90 text-sm" data-magicpath-id="122" data-magicpath-path="QuizDetailPage.tsx">{selectedAttempt.completedDate}</p>
                </div>
                <div className="text-right" data-magicpath-id="123" data-magicpath-path="QuizDetailPage.tsx">
                  <p className="text-xs text-white/80 font-medium mb-1" data-magicpath-id="124" data-magicpath-path="QuizDetailPage.tsx">Score</p>
                  <p className="text-3xl font-bold text-white" data-magicpath-id="125" data-magicpath-path="QuizDetailPage.tsx">{selectedAttempt.score}%</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6" data-magicpath-id="126" data-magicpath-path="QuizDetailPage.tsx">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6" data-magicpath-id="127" data-magicpath-path="QuizDetailPage.tsx">
                <div className="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl" data-magicpath-id="128" data-magicpath-path="QuizDetailPage.tsx">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" data-magicpath-id="129" data-magicpath-path="QuizDetailPage.tsx" />
                  <p className="text-2xl font-bold text-emerald-600 mb-1" data-magicpath-id="130" data-magicpath-path="QuizDetailPage.tsx">{selectedAttempt.correctAnswers}</p>
                  <p className="text-xs text-slate-600 font-medium" data-magicpath-id="131" data-magicpath-path="QuizDetailPage.tsx">Correct</p>
                </div>
                <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl" data-magicpath-id="132" data-magicpath-path="QuizDetailPage.tsx">
                  <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" data-magicpath-id="133" data-magicpath-path="QuizDetailPage.tsx" />
                  <p className="text-2xl font-bold text-red-600 mb-1" data-magicpath-id="134" data-magicpath-path="QuizDetailPage.tsx">
                    {selectedAttempt.totalQuestions - selectedAttempt.correctAnswers}
                  </p>
                  <p className="text-xs text-slate-600 font-medium" data-magicpath-id="135" data-magicpath-path="QuizDetailPage.tsx">Wrong</p>
                </div>
                <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-xl" data-magicpath-id="136" data-magicpath-path="QuizDetailPage.tsx">
                  <Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" data-magicpath-id="137" data-magicpath-path="QuizDetailPage.tsx" />
                  <p className="text-2xl font-bold text-slate-900 mb-1" data-magicpath-id="138" data-magicpath-path="QuizDetailPage.tsx">{selectedAttempt.timeSpent}m</p>
                  <p className="text-xs text-slate-600 font-medium" data-magicpath-id="139" data-magicpath-path="QuizDetailPage.tsx">Time Spent</p>
                </div>
              </div>

              {/* Questions Review */}
              <h3 className="text-lg font-bold text-slate-900 mb-4" data-magicpath-id="140" data-magicpath-path="QuizDetailPage.tsx">Question Review</h3>
              <div className="space-y-3" data-magicpath-id="141" data-magicpath-path="QuizDetailPage.tsx">
                {mockQuestions.map((q, idx) => <div key={q.id} className={`p-4 rounded-xl border-2 ${q.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`} data-magicpath-id="142" data-magicpath-path="QuizDetailPage.tsx">
                    <div className="flex items-start gap-3 mb-2" data-magicpath-id="143" data-magicpath-path="QuizDetailPage.tsx">
                      {q.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" data-magicpath-id="144" data-magicpath-path="QuizDetailPage.tsx" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" data-magicpath-id="145" data-magicpath-path="QuizDetailPage.tsx" />}
                      <div className="flex-1" data-magicpath-id="146" data-magicpath-path="QuizDetailPage.tsx">
                        <p className="font-semibold text-slate-900 mb-1" data-magicpath-id="147" data-magicpath-path="QuizDetailPage.tsx">Question {idx + 1}</p>
                        <p className="text-sm text-slate-700 mb-3" data-magicpath-id="148" data-magicpath-path="QuizDetailPage.tsx">{q.question}</p>
                        
                        <div className="space-y-2" data-magicpath-id="149" data-magicpath-path="QuizDetailPage.tsx">
                          <div className={`p-2 rounded-lg ${q.isCorrect ? 'bg-white' : 'bg-red-100'}`} data-magicpath-id="150" data-magicpath-path="QuizDetailPage.tsx">
                            <p className="text-xs font-semibold text-slate-600 mb-0.5" data-magicpath-id="151" data-magicpath-path="QuizDetailPage.tsx">Your Answer:</p>
                            <p className="text-sm font-medium text-slate-900" data-magicpath-id="152" data-magicpath-path="QuizDetailPage.tsx">{q.userAnswer}</p>
                          </div>
                          
                          {!q.isCorrect && <div className="p-2 rounded-lg bg-emerald-100" data-magicpath-id="153" data-magicpath-path="QuizDetailPage.tsx">
                              <p className="text-xs font-semibold text-slate-600 mb-0.5" data-magicpath-id="154" data-magicpath-path="QuizDetailPage.tsx">Correct Answer:</p>
                              <p className="text-sm font-medium text-emerald-900" data-magicpath-id="155" data-magicpath-path="QuizDetailPage.tsx">{q.correctAnswer}</p>
                            </div>}
                        </div>

                        <span className="inline-block mt-2 text-xs font-semibold text-slate-600 bg-white px-2 py-1 rounded" data-magicpath-id="156" data-magicpath-path="QuizDetailPage.tsx">
                          Topic: {q.topic}
                        </span>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50" data-magicpath-id="157" data-magicpath-path="QuizDetailPage.tsx">
              <button onClick={() => setShowAttemptDetails(false)} className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-xl active:scale-95 transition-all" data-magicpath-id="158" data-magicpath-path="QuizDetailPage.tsx">
                Close
              </button>
            </div>
          </div>
        </div>}
    </div>;
};