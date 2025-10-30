import React, { useState } from 'react';
import { Book, Plus, Search, Filter, TrendingUp, Clock, Target, ChevronRight, FileText, Brain, Trophy, Calendar, AlertCircle, CheckCircle2, ArrowRight, X, Sparkles } from 'lucide-react';
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
  totalMaterials: number;
  studyHours: number;
  weakTopics: string[];
  strongTopics: string[];
  nextMilestone: string;
};
type SubjectsPageProps = {
  subjects?: Subject[];
  onSubjectClick?: (subjectId: string) => void;
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
  upcomingQuiz: 'Tomorrow at 2:00 PM',
  totalMaterials: 12,
  studyHours: 24,
  weakTopics: ['World War II', 'Ancient Rome'],
  strongTopics: ['American Revolution', 'Renaissance'],
  nextMilestone: 'Complete Chapter 8 Quiz'
}, {
  id: '2',
  name: 'English',
  color: 'from-purple-500 to-purple-600',
  progress: 72,
  passingChance: 78,
  quizzesTaken: 6,
  averageScore: 72,
  lastStudied: '1 day ago',
  totalMaterials: 15,
  studyHours: 18,
  weakTopics: ['Poetry Analysis', 'Grammar Rules'],
  strongTopics: ['Essay Writing', 'Reading Comprehension'],
  nextMilestone: 'Practice 5 More Essays'
}, {
  id: '3',
  name: 'Mathematics',
  color: 'from-green-500 to-green-600',
  progress: 91,
  passingChance: 96,
  quizzesTaken: 12,
  averageScore: 91,
  lastStudied: '3 hours ago',
  upcomingQuiz: 'Friday at 10:00 AM',
  totalMaterials: 20,
  studyHours: 32,
  weakTopics: ['Calculus', 'Trigonometry'],
  strongTopics: ['Algebra', 'Geometry', 'Statistics'],
  nextMilestone: 'Master Derivatives'
}, {
  id: '4',
  name: 'Science',
  color: 'from-orange-500 to-orange-600',
  progress: 65,
  passingChance: 68,
  quizzesTaken: 5,
  averageScore: 65,
  lastStudied: '2 days ago',
  totalMaterials: 10,
  studyHours: 15,
  weakTopics: ['Chemical Reactions', 'Physics Laws', 'Cell Biology'],
  strongTopics: ['Periodic Table'],
  nextMilestone: 'Complete Lab Reports'
}, {
  id: '5',
  name: 'Geography',
  color: 'from-teal-500 to-teal-600',
  progress: 55,
  passingChance: 62,
  quizzesTaken: 4,
  averageScore: 58,
  lastStudied: '3 days ago',
  totalMaterials: 8,
  studyHours: 12,
  weakTopics: ['Climate Zones', 'World Capitals', 'Topography'],
  strongTopics: ['Continents'],
  nextMilestone: 'Study World Maps'
}, {
  id: '6',
  name: 'Computer Science',
  color: 'from-indigo-500 to-indigo-600',
  progress: 78,
  passingChance: 84,
  quizzesTaken: 9,
  averageScore: 80,
  lastStudied: '5 hours ago',
  upcomingQuiz: 'Next Monday',
  totalMaterials: 18,
  studyHours: 28,
  weakTopics: ['Algorithms', 'Data Structures'],
  strongTopics: ['Programming Basics', 'Problem Solving', 'Debugging'],
  nextMilestone: 'Complete Sorting Project'
}];
export const SubjectsPage = (props: SubjectsPageProps) => {
  const subjects = props.subjects || mockSubjects;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'needs-attention' | 'on-track' | 'excelling'>('all');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    description: '',
    testDate: '',
    teacherEmphasis: ''
  });
  const handleAddSubject = () => {
    // Here you would typically save the subject
    console.log('Adding subject:', newSubject);
    setIsAddSubjectOpen(false);
    setNewSubject({
      name: '',
      description: '',
      testDate: '',
      teacherEmphasis: ''
    });
  };
  const exampleEmphases = ['Focus on problem-solving methods', 'Memorize key dates and events', 'Understand concepts, not just formulas', 'Practice essay writing techniques', 'Review homework problems weekly'];
  const getPassingChanceColor = (chance: number) => {
    if (chance >= 90) return 'text-emerald-600 bg-emerald-50';
    if (chance >= 75) return 'text-green-600 bg-green-50';
    if (chance >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };
  const getPassingChanceIcon = (chance: number) => {
    if (chance >= 90) return CheckCircle2;
    if (chance >= 75) return TrendingUp;
    if (chance >= 60) return Clock;
    return AlertCircle;
  };
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    switch (filterBy) {
      case 'needs-attention':
        return subject.passingChance < 75;
      case 'on-track':
        return subject.passingChance >= 75 && subject.passingChance < 90;
      case 'excelling':
        return subject.passingChance >= 90;
      default:
        return true;
    }
  });
  const stats = {
    total: subjects.length,
    needsAttention: subjects.filter(s => s.passingChance < 75).length,
    onTrack: subjects.filter(s => s.passingChance >= 75 && s.passingChance < 90).length,
    excelling: subjects.filter(s => s.passingChance >= 90).length
  };
  return <div className="h-full overflow-y-auto pb-4" data-magicpath-id="0" data-magicpath-path="SubjectsPage.tsx">
      {/* Header Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-200/60" data-magicpath-id="1" data-magicpath-path="SubjectsPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="2" data-magicpath-path="SubjectsPage.tsx">
          <div className="flex items-start justify-between mb-4 lg:mb-6" data-magicpath-id="3" data-magicpath-path="SubjectsPage.tsx">
            <div data-magicpath-id="4" data-magicpath-path="SubjectsPage.tsx">
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2" data-magicpath-id="5" data-magicpath-path="SubjectsPage.tsx">My Subjects</h1>
              <p className="text-sm lg:text-base text-slate-600" data-magicpath-id="6" data-magicpath-path="SubjectsPage.tsx">Manage and track your learning progress</p>
            </div>
            <button onClick={() => setIsAddSubjectOpen(true)} className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all" data-magicpath-id="7" data-magicpath-path="SubjectsPage.tsx">
              <Plus className="w-5 h-5" data-magicpath-id="8" data-magicpath-path="SubjectsPage.tsx" />
              <span data-magicpath-id="9" data-magicpath-path="SubjectsPage.tsx">Add Subject</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-2 lg:gap-4 mb-4" data-magicpath-id="10" data-magicpath-path="SubjectsPage.tsx">
            <button onClick={() => setFilterBy('all')} className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterBy === 'all' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`} data-magicpath-id="11" data-magicpath-path="SubjectsPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="12" data-magicpath-path="SubjectsPage.tsx">Total</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900" data-magicpath-id="13" data-magicpath-path="SubjectsPage.tsx">{stats.total}</p>
            </button>
            <button onClick={() => setFilterBy('needs-attention')} className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterBy === 'needs-attention' ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'}`} data-magicpath-id="14" data-magicpath-path="SubjectsPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="15" data-magicpath-path="SubjectsPage.tsx">Needs Help</p>
              <p className="text-xl lg:text-3xl font-bold text-red-600" data-magicpath-id="16" data-magicpath-path="SubjectsPage.tsx">{stats.needsAttention}</p>
            </button>
            <button onClick={() => setFilterBy('on-track')} className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterBy === 'on-track' ? 'border-green-500 ring-2 ring-green-100' : 'border-slate-200'}`} data-magicpath-id="17" data-magicpath-path="SubjectsPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="18" data-magicpath-path="SubjectsPage.tsx">On Track</p>
              <p className="text-xl lg:text-3xl font-bold text-green-600" data-magicpath-id="19" data-magicpath-path="SubjectsPage.tsx">{stats.onTrack}</p>
            </button>
            <button onClick={() => setFilterBy('excelling')} className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterBy === 'excelling' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'}`} data-magicpath-id="20" data-magicpath-path="SubjectsPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="21" data-magicpath-path="SubjectsPage.tsx">Excelling</p>
              <p className="text-xl lg:text-3xl font-bold text-emerald-600" data-magicpath-id="22" data-magicpath-path="SubjectsPage.tsx">{stats.excelling}</p>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative" data-magicpath-id="23" data-magicpath-path="SubjectsPage.tsx">
            <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-slate-400" data-magicpath-id="24" data-magicpath-path="SubjectsPage.tsx" />
            <input type="text" placeholder="Search subjects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 bg-white border-2 border-slate-200 rounded-xl text-sm lg:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" data-magicpath-id="25" data-magicpath-path="SubjectsPage.tsx" />
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="px-4 py-4 lg:px-8 lg:py-6" data-magicpath-id="26" data-magicpath-path="SubjectsPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="27" data-magicpath-path="SubjectsPage.tsx">
          {filteredSubjects.length === 0 ? <div className="text-center py-12" data-magicpath-id="28" data-magicpath-path="SubjectsPage.tsx">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4" data-magicpath-id="29" data-magicpath-path="SubjectsPage.tsx">
                <Book className="w-8 h-8 text-slate-400" data-magicpath-id="30" data-magicpath-path="SubjectsPage.tsx" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2" data-magicpath-id="31" data-magicpath-path="SubjectsPage.tsx">No subjects found</h3>
              <p className="text-slate-600 mb-4" data-magicpath-id="32" data-magicpath-path="SubjectsPage.tsx">Try adjusting your search or filters</p>
              <button className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors" data-magicpath-id="33" data-magicpath-path="SubjectsPage.tsx">
                Clear Filters
              </button>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4" data-magicpath-id="34" data-magicpath-path="SubjectsPage.tsx">
              {filteredSubjects.map(subject => {
            const PassingIcon = getPassingChanceIcon(subject.passingChance);
            return <div key={subject.id} onClick={() => {
              setSelectedSubject(subject);
              props.onSubjectClick?.(subject.id);
            }} className="bg-white rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-slate-300 p-4 lg:p-5 transition-all hover:shadow-lg cursor-pointer active:scale-[0.98] group" data-magicpath-id="35" data-magicpath-path="SubjectsPage.tsx">
                    {/* Subject Header */}
                    <div className="flex items-start gap-3 mb-4" data-magicpath-id="36" data-magicpath-path="SubjectsPage.tsx">
                      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-md flex-shrink-0`} data-magicpath-id="37" data-magicpath-path="SubjectsPage.tsx">
                        <Book className="w-6 h-6 lg:w-7 lg:h-7 text-white" data-magicpath-id="38" data-magicpath-path="SubjectsPage.tsx" />
                      </div>
                      <div className="flex-1 min-w-0" data-magicpath-id="39" data-magicpath-path="SubjectsPage.tsx">
                        <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-1 truncate group-hover:text-blue-600 transition-colors" data-magicpath-id="40" data-magicpath-path="SubjectsPage.tsx">
                          {subject.name}
                        </h3>
                        <p className="text-xs lg:text-sm text-slate-600" data-magicpath-id="41" data-magicpath-path="SubjectsPage.tsx">
                          {subject.quizzesTaken} quizzes • {subject.totalMaterials} materials
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" data-magicpath-id="42" data-magicpath-path="SubjectsPage.tsx" />
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4" data-magicpath-id="43" data-magicpath-path="SubjectsPage.tsx">
                      <div className="flex items-center justify-between mb-2" data-magicpath-id="44" data-magicpath-path="SubjectsPage.tsx">
                        <span className="text-xs font-semibold text-slate-600" data-magicpath-id="45" data-magicpath-path="SubjectsPage.tsx">Progress</span>
                        <span className="text-sm font-bold text-slate-900" data-magicpath-id="46" data-magicpath-path="SubjectsPage.tsx">{subject.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden" data-magicpath-id="47" data-magicpath-path="SubjectsPage.tsx">
                        <div className={`h-full bg-gradient-to-r ${subject.color} rounded-full transition-all duration-500`} style={{
                    width: `${subject.progress}%`
                  }} data-magicpath-id="48" data-magicpath-path="SubjectsPage.tsx"></div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3" data-magicpath-id="49" data-magicpath-path="SubjectsPage.tsx">
                      <div className={`p-2 lg:p-3 rounded-lg ${getPassingChanceColor(subject.passingChance)}`} data-magicpath-id="50" data-magicpath-path="SubjectsPage.tsx">
                        <div className="flex items-center gap-1.5 mb-1" data-magicpath-id="51" data-magicpath-path="SubjectsPage.tsx">
                          <PassingIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4" data-magicpath-id="52" data-magicpath-path="SubjectsPage.tsx" />
                          <span className="text-[10px] lg:text-xs font-semibold" data-magicpath-id="53" data-magicpath-path="SubjectsPage.tsx">Passing</span>
                        </div>
                        <p className="text-lg lg:text-xl font-bold" data-magicpath-id="54" data-magicpath-path="SubjectsPage.tsx">{subject.passingChance}%</p>
                      </div>
                      <div className="p-2 lg:p-3 rounded-lg bg-slate-50 border border-slate-200" data-magicpath-id="55" data-magicpath-path="SubjectsPage.tsx">
                        <div className="flex items-center gap-1.5 mb-1" data-magicpath-id="56" data-magicpath-path="SubjectsPage.tsx">
                          <Trophy className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-600" data-magicpath-id="57" data-magicpath-path="SubjectsPage.tsx" />
                          <span className="text-[10px] lg:text-xs font-semibold text-slate-600" data-magicpath-id="58" data-magicpath-path="SubjectsPage.tsx">Avg Score</span>
                        </div>
                        <p className="text-lg lg:text-xl font-bold text-slate-900" data-magicpath-id="59" data-magicpath-path="SubjectsPage.tsx">{subject.averageScore}%</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200" data-magicpath-id="60" data-magicpath-path="SubjectsPage.tsx">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600" data-magicpath-id="61" data-magicpath-path="SubjectsPage.tsx">
                        <Clock className="w-3.5 h-3.5" data-magicpath-id="62" data-magicpath-path="SubjectsPage.tsx" />
                        <span data-magicpath-id="63" data-magicpath-path="SubjectsPage.tsx">{subject.lastStudied}</span>
                      </div>
                      {subject.upcomingQuiz && <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg" data-magicpath-id="64" data-magicpath-path="SubjectsPage.tsx">
                          <Calendar className="w-3 h-3" data-magicpath-id="65" data-magicpath-path="SubjectsPage.tsx" />
                          <span className="text-xs font-semibold" data-magicpath-id="66" data-magicpath-path="SubjectsPage.tsx">Quiz Soon</span>
                        </div>}
                    </div>
                  </div>;
          })}
            </div>}
        </div>
      </div>

      {/* Subject Detail Modal */}
      {selectedSubject && <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedSubject(null)} data-magicpath-id="67" data-magicpath-path="SubjectsPage.tsx">
          <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-3xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()} data-magicpath-id="68" data-magicpath-path="SubjectsPage.tsx">
            {/* Modal Header */}
            <div className={`flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-gradient-to-br ${selectedSubject.color}`} data-magicpath-id="69" data-magicpath-path="SubjectsPage.tsx">
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden" data-magicpath-id="70" data-magicpath-path="SubjectsPage.tsx"></div>
              <div className="flex items-center gap-4" data-magicpath-id="71" data-magicpath-path="SubjectsPage.tsx">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center" data-magicpath-id="72" data-magicpath-path="SubjectsPage.tsx">
                  <Book className="w-7 h-7 text-white" data-magicpath-id="73" data-magicpath-path="SubjectsPage.tsx" />
                </div>
                <div className="flex-1" data-magicpath-id="74" data-magicpath-path="SubjectsPage.tsx">
                  <h2 className="text-2xl font-bold text-white mb-1" data-magicpath-id="75" data-magicpath-path="SubjectsPage.tsx">{selectedSubject.name}</h2>
                  <p className="text-white/90 text-sm" data-magicpath-id="76" data-magicpath-path="SubjectsPage.tsx">{selectedSubject.studyHours} hours studied • {selectedSubject.totalMaterials} materials</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6" data-magicpath-id="77" data-magicpath-path="SubjectsPage.tsx">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6" data-magicpath-id="78" data-magicpath-path="SubjectsPage.tsx">
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200" data-magicpath-id="79" data-magicpath-path="SubjectsPage.tsx">
                  <p className="text-2xl font-bold text-slate-900 mb-1" data-magicpath-id="80" data-magicpath-path="SubjectsPage.tsx">{selectedSubject.progress}%</p>
                  <p className="text-xs text-slate-600 font-medium" data-magicpath-id="81" data-magicpath-path="SubjectsPage.tsx">Progress</p>
                </div>
                <div className={`text-center p-4 rounded-xl ${getPassingChanceColor(selectedSubject.passingChance)}`} data-magicpath-id="82" data-magicpath-path="SubjectsPage.tsx">
                  <p className="text-2xl font-bold mb-1" data-magicpath-id="83" data-magicpath-path="SubjectsPage.tsx">{selectedSubject.passingChance}%</p>
                  <p className="text-xs font-medium" data-magicpath-id="84" data-magicpath-path="SubjectsPage.tsx">Passing</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200" data-magicpath-id="85" data-magicpath-path="SubjectsPage.tsx">
                  <p className="text-2xl font-bold text-slate-900 mb-1" data-magicpath-id="86" data-magicpath-path="SubjectsPage.tsx">{selectedSubject.averageScore}%</p>
                  <p className="text-xs text-slate-600 font-medium" data-magicpath-id="87" data-magicpath-path="SubjectsPage.tsx">Avg Score</p>
                </div>
              </div>

              {/* Next Milestone */}
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl" data-magicpath-id="88" data-magicpath-path="SubjectsPage.tsx">
                <div className="flex items-start gap-3" data-magicpath-id="89" data-magicpath-path="SubjectsPage.tsx">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0" data-magicpath-id="90" data-magicpath-path="SubjectsPage.tsx">
                    <Target className="w-5 h-5 text-white" data-magicpath-id="91" data-magicpath-path="SubjectsPage.tsx" />
                  </div>
                  <div className="flex-1" data-magicpath-id="92" data-magicpath-path="SubjectsPage.tsx">
                    <p className="text-xs font-semibold text-blue-600 mb-1" data-magicpath-id="93" data-magicpath-path="SubjectsPage.tsx">NEXT MILESTONE</p>
                    <p className="text-sm font-bold text-slate-900" data-magicpath-id="94" data-magicpath-path="SubjectsPage.tsx">{selectedSubject.nextMilestone}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors" data-magicpath-id="95" data-magicpath-path="SubjectsPage.tsx">
                    Start
                  </button>
                </div>
              </div>

              {/* Topics Analysis */}
              <div className="grid md:grid-cols-2 gap-4 mb-6" data-magicpath-id="96" data-magicpath-path="SubjectsPage.tsx">
                {/* Strong Topics */}
                <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl" data-magicpath-id="97" data-magicpath-path="SubjectsPage.tsx">
                  <div className="flex items-center gap-2 mb-3" data-magicpath-id="98" data-magicpath-path="SubjectsPage.tsx">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" data-magicpath-id="99" data-magicpath-path="SubjectsPage.tsx" />
                    <h3 className="text-sm font-bold text-slate-900" data-magicpath-id="100" data-magicpath-path="SubjectsPage.tsx">Strong Topics</h3>
                  </div>
                  <div className="space-y-2" data-magicpath-id="101" data-magicpath-path="SubjectsPage.tsx">
                    {selectedSubject.strongTopics.map((topic, idx) => <div key={idx} className="flex items-center gap-2" data-magicpath-id="102" data-magicpath-path="SubjectsPage.tsx">
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" data-magicpath-id="103" data-magicpath-path="SubjectsPage.tsx"></div>
                        <span className="text-sm text-slate-700" data-magicpath-id="104" data-magicpath-path="SubjectsPage.tsx">{topic}</span>
                      </div>)}
                  </div>
                </div>

                {/* Weak Topics */}
                <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl" data-magicpath-id="105" data-magicpath-path="SubjectsPage.tsx">
                  <div className="flex items-center gap-2 mb-3" data-magicpath-id="106" data-magicpath-path="SubjectsPage.tsx">
                    <AlertCircle className="w-5 h-5 text-amber-600" data-magicpath-id="107" data-magicpath-path="SubjectsPage.tsx" />
                    <h3 className="text-sm font-bold text-slate-900" data-magicpath-id="108" data-magicpath-path="SubjectsPage.tsx">Needs Practice</h3>
                  </div>
                  <div className="space-y-2" data-magicpath-id="109" data-magicpath-path="SubjectsPage.tsx">
                    {selectedSubject.weakTopics.map((topic, idx) => <div key={idx} className="flex items-center gap-2" data-magicpath-id="110" data-magicpath-path="SubjectsPage.tsx">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" data-magicpath-id="111" data-magicpath-path="SubjectsPage.tsx"></div>
                        <span className="text-sm text-slate-700" data-magicpath-id="112" data-magicpath-path="SubjectsPage.tsx">{topic}</span>
                      </div>)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3" data-magicpath-id="113" data-magicpath-path="SubjectsPage.tsx">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all" data-magicpath-id="114" data-magicpath-path="SubjectsPage.tsx">
                  <Brain className="w-5 h-5" data-magicpath-id="115" data-magicpath-path="SubjectsPage.tsx" />
                  <span data-magicpath-id="116" data-magicpath-path="SubjectsPage.tsx">Study Now</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all" data-magicpath-id="117" data-magicpath-path="SubjectsPage.tsx">
                  <FileText className="w-5 h-5" data-magicpath-id="118" data-magicpath-path="SubjectsPage.tsx" />
                  <span data-magicpath-id="119" data-magicpath-path="SubjectsPage.tsx">Materials</span>
                </button>
              </div>
            </div>
          </div>
        </div>}

      {/* Mobile FAB */}
      <button onClick={() => setIsAddSubjectOpen(true)} className="lg:hidden fixed bottom-20 right-4 z-30 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl active:scale-95 transition-all" data-magicpath-id="120" data-magicpath-path="SubjectsPage.tsx">
        <Plus className="w-6 h-6" data-magicpath-id="121" data-magicpath-path="SubjectsPage.tsx" />
      </button>

      {/* Add Subject Modal */}
      {isAddSubjectOpen && <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsAddSubjectOpen(false)} data-magicpath-id="122" data-magicpath-path="SubjectsPage.tsx">
          <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()} data-magicpath-id="123" data-magicpath-path="SubjectsPage.tsx">
            {/* Modal Header */}
            <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-gradient-to-br from-blue-500 to-indigo-600" data-magicpath-id="124" data-magicpath-path="SubjectsPage.tsx">
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden" data-magicpath-id="125" data-magicpath-path="SubjectsPage.tsx"></div>
              <div className="flex items-center gap-4" data-magicpath-id="126" data-magicpath-path="SubjectsPage.tsx">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center" data-magicpath-id="127" data-magicpath-path="SubjectsPage.tsx">
                  <Plus className="w-7 h-7 text-white" data-magicpath-id="128" data-magicpath-path="SubjectsPage.tsx" />
                </div>
                <div className="flex-1" data-magicpath-id="129" data-magicpath-path="SubjectsPage.tsx">
                  <h2 className="text-2xl font-bold text-white mb-1" data-magicpath-id="130" data-magicpath-path="SubjectsPage.tsx">Add New Subject</h2>
                  <p className="text-white/90 text-sm" data-magicpath-id="131" data-magicpath-path="SubjectsPage.tsx">Start tracking your progress</p>
                </div>
                <button onClick={() => setIsAddSubjectOpen(false)} className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all" aria-label="Close modal" data-magicpath-id="132" data-magicpath-path="SubjectsPage.tsx">
                  <X className="w-5 h-5 text-white" data-magicpath-id="133" data-magicpath-path="SubjectsPage.tsx" />
                </button>
              </div>
            </div>

            {/* Modal Content - Form */}
            <div className="flex-1 overflow-y-auto p-6" data-magicpath-id="134" data-magicpath-path="SubjectsPage.tsx">
              <div className="space-y-5" data-magicpath-id="135" data-magicpath-path="SubjectsPage.tsx">
                {/* Subject Name */}
                <div data-magicpath-id="136" data-magicpath-path="SubjectsPage.tsx">
                  <label htmlFor="subject-name" className="block text-sm font-bold text-slate-900 mb-2" data-magicpath-id="137" data-magicpath-path="SubjectsPage.tsx">
                    Subject Name <span className="text-red-500" data-magicpath-id="138" data-magicpath-path="SubjectsPage.tsx">*</span>
                  </label>
                  <input id="subject-name" type="text" value={newSubject.name} onChange={e => setNewSubject({
                ...newSubject,
                name: e.target.value
              })} placeholder="e.g., Mathematics, History, Biology" className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" required data-magicpath-id="139" data-magicpath-path="SubjectsPage.tsx" />
                </div>

                {/* Description (Optional) */}
                <div data-magicpath-id="140" data-magicpath-path="SubjectsPage.tsx">
                  <label htmlFor="subject-description" className="block text-sm font-bold text-slate-900 mb-2" data-magicpath-id="141" data-magicpath-path="SubjectsPage.tsx">
                    Description <span className="text-slate-400 font-normal" data-magicpath-id="142" data-magicpath-path="SubjectsPage.tsx">(Optional)</span>
                  </label>
                  <textarea id="subject-description" value={newSubject.description} onChange={e => setNewSubject({
                ...newSubject,
                description: e.target.value
              })} placeholder="Add any additional context about this subject..." rows={3} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none" data-magicpath-id="143" data-magicpath-path="SubjectsPage.tsx" />
                </div>

                {/* Test Date (Optional) */}
                <div data-magicpath-id="144" data-magicpath-path="SubjectsPage.tsx">
                  <label htmlFor="test-date" className="block text-sm font-bold text-slate-900 mb-2" data-magicpath-id="145" data-magicpath-path="SubjectsPage.tsx">
                    <div className="flex items-center gap-2" data-magicpath-id="146" data-magicpath-path="SubjectsPage.tsx">
                      <Calendar className="w-4 h-4 text-slate-600" data-magicpath-id="147" data-magicpath-path="SubjectsPage.tsx" />
                      <span data-magicpath-id="148" data-magicpath-path="SubjectsPage.tsx">Test Date</span>
                      <span className="text-slate-400 font-normal" data-magicpath-id="149" data-magicpath-path="SubjectsPage.tsx">(Optional)</span>
                    </div>
                  </label>
                  <input id="test-date" type="date" value={newSubject.testDate} onChange={e => setNewSubject({
                ...newSubject,
                testDate: e.target.value
              })} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" data-magicpath-id="150" data-magicpath-path="SubjectsPage.tsx" />
                  <p className="text-xs text-slate-500 mt-1.5" data-magicpath-id="151" data-magicpath-path="SubjectsPage.tsx">Set a target date for your upcoming test or exam</p>
                </div>

                {/* Teacher Emphasis */}
                <div data-magicpath-id="152" data-magicpath-path="SubjectsPage.tsx">
                  <label htmlFor="teacher-emphasis" className="block text-sm font-bold text-slate-900 mb-2" data-magicpath-id="153" data-magicpath-path="SubjectsPage.tsx">
                    <div className="flex items-center gap-2" data-magicpath-id="154" data-magicpath-path="SubjectsPage.tsx">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span data-magicpath-id="155" data-magicpath-path="SubjectsPage.tsx">Teacher Emphasis</span>
                      <span className="text-slate-400 font-normal" data-magicpath-id="156" data-magicpath-path="SubjectsPage.tsx">(Optional)</span>
                    </div>
                  </label>
                  <textarea id="teacher-emphasis" value={newSubject.teacherEmphasis} onChange={e => setNewSubject({
                ...newSubject,
                teacherEmphasis: e.target.value
              })} placeholder="What does your teacher emphasize? What topics are most important?" rows={4} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none" data-magicpath-id="157" data-magicpath-path="SubjectsPage.tsx" />
                  
                  {/* Examples Section */}
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg" data-magicpath-id="158" data-magicpath-path="SubjectsPage.tsx">
                    <p className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1.5" data-magicpath-id="159" data-magicpath-path="SubjectsPage.tsx">
                      <Sparkles className="w-3.5 h-3.5" />
                      Example teacher emphasis points:
                    </p>
                    <div className="space-y-1.5" data-magicpath-id="160" data-magicpath-path="SubjectsPage.tsx">
                      {exampleEmphases.map((example, idx) => <button key={idx} type="button" onClick={() => setNewSubject({
                    ...newSubject,
                    teacherEmphasis: example
                  })} className="block w-full text-left px-2.5 py-1.5 text-xs text-slate-700 bg-white hover:bg-amber-100 rounded-md transition-colors border border-amber-200/50" data-magicpath-id="161" data-magicpath-path="SubjectsPage.tsx">
                          • {example}
                        </button>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50" data-magicpath-id="162" data-magicpath-path="SubjectsPage.tsx">
              <div className="flex gap-3" data-magicpath-id="163" data-magicpath-path="SubjectsPage.tsx">
                <button onClick={() => setIsAddSubjectOpen(false)} className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all" data-magicpath-id="164" data-magicpath-path="SubjectsPage.tsx">
                  Cancel
                </button>
                <button onClick={handleAddSubject} disabled={!newSubject.name.trim()} className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100" data-magicpath-id="165" data-magicpath-path="SubjectsPage.tsx">
                  Add Subject
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};