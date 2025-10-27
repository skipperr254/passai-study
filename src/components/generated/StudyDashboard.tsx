import React, { useState } from 'react';
import { Book, TrendingUp, Calendar, Clock, ChevronRight, Plus, Settings, Bell, Search } from 'lucide-react';
type Subject = {
  id: string;
  name: string;
  color: string;
  progress: number;
  quizzesTaken: number;
  lastStudied: string;
  upcomingQuiz?: string;
};
type QuizResult = {
  quizNumber: number;
  score: number;
};
type StudyDashboardProps = {
  subjects?: Subject[];
};
const mockSubjects: Subject[] = [{
  id: '1',
  name: 'History',
  color: 'bg-blue-500',
  progress: 85,
  quizzesTaken: 8,
  lastStudied: '2 hours ago',
  upcomingQuiz: 'Tomorrow at 2:00 PM'
}, {
  id: '2',
  name: 'English',
  color: 'bg-purple-500',
  progress: 72,
  quizzesTaken: 6,
  lastStudied: '1 day ago'
}, {
  id: '3',
  name: 'Mathematics',
  color: 'bg-green-500',
  progress: 91,
  quizzesTaken: 12,
  lastStudied: '3 hours ago',
  upcomingQuiz: 'Friday at 10:00 AM'
}, {
  id: '4',
  name: 'Science',
  color: 'bg-orange-500',
  progress: 65,
  quizzesTaken: 5,
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

// @component: StudyDashboard
export const StudyDashboard = (props: StudyDashboardProps) => {
  const subjects = props.subjects || mockSubjects;
  const [selectedSubject, setSelectedSubject] = useState<Subject>(subjects[0]);
  const [isSubjectSelectorOpen, setIsSubjectSelectorOpen] = useState(false);
  const quizData = mockQuizData;
  const maxScore = Math.max(...quizData.map(d => d.score));
  const currentScore = quizData[quizData.length - 1]?.score || 0;
  const daysLeft = 6;
  const materialsCount = 1;

  // @return
  return <div className="min-h-screen bg-slate-50" data-magicpath-id="0" data-magicpath-path="StudyDashboard.tsx">
      <div className="flex h-screen" data-magicpath-id="1" data-magicpath-path="StudyDashboard.tsx">
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col" data-magicpath-id="2" data-magicpath-path="StudyDashboard.tsx">
          <div className="p-6 border-b border-slate-200" data-magicpath-id="3" data-magicpath-path="StudyDashboard.tsx">
            <div className="flex items-center gap-3" data-magicpath-id="4" data-magicpath-path="StudyDashboard.tsx">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center" data-magicpath-id="5" data-magicpath-path="StudyDashboard.tsx">
                <Book className="w-6 h-6 text-white" data-magicpath-id="6" data-magicpath-path="StudyDashboard.tsx" />
              </div>
              <div data-magicpath-id="7" data-magicpath-path="StudyDashboard.tsx">
                <h1 className="text-xl font-semibold text-slate-900" data-magicpath-id="8" data-magicpath-path="StudyDashboard.tsx">PassAI</h1>
                <p className="text-sm text-slate-500" data-magicpath-id="9" data-magicpath-path="StudyDashboard.tsx">Study Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4" data-magicpath-id="10" data-magicpath-path="StudyDashboard.tsx">
            <div className="mb-4" data-magicpath-id="11" data-magicpath-path="StudyDashboard.tsx">
              <div className="flex items-center justify-between mb-3 px-2" data-magicpath-id="12" data-magicpath-path="StudyDashboard.tsx">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider" data-magicpath-id="13" data-magicpath-path="StudyDashboard.tsx">Subjects</h2>
                <button className="w-6 h-6 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors" data-magicpath-id="14" data-magicpath-path="StudyDashboard.tsx">
                  <Plus className="w-4 h-4" data-magicpath-id="15" data-magicpath-path="StudyDashboard.tsx" />
                </button>
              </div>
              <div className="space-y-1" data-magicpath-id="16" data-magicpath-path="StudyDashboard.tsx">
                {subjects.map(subject => <button key={subject.id} onClick={() => setSelectedSubject(subject)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${selectedSubject.id === subject.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`} data-magicpath-id="17" data-magicpath-path="StudyDashboard.tsx">
                    <div className={`w-2 h-2 rounded-full ${subject.color}`} data-magicpath-id="18" data-magicpath-path="StudyDashboard.tsx" />
                    <span className="flex-1 text-left font-medium text-sm" data-magicpath-id="19" data-magicpath-path="StudyDashboard.tsx">{subject.name}</span>
                    <span className="text-xs text-slate-500" data-magicpath-id="20" data-magicpath-path="StudyDashboard.tsx">{subject.progress}%</span>
                  </button>)}
              </div>
            </div>

            <div className="mt-6 px-2" data-magicpath-id="21" data-magicpath-path="StudyDashboard.tsx">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3" data-magicpath-id="22" data-magicpath-path="StudyDashboard.tsx">Quick Actions</h3>
              <div className="space-y-1" data-magicpath-id="23" data-magicpath-path="StudyDashboard.tsx">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors" data-magicpath-id="24" data-magicpath-path="StudyDashboard.tsx">
                  <Calendar className="w-4 h-4" data-magicpath-id="25" data-magicpath-path="StudyDashboard.tsx" />
                  <span className="text-sm font-medium" data-magicpath-id="26" data-magicpath-path="StudyDashboard.tsx">Schedule</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors" data-magicpath-id="27" data-magicpath-path="StudyDashboard.tsx">
                  <Bell className="w-4 h-4" data-magicpath-id="28" data-magicpath-path="StudyDashboard.tsx" />
                  <span className="text-sm font-medium" data-magicpath-id="29" data-magicpath-path="StudyDashboard.tsx">Notifications</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors" data-magicpath-id="30" data-magicpath-path="StudyDashboard.tsx">
                  <Settings className="w-4 h-4" data-magicpath-id="31" data-magicpath-path="StudyDashboard.tsx" />
                  <span className="text-sm font-medium" data-magicpath-id="32" data-magicpath-path="StudyDashboard.tsx">Settings</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200" data-magicpath-id="33" data-magicpath-path="StudyDashboard.tsx">
            <div className="flex items-center gap-3 px-2" data-magicpath-id="34" data-magicpath-path="StudyDashboard.tsx">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold" data-magicpath-id="35" data-magicpath-path="StudyDashboard.tsx">
                A
              </div>
              <div className="flex-1 min-w-0" data-magicpath-id="36" data-magicpath-path="StudyDashboard.tsx">
                <p className="text-sm font-medium text-slate-900 truncate" data-magicpath-id="37" data-magicpath-path="StudyDashboard.tsx">Account</p>
                <p className="text-xs text-slate-500 truncate" data-magicpath-id="38" data-magicpath-path="StudyDashboard.tsx">View profile</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto" data-magicpath-id="39" data-magicpath-path="StudyDashboard.tsx">
          <div className="max-w-7xl mx-auto p-8" data-magicpath-id="40" data-magicpath-path="StudyDashboard.tsx">
            <div className="mb-8" data-magicpath-id="41" data-magicpath-path="StudyDashboard.tsx">
              <div className="flex items-center justify-between mb-2" data-magicpath-id="42" data-magicpath-path="StudyDashboard.tsx">
                <h2 className="text-3xl font-bold text-slate-900" data-magicpath-id="43" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.name}</h2>
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2" data-magicpath-id="44" data-magicpath-path="StudyDashboard.tsx">
                  Take Quiz
                  <ChevronRight className="w-4 h-4" data-magicpath-id="45" data-magicpath-path="StudyDashboard.tsx" />
                </button>
              </div>
              <p className="text-slate-600" data-magicpath-id="46" data-magicpath-path="StudyDashboard.tsx">Track your progress and stay on top of your studies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" data-magicpath-id="47" data-magicpath-path="StudyDashboard.tsx">
              <div className="bg-white rounded-xl p-6 border border-slate-200" data-magicpath-id="48" data-magicpath-path="StudyDashboard.tsx">
                <div className="flex items-center gap-3 mb-3" data-magicpath-id="49" data-magicpath-path="StudyDashboard.tsx">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center" data-magicpath-id="50" data-magicpath-path="StudyDashboard.tsx">
                    <TrendingUp className="w-5 h-5 text-blue-600" data-magicpath-id="51" data-magicpath-path="StudyDashboard.tsx" />
                  </div>
                  <div data-magicpath-id="52" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-sm text-slate-600" data-magicpath-id="53" data-magicpath-path="StudyDashboard.tsx">Current Score</p>
                    <p className="text-2xl font-bold text-slate-900" data-magicpath-id="54" data-magicpath-path="StudyDashboard.tsx">{currentScore}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm" data-magicpath-id="55" data-magicpath-path="StudyDashboard.tsx">
                  <span className="text-green-600 font-medium" data-magicpath-id="56" data-magicpath-path="StudyDashboard.tsx">+3%</span>
                  <span className="text-slate-500" data-magicpath-id="57" data-magicpath-path="StudyDashboard.tsx">from last quiz</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200" data-magicpath-id="58" data-magicpath-path="StudyDashboard.tsx">
                <div className="flex items-center gap-3 mb-3" data-magicpath-id="59" data-magicpath-path="StudyDashboard.tsx">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center" data-magicpath-id="60" data-magicpath-path="StudyDashboard.tsx">
                    <Calendar className="w-5 h-5 text-orange-600" data-magicpath-id="61" data-magicpath-path="StudyDashboard.tsx" />
                  </div>
                  <div data-magicpath-id="62" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-sm text-slate-600" data-magicpath-id="63" data-magicpath-path="StudyDashboard.tsx">Days Left</p>
                    <p className="text-2xl font-bold text-slate-900" data-magicpath-id="64" data-magicpath-path="StudyDashboard.tsx">{daysLeft}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500" data-magicpath-id="65" data-magicpath-path="StudyDashboard.tsx">Until next milestone</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200" data-magicpath-id="66" data-magicpath-path="StudyDashboard.tsx">
                <div className="flex items-center gap-3 mb-3" data-magicpath-id="67" data-magicpath-path="StudyDashboard.tsx">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center" data-magicpath-id="68" data-magicpath-path="StudyDashboard.tsx">
                    <Book className="w-5 h-5 text-purple-600" data-magicpath-id="69" data-magicpath-path="StudyDashboard.tsx" />
                  </div>
                  <div data-magicpath-id="70" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-sm text-slate-600" data-magicpath-id="71" data-magicpath-path="StudyDashboard.tsx">Materials</p>
                    <p className="text-2xl font-bold text-slate-900" data-magicpath-id="72" data-magicpath-path="StudyDashboard.tsx">{materialsCount}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500" data-magicpath-id="73" data-magicpath-path="StudyDashboard.tsx">Study resources available</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200" data-magicpath-id="74" data-magicpath-path="StudyDashboard.tsx">
                <div className="flex items-center gap-3 mb-3" data-magicpath-id="75" data-magicpath-path="StudyDashboard.tsx">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center" data-magicpath-id="76" data-magicpath-path="StudyDashboard.tsx">
                    <Clock className="w-5 h-5 text-green-600" data-magicpath-id="77" data-magicpath-path="StudyDashboard.tsx" />
                  </div>
                  <div data-magicpath-id="78" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-sm text-slate-600" data-magicpath-id="79" data-magicpath-path="StudyDashboard.tsx">Quizzes Taken</p>
                    <p className="text-2xl font-bold text-slate-900" data-magicpath-id="80" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.quizzesTaken}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500" data-magicpath-id="81" data-magicpath-path="StudyDashboard.tsx">Last: {selectedSubject.lastStudied}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8" data-magicpath-id="82" data-magicpath-path="StudyDashboard.tsx">
              <div className="flex items-center justify-between mb-6" data-magicpath-id="83" data-magicpath-path="StudyDashboard.tsx">
                <div data-magicpath-id="84" data-magicpath-path="StudyDashboard.tsx">
                  <h3 className="text-lg font-semibold text-slate-900" data-magicpath-id="85" data-magicpath-path="StudyDashboard.tsx">Score Progression</h3>
                  <p className="text-sm text-slate-600 mt-1" data-magicpath-id="86" data-magicpath-path="StudyDashboard.tsx">Your performance over recent quizzes</p>
                </div>
                <div className="flex items-center gap-2 text-sm" data-magicpath-id="87" data-magicpath-path="StudyDashboard.tsx">
                  <span className="text-slate-600" data-magicpath-id="88" data-magicpath-path="StudyDashboard.tsx">Best:</span>
                  <span className="font-semibold text-green-600" data-magicpath-id="89" data-magicpath-path="StudyDashboard.tsx">{maxScore}%</span>
                </div>
              </div>
              <div className="relative h-64" data-magicpath-id="90" data-magicpath-path="StudyDashboard.tsx">
                <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none" data-magicpath-id="91" data-magicpath-path="StudyDashboard.tsx">
                  <defs data-magicpath-id="92" data-magicpath-path="StudyDashboard.tsx">
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%" data-magicpath-id="93" data-magicpath-path="StudyDashboard.tsx">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`M 0,${200 - quizData[0].score * 2} ${quizData.map((d, i) => `L ${i * 800 / (quizData.length - 1)},${200 - d.score * 2}`).join(' ')}`} fill="none" stroke="rgb(59, 130, 246)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" data-magicpath-id="94" data-magicpath-path="StudyDashboard.tsx" />
                  <path d={`M 0,${200 - quizData[0].score * 2} ${quizData.map((d, i) => `L ${i * 800 / (quizData.length - 1)},${200 - d.score * 2}`).join(' ')} L 800,200 L 0,200 Z`} fill="url(#scoreGradient)" data-magicpath-id="95" data-magicpath-path="StudyDashboard.tsx" />
                  {quizData.map((d, i) => <circle key={i} cx={i * 800 / (quizData.length - 1)} cy={200 - d.score * 2} r="5" fill="rgb(59, 130, 246)" stroke="white" strokeWidth="2" data-magicpath-id="96" data-magicpath-path="StudyDashboard.tsx" />)}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-slate-500" data-magicpath-id="97" data-magicpath-path="StudyDashboard.tsx">
                  {quizData.map((d, i) => <span key={i} data-magicpath-id="98" data-magicpath-path="StudyDashboard.tsx">Q{d.quizNumber}</span>)}
                </div>
              </div>
            </div>

            {selectedSubject.upcomingQuiz && <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6" data-magicpath-id="99" data-magicpath-path="StudyDashboard.tsx">
                <div className="flex items-start justify-between" data-magicpath-id="100" data-magicpath-path="StudyDashboard.tsx">
                  <div data-magicpath-id="101" data-magicpath-path="StudyDashboard.tsx">
                    <div className="flex items-center gap-2 mb-2" data-magicpath-id="102" data-magicpath-path="StudyDashboard.tsx">
                      <Calendar className="w-5 h-5 text-blue-600" data-magicpath-id="103" data-magicpath-path="StudyDashboard.tsx" />
                      <h3 className="text-lg font-semibold text-slate-900" data-magicpath-id="104" data-magicpath-path="StudyDashboard.tsx">Upcoming Quiz</h3>
                    </div>
                    <p className="text-slate-700 mb-4" data-magicpath-id="105" data-magicpath-path="StudyDashboard.tsx">{selectedSubject.upcomingQuiz}</p>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm" data-magicpath-id="106" data-magicpath-path="StudyDashboard.tsx">
                      Set Reminder
                    </button>
                  </div>
                  <div className="text-right" data-magicpath-id="107" data-magicpath-path="StudyDashboard.tsx">
                    <p className="text-sm text-slate-600 mb-1" data-magicpath-id="108" data-magicpath-path="StudyDashboard.tsx">Recommended study time</p>
                    <p className="text-2xl font-bold text-slate-900" data-magicpath-id="109" data-magicpath-path="StudyDashboard.tsx">2-3 hours</p>
                  </div>
                </div>
              </div>}
          </div>
        </main>
      </div>
    </div>;
};