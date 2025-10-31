import React, { useState } from 'react';
import { Book, TrendingUp, Calendar, ChevronRight, Settings, Bell, LayoutDashboard, Upload, FileQuestion, Menu, X, Target, Award, Activity, Home, GraduationCap } from 'lucide-react';
type Subject = {
  id: string;
  name: string;
  color: string;
  progress: number;
  passingChance: number;
  quizzesTaken: number;
  averageScore: number;
  lastStudied: string;
  upcomingQuiz?: string;
};
type QuizResult = {
  quizNumber: number;
  score: number;
};
type StudyDashboardProps = {
  userName?: string;
  subjects?: Subject[];
};
type NavigationItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
};
const mockSubjects: Subject[] = [{
  id: '1',
  name: 'History',
  color: 'from-blue-500 to-blue-600',
  progress: 85,
  passingChance: 92,
  quizzesTaken: 8,
  averageScore: 85,
  lastStudied: '2 hours ago',
  upcomingQuiz: 'Tomorrow at 2:00 PM'
}, {
  id: '2',
  name: 'English',
  color: 'from-purple-500 to-purple-600',
  progress: 72,
  passingChance: 78,
  quizzesTaken: 6,
  averageScore: 72,
  lastStudied: '1 day ago'
}, {
  id: '3',
  name: 'Mathematics',
  color: 'from-green-500 to-green-600',
  progress: 91,
  passingChance: 96,
  quizzesTaken: 12,
  averageScore: 91,
  lastStudied: '3 hours ago',
  upcomingQuiz: 'Friday at 10:00 AM'
}, {
  id: '4',
  name: 'Science',
  color: 'from-orange-500 to-orange-600',
  progress: 65,
  passingChance: 68,
  quizzesTaken: 5,
  averageScore: 65,
  lastStudied: '2 days ago'
}];
const mockQuizData: QuizResult[] = [{
  quizNumber: 1,
  score: 65
}, {
  quizNumber: 2,
  score: 70
}, {
  quizNumber: 3,
  score: 78
}, {
  quizNumber: 4,
  score: 72
}, {
  quizNumber: 5,
  score: 68
}, {
  quizNumber: 6,
  score: 85
}, {
  quizNumber: 7,
  score: 82
}, {
  quizNumber: 8,
  score: 88
}];
const navigationItems: NavigationItem[] = [{
  id: 'dashboard',
  label: 'Dashboard',
  icon: LayoutDashboard,
  path: '/'
}, {
  id: 'study-plan',
  label: 'Study Plan',
  icon: GraduationCap,
  path: '/study-plan'
}, {
  id: 'subjects',
  label: 'Subjects',
  icon: Book,
  path: '/subjects'
}, {
  id: 'upload',
  label: 'Upload',
  icon: Upload,
  path: '/upload'
}, {
  id: 'quizzes',
  label: 'Quizzes',
  icon: FileQuestion,
  path: '/quizzes',
  badge: 3
}];
export const StudyDashboard = (props: StudyDashboardProps) => {
  const userName = props.userName || 'Jake';
  const subjects = props.subjects || mockSubjects;
  const [selectedSubject, setSelectedSubject] = useState<Subject>(subjects[0]);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const quizData = mockQuizData;
  const maxScore = Math.max(...quizData.map(d => d.score));
  const currentScore = quizData[quizData.length - 1]?.score || 0;
  const daysLeft = 6;
  const materialsCount = subjects.reduce((acc, s) => acc + (s.quizzesTaken > 0 ? 1 : 0), 0);
  const getPassingChanceColor = (chance: number) => {
    if (chance >= 90) return 'text-emerald-600 bg-emerald-50';
    if (chance >= 75) return 'text-green-600 bg-green-50';
    if (chance >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };
  const getPassingChanceBadge = (chance: number) => {
    if (chance >= 90) return 'Excellent';
    if (chance >= 75) return 'Good';
    if (chance >= 60) return 'Fair';
    return 'Needs Work';
  };
  const getPassingChanceGradient = (chance: number) => {
    if (chance >= 90) return 'from-emerald-500 to-green-600';
    if (chance >= 75) return 'from-green-500 to-emerald-600';
    if (chance >= 60) return 'from-amber-500 to-yellow-600';
    return 'from-red-500 to-orange-600';
  };
  const getPassingChanceBg = (chance: number) => {
    if (chance >= 90) return 'from-emerald-50 to-green-50 border-emerald-200';
    if (chance >= 75) return 'from-green-50 to-emerald-50 border-green-200';
    if (chance >= 60) return 'from-amber-50 to-yellow-50 border-amber-200';
    return 'from-red-50 to-orange-50 border-red-200';
  };
  const getPassingChanceBadgeBg = (chance: number) => {
    if (chance >= 90) return 'bg-emerald-600';
    if (chance >= 75) return 'bg-green-600';
    if (chance >= 60) return 'bg-amber-600';
    return 'bg-red-600';
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Mobile App Layout */}
      <div className="flex flex-col h-screen lg:flex-row">
        
        {/* Desktop Sidebar - Unchanged */}
        <aside className="hidden lg:flex w-80 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex-col shadow-sm">
          <div className="p-6 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Book className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">PassAI</h1>
                <p className="text-sm text-slate-500 font-medium">Intelligent Study</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4" aria-label="Main navigation">
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">Navigation</h3>
              <ul className="space-y-1">
                {navigationItems.map(item => {
                const Icon = item.icon;
                return <li key={item.id}>
                      <button onClick={() => setActiveNav(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeNav === item.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`} aria-current={activeNav === item.id ? 'page' : undefined}>
                        <Icon className="w-5 h-5" />
                        <span className="flex-1 text-left font-semibold text-sm">{item.label}</span>
                        {item.badge && <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeNav === item.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                            {item.badge}
                          </span>}
                      </button>
                    </li>;
              })}
              </ul>
            </div>
          </nav>

          <div className="p-4 border-t border-slate-200/60 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-all">
              <Bell className="w-5 h-5" />
              <span className="text-sm font-semibold">Notifications</span>
              <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-all">
              <Settings className="w-5 h-5" />
              <span className="text-sm font-semibold">Settings</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header - Simplified & Modern */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm safe-top">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
                  <Book className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-900">PassAI</h1>
                  <p className="text-xs text-slate-500 font-medium">Hi, {userName}!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center transition-all relative">
                  <Bell className="w-4 h-4 text-slate-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Subject Selection Modal - Enhanced for Mobile */}
        {isSubjectModalOpen && <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsSubjectModalOpen(false)}>
            <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[85vh] md:max-h-[70vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <div className="flex-shrink-0 px-6 pt-4 pb-3 border-b border-slate-200">
                <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 md:hidden"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">Select Subject</h2>
                    <p className="text-sm text-slate-600 mt-1">Choose a subject to view details</p>
                  </div>
                  <button onClick={() => setIsSubjectModalOpen(false)} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center transition-all" aria-label="Close modal">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
                <div className="space-y-2 md:space-y-3">
                  {subjects.map(subject => <button key={subject.id} onClick={() => {
                setSelectedSubject(subject);
                setIsSubjectModalOpen(false);
              }} className={`w-full bg-white rounded-xl border-2 p-3 md:p-4 text-left transition-all active:scale-[0.98] ${selectedSubject.id === subject.id ? 'border-blue-500 shadow-md ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-sm`}>
                          <Book className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-slate-900 truncate mb-1">{subject.name}</h4>
                          <p className="text-xs text-slate-600">{subject.quizzesTaken} quizzes • {subject.lastStudied}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${subject.color} rounded-full transition-all duration-500`} style={{
                          width: `${subject.progress}%`
                        }}></div>
                            </div>
                            <span className="text-xs font-bold text-slate-700">{subject.progress}%</span>
                          </div>
                        </div>
                        <div className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${getPassingChanceColor(subject.passingChance)} flex-shrink-0`}>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            <span>{subject.passingChance}%</span>
                          </div>
                        </div>
                      </div>
                    </button>)}
                </div>
              </div>
            </div>
          </div>}

        {/* Main Content - Mobile Optimized */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 pt-16 lg:pt-0">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
            
            {/* Mobile Subject Switcher - Horizontal Scroll */}
            <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto hide-scrollbar">
              <div className="flex gap-2 pb-1">
                {subjects.map(subject => <button key={subject.id} onClick={() => setSelectedSubject(subject)} className={`flex-shrink-0 px-3 py-2 rounded-xl transition-all active:scale-95 ${selectedSubject.id === subject.id ? `bg-gradient-to-r ${subject.color} text-white shadow-md` : 'bg-white border-2 border-slate-200 text-slate-700'}`}>
                    <div className="flex items-center gap-2">
                      <Book className="w-4 h-4" />
                      <span className="text-sm font-semibold whitespace-nowrap">{subject.name}</span>
                      {selectedSubject.id === subject.id && <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                          {subject.passingChance}%
                        </span>}
                    </div>
                  </button>)}
              </div>
            </div>

            {/* Desktop Header - Tablet & Up */}
            <header className="hidden lg:block mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-slate-900 mb-2">{selectedSubject.name}</h2>
                  <p className="text-slate-600">Track your progress and master your subject</p>
                </div>
                
                <button onClick={() => setIsSubjectModalOpen(true)} className="group bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-400 rounded-xl transition-all shadow-sm hover:shadow-md px-4 py-3 flex items-center gap-3 min-w-[280px]">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedSubject.color} flex items-center justify-center shadow-sm`}>
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">{selectedSubject.name}</p>
                    <p className="text-xs text-slate-600 font-medium">{selectedSubject.quizzesTaken} quizzes taken</p>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${getPassingChanceColor(selectedSubject.passingChance)}`}>
                    <Target className="w-3 h-3" />
                    <span>{selectedSubject.passingChance}%</span>
                  </div>
                </button>
              </div>

              {/* Passing Chance Banner - Desktop */}
              <div className={`rounded-2xl p-6 border-2 bg-gradient-to-br ${getPassingChanceBg(selectedSubject.passingChance)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${getPassingChanceGradient(selectedSubject.passingChance)}`}>
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">Passing Chance</p>
                      <div className="flex items-baseline gap-3">
                        <p className="text-5xl font-bold text-slate-900">{selectedSubject.passingChance}%</p>
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold text-white ${getPassingChanceBadgeBg(selectedSubject.passingChance)}`}>
                          {getPassingChanceBadge(selectedSubject.passingChance)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-600 mb-1">Based on</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedSubject.quizzesTaken} Quizzes</p>
                    <p className="text-sm text-slate-600 mt-1">Avg: <span className="font-bold">{selectedSubject.averageScore}%</span></p>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile Passing Chance Card - Prominent */}
            <div className={`lg:hidden rounded-2xl p-4 mb-4 border-2 bg-gradient-to-br ${getPassingChanceBg(selectedSubject.passingChance)}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br ${getPassingChanceGradient(selectedSubject.passingChance)}`}>
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Passing Chance</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-slate-900">{selectedSubject.passingChance}%</p>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${getPassingChanceBadgeBg(selectedSubject.passingChance)}`}>
                      {getPassingChanceBadge(selectedSubject.passingChance)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Based on <span className="font-bold text-slate-900">{selectedSubject.quizzesTaken}</span> quizzes</span>
                <span className="text-slate-600">Avg: <span className="font-bold text-slate-900">{selectedSubject.averageScore}%</span></span>
              </div>
            </div>

            {/* Stats Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 gap-3 mb-4 lg:grid-cols-4 lg:gap-4 lg:mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-slate-200/60 shadow-sm active:scale-[0.98] lg:hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs lg:text-sm text-slate-600 font-medium">Score</p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900">{currentScore}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs lg:text-sm">
                  <span className="text-emerald-600 font-bold">+3%</span>
                  <span className="text-slate-500">from last</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-slate-200/60 shadow-sm active:scale-[0.98] lg:hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                    <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs lg:text-sm text-slate-600 font-medium">Days Left</p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900">{daysLeft}</p>
                  </div>
                </div>
                <p className="text-xs lg:text-sm text-slate-500 font-medium">Until milestone</p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-slate-200/60 shadow-sm active:scale-[0.98] lg:hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <Book className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs lg:text-sm text-slate-600 font-medium">Materials</p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900">{materialsCount}</p>
                  </div>
                </div>
                <p className="text-xs lg:text-sm text-slate-500 font-medium">Resources</p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-slate-200/60 shadow-sm active:scale-[0.98] lg:hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                    <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs lg:text-sm text-slate-600 font-medium">Quizzes</p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900">{selectedSubject.quizzesTaken}</p>
                  </div>
                </div>
                <p className="text-xs lg:text-sm text-slate-500 font-medium truncate">{selectedSubject.lastStudied}</p>
              </div>
            </div>

            {/* Score Progression Chart - Mobile Optimized */}
            <section className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-200/60 p-4 lg:p-6 mb-4 lg:mb-8 shadow-sm" aria-labelledby="score-progression-heading">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div>
                  <h3 id="score-progression-heading" className="text-base lg:text-xl font-bold text-slate-900">Score Progression</h3>
                  <p className="text-xs lg:text-sm text-slate-600 mt-0.5 lg:mt-1">Performance over recent quizzes</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg lg:rounded-xl border border-emerald-200">
                  <Award className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                  <div className="text-left">
                    <p className="text-[10px] lg:text-xs text-slate-600 font-medium leading-none">Best</p>
                    <p className="text-sm lg:text-lg font-bold text-emerald-600 leading-tight">{maxScore}%</p>
                  </div>
                </div>
              </div>
              
              <div className="relative h-40 lg:h-64">
                <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none" role="img" aria-label="Quiz score progression chart">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                      <stop offset="100%" stopColor="rgb(99, 102, 241)" />
                    </linearGradient>
                  </defs>
                  
                  {[0, 25, 50, 75, 100].map(val => <line key={val} x1="0" y1={200 - val * 2} x2="800" y2={200 - val * 2} stroke="rgb(226, 232, 240)" strokeWidth="1" strokeDasharray="4" />)}
                  
                  <path d={`M 0,${200 - quizData[0].score * 2} ${quizData.map((d, i) => `L ${i * 800 / (quizData.length - 1)},${200 - d.score * 2}`).join(' ')} L 800,200 L 0,200 Z`} fill="url(#scoreGradient)" />
                  
                  <path d={`M 0,${200 - quizData[0].score * 2} ${quizData.map((d, i) => `L ${i * 800 / (quizData.length - 1)},${200 - d.score * 2}`).join(' ')}`} fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {quizData.map((d, i) => <g key={i}>
                      <circle cx={i * 800 / (quizData.length - 1)} cy={200 - d.score * 2} r="6" fill="white" stroke="url(#lineGradient)" strokeWidth="3" />
                      <title>{`Quiz ${d.quizNumber}: ${d.score}%`}</title>
                    </g>)}
                </svg>
                
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] lg:text-xs font-medium text-slate-500">
                  {quizData.map((d, i) => <span key={i}>Q{d.quizNumber}</span>)}
                </div>
              </div>
            </section>

            {/* Upcoming Quiz Card - Mobile Optimized */}
            {selectedSubject.upcomingQuiz && <section className="bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 rounded-xl lg:rounded-2xl p-5 lg:p-8 text-white shadow-xl shadow-blue-500/20" aria-labelledby="upcoming-quiz-heading">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 lg:mb-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <h3 id="upcoming-quiz-heading" className="text-lg lg:text-xl font-bold">Upcoming Quiz</h3>
                        <p className="text-blue-100 text-xs lg:text-sm font-medium">Don't forget to prepare</p>
                      </div>
                    </div>
                    <p className="text-base lg:text-lg font-semibold mb-4 lg:mb-6 text-white/95">{selectedSubject.upcomingQuiz}</p>
                    <button className="w-full lg:w-auto px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 active:scale-95 font-bold rounded-xl transition-all shadow-lg">
                      <span>Set Reminder</span>
                    </button>
                  </div>
                  <div className="w-full lg:w-auto bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20 lg:min-w-[200px]">
                    <p className="text-xs lg:text-sm text-blue-100 mb-2 font-medium">Recommended Prep</p>
                    <p className="text-3xl lg:text-4xl font-bold mb-1">2-3</p>
                    <p className="text-xs lg:text-sm text-blue-100 font-medium">hours</p>
                  </div>
                </div>
              </section>}
          </div>
        </main>

        {/* Mobile Bottom Navigation - Native App Style */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-lg safe-bottom" aria-label="Mobile navigation">
          <div className="grid grid-cols-4 gap-1 px-2 py-2">
            {navigationItems.map(item => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => setActiveNav(item.id)} className={`relative flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl transition-all active:scale-95 ${activeNav === item.id ? 'text-blue-600' : 'text-slate-500'}`} aria-current={activeNav === item.id ? 'page' : undefined}>
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${activeNav === item.id ? 'scale-110' : ''} transition-transform`} />
                    {item.badge && <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>}
                  </div>
                  <span className={`text-[10px] font-semibold ${activeNav === item.id ? 'text-blue-600' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                  {activeNav === item.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full"></div>}
                </button>;
          })}
          </div>
        </nav>
      </div>

      <style>{`
        .safe-top { padding-top: env(safe-area-inset-top); }
        .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl { backdrop-filter: blur(20px); }
        }
      `}</style>
    </div>;
};