import React, { useState } from 'react';
import { FileQuestion, Play, Clock, Target, TrendingUp, Trophy, Calendar, ChevronRight, Book, CheckCircle2, XCircle, AlertCircle, Zap, Star, Plus, Filter, BarChart3, Brain, X } from 'lucide-react';
type Quiz = {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  questionsCount: number;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'completed' | 'in-progress' | 'not-started';
  score?: number;
  completedDate?: string;
  dueDate?: string;
  attempts: number;
  bestScore?: number;
  averageScore?: number;
  topicsCount: number;
};
type QuizzesPageProps = {
  quizzes?: Quiz[];
  onQuizClick?: (quizId: string) => void;
};
const mockQuizzes: Quiz[] = [{
  id: '1',
  title: 'World War II Analysis',
  subject: 'History',
  subjectColor: 'from-blue-500 to-blue-600',
  questionsCount: 25,
  duration: 30,
  difficulty: 'medium',
  status: 'completed',
  score: 88,
  completedDate: '2 hours ago',
  attempts: 2,
  bestScore: 88,
  averageScore: 85,
  topicsCount: 5
}, {
  id: '2',
  title: 'Calculus Derivatives',
  subject: 'Mathematics',
  subjectColor: 'from-green-500 to-green-600',
  questionsCount: 20,
  duration: 45,
  difficulty: 'hard',
  status: 'in-progress',
  score: 65,
  attempts: 1,
  topicsCount: 8
}, {
  id: '3',
  title: 'Poetry Analysis Fundamentals',
  subject: 'English',
  subjectColor: 'from-purple-500 to-purple-600',
  questionsCount: 15,
  duration: 20,
  difficulty: 'easy',
  status: 'not-started',
  dueDate: 'Tomorrow',
  attempts: 0,
  topicsCount: 3
}, {
  id: '4',
  title: 'Chemical Reactions & Equations',
  subject: 'Science',
  subjectColor: 'from-orange-500 to-orange-600',
  questionsCount: 30,
  duration: 40,
  difficulty: 'medium',
  status: 'completed',
  score: 72,
  completedDate: '1 day ago',
  attempts: 3,
  bestScore: 78,
  averageScore: 70,
  topicsCount: 6
}, {
  id: '5',
  title: 'Algebra Fundamentals Review',
  subject: 'Mathematics',
  subjectColor: 'from-green-500 to-green-600',
  questionsCount: 18,
  duration: 25,
  difficulty: 'easy',
  status: 'completed',
  score: 95,
  completedDate: '3 days ago',
  attempts: 1,
  bestScore: 95,
  averageScore: 95,
  topicsCount: 4
}, {
  id: '6',
  title: 'Advanced Algorithms',
  subject: 'Computer Science',
  subjectColor: 'from-indigo-500 to-indigo-600',
  questionsCount: 35,
  duration: 60,
  difficulty: 'hard',
  status: 'not-started',
  dueDate: 'Next Monday',
  attempts: 0,
  topicsCount: 10
}];
export const QuizzesPage = (props: QuizzesPageProps) => {
  const quizzes = props.quizzes || mockQuizzes;
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'not-started':
        return 'text-slate-600 bg-slate-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle2;
      case 'in-progress':
        return Clock;
      case 'not-started':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };
  const filteredQuizzes = quizzes.filter(quiz => {
    if (filterStatus === 'all') return true;
    return quiz.status === filterStatus;
  });
  const stats = {
    total: quizzes.length,
    completed: quizzes.filter(q => q.status === 'completed').length,
    inProgress: quizzes.filter(q => q.status === 'in-progress').length,
    notStarted: quizzes.filter(q => q.status === 'not-started').length,
    averageScore: Math.round(quizzes.filter(q => q.score).reduce((acc, q) => acc + (q.score || 0), 0) / quizzes.filter(q => q.score).length)
  };
  return <div className="h-full overflow-y-auto pb-4" data-magicpath-id="0" data-magicpath-path="QuizzesPage.tsx">
      {/* Header Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-200/60" data-magicpath-id="1" data-magicpath-path="QuizzesPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="2" data-magicpath-path="QuizzesPage.tsx">
          <div className="flex items-start justify-between mb-4 lg:mb-6" data-magicpath-id="3" data-magicpath-path="QuizzesPage.tsx">
            <div data-magicpath-id="4" data-magicpath-path="QuizzesPage.tsx">
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2" data-magicpath-id="5" data-magicpath-path="QuizzesPage.tsx">My Quizzes</h1>
              <p className="text-sm lg:text-base text-slate-600" data-magicpath-id="6" data-magicpath-path="QuizzesPage.tsx">Practice and track your performance</p>
            </div>
            <button className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all" data-magicpath-id="7" data-magicpath-path="QuizzesPage.tsx">
              <Plus className="w-5 h-5" data-magicpath-id="8" data-magicpath-path="QuizzesPage.tsx" />
              <span data-magicpath-id="9" data-magicpath-path="QuizzesPage.tsx">Create Quiz</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4 mb-4" data-magicpath-id="10" data-magicpath-path="QuizzesPage.tsx">
            <button onClick={() => setFilterStatus('all')} className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'all' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`} data-magicpath-id="11" data-magicpath-path="QuizzesPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="12" data-magicpath-path="QuizzesPage.tsx">Total</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900" data-magicpath-id="13" data-magicpath-path="QuizzesPage.tsx">{stats.total}</p>
            </button>
            <button onClick={() => setFilterStatus('completed')} className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'completed' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'}`} data-magicpath-id="14" data-magicpath-path="QuizzesPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="15" data-magicpath-path="QuizzesPage.tsx">Done</p>
              <p className="text-xl lg:text-3xl font-bold text-emerald-600" data-magicpath-id="16" data-magicpath-path="QuizzesPage.tsx">{stats.completed}</p>
            </button>
            <button onClick={() => setFilterStatus('in-progress')} className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'in-progress' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`} data-magicpath-id="17" data-magicpath-path="QuizzesPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="18" data-magicpath-path="QuizzesPage.tsx">Active</p>
              <p className="text-xl lg:text-3xl font-bold text-blue-600" data-magicpath-id="19" data-magicpath-path="QuizzesPage.tsx">{stats.inProgress}</p>
            </button>
            <button onClick={() => setFilterStatus('not-started')} className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'not-started' ? 'border-slate-500 ring-2 ring-slate-100' : 'border-slate-200'}`} data-magicpath-id="20" data-magicpath-path="QuizzesPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="21" data-magicpath-path="QuizzesPage.tsx">Pending</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900" data-magicpath-id="22" data-magicpath-path="QuizzesPage.tsx">{stats.notStarted}</p>
            </button>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 lg:p-4 text-white col-span-2 lg:col-span-1" data-magicpath-id="23" data-magicpath-path="QuizzesPage.tsx">
              <p className="text-xs lg:text-sm font-medium mb-1 text-white/90" data-magicpath-id="24" data-magicpath-path="QuizzesPage.tsx">Avg Score</p>
              <p className="text-xl lg:text-3xl font-bold" data-magicpath-id="25" data-magicpath-path="QuizzesPage.tsx">{stats.averageScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="px-4 py-4 lg:px-8 lg:py-6" data-magicpath-id="26" data-magicpath-path="QuizzesPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="27" data-magicpath-path="QuizzesPage.tsx">
          {filteredQuizzes.length === 0 ? <div className="text-center py-12" data-magicpath-id="28" data-magicpath-path="QuizzesPage.tsx">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4" data-magicpath-id="29" data-magicpath-path="QuizzesPage.tsx">
                <FileQuestion className="w-8 h-8 text-slate-400" data-magicpath-id="30" data-magicpath-path="QuizzesPage.tsx" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2" data-magicpath-id="31" data-magicpath-path="QuizzesPage.tsx">No quizzes found</h3>
              <p className="text-slate-600 mb-4" data-magicpath-id="32" data-magicpath-path="QuizzesPage.tsx">Try adjusting your filters</p>
              <button className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors" data-magicpath-id="33" data-magicpath-path="QuizzesPage.tsx">
                Clear Filters
              </button>
            </div> : <div className="space-y-3 lg:space-y-4" data-magicpath-id="34" data-magicpath-path="QuizzesPage.tsx">
              {filteredQuizzes.map(quiz => {
            const StatusIcon = getStatusIcon(quiz.status);
            return <div key={quiz.id} onClick={() => setSelectedQuiz(quiz)} className="bg-white rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-slate-300 p-4 lg:p-5 transition-all hover:shadow-lg cursor-pointer active:scale-[0.98] group" data-magicpath-id="35" data-magicpath-path="QuizzesPage.tsx">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4" data-magicpath-id="36" data-magicpath-path="QuizzesPage.tsx">
                      {/* Quiz Icon & Subject */}
                      <div className="flex items-start gap-3 flex-1" data-magicpath-id="37" data-magicpath-path="QuizzesPage.tsx">
                        <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${quiz.subjectColor} flex items-center justify-center shadow-md flex-shrink-0`} data-magicpath-id="38" data-magicpath-path="QuizzesPage.tsx">
                          <FileQuestion className="w-6 h-6 lg:w-7 lg:h-7 text-white" data-magicpath-id="39" data-magicpath-path="QuizzesPage.tsx" />
                        </div>
                        <div className="flex-1 min-w-0" data-magicpath-id="40" data-magicpath-path="QuizzesPage.tsx">
                          <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors" data-magicpath-id="41" data-magicpath-path="QuizzesPage.tsx">
                            {quiz.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap" data-magicpath-id="42" data-magicpath-path="QuizzesPage.tsx">
                            <span className="text-xs lg:text-sm text-slate-600 font-medium" data-magicpath-id="43" data-magicpath-path="QuizzesPage.tsx">{quiz.subject}</span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full" data-magicpath-id="44" data-magicpath-path="QuizzesPage.tsx"></span>
                            <span className="text-xs lg:text-sm text-slate-600" data-magicpath-id="45" data-magicpath-path="QuizzesPage.tsx">{quiz.questionsCount} questions</span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full" data-magicpath-id="46" data-magicpath-path="QuizzesPage.tsx"></span>
                            <span className="text-xs lg:text-sm text-slate-600" data-magicpath-id="47" data-magicpath-path="QuizzesPage.tsx">{quiz.duration} min</span>
                          </div>
                        </div>
                      </div>

                      {/* Quiz Stats - Mobile */}
                      <div className="flex items-center gap-2 lg:hidden" data-magicpath-id="48" data-magicpath-path="QuizzesPage.tsx">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(quiz.difficulty)}`} data-magicpath-id="49" data-magicpath-path="QuizzesPage.tsx">
                          {quiz.difficulty}
                        </span>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${getStatusColor(quiz.status)}`} data-magicpath-id="50" data-magicpath-path="QuizzesPage.tsx">
                          <StatusIcon className="w-3.5 h-3.5" data-magicpath-id="51" data-magicpath-path="QuizzesPage.tsx" />
                          <span className="text-xs font-semibold capitalize" data-magicpath-id="52" data-magicpath-path="QuizzesPage.tsx">{quiz.status.replace('-', ' ')}</span>
                        </div>
                      </div>

                      {/* Quiz Stats - Desktop */}
                      <div className="hidden lg:flex items-center gap-3" data-magicpath-id="53" data-magicpath-path="QuizzesPage.tsx">
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${getDifficultyColor(quiz.difficulty)}`} data-magicpath-id="54" data-magicpath-path="QuizzesPage.tsx">
                          {quiz.difficulty}
                        </span>
                        
                        {quiz.status === 'completed' && quiz.score !== undefined && <div className={`flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200`} data-magicpath-id="55" data-magicpath-path="QuizzesPage.tsx">
                            <Trophy className="w-4 h-4 text-slate-600" data-magicpath-id="56" data-magicpath-path="QuizzesPage.tsx" />
                            <span className={`text-sm font-bold ${getScoreColor(quiz.score)}`} data-magicpath-id="57" data-magicpath-path="QuizzesPage.tsx">{quiz.score}%</span>
                          </div>}

                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getStatusColor(quiz.status)}`} data-magicpath-id="58" data-magicpath-path="QuizzesPage.tsx">
                          <StatusIcon className="w-4 h-4" data-magicpath-id="59" data-magicpath-path="QuizzesPage.tsx" />
                          <span className="text-sm font-semibold capitalize" data-magicpath-id="60" data-magicpath-path="QuizzesPage.tsx">{quiz.status.replace('-', ' ')}</span>
                        </div>

                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" data-magicpath-id="61" data-magicpath-path="QuizzesPage.tsx" />
                      </div>
                    </div>

                    {/* Mobile Score Display */}
                    {quiz.status === 'completed' && quiz.score !== undefined && <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 flex items-center justify-between" data-magicpath-id="62" data-magicpath-path="QuizzesPage.tsx">
                        <span className="text-xs text-slate-600 font-medium" data-magicpath-id="63" data-magicpath-path="QuizzesPage.tsx">Score:</span>
                        <span className={`text-lg font-bold ${getScoreColor(quiz.score)}`} data-magicpath-id="64" data-magicpath-path="QuizzesPage.tsx">{quiz.score}%</span>
                      </div>}

                    {/* Due Date Badge */}
                    {quiz.dueDate && quiz.status !== 'completed' && <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-amber-600" data-magicpath-id="65" data-magicpath-path="QuizzesPage.tsx">
                        <Calendar className="w-3.5 h-3.5" data-magicpath-id="66" data-magicpath-path="QuizzesPage.tsx" />
                        <span className="font-semibold" data-magicpath-id="67" data-magicpath-path="QuizzesPage.tsx">Due {quiz.dueDate}</span>
                      </div>}
                  </div>;
          })}
            </div>}
        </div>
      </div>

      {/* Quiz Detail Modal */}
      {selectedQuiz && <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedQuiz(null)} data-magicpath-id="68" data-magicpath-path="QuizzesPage.tsx">
          <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()} data-magicpath-id="69" data-magicpath-path="QuizzesPage.tsx">
            {/* Modal Header */}
            <div className={`flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-gradient-to-br ${selectedQuiz.subjectColor}`} data-magicpath-id="70" data-magicpath-path="QuizzesPage.tsx">
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden" data-magicpath-id="71" data-magicpath-path="QuizzesPage.tsx"></div>
              <div className="flex items-start gap-4" data-magicpath-id="72" data-magicpath-path="QuizzesPage.tsx">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0" data-magicpath-id="73" data-magicpath-path="QuizzesPage.tsx">
                  <FileQuestion className="w-7 h-7 text-white" data-magicpath-id="74" data-magicpath-path="QuizzesPage.tsx" />
                </div>
                <div className="flex-1 min-w-0" data-magicpath-id="75" data-magicpath-path="QuizzesPage.tsx">
                  <h2 className="text-xl lg:text-2xl font-bold text-white mb-1" data-magicpath-id="76" data-magicpath-path="QuizzesPage.tsx">{selectedQuiz.title}</h2>
                  <p className="text-white/90 text-sm" data-magicpath-id="77" data-magicpath-path="QuizzesPage.tsx">{selectedQuiz.subject} • {selectedQuiz.questionsCount} questions</p>
                </div>
                <button onClick={() => setSelectedQuiz(null)} className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all flex-shrink-0" aria-label="Close modal" data-magicpath-id="78" data-magicpath-path="QuizzesPage.tsx">
                  <X className="w-5 h-5 text-white" data-magicpath-id="79" data-magicpath-path="QuizzesPage.tsx" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6" data-magicpath-id="80" data-magicpath-path="QuizzesPage.tsx">
              {/* Quiz Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6" data-magicpath-id="81" data-magicpath-path="QuizzesPage.tsx">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl" data-magicpath-id="82" data-magicpath-path="QuizzesPage.tsx">
                  <div className="flex items-center gap-2 mb-2" data-magicpath-id="83" data-magicpath-path="QuizzesPage.tsx">
                    <Clock className="w-4 h-4 text-slate-600" data-magicpath-id="84" data-magicpath-path="QuizzesPage.tsx" />
                    <span className="text-xs font-semibold text-slate-600" data-magicpath-id="85" data-magicpath-path="QuizzesPage.tsx">Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900" data-magicpath-id="86" data-magicpath-path="QuizzesPage.tsx">{selectedQuiz.duration} min</p>
                </div>
                <div className={`p-4 rounded-xl border ${getDifficultyColor(selectedQuiz.difficulty)}`} data-magicpath-id="87" data-magicpath-path="QuizzesPage.tsx">
                  <div className="flex items-center gap-2 mb-2" data-magicpath-id="88" data-magicpath-path="QuizzesPage.tsx">
                    <Zap className="w-4 h-4" data-magicpath-id="89" data-magicpath-path="QuizzesPage.tsx" />
                    <span className="text-xs font-semibold" data-magicpath-id="90" data-magicpath-path="QuizzesPage.tsx">Difficulty</span>
                  </div>
                  <p className="text-2xl font-bold capitalize" data-magicpath-id="91" data-magicpath-path="QuizzesPage.tsx">{selectedQuiz.difficulty}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl" data-magicpath-id="92" data-magicpath-path="QuizzesPage.tsx">
                  <div className="flex items-center gap-2 mb-2" data-magicpath-id="93" data-magicpath-path="QuizzesPage.tsx">
                    <Brain className="w-4 h-4 text-slate-600" data-magicpath-id="94" data-magicpath-path="QuizzesPage.tsx" />
                    <span className="text-xs font-semibold text-slate-600" data-magicpath-id="95" data-magicpath-path="QuizzesPage.tsx">Topics</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900" data-magicpath-id="96" data-magicpath-path="QuizzesPage.tsx">{selectedQuiz.topicsCount}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl" data-magicpath-id="97" data-magicpath-path="QuizzesPage.tsx">
                  <div className="flex items-center gap-2 mb-2" data-magicpath-id="98" data-magicpath-path="QuizzesPage.tsx">
                    <BarChart3 className="w-4 h-4 text-slate-600" data-magicpath-id="99" data-magicpath-path="QuizzesPage.tsx" />
                    <span className="text-xs font-semibold text-slate-600" data-magicpath-id="100" data-magicpath-path="QuizzesPage.tsx">Attempts</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900" data-magicpath-id="101" data-magicpath-path="QuizzesPage.tsx">{selectedQuiz.attempts}</p>
                </div>
              </div>

              {/* Performance Stats (if completed) */}
              {selectedQuiz.status === 'completed' && selectedQuiz.score !== undefined && <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl" data-magicpath-id="102" data-magicpath-path="QuizzesPage.tsx">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2" data-magicpath-id="103" data-magicpath-path="QuizzesPage.tsx">
                    <Trophy className="w-5 h-5 text-blue-600" data-magicpath-id="104" data-magicpath-path="QuizzesPage.tsx" />
                    Performance Summary
                  </h3>
                  <div className="grid grid-cols-3 gap-3" data-magicpath-id="105" data-magicpath-path="QuizzesPage.tsx">
                    <div className="text-center" data-magicpath-id="106" data-magicpath-path="QuizzesPage.tsx">
                      <p className={`text-3xl font-bold mb-1 ${getScoreColor(selectedQuiz.score)}`} data-magicpath-id="107" data-magicpath-path="QuizzesPage.tsx">{selectedQuiz.score}%</p>
                      <p className="text-xs text-slate-600 font-medium" data-magicpath-id="108" data-magicpath-path="QuizzesPage.tsx">Last Score</p>
                    </div>
                    {selectedQuiz.bestScore !== undefined && <div className="text-center" data-magicpath-id="109" data-magicpath-path="QuizzesPage.tsx">
                        <p className="text-3xl font-bold text-emerald-600 mb-1" data-magicpath-id="110" data-magicpath-path="QuizzesPage.tsx">{selectedQuiz.bestScore}%</p>
                        <p className="text-xs text-slate-600 font-medium" data-magicpath-id="111" data-magicpath-path="QuizzesPage.tsx">Best Score</p>
                      </div>}
                    {selectedQuiz.averageScore !== undefined && <div className="text-center" data-magicpath-id="112" data-magicpath-path="QuizzesPage.tsx">
                        <p className="text-3xl font-bold text-blue-600 mb-1" data-magicpath-id="113" data-magicpath-path="QuizzesPage.tsx">{selectedQuiz.averageScore}%</p>
                        <p className="text-xs text-slate-600 font-medium" data-magicpath-id="114" data-magicpath-path="QuizzesPage.tsx">Average</p>
                      </div>}
                  </div>
                </div>}

              {/* Due Date Warning */}
              {selectedQuiz.dueDate && selectedQuiz.status !== 'completed' && <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl" data-magicpath-id="115" data-magicpath-path="QuizzesPage.tsx">
                  <div className="flex items-center gap-3" data-magicpath-id="116" data-magicpath-path="QuizzesPage.tsx">
                    <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center" data-magicpath-id="117" data-magicpath-path="QuizzesPage.tsx">
                      <Calendar className="w-5 h-5 text-white" data-magicpath-id="118" data-magicpath-path="QuizzesPage.tsx" />
                    </div>
                    <div className="flex-1" data-magicpath-id="119" data-magicpath-path="QuizzesPage.tsx">
                      <p className="text-xs font-semibold text-amber-900" data-magicpath-id="120" data-magicpath-path="QuizzesPage.tsx">DUE DATE</p>
                      <p className="text-sm font-bold text-slate-900" data-magicpath-id="121" data-magicpath-path="QuizzesPage.tsx">{selectedQuiz.dueDate}</p>
                    </div>
                  </div>
                </div>}

              {/* Action Button */}
              <button className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all ${selectedQuiz.status === 'completed' ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' : selectedQuiz.status === 'in-progress' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-gradient-to-r from-slate-700 to-slate-900 text-white'}`} data-magicpath-id="122" data-magicpath-path="QuizzesPage.tsx">
                <Play className="w-5 h-5" data-magicpath-id="123" data-magicpath-path="QuizzesPage.tsx" />
                <span data-magicpath-id="124" data-magicpath-path="QuizzesPage.tsx">
                  {selectedQuiz.status === 'completed' ? 'Retake Quiz' : selectedQuiz.status === 'in-progress' ? 'Continue Quiz' : 'Start Quiz'}
                </span>
              </button>
            </div>
          </div>
        </div>}

      {/* Mobile FAB */}
      <button className="lg:hidden fixed bottom-20 right-4 z-30 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl active:scale-95 transition-all" data-magicpath-id="125" data-magicpath-path="QuizzesPage.tsx">
        <Plus className="w-6 h-6" data-magicpath-id="126" data-magicpath-path="QuizzesPage.tsx" />
      </button>
    </div>;
};