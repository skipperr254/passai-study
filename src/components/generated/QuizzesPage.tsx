import React, { useState } from 'react';
import { FileQuestion, Play, Clock, Target, TrendingUp, Trophy, Calendar, ChevronRight, Book, CheckCircle2, XCircle, AlertCircle, Zap, Star, Plus, Filter, BarChart3, Brain, X, ChevronDown } from 'lucide-react';
import { QuizDetailPage } from './QuizDetailPage';
type Quiz = {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  questionsCount: number;
  duration: number;
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
type Subject = {
  id: string;
  name: string;
  color: string;
};
type QuizzesPageProps = {
  quizzes?: Quiz[];
  subjects?: Subject[];
  selectedSubjectId?: string;
  onQuizClick?: (quizId: string) => void;
};
const mockSubjects: Subject[] = [{
  id: 'all',
  name: 'All Subjects',
  color: 'from-slate-600 to-slate-700'
}, {
  id: '1',
  name: 'History',
  color: 'from-blue-500 to-blue-600'
}, {
  id: '2',
  name: 'English',
  color: 'from-purple-500 to-purple-600'
}, {
  id: '3',
  name: 'Mathematics',
  color: 'from-green-500 to-green-600'
}, {
  id: '4',
  name: 'Science',
  color: 'from-orange-500 to-orange-600'
}, {
  id: '5',
  name: 'Computer Science',
  color: 'from-indigo-500 to-indigo-600'
}];
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
  const subjects = props.subjects || mockSubjects;
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(subjects.find(s => s.id === props.selectedSubjectId) || subjects[0]);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  // If viewing quiz detail, show that page
  if (selectedQuizId) {
    return <QuizDetailPage quizId={selectedQuizId} onBack={() => setSelectedQuizId(null)} onStartQuiz={() => {
      // Quiz session is now handled within QuizDetailPage
    }} data-magicpath-id="0" data-magicpath-path="QuizzesPage.tsx" />;
  }
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
    const matchesStatus = filterStatus === 'all' || quiz.status === filterStatus;
    const matchesSubject = selectedSubject.id === 'all' || quiz.subject === selectedSubject.name;
    return matchesStatus && matchesSubject;
  });
  const stats = {
    total: filteredQuizzes.length,
    completed: filteredQuizzes.filter(q => q.status === 'completed').length,
    inProgress: filteredQuizzes.filter(q => q.status === 'in-progress').length,
    notStarted: filteredQuizzes.filter(q => q.status === 'not-started').length,
    averageScore: filteredQuizzes.filter(q => q.score).length > 0 ? Math.round(filteredQuizzes.filter(q => q.score).reduce((acc, q) => acc + (q.score || 0), 0) / filteredQuizzes.filter(q => q.score).length) : 0
  };
  return <div className="h-full overflow-y-auto pb-4" data-magicpath-id="1" data-magicpath-path="QuizzesPage.tsx">
      {/* Header Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-200/60" data-magicpath-id="2" data-magicpath-path="QuizzesPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="3" data-magicpath-path="QuizzesPage.tsx">
          <div className="flex items-start justify-between mb-4 lg:mb-6" data-magicpath-id="4" data-magicpath-path="QuizzesPage.tsx">
            <div data-magicpath-id="5" data-magicpath-path="QuizzesPage.tsx">
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2" data-magicpath-id="6" data-magicpath-path="QuizzesPage.tsx">My Quizzes</h1>
              <p className="text-sm lg:text-base text-slate-600" data-magicpath-id="7" data-magicpath-path="QuizzesPage.tsx">Practice and track your performance</p>
            </div>
            <button className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all" data-magicpath-id="8" data-magicpath-path="QuizzesPage.tsx">
              <Plus className="w-5 h-5" data-magicpath-id="9" data-magicpath-path="QuizzesPage.tsx" />
              <span data-magicpath-id="10" data-magicpath-path="QuizzesPage.tsx">Create Quiz</span>
            </button>
          </div>

          {/* Subject Filter - Mobile Horizontal Scroll */}
          <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto hide-scrollbar" data-magicpath-id="11" data-magicpath-path="QuizzesPage.tsx">
            <div className="flex gap-2 pb-1" data-magicpath-id="12" data-magicpath-path="QuizzesPage.tsx">
              {subjects.map(subject => <button key={subject.id} onClick={() => setSelectedSubject(subject)} className={`flex-shrink-0 px-3 py-2 rounded-xl transition-all active:scale-95 ${selectedSubject.id === subject.id ? `bg-gradient-to-r ${subject.color} text-white shadow-md` : 'bg-white border-2 border-slate-200 text-slate-700'}`} data-magicpath-id="13" data-magicpath-path="QuizzesPage.tsx">
                  <div className="flex items-center gap-2" data-magicpath-id="14" data-magicpath-path="QuizzesPage.tsx">
                    <Book className="w-4 h-4" data-magicpath-id="15" data-magicpath-path="QuizzesPage.tsx" />
                    <span className="text-sm font-semibold whitespace-nowrap" data-magicpath-id="16" data-magicpath-path="QuizzesPage.tsx">{subject.name}</span>
                  </div>
                </button>)}
            </div>
          </div>

          {/* Subject Filter - Desktop Dropdown */}
          <div className="hidden lg:block mb-4" data-magicpath-id="17" data-magicpath-path="QuizzesPage.tsx">
            <div className="relative inline-block" data-magicpath-id="18" data-magicpath-path="QuizzesPage.tsx">
              <button onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)} className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all bg-gradient-to-r ${selectedSubject.color} text-white shadow-md hover:shadow-lg`} data-magicpath-id="19" data-magicpath-path="QuizzesPage.tsx">
                <Book className="w-5 h-5" data-magicpath-id="20" data-magicpath-path="QuizzesPage.tsx" />
                <span className="font-semibold" data-magicpath-id="21" data-magicpath-path="QuizzesPage.tsx">{selectedSubject.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isSubjectDropdownOpen ? 'rotate-180' : ''}`} data-magicpath-id="22" data-magicpath-path="QuizzesPage.tsx" />
              </button>

              {isSubjectDropdownOpen && <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border-2 border-slate-200 shadow-xl z-10" data-magicpath-id="23" data-magicpath-path="QuizzesPage.tsx">
                  {subjects.map(subject => <button key={subject.id} onClick={() => {
                setSelectedSubject(subject);
                setIsSubjectDropdownOpen(false);
              }} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${selectedSubject.id === subject.id ? 'bg-blue-50' : ''}`} data-magicpath-id="24" data-magicpath-path="QuizzesPage.tsx">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center`} data-magicpath-id="25" data-magicpath-path="QuizzesPage.tsx">
                        <Book className="w-5 h-5 text-white" data-magicpath-id="26" data-magicpath-path="QuizzesPage.tsx" />
                      </div>
                      <span className="flex-1 text-left font-semibold text-slate-900" data-magicpath-id="27" data-magicpath-path="QuizzesPage.tsx">{subject.name}</span>
                      {selectedSubject.id === subject.id && <CheckCircle2 className="w-5 h-5 text-blue-600" data-magicpath-id="28" data-magicpath-path="QuizzesPage.tsx" />}
                    </button>)}
                </div>}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4" data-magicpath-id="29" data-magicpath-path="QuizzesPage.tsx">
            <button onClick={() => setFilterStatus('all')} className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'all' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`} data-magicpath-id="30" data-magicpath-path="QuizzesPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="31" data-magicpath-path="QuizzesPage.tsx">Total</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900" data-magicpath-id="32" data-magicpath-path="QuizzesPage.tsx">{stats.total}</p>
            </button>
            <button onClick={() => setFilterStatus('completed')} className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'completed' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'}`} data-magicpath-id="33" data-magicpath-path="QuizzesPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="34" data-magicpath-path="QuizzesPage.tsx">Done</p>
              <p className="text-xl lg:text-3xl font-bold text-emerald-600" data-magicpath-id="35" data-magicpath-path="QuizzesPage.tsx">{stats.completed}</p>
            </button>
            <button onClick={() => setFilterStatus('in-progress')} className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'in-progress' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`} data-magicpath-id="36" data-magicpath-path="QuizzesPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="37" data-magicpath-path="QuizzesPage.tsx">Active</p>
              <p className="text-xl lg:text-3xl font-bold text-blue-600" data-magicpath-id="38" data-magicpath-path="QuizzesPage.tsx">{stats.inProgress}</p>
            </button>
            <button onClick={() => setFilterStatus('not-started')} className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'not-started' ? 'border-slate-500 ring-2 ring-slate-100' : 'border-slate-200'}`} data-magicpath-id="39" data-magicpath-path="QuizzesPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="40" data-magicpath-path="QuizzesPage.tsx">Pending</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900" data-magicpath-id="41" data-magicpath-path="QuizzesPage.tsx">{stats.notStarted}</p>
            </button>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 lg:p-4 text-white col-span-2 lg:col-span-1" data-magicpath-id="42" data-magicpath-path="QuizzesPage.tsx">
              <p className="text-xs lg:text-sm font-medium mb-1 text-white/90" data-magicpath-id="43" data-magicpath-path="QuizzesPage.tsx">Avg Score</p>
              <p className="text-xl lg:text-3xl font-bold" data-magicpath-id="44" data-magicpath-path="QuizzesPage.tsx">{stats.averageScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="px-4 py-4 lg:px-8 lg:py-6" data-magicpath-id="45" data-magicpath-path="QuizzesPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="46" data-magicpath-path="QuizzesPage.tsx">
          {filteredQuizzes.length === 0 ? <div className="text-center py-12" data-magicpath-id="47" data-magicpath-path="QuizzesPage.tsx">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4" data-magicpath-id="48" data-magicpath-path="QuizzesPage.tsx">
                <FileQuestion className="w-8 h-8 text-slate-400" data-magicpath-id="49" data-magicpath-path="QuizzesPage.tsx" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2" data-magicpath-id="50" data-magicpath-path="QuizzesPage.tsx">No quizzes found</h3>
              <p className="text-slate-600 mb-4" data-magicpath-id="51" data-magicpath-path="QuizzesPage.tsx">
                {selectedSubject.id !== 'all' ? `No quizzes for ${selectedSubject.name}` : 'Try adjusting your filters'}
              </p>
              <button onClick={() => {
            setFilterStatus('all');
            setSelectedSubject(subjects[0]);
          }} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors" data-magicpath-id="52" data-magicpath-path="QuizzesPage.tsx">
                Clear Filters
              </button>
            </div> : <div className="space-y-3 lg:space-y-4" data-magicpath-id="53" data-magicpath-path="QuizzesPage.tsx">
              {filteredQuizzes.map(quiz => {
            const StatusIcon = getStatusIcon(quiz.status);
            return <div key={quiz.id} onClick={() => setSelectedQuizId(quiz.id)} className="bg-white rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-slate-300 p-4 lg:p-5 transition-all hover:shadow-lg cursor-pointer active:scale-[0.98] group" data-magicpath-id="54" data-magicpath-path="QuizzesPage.tsx">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4" data-magicpath-id="55" data-magicpath-path="QuizzesPage.tsx">
                      {/* Quiz Icon & Subject */}
                      <div className="flex items-start gap-3 flex-1" data-magicpath-id="56" data-magicpath-path="QuizzesPage.tsx">
                        <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${quiz.subjectColor} flex items-center justify-center shadow-md flex-shrink-0`} data-magicpath-id="57" data-magicpath-path="QuizzesPage.tsx">
                          <FileQuestion className="w-6 h-6 lg:w-7 lg:h-7 text-white" data-magicpath-id="58" data-magicpath-path="QuizzesPage.tsx" />
                        </div>
                        <div className="flex-1 min-w-0" data-magicpath-id="59" data-magicpath-path="QuizzesPage.tsx">
                          <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors" data-magicpath-id="60" data-magicpath-path="QuizzesPage.tsx">
                            {quiz.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap" data-magicpath-id="61" data-magicpath-path="QuizzesPage.tsx">
                            <span className="text-xs lg:text-sm text-slate-600 font-medium" data-magicpath-id="62" data-magicpath-path="QuizzesPage.tsx">{quiz.subject}</span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full" data-magicpath-id="63" data-magicpath-path="QuizzesPage.tsx"></span>
                            <span className="text-xs lg:text-sm text-slate-600" data-magicpath-id="64" data-magicpath-path="QuizzesPage.tsx">{quiz.questionsCount} questions</span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full" data-magicpath-id="65" data-magicpath-path="QuizzesPage.tsx"></span>
                            <span className="text-xs lg:text-sm text-slate-600" data-magicpath-id="66" data-magicpath-path="QuizzesPage.tsx">{quiz.duration} min</span>
                          </div>
                        </div>
                      </div>

                      {/* Quiz Stats - Mobile */}
                      <div className="flex items-center gap-2 lg:hidden" data-magicpath-id="67" data-magicpath-path="QuizzesPage.tsx">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(quiz.difficulty)}`} data-magicpath-id="68" data-magicpath-path="QuizzesPage.tsx">
                          {quiz.difficulty}
                        </span>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${getStatusColor(quiz.status)}`} data-magicpath-id="69" data-magicpath-path="QuizzesPage.tsx">
                          <StatusIcon className="w-3.5 h-3.5" data-magicpath-id="70" data-magicpath-path="QuizzesPage.tsx" />
                          <span className="text-xs font-semibold capitalize" data-magicpath-id="71" data-magicpath-path="QuizzesPage.tsx">{quiz.status.replace('-', ' ')}</span>
                        </div>
                      </div>

                      {/* Quiz Stats - Desktop */}
                      <div className="hidden lg:flex items-center gap-3" data-magicpath-id="72" data-magicpath-path="QuizzesPage.tsx">
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${getDifficultyColor(quiz.difficulty)}`} data-magicpath-id="73" data-magicpath-path="QuizzesPage.tsx">
                          {quiz.difficulty}
                        </span>
                        
                        {quiz.status === 'completed' && quiz.score !== undefined && <div className={`flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200`} data-magicpath-id="74" data-magicpath-path="QuizzesPage.tsx">
                            <Trophy className="w-4 h-4 text-slate-600" data-magicpath-id="75" data-magicpath-path="QuizzesPage.tsx" />
                            <span className={`text-sm font-bold ${getScoreColor(quiz.score)}`} data-magicpath-id="76" data-magicpath-path="QuizzesPage.tsx">{quiz.score}%</span>
                          </div>}

                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getStatusColor(quiz.status)}`} data-magicpath-id="77" data-magicpath-path="QuizzesPage.tsx">
                          <StatusIcon className="w-4 h-4" data-magicpath-id="78" data-magicpath-path="QuizzesPage.tsx" />
                          <span className="text-sm font-semibold capitalize" data-magicpath-id="79" data-magicpath-path="QuizzesPage.tsx">{quiz.status.replace('-', ' ')}</span>
                        </div>

                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" data-magicpath-id="80" data-magicpath-path="QuizzesPage.tsx" />
                      </div>
                    </div>

                    {/* Mobile Score Display */}
                    {quiz.status === 'completed' && quiz.score !== undefined && <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 flex items-center justify-between" data-magicpath-id="81" data-magicpath-path="QuizzesPage.tsx">
                        <span className="text-xs text-slate-600 font-medium" data-magicpath-id="82" data-magicpath-path="QuizzesPage.tsx">Score:</span>
                        <span className={`text-lg font-bold ${getScoreColor(quiz.score)}`} data-magicpath-id="83" data-magicpath-path="QuizzesPage.tsx">{quiz.score}%</span>
                      </div>}

                    {/* Due Date Badge */}
                    {quiz.dueDate && quiz.status !== 'completed' && <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-amber-600" data-magicpath-id="84" data-magicpath-path="QuizzesPage.tsx">
                        <Calendar className="w-3.5 h-3.5" data-magicpath-id="85" data-magicpath-path="QuizzesPage.tsx" />
                        <span className="font-semibold" data-magicpath-id="86" data-magicpath-path="QuizzesPage.tsx">Due {quiz.dueDate}</span>
                      </div>}
                  </div>;
          })}
            </div>}
        </div>
      </div>

      {/* Mobile FAB */}
      <button className="lg:hidden fixed bottom-20 right-4 z-30 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl active:scale-95 transition-all" data-magicpath-id="87" data-magicpath-path="QuizzesPage.tsx">
        <Plus className="w-6 h-6" data-magicpath-id="88" data-magicpath-path="QuizzesPage.tsx" />
      </button>

      <style data-magicpath-id="89" data-magicpath-path="QuizzesPage.tsx">{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>;
};