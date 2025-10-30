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
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40" data-magicpath-id="0" data-magicpath-path="StudyDashboard.tsx">
      {/* Mobile App Layout */}
      <div className="flex flex-col h-screen lg:flex-row" data-magicpath-id="1" data-magicpath-path="StudyDashboard.tsx">
        
        {/* Desktop Sidebar - Unchanged */}
        <aside className="hidden lg:flex w-80 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex-col shadow-sm" data-magicpath-id="2" data-magicpath-path="StudyDashboard.tsx">
          <div className="p-6 border-b border-slate-200/60" data-magicpath-id="3" data-magicpath-path="StudyDashboard.tsx">
            <div className="flex items-center gap-3" data-magicpath-id="4" data-magicpath-path="StudyDashboard.tsx">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20" data-magicpath-id="5" data-magicpath-path="StudyDashboard.tsx">
                <Book className="w-7 h-7 text-white" data-magicpath-id="6" data-magicpath-path="StudyDashboard.tsx" />
              </div>
              <div data-magicpath-id="7" data-magicpath-path="StudyDashboard.tsx">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight" data-magicpath-id="8" data-magicpath-path="StudyDashboard.tsx">PassAI</h1>
                <p className="text-sm text-slate-500 font-medium" data-magicpath-id="9" data-magicpath-path="StudyDashboard.tsx">Intelligent Study</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4" aria-label="Main navigation" data-magicpath-id="10" data-magicpath-path="StudyDashboard.tsx">
            <div className="mb-6" data-magicpath-id="11" data-magicpath-path="StudyDashboard.tsx">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3" data-magicpath-id="12" data-magicpath-path="StudyDashboard.tsx">Navigation</h3>
              <ul className="space-y-1" data-magicpath-id="13" data-magicpath-path="StudyDashboard.tsx">
                {navigationItems.map(item => {
                const Icon = item.icon;
                return <li key={item.id} data-magicpath-id="14" data-magicpath-path="StudyDashboard.tsx">
                      <button onClick={() => setActiveNav(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeNav === item.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`} aria-current={activeNav === item.id ? 'page' : undefined} data-magicpath-id="15" data-magicpath-path="StudyDashboard.tsx">
                        <Icon className="w-5 h-5" data-magicpath-id="16" data-magicpath-path="StudyDashboard.tsx" />
                        <span className="flex-1 text-left font-semibold text-sm" data-magicpath-id="17" data-magicpath-path="StudyDashboard.tsx">{item.label}</span>
                        {item.badge && <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeNav === item.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`} data-magicpath-id="18" data-magicpath-path="StudyDashboard.tsx">
                            {item.badge}
                          </span>}
                      </button>
                    </li>;
              })}
              </ul>
            </div>
          </nav>

          <div className="p-4 border-t border-slate-200/60 space-y-2" data-magicpath-id="19" data-magicpath-path="StudyDashboard.tsx">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-all" data-magicpath-id="20" data-magicpath-path="StudyDashboard.tsx">
              <Bell className="w-5 h-5" data-magicpath-id="21" data-magicpath-path="StudyDashboard.tsx" />
              <span className="text-sm font-semibold" data-magicpath-id="22" data-magicpath-path="StudyDashboard.tsx">Notifications</span>
              <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" data-magicpath-id="23" data-magicpath-path="StudyDashboard.tsx"></span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-all" data-magicpath-id="24" data-magicpath-path="StudyDashboard.tsx">
              <Settings className="w-5 h-5" data-magicpath-id="25" data-magicpath-path="StudyDashboard.tsx" />
              <span className="text-sm font-semibold" data-magicpath-id="26" data-magicpath-path="StudyDashboard.tsx">Settings</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header - Simplified & Modern */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm safe-top" data-magicpath-id="27" data-magicpath-path="StudyDashboard.tsx">
          <div className="px-4 py-3" data-magicpath-id="28" data-magicpath-path="StudyDashboard.tsx">
            <div className="flex items-center justify-between" data-magicpath-id="29" data-magicpath-path="StudyDashboard.tsx">
              <div className="flex items-center gap-3" data-magicpath-id="30" data-magicpath-path="StudyDashboard.tsx">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md" data-magicpath-id="31" data-magicpath-path="StudyDashboard.tsx">
                  <Book className="w-5 h-5 text-white" data-magicpath-id="32" data-magicpath-path="StudyDashboard.tsx" />
                </div>
                <div data-magicpath-id="33" data-magicpath-path="StudyDashboard.tsx">
                  <h1 className="text-base font-bold text-slate-900" data-magicpath-id="34" data-magicpath-path="StudyDashboard.tsx">PassAI</h1>
                  <p className="text-xs text-slate-500 font-medium" data-magicpath-id="35" data-magicpath-path="StudyDashboard.tsx">Hi, {userName}!</p>
                </div>
              </div>
              <div className="flex items-center gap-2" data-magicpath-id="36" data-magicpath-path="StudyDashboard.tsx">
                <button className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center transition-all relative" data-magicpath-id="37" data-magicpath-path="StudyDashboard.tsx">
                  <Bell className="w-4 h-4 text-slate-700" data-magicpath-id="38" data-magicpath-path="StudyDashboard.tsx" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" data-magicpath-id="39" data-magicpath-path="StudyDashboard.tsx"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Subject Selection Modal - Enhanced for Mobile */}
        {isSubjectModalOpen && <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsSubjectModalOpen(false)} data-magicpath-id="40" data-magicpath-path="StudyDashboard.tsx">
            <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[85vh] md:max-h-[70vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()} data-magicpath-id="41" data-magicpath-path="StudyDashboard.tsx">
              <div className="flex-shrink-0 px-6 pt-4 pb-3 border-b border-slate-200" data-magicpath-id="42" data-magicpath-path="StudyDashboard.tsx">
                <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 md:hidden" data-magicpath-id="43" data-magicpath-path="StudyDashboard.tsx"></div>
                <div className="flex items-center justify-between" data-magicpath-id="44" data-magicpath-path="StudyDashboard.tsx">
                  <div data-magicpath-id="45" data-magicpath-path="StudyDashboard.tsx">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900" data-magicpath-id="46" data-magicpath-path="StudyDashboard.tsx">Select Subject</h2>
                    <p className="text-sm text-slate-600 mt-1" data-magicpath-id="47" data-magicpath-path="StudyDashboard.tsx">Choose a subject to view details</p>
                  </div>
                  <button onClick={() => setIsSubjectModalOpen(false)} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center transition-all" aria-label="Close modal" data-magicpath-id="48" data-magicpath-path="StudyDashboard.tsx">
                    <X className="w-5 h-5" data-magicpath-id="49" data-magicpath-path="StudyDashboard.tsx" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6" data-magicpath-id="50" data-magicpath-path="StudyDashboard.tsx">
                <div className="space-y-2 md:space-y-3" data-magicpath-id="51" data-magicpath-path="StudyDashboard.tsx">
                  {subjects.map(subject => <button key={subject.id} onClick={() => {
                setSelectedSubject(subject);
                setIsSubjectModalOpen(false);
              }} className={`w-full bg-white rounded-xl border-2 p-3 md:p-4 text-left transition-all active:scale-[0.98] ${selectedSubject.id === subject.id ? 'border-blue-500 shadow-md ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`} data-magicpath-id="52" data-magicpath-path="StudyDashboard.tsx">
                      <div className="flex items-center gap-3" data-magicpath-id="53" data-magicpath-path="StudyDashboard.tsx">
                        <div className={`w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-sm`} data-magicpath-id="54" data-magicpath-path="StudyDashboard.tsx">
                          <Book className="w-6 h-6 text-white" data-magicpath-id="55" data-magicpath-path="StudyDashboard.tsx" />
                        </div>
                        <div className="flex-1 min-w-0" data-magicpath-id="56" data-magicpath-path="StudyDashboard.tsx">
                          <h4 className="text-base font-bold text-slate-900 truncate mb-1" data-magicpath-id="57" data-magicpath-path="StudyDashboard.tsx">{subject.name}</h4>
                          <p className="text-xs text-slate-600" data-magicpath-id="58" data-magicpath-path="StudyDashboard.tsx">{subject.quizzesTaken} quizzes • {subject.lastStudied}</p>
                          <div className="flex items-center gap-2 mt-2" data-magicpath-id="59" data-magicpath-path="StudyDashboard.tsx">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden" data-magicpath-id="60" data-magicpath-path="StudyDashboard.tsx">
                              <div className={`h-full bg-gradient-to-r ${subject.color} rounded-full transition-all duration-500`} style={{
                          width: `${subject.progress}%`
                        }} data-magicpath-id="61" data-magicpath-path="StudyDashboard.tsx"></div>
                            </div>
                            <span className="text-xs font-bold text-slate-700" data-magicpath-id="62" data-magicpath-path="StudyDashboard.tsx">{subject.progress}%</span>
                          </div>
                        </div>
                        <div className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${getPassingChanceColor(subject.passingChance)} flex-shrink-0`} data-magicpath-id="63" data-magicpath-path="StudyDashboard.tsx">
                          <div className="flex items-center gap-1" data-magicpath-id="64" data-magicpath-path="StudyDashboard.tsx">
                            <Target className="w-3 h-3" data-magicpath-id="65" data-magicpath-path="StudyDashboard.tsx" />
                            <span data-magicpath-id="66" data-magicpath-path="StudyDashboard.tsx">{subject.passingChance}%</span>
                          </div>
                        </div>
                      </div>
                    </button>)}
                </div>
              </div>
            </div>
          </div>}

        {/* Main Content - Mobile Optimized */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 pt-16 lg:pt-0" data-magicpath-id="67" data-magicpath-path="StudyDashboard.tsx">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:p-8" data-magicpath-id="68" data-magicpath-path="StudyDashboard.tsx">
            
            {/* Mobile Subject Switcher - Horizontal Scroll */}
            <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto hide-scrollbar" data-magicpath-id="69" data-magicpath-path="StudyDashboard.tsx">
              <div className="flex gap-2 pb-1" data-magicpath-id="70" data-magicpath-path="StudyDashboard.tsx">
                {subjects.map(subject => <button key={subject.id} onClick={() => setSelectedSubject(subject)} className={`flex-shrink-0 px-3 py-2 rounded-xl transition-all active:scale-95 ${selectedSubject.id === subject.id ? `bg-gradient-to-r ${subject.color} text-white shadow-md` : 'bg-white border-2 border-slate-200 text-slate-700'}`} data-magicpath-id="71" data-magicpath-path="StudyDashboard.tsx">
                    <div className="flex items-center gap-2" data-magicpath-id="72" data-magicpath-path="StudyDashboard.tsx">
                      <Book className="w-4 h-4" data-magicpath-id="73" data-magicpath-path="StudyDashboard.tsx" />
                      <span className="text-sm font-semibold whitespace-nowrap" data-magicpath-id="74" data-magicpath-path="StudyDashboard.tsx">{subject.name}</span>
                      {selectedSubject.id === subject.id && <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full" data-magicpath-id="75" data-magicpath-path="StudyDashboard.tsx">
                          {subject.passingChance}%
                        </span>}
                    </div>
                  </button>)}
              </div>
            </div>

            {/* Desktop Header - Tablet & Up */}
            <header className="hidden lg:block mb-8" data-magicpath-id="76" data-magicpath-path="StudyDashboard.tsx">
              <div className="flex items-start justify-between gap-4 mb-4" data-magicpath-id="77" data-magicpath-path="StudyDashboard.tsx">
                <div className="flex-1" data-magicpath-id="78" data-magicpath-path="StudyDashboard.tsx">
                  <h2 className="text-4xl font-bold text-slate-900 mb-2" data-magicpath-id="79" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.name}</h2>
                  <p className="text-slate-600" data-magicpath-id="80" data-magicpath-path="StudyDashboard.tsx">Track your progress and master your subject</p>
                </div>
                
                <button onClick={() => setIsSubjectModalOpen(true)} className="group bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-400 rounded-xl transition-all shadow-sm hover:shadow-md px-4 py-3 flex items-center gap-3 min-w-[280px]" data-magicpath-id="81" data-magicpath-path="StudyDashboard.tsx">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedSubject.color} flex items-center justify-center shadow-sm`} data-magicpath-id="82" data-magicpath-path="StudyDashboard.tsx">
                    <Book className="w-5 h-5 text-white" data-magicpath-id="83" data-magicpath-path="StudyDashboard.tsx" />
                  </div>
                  <div className="flex-1 text-left min-w-0" data-magicpath-id="84" data-magicpath-path="StudyDashboard.tsx">
                    <p className="font-semibold text-sm text-slate-900 truncate" data-magicpath-id="85" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.name}</p>
                    <p className="text-xs text-slate-600 font-medium" data-magicpath-id="86" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.quizzesTaken} quizzes taken</p>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${getPassingChanceColor(selectedSubject.passingChance)}`} data-magicpath-id="87" data-magicpath-path="StudyDashboard.tsx">
                    <Target className="w-3 h-3" data-magicpath-id="88" data-magicpath-path="StudyDashboard.tsx" />
                    <span data-magicpath-id="89" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.passingChance}%</span>
                  </div>
                </button>
              </div>

              {/* Passing Chance Banner - Desktop */}
              <div className={`rounded-2xl p-6 border-2 bg-gradient-to-br ${getPassingChanceBg(selectedSubject.passingChance)}`} data-magicpath-id="90" data-magicpath-path="StudyDashboard.tsx">
                <div className="flex items-center justify-between" data-magicpath-id="91" data-magicpath-path="StudyDashboard.tsx">
                  <div className="flex items-center gap-4" data-magicpath-id="92" data-magicpath-path="StudyDashboard.tsx">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${getPassingChanceGradient(selectedSubject.passingChance)}`} data-magicpath-id="93" data-magicpath-path="StudyDashboard.tsx">
                      <Target className="w-7 h-7 text-white" data-magicpath-id="94" data-magicpath-path="StudyDashboard.tsx" />
                    </div>
                    <div data-magicpath-id="95" data-magicpath-path="StudyDashboard.tsx">
                      <p className="text-sm font-semibold text-slate-600 mb-1" data-magicpath-id="96" data-magicpath-path="StudyDashboard.tsx">Passing Chance</p>
                      <div className="flex items-baseline gap-3" data-magicpath-id="97" data-magicpath-path="StudyDashboard.tsx">
                        <p className="text-5xl font-bold text-slate-900" data-magicpath-id="98" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.passingChance}%</p>
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold text-white ${getPassingChanceBadgeBg(selectedSubject.passingChance)}`} data-magicpath-id="99" data-magicpath-path="StudyDashboard.tsx">
                          {getPassingChanceBadge(selectedSubject.passingChance)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right" data-magicpath-id="100" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-sm font-semibold text-slate-600 mb-1" data-magicpath-id="101" data-magicpath-path="StudyDashboard.tsx">Based on</p>
                    <p className="text-2xl font-bold text-slate-900" data-magicpath-id="102" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.quizzesTaken} Quizzes</p>
                    <p className="text-sm text-slate-600 mt-1" data-magicpath-id="103" data-magicpath-path="StudyDashboard.tsx">Avg: <span className="font-bold" data-magicpath-id="104" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.averageScore}%</span></p>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile Passing Chance Card - Prominent */}
            <div className={`lg:hidden rounded-2xl p-4 mb-4 border-2 bg-gradient-to-br ${getPassingChanceBg(selectedSubject.passingChance)}`} data-magicpath-id="105" data-magicpath-path="StudyDashboard.tsx">
              <div className="flex items-start gap-3 mb-3" data-magicpath-id="106" data-magicpath-path="StudyDashboard.tsx">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br ${getPassingChanceGradient(selectedSubject.passingChance)}`} data-magicpath-id="107" data-magicpath-path="StudyDashboard.tsx">
                  <Target className="w-6 h-6 text-white" data-magicpath-id="108" data-magicpath-path="StudyDashboard.tsx" />
                </div>
                <div className="flex-1" data-magicpath-id="109" data-magicpath-path="StudyDashboard.tsx">
                  <p className="text-xs font-semibold text-slate-600 mb-1" data-magicpath-id="110" data-magicpath-path="StudyDashboard.tsx">Passing Chance</p>
                  <div className="flex items-baseline gap-2" data-magicpath-id="111" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-3xl font-bold text-slate-900" data-magicpath-id="112" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.passingChance}%</p>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${getPassingChanceBadgeBg(selectedSubject.passingChance)}`} data-magicpath-id="113" data-magicpath-path="StudyDashboard.tsx">
                      {getPassingChanceBadge(selectedSubject.passingChance)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm" data-magicpath-id="114" data-magicpath-path="StudyDashboard.tsx">
                <span className="text-slate-600" data-magicpath-id="115" data-magicpath-path="StudyDashboard.tsx">Based on <span className="font-bold text-slate-900" data-magicpath-id="116" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.quizzesTaken}</span> quizzes</span>
                <span className="text-slate-600" data-magicpath-id="117" data-magicpath-path="StudyDashboard.tsx">Avg: <span className="font-bold text-slate-900" data-magicpath-id="118" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.averageScore}%</span></span>
              </div>
            </div>

            {/* Stats Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 gap-3 mb-4 lg:grid-cols-4 lg:gap-4 lg:mb-8" data-magicpath-id="119" data-magicpath-path="StudyDashboard.tsx">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-slate-200/60 shadow-sm active:scale-[0.98] lg:hover:shadow-md transition-all" data-magicpath-id="120" data-magicpath-path="StudyDashboard.tsx">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2 lg:mb-3" data-magicpath-id="121" data-magicpath-path="StudyDashboard.tsx">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm" data-magicpath-id="122" data-magicpath-path="StudyDashboard.tsx">
                    <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" data-magicpath-id="123" data-magicpath-path="StudyDashboard.tsx" />
                  </div>
                  <div className="flex-1 min-w-0" data-magicpath-id="124" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-xs lg:text-sm text-slate-600 font-medium" data-magicpath-id="125" data-magicpath-path="StudyDashboard.tsx">Score</p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900" data-magicpath-id="126" data-magicpath-path="StudyDashboard.tsx">{currentScore}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs lg:text-sm" data-magicpath-id="127" data-magicpath-path="StudyDashboard.tsx">
                  <span className="text-emerald-600 font-bold" data-magicpath-id="128" data-magicpath-path="StudyDashboard.tsx">+3%</span>
                  <span className="text-slate-500" data-magicpath-id="129" data-magicpath-path="StudyDashboard.tsx">from last</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-slate-200/60 shadow-sm active:scale-[0.98] lg:hover:shadow-md transition-all" data-magicpath-id="130" data-magicpath-path="StudyDashboard.tsx">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2 lg:mb-3" data-magicpath-id="131" data-magicpath-path="StudyDashboard.tsx">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm" data-magicpath-id="132" data-magicpath-path="StudyDashboard.tsx">
                    <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" data-magicpath-id="133" data-magicpath-path="StudyDashboard.tsx" />
                  </div>
                  <div className="flex-1 min-w-0" data-magicpath-id="134" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-xs lg:text-sm text-slate-600 font-medium" data-magicpath-id="135" data-magicpath-path="StudyDashboard.tsx">Days Left</p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900" data-magicpath-id="136" data-magicpath-path="StudyDashboard.tsx">{daysLeft}</p>
                  </div>
                </div>
                <p className="text-xs lg:text-sm text-slate-500 font-medium" data-magicpath-id="137" data-magicpath-path="StudyDashboard.tsx">Until milestone</p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-slate-200/60 shadow-sm active:scale-[0.98] lg:hover:shadow-md transition-all" data-magicpath-id="138" data-magicpath-path="StudyDashboard.tsx">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2 lg:mb-3" data-magicpath-id="139" data-magicpath-path="StudyDashboard.tsx">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm" data-magicpath-id="140" data-magicpath-path="StudyDashboard.tsx">
                    <Book className="w-5 h-5 lg:w-6 lg:h-6 text-white" data-magicpath-id="141" data-magicpath-path="StudyDashboard.tsx" />
                  </div>
                  <div className="flex-1 min-w-0" data-magicpath-id="142" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-xs lg:text-sm text-slate-600 font-medium" data-magicpath-id="143" data-magicpath-path="StudyDashboard.tsx">Materials</p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900" data-magicpath-id="144" data-magicpath-path="StudyDashboard.tsx">{materialsCount}</p>
                  </div>
                </div>
                <p className="text-xs lg:text-sm text-slate-500 font-medium" data-magicpath-id="145" data-magicpath-path="StudyDashboard.tsx">Resources</p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-slate-200/60 shadow-sm active:scale-[0.98] lg:hover:shadow-md transition-all" data-magicpath-id="146" data-magicpath-path="StudyDashboard.tsx">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2 lg:mb-3" data-magicpath-id="147" data-magicpath-path="StudyDashboard.tsx">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm" data-magicpath-id="148" data-magicpath-path="StudyDashboard.tsx">
                    <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-white" data-magicpath-id="149" data-magicpath-path="StudyDashboard.tsx" />
                  </div>
                  <div className="flex-1 min-w-0" data-magicpath-id="150" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-xs lg:text-sm text-slate-600 font-medium" data-magicpath-id="151" data-magicpath-path="StudyDashboard.tsx">Quizzes</p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900" data-magicpath-id="152" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.quizzesTaken}</p>
                  </div>
                </div>
                <p className="text-xs lg:text-sm text-slate-500 font-medium truncate" data-magicpath-id="153" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.lastStudied}</p>
              </div>
            </div>

            {/* Score Progression Chart - Mobile Optimized */}
            <section className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-200/60 p-4 lg:p-6 mb-4 lg:mb-8 shadow-sm" aria-labelledby="score-progression-heading" data-magicpath-id="154" data-magicpath-path="StudyDashboard.tsx">
              <div className="flex items-center justify-between mb-4 lg:mb-6" data-magicpath-id="155" data-magicpath-path="StudyDashboard.tsx">
                <div data-magicpath-id="156" data-magicpath-path="StudyDashboard.tsx">
                  <h3 id="score-progression-heading" className="text-base lg:text-xl font-bold text-slate-900" data-magicpath-id="157" data-magicpath-path="StudyDashboard.tsx">Score Progression</h3>
                  <p className="text-xs lg:text-sm text-slate-600 mt-0.5 lg:mt-1" data-magicpath-id="158" data-magicpath-path="StudyDashboard.tsx">Performance over recent quizzes</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg lg:rounded-xl border border-emerald-200" data-magicpath-id="159" data-magicpath-path="StudyDashboard.tsx">
                  <Award className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" data-magicpath-id="160" data-magicpath-path="StudyDashboard.tsx" />
                  <div className="text-left" data-magicpath-id="161" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-[10px] lg:text-xs text-slate-600 font-medium leading-none" data-magicpath-id="162" data-magicpath-path="StudyDashboard.tsx">Best</p>
                    <p className="text-sm lg:text-lg font-bold text-emerald-600 leading-tight" data-magicpath-id="163" data-magicpath-path="StudyDashboard.tsx">{maxScore}%</p>
                  </div>
                </div>
              </div>
              
              <div className="relative h-40 lg:h-64" data-magicpath-id="164" data-magicpath-path="StudyDashboard.tsx">
                <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none" role="img" aria-label="Quiz score progression chart" data-magicpath-id="165" data-magicpath-path="StudyDashboard.tsx">
                  <defs data-magicpath-id="166" data-magicpath-path="StudyDashboard.tsx">
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%" data-magicpath-id="167" data-magicpath-path="StudyDashboard.tsx">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%" data-magicpath-id="168" data-magicpath-path="StudyDashboard.tsx">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                      <stop offset="100%" stopColor="rgb(99, 102, 241)" />
                    </linearGradient>
                  </defs>
                  
                  {[0, 25, 50, 75, 100].map(val => <line key={val} x1="0" y1={200 - val * 2} x2="800" y2={200 - val * 2} stroke="rgb(226, 232, 240)" strokeWidth="1" strokeDasharray="4" />)}
                  
                  <path d={`M 0,${200 - quizData[0].score * 2} ${quizData.map((d, i) => `L ${i * 800 / (quizData.length - 1)},${200 - d.score * 2}`).join(' ')} L 800,200 L 0,200 Z`} fill="url(#scoreGradient)" data-magicpath-id="169" data-magicpath-path="StudyDashboard.tsx" />
                  
                  <path d={`M 0,${200 - quizData[0].score * 2} ${quizData.map((d, i) => `L ${i * 800 / (quizData.length - 1)},${200 - d.score * 2}`).join(' ')}`} fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" data-magicpath-id="170" data-magicpath-path="StudyDashboard.tsx" />
                  
                  {quizData.map((d, i) => <g key={i} data-magicpath-id="171" data-magicpath-path="StudyDashboard.tsx">
                      <circle cx={i * 800 / (quizData.length - 1)} cy={200 - d.score * 2} r="6" fill="white" stroke="url(#lineGradient)" strokeWidth="3" data-magicpath-id="172" data-magicpath-path="StudyDashboard.tsx" />
                      <title data-magicpath-id="173" data-magicpath-path="StudyDashboard.tsx">{`Quiz ${d.quizNumber}: ${d.score}%`}</title>
                    </g>)}
                </svg>
                
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] lg:text-xs font-medium text-slate-500" data-magicpath-id="174" data-magicpath-path="StudyDashboard.tsx">
                  {quizData.map((d, i) => <span key={i} data-magicpath-id="175" data-magicpath-path="StudyDashboard.tsx">Q{d.quizNumber}</span>)}
                </div>
              </div>
            </section>

            {/* Upcoming Quiz Card - Mobile Optimized */}
            {selectedSubject.upcomingQuiz && <section className="bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 rounded-xl lg:rounded-2xl p-5 lg:p-8 text-white shadow-xl shadow-blue-500/20" aria-labelledby="upcoming-quiz-heading" data-magicpath-id="176" data-magicpath-path="StudyDashboard.tsx">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-6" data-magicpath-id="177" data-magicpath-path="StudyDashboard.tsx">
                  <div className="flex-1" data-magicpath-id="178" data-magicpath-path="StudyDashboard.tsx">
                    <div className="flex items-center gap-3 mb-3 lg:mb-4" data-magicpath-id="179" data-magicpath-path="StudyDashboard.tsx">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center" data-magicpath-id="180" data-magicpath-path="StudyDashboard.tsx">
                        <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" data-magicpath-id="181" data-magicpath-path="StudyDashboard.tsx" />
                      </div>
                      <div data-magicpath-id="182" data-magicpath-path="StudyDashboard.tsx">
                        <h3 id="upcoming-quiz-heading" className="text-lg lg:text-xl font-bold" data-magicpath-id="183" data-magicpath-path="StudyDashboard.tsx">Upcoming Quiz</h3>
                        <p className="text-blue-100 text-xs lg:text-sm font-medium" data-magicpath-id="184" data-magicpath-path="StudyDashboard.tsx">Don't forget to prepare</p>
                      </div>
                    </div>
                    <p className="text-base lg:text-lg font-semibold mb-4 lg:mb-6 text-white/95" data-magicpath-id="185" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.upcomingQuiz}</p>
                    <button className="w-full lg:w-auto px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 active:scale-95 font-bold rounded-xl transition-all shadow-lg" data-magicpath-id="186" data-magicpath-path="StudyDashboard.tsx">
                      <span data-magicpath-id="187" data-magicpath-path="StudyDashboard.tsx">Set Reminder</span>
                    </button>
                  </div>
                  <div className="w-full lg:w-auto bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20 lg:min-w-[200px]" data-magicpath-id="188" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-xs lg:text-sm text-blue-100 mb-2 font-medium" data-magicpath-id="189" data-magicpath-path="StudyDashboard.tsx">Recommended Prep</p>
                    <p className="text-3xl lg:text-4xl font-bold mb-1" data-magicpath-id="190" data-magicpath-path="StudyDashboard.tsx">2-3</p>
                    <p className="text-xs lg:text-sm text-blue-100 font-medium" data-magicpath-id="191" data-magicpath-path="StudyDashboard.tsx">hours</p>
                  </div>
                </div>
              </section>}
          </div>
        </main>

        {/* Mobile Bottom Navigation - Native App Style */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-lg safe-bottom" aria-label="Mobile navigation" data-magicpath-id="192" data-magicpath-path="StudyDashboard.tsx">
          <div className="grid grid-cols-4 gap-1 px-2 py-2" data-magicpath-id="193" data-magicpath-path="StudyDashboard.tsx">
            {navigationItems.map(item => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => setActiveNav(item.id)} className={`relative flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl transition-all active:scale-95 ${activeNav === item.id ? 'text-blue-600' : 'text-slate-500'}`} aria-current={activeNav === item.id ? 'page' : undefined} data-magicpath-id="194" data-magicpath-path="StudyDashboard.tsx">
                  <div className="relative" data-magicpath-id="195" data-magicpath-path="StudyDashboard.tsx">
                    <Icon className={`w-5 h-5 ${activeNav === item.id ? 'scale-110' : ''} transition-transform`} data-magicpath-id="196" data-magicpath-path="StudyDashboard.tsx" />
                    {item.badge && <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center" data-magicpath-id="197" data-magicpath-path="StudyDashboard.tsx">
                        {item.badge}
                      </span>}
                  </div>
                  <span className={`text-[10px] font-semibold ${activeNav === item.id ? 'text-blue-600' : 'text-slate-500'}`} data-magicpath-id="198" data-magicpath-path="StudyDashboard.tsx">
                    {item.label}
                  </span>
                  {activeNav === item.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" data-magicpath-id="199" data-magicpath-path="StudyDashboard.tsx"></div>}
                </button>;
          })}
          </div>
        </nav>
      </div>

      <style data-magicpath-id="200" data-magicpath-path="StudyDashboard.tsx">{`
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