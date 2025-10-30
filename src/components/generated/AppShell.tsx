import React, { useState } from 'react';
import { Book, TrendingUp, Calendar, Settings, Bell, LayoutDashboard, Upload, FileQuestion, GraduationCap } from 'lucide-react';
import { SubjectsPage } from './SubjectsPage';
import { DashboardPage } from './DashboardPage';
import { QuizzesPage } from './QuizzesPage';
type NavigationItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
};
type AppShellProps = {
  userName?: string;
  children?: React.ReactNode;
};
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
export const AppShell = (props: AppShellProps) => {
  const userName = props.userName || 'Jake';
  const [activeNav, setActiveNav] = useState('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const renderPage = () => {
    switch (activeNav) {
      case 'subjects':
        return <SubjectsPage onSubjectClick={id => setActiveNav('dashboard')} data-magicpath-id="0" data-magicpath-path="AppShell.tsx" />;
      case 'quizzes':
        return <QuizzesPage selectedSubjectId={selectedSubjectId} onQuizClick={id => console.log('Quiz clicked:', id)} data-magicpath-id="1" data-magicpath-path="AppShell.tsx" />;
      case 'dashboard':
        return <DashboardPage userName={userName} data-magicpath-id="2" data-magicpath-path="AppShell.tsx" />;
      default:
        return props.children || <DashboardPage userName={userName} data-magicpath-id="3" data-magicpath-path="AppShell.tsx" />;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40" data-magicpath-id="4" data-magicpath-path="AppShell.tsx">
      <div className="flex flex-col h-screen lg:flex-row" data-magicpath-id="5" data-magicpath-path="AppShell.tsx">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-80 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex-col shadow-sm" data-magicpath-id="6" data-magicpath-path="AppShell.tsx">
          <div className="p-6 border-b border-slate-200/60" data-magicpath-id="7" data-magicpath-path="AppShell.tsx">
            <div className="flex items-center gap-3" data-magicpath-id="8" data-magicpath-path="AppShell.tsx">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20" data-magicpath-id="9" data-magicpath-path="AppShell.tsx">
                <Book className="w-7 h-7 text-white" data-magicpath-id="10" data-magicpath-path="AppShell.tsx" />
              </div>
              <div data-magicpath-id="11" data-magicpath-path="AppShell.tsx">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight" data-magicpath-id="12" data-magicpath-path="AppShell.tsx">PassAI</h1>
                <p className="text-sm text-slate-500 font-medium" data-magicpath-id="13" data-magicpath-path="AppShell.tsx">Intelligent Study</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4" aria-label="Main navigation" data-magicpath-id="14" data-magicpath-path="AppShell.tsx">
            <div className="mb-6" data-magicpath-id="15" data-magicpath-path="AppShell.tsx">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3" data-magicpath-id="16" data-magicpath-path="AppShell.tsx">Navigation</h3>
              <ul className="space-y-1" data-magicpath-id="17" data-magicpath-path="AppShell.tsx">
                {navigationItems.map(item => {
                const Icon = item.icon;
                return <li key={item.id} data-magicpath-id="18" data-magicpath-path="AppShell.tsx">
                      <button onClick={() => setActiveNav(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeNav === item.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`} aria-current={activeNav === item.id ? 'page' : undefined} data-magicpath-id="19" data-magicpath-path="AppShell.tsx">
                        <Icon className="w-5 h-5" data-magicpath-id="20" data-magicpath-path="AppShell.tsx" />
                        <span className="flex-1 text-left font-semibold text-sm" data-magicpath-id="21" data-magicpath-path="AppShell.tsx">{item.label}</span>
                        {item.badge && <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeNav === item.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`} data-magicpath-id="22" data-magicpath-path="AppShell.tsx">
                            {item.badge}
                          </span>}
                      </button>
                    </li>;
              })}
              </ul>
            </div>
          </nav>

          <div className="p-4 border-t border-slate-200/60 space-y-2" data-magicpath-id="23" data-magicpath-path="AppShell.tsx">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-all" data-magicpath-id="24" data-magicpath-path="AppShell.tsx">
              <Bell className="w-5 h-5" data-magicpath-id="25" data-magicpath-path="AppShell.tsx" />
              <span className="text-sm font-semibold" data-magicpath-id="26" data-magicpath-path="AppShell.tsx">Notifications</span>
              <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" data-magicpath-id="27" data-magicpath-path="AppShell.tsx"></span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-all" data-magicpath-id="28" data-magicpath-path="AppShell.tsx">
              <Settings className="w-5 h-5" data-magicpath-id="29" data-magicpath-path="AppShell.tsx" />
              <span className="text-sm font-semibold" data-magicpath-id="30" data-magicpath-path="AppShell.tsx">Settings</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm safe-top" data-magicpath-id="31" data-magicpath-path="AppShell.tsx">
          <div className="px-4 py-3" data-magicpath-id="32" data-magicpath-path="AppShell.tsx">
            <div className="flex items-center justify-between" data-magicpath-id="33" data-magicpath-path="AppShell.tsx">
              <div className="flex items-center gap-3" data-magicpath-id="34" data-magicpath-path="AppShell.tsx">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md" data-magicpath-id="35" data-magicpath-path="AppShell.tsx">
                  <Book className="w-5 h-5 text-white" data-magicpath-id="36" data-magicpath-path="AppShell.tsx" />
                </div>
                <div data-magicpath-id="37" data-magicpath-path="AppShell.tsx">
                  <h1 className="text-base font-bold text-slate-900" data-magicpath-id="38" data-magicpath-path="AppShell.tsx">PassAI</h1>
                  <p className="text-xs text-slate-500 font-medium" data-magicpath-id="39" data-magicpath-path="AppShell.tsx">Hi, {userName}!</p>
                </div>
              </div>
              <div className="flex items-center gap-2" data-magicpath-id="40" data-magicpath-path="AppShell.tsx">
                <button className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center transition-all relative" data-magicpath-id="41" data-magicpath-path="AppShell.tsx">
                  <Bell className="w-4 h-4 text-slate-700" data-magicpath-id="42" data-magicpath-path="AppShell.tsx" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" data-magicpath-id="43" data-magicpath-path="AppShell.tsx"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 pt-16 lg:pt-0" data-magicpath-id="44" data-magicpath-path="AppShell.tsx">
          {renderPage()}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-lg safe-bottom" aria-label="Mobile navigation" data-magicpath-id="45" data-magicpath-path="AppShell.tsx">
          <div className="grid grid-cols-5 gap-1 px-2 py-2" data-magicpath-id="46" data-magicpath-path="AppShell.tsx">
            {navigationItems.map(item => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => setActiveNav(item.id)} className={`relative flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl transition-all active:scale-95 ${activeNav === item.id ? 'text-blue-600' : 'text-slate-500'}`} aria-current={activeNav === item.id ? 'page' : undefined} data-magicpath-id="47" data-magicpath-path="AppShell.tsx">
                  <div className="relative" data-magicpath-id="48" data-magicpath-path="AppShell.tsx">
                    <Icon className={`w-5 h-5 ${activeNav === item.id ? 'scale-110' : ''} transition-transform`} data-magicpath-id="49" data-magicpath-path="AppShell.tsx" />
                    {item.badge && <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center" data-magicpath-id="50" data-magicpath-path="AppShell.tsx">
                        {item.badge}
                      </span>}
                  </div>
                  <span className={`text-[10px] font-semibold ${activeNav === item.id ? 'text-blue-600' : 'text-slate-500'}`} data-magicpath-id="51" data-magicpath-path="AppShell.tsx">
                    {item.label.split(' ')[0]}
                  </span>
                  {activeNav === item.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" data-magicpath-id="52" data-magicpath-path="AppShell.tsx"></div>}
                </button>;
          })}
          </div>
        </nav>
      </div>

      <style data-magicpath-id="53" data-magicpath-path="AppShell.tsx">{`
        .safe-top { padding-top: env(safe-area-inset-top); }
        .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl { backdrop-filter: blur(20px); }
        }
      `}</style>
    </div>;
};