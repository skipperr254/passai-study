import React, { useState, useEffect } from 'react';
import {
  Book,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Target,
  ChevronRight,
  FileText,
  Brain,
  Trophy,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useSubjects } from '@/hooks/useSubjects';
import type { Subject as SubjectType } from '@/types/subject';

type SubjectWithStats = Partial<SubjectType> & {
  id: string;
  name: string;
  color: string;
  progress?: number;
  passingChance?: number;
  quizzesTaken?: number;
  averageScore?: number;
  lastStudied?: string;
  upcomingQuiz?: string;
  totalMaterials?: number;
  studyHours?: number;
  weakTopics?: string[];
  strongTopics?: string[];
  nextMilestone?: string;
};
type SubjectsPageProps = {
  onSubjectClick?: (subjectId: string) => void;
};

// Color options for subjects
const subjectColors = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-teal-500 to-teal-600',
  'from-indigo-500 to-indigo-600',
  'from-pink-500 to-pink-600',
  'from-red-500 to-red-600',
  'from-cyan-500 to-cyan-600',
  'from-amber-500 to-amber-600',
];

const mockSubjects: SubjectWithStats[] = [
  {
    id: '1',
    userId: '',
    name: 'History',
    color: 'from-blue-500 to-blue-600',
    createdAt: '',
    updatedAt: '',
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
    nextMilestone: 'Complete Chapter 8 Quiz',
  },
  {
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
    nextMilestone: 'Practice 5 More Essays',
  },
  {
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
    nextMilestone: 'Master Derivatives',
  },
  {
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
    nextMilestone: 'Complete Lab Reports',
  },
  {
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
    nextMilestone: 'Study World Maps',
  },
  {
    id: '6',
    userId: '',
    name: 'Computer Science',
    color: 'from-indigo-500 to-indigo-600',
    createdAt: '',
    updatedAt: '',
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
    nextMilestone: 'Complete Sorting Project',
  },
];

export const SubjectsPage = (props: SubjectsPageProps) => {
  const {
    subjects: dbSubjects,
    loading,
    error,
    addSubject,
    editSubject,
    removeSubject,
  } = useSubjects();
  const [subjectsWithStats, setSubjectsWithStats] = useState<SubjectWithStats[]>([]);

  // Transform database subjects to include mock stats (temporary until we implement stats)
  useEffect(() => {
    if (dbSubjects.length > 0) {
      const enriched = dbSubjects.map((subject, idx) => ({
        ...subject,
        progress: Math.floor(Math.random() * 40) + 60, // 60-100
        passingChance: Math.floor(Math.random() * 40) + 60, // 60-100
        quizzesTaken: Math.floor(Math.random() * 10) + 1,
        averageScore: Math.floor(Math.random() * 30) + 70,
        lastStudied: `${Math.floor(Math.random() * 5) + 1} hours ago`,
        totalMaterials: Math.floor(Math.random() * 15) + 5,
        studyHours: Math.floor(Math.random() * 20) + 10,
        weakTopics: ['Topic 1', 'Topic 2'],
        strongTopics: ['Topic 3', 'Topic 4'],
        nextMilestone: 'Complete next quiz',
      }));
      setSubjectsWithStats(enriched);
    } else if (!loading) {
      setSubjectsWithStats([]);
    }
  }, [dbSubjects, loading]);

  const subjects = subjectsWithStats.length > 0 ? subjectsWithStats : mockSubjects;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'needs-attention' | 'on-track' | 'excelling'>(
    'all'
  );
  const [selectedSubject, setSelectedSubject] = useState<SubjectWithStats | null>(null);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [newSubject, setNewSubject] = useState({
    name: '',
    description: '',
    testDate: '',
    teacherEmphasis: '',
  });

  const handleAddSubject = async () => {
    if (!newSubject.name.trim()) return;

    setIsSaving(true);
    try {
      const result = await addSubject({
        name: newSubject.name.trim(),
        color: subjectColors[selectedColorIndex],
        description: newSubject.description.trim() || undefined,
        testDate: newSubject.testDate || undefined,
        teacherEmphasis: newSubject.teacherEmphasis.trim() || undefined,
      });

      if (result) {
        setIsAddSubjectOpen(false);
        setNewSubject({
          name: '',
          description: '',
          testDate: '',
          teacherEmphasis: '',
        });
        setSelectedColorIndex(0);
      }
    } catch (err) {
      console.error('Failed to add subject:', err);
    } finally {
      setIsSaving(false);
    }
  };
  const exampleEmphases = [
    'Focus on problem-solving methods',
    'Memorize key dates and events',
    'Understand concepts, not just formulas',
    'Practice essay writing techniques',
    'Review homework problems weekly',
  ];
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
    const chance = subject.passingChance ?? 0;
    switch (filterBy) {
      case 'needs-attention':
        return chance < 75;
      case 'on-track':
        return chance >= 75 && chance < 90;
      case 'excelling':
        return chance >= 90;
      default:
        return true;
    }
  });
  const stats = {
    total: subjects.length,
    needsAttention: subjects.filter(s => (s.passingChance ?? 0) < 75).length,
    onTrack: subjects.filter(s => {
      const chance = s.passingChance ?? 0;
      return chance >= 75 && chance < 90;
    }).length,
    excelling: subjects.filter(s => (s.passingChance ?? 0) >= 90).length,
  };
  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Header Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-4 lg:mb-6">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2">
                My Subjects
              </h1>
              <p className="text-sm lg:text-base text-slate-600">
                Manage and track your learning progress
              </p>
            </div>
            <button
              onClick={() => setIsAddSubjectOpen(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Add Subject</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-2 lg:gap-4 mb-4">
            <button
              onClick={() => setFilterBy('all')}
              className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterBy === 'all' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}
            >
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">Total</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900">{stats.total}</p>
            </button>
            <button
              onClick={() => setFilterBy('needs-attention')}
              className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterBy === 'needs-attention' ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'}`}
            >
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">Needs Help</p>
              <p className="text-xl lg:text-3xl font-bold text-red-600">{stats.needsAttention}</p>
            </button>
            <button
              onClick={() => setFilterBy('on-track')}
              className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterBy === 'on-track' ? 'border-green-500 ring-2 ring-green-100' : 'border-slate-200'}`}
            >
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">On Track</p>
              <p className="text-xl lg:text-3xl font-bold text-green-600">{stats.onTrack}</p>
            </button>
            <button
              onClick={() => setFilterBy('excelling')}
              className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterBy === 'excelling' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'}`}
            >
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">Excelling</p>
              <p className="text-xl lg:text-3xl font-bold text-emerald-600">{stats.excelling}</p>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 bg-white border-2 border-slate-200 rounded-xl text-sm lg:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="px-4 py-4 lg:px-8 lg:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Error State */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900">Error loading subjects</p>
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-600 font-medium">Loading subjects...</p>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {subjects.length === 0 ? 'No subjects yet' : 'No subjects found'}
              </h3>
              <p className="text-slate-600 mb-4">
                {subjects.length === 0
                  ? 'Get started by adding your first subject'
                  : 'Try adjusting your search or filters'}
              </p>
              <button
                onClick={() =>
                  subjects.length === 0 ? setIsAddSubjectOpen(true) : setSearchQuery('')
                }
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                {subjects.length === 0 ? 'Add Your First Subject' : 'Clear Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {filteredSubjects.map(subject => {
                const PassingIcon = getPassingChanceIcon(subject.passingChance ?? 0);
                return (
                  <div
                    key={subject.id}
                    onClick={() => {
                      setSelectedSubject(subject);
                      props.onSubjectClick?.(subject.id);
                    }}
                    className="bg-white rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-slate-300 p-4 lg:p-5 transition-all hover:shadow-lg cursor-pointer active:scale-[0.98] group"
                  >
                    {/* Subject Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-md flex-shrink-0`}
                      >
                        <Book className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                          {subject.name}
                        </h3>
                        <p className="text-xs lg:text-sm text-slate-600">
                          {subject.quizzesTaken} quizzes • {subject.totalMaterials} materials
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-600">Progress</span>
                        <span className="text-sm font-bold text-slate-900">
                          {subject.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${subject.color} rounded-full transition-all duration-500`}
                          style={{
                            width: `${subject.progress}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div
                        className={`p-2 lg:p-3 rounded-lg ${getPassingChanceColor(subject.passingChance ?? 0)}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <PassingIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                          <span className="text-[10px] lg:text-xs font-semibold">Passing</span>
                        </div>
                        <p className="text-lg lg:text-xl font-bold">
                          {subject.passingChance ?? 0}%
                        </p>
                      </div>
                      <div className="p-2 lg:p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Trophy className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-600" />
                          <span className="text-[10px] lg:text-xs font-semibold text-slate-600">
                            Avg Score
                          </span>
                        </div>
                        <p className="text-lg lg:text-xl font-bold text-slate-900">
                          {subject.averageScore ?? 0}%
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{subject.lastStudied}</span>
                      </div>
                      {subject.upcomingQuiz && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-semibold">Quiz Soon</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Subject Detail Modal */}
      {selectedSubject && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedSubject(null)}
        >
          <div
            className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-3xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-gradient-to-br ${selectedSubject.color}`}
            >
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden"></div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Book className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedSubject.name}</h2>
                  <p className="text-white/90 text-sm">
                    {selectedSubject.studyHours} hours studied • {selectedSubject.totalMaterials}{' '}
                    materials
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {selectedSubject.progress ?? 0}%
                  </p>
                  <p className="text-xs text-slate-600 font-medium">Progress</p>
                </div>
                <div
                  className={`text-center p-4 rounded-xl ${getPassingChanceColor(selectedSubject.passingChance ?? 0)}`}
                >
                  <p className="text-2xl font-bold mb-1">{selectedSubject.passingChance ?? 0}%</p>
                  <p className="text-xs font-medium">Passing</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {selectedSubject.averageScore ?? 0}%
                  </p>
                  <p className="text-xs text-slate-600 font-medium">Avg Score</p>
                </div>
              </div>

              {/* Next Milestone */}
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-600 mb-1">NEXT MILESTONE</p>
                    <p className="text-sm font-bold text-slate-900">
                      {selectedSubject.nextMilestone}
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                    Start
                  </button>
                </div>
              </div>

              {/* Topics Analysis */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Strong Topics */}
                <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">Strong Topics</h3>
                  </div>
                  <div className="space-y-2">
                    {(selectedSubject.strongTopics || []).map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                        <span className="text-sm text-slate-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weak Topics */}
                <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-900">Needs Practice</h3>
                  </div>
                  <div className="space-y-2">
                    {(selectedSubject.weakTopics || []).map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                        <span className="text-sm text-slate-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all">
                  <Brain className="w-5 h-5" />
                  <span>Study Now</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all">
                  <FileText className="w-5 h-5" />
                  <span>Materials</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setIsAddSubjectOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-30 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Subject Modal */}
      {isAddSubjectOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsAddSubjectOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-gradient-to-br from-blue-500 to-indigo-600">
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden"></div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">Add New Subject</h2>
                  <p className="text-white/90 text-sm">Start tracking your progress</p>
                </div>
                <button
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content - Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-3">
                    Subject Color <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {subjectColors.map((color, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColorIndex(idx)}
                        className={`h-12 rounded-lg bg-gradient-to-br ${color} transition-all ${
                          selectedColorIndex === idx
                            ? 'ring-4 ring-blue-500 ring-offset-2 scale-105'
                            : 'hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Subject Name */}
                <div>
                  <label
                    htmlFor="subject-name"
                    className="block text-sm font-bold text-slate-900 mb-2"
                  >
                    Subject Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject-name"
                    type="text"
                    value={newSubject.name}
                    onChange={e =>
                      setNewSubject({
                        ...newSubject,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., Mathematics, History, Biology"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    required
                    disabled={isSaving}
                  />
                </div>

                {/* Description (Optional) */}
                <div>
                  <label
                    htmlFor="subject-description"
                    className="block text-sm font-bold text-slate-900 mb-2"
                  >
                    Description <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="subject-description"
                    value={newSubject.description}
                    onChange={e =>
                      setNewSubject({
                        ...newSubject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Add any additional context about this subject..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  />
                </div>

                {/* Test Date (Optional) */}
                <div>
                  <label
                    htmlFor="test-date"
                    className="block text-sm font-bold text-slate-900 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      <span>Test Date</span>
                      <span className="text-slate-400 font-normal">(Optional)</span>
                    </div>
                  </label>
                  <input
                    id="test-date"
                    type="date"
                    value={newSubject.testDate}
                    onChange={e =>
                      setNewSubject({
                        ...newSubject,
                        testDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    Set a target date for your upcoming test or exam
                  </p>
                </div>

                {/* Teacher Emphasis */}
                <div>
                  <label
                    htmlFor="teacher-emphasis"
                    className="block text-sm font-bold text-slate-900 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Teacher Emphasis</span>
                      <span className="text-slate-400 font-normal">(Optional)</span>
                    </div>
                  </label>
                  <textarea
                    id="teacher-emphasis"
                    value={newSubject.teacherEmphasis}
                    onChange={e =>
                      setNewSubject({
                        ...newSubject,
                        teacherEmphasis: e.target.value,
                      })
                    }
                    placeholder="What does your teacher emphasize? What topics are most important?"
                    rows={4}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  />

                  {/* Examples Section */}
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Example teacher emphasis points:
                    </p>
                    <div className="space-y-1.5">
                      {exampleEmphases.map((example, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setNewSubject({
                              ...newSubject,
                              teacherEmphasis: example,
                            })
                          }
                          className="block w-full text-left px-2.5 py-1.5 text-xs text-slate-700 bg-white hover:bg-amber-100 rounded-md transition-colors border border-amber-200/50"
                        >
                          • {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="flex gap-3">
                <button
                  onClick={() => setIsAddSubjectOpen(false)}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubject}
                  disabled={!newSubject.name.trim() || isSaving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <span>Add Subject</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
