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
import { useAuth } from '../common/AuthContext';
import toast from 'react-hot-toast';

type SubjectWithStats = {
  id: string;
  name: string;
  color: string;
  description?: string;
  testDate?: string;
  createdAt: string;
  totalMaterials?: number;
  totalQuizzes?: number;
  hoursStudied?: number;
  // Enriched fields
  studyHours?: number;
  quizzesTaken?: number;
  progress?: number;
  averageScore?: number;
  passingChance?: number;
  lastStudied?: string;
  upcomingQuiz?: string;
  nextMilestone?: string;
  strongTopics?: string[];
  weakTopics?: string[];
};

type SubjectsPageProps = {
  onSubjectClick?: (subjectId: string) => void;
};

export const SubjectsPage = (props: SubjectsPageProps) => {
  const { user } = useAuth();
  const { addSubject, editSubject, removeSubject, fetchSubjectsWithStats } = useSubjects();
  const [subjects, setSubjects] = useState<SubjectWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch subjects with stats on mount
  useEffect(() => {
    const loadSubjects = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const subjectsData = await fetchSubjectsWithStats();
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Failed to load subjects:', error);
        toast.error('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, [user, fetchSubjectsWithStats]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'needs-attention' | 'on-track' | 'excelling'>(
    'all'
  );
  const [selectedSubject, setSelectedSubject] = useState<SubjectWithStats | null>(null);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    description: '',
    testDate: '',
    teacherEmphasis: '',
    color: 'from-blue-500 to-blue-600',
  });

  const handleAddSubject = async () => {
    if (!user || !newSubject.name.trim()) {
      toast.error('Please enter a subject name');
      return;
    }

    try {
      await addSubject({
        name: newSubject.name,
        color: newSubject.color,
        description: newSubject.description || undefined,
        testDate: newSubject.testDate || undefined,
        teacherEmphasis: newSubject.teacherEmphasis || undefined,
      });
      toast.success(`${newSubject.name} added successfully`);
      setIsAddSubjectOpen(false);
      setNewSubject({
        name: '',
        description: '',
        testDate: '',
        teacherEmphasis: '',
        color: 'from-blue-500 to-blue-600',
      });

      // Refresh subjects list
      const subjectsData = await fetchSubjectsWithStats();
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Failed to add subject:', error);
      toast.error('Failed to add subject');
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
  // Enrich subjects with calculated fields (placeholders for quiz data until implemented)
  const enrichedSubjects = subjects.map(subject => ({
    ...subject,
    // Real data from database
    totalMaterials: subject.totalMaterials || 0,
    totalQuizzes: subject.totalQuizzes || 0,
    studyHours: subject.hoursStudied || 0,
    // Placeholder quiz stats (will be real once quiz system is implemented)
    quizzesTaken: subject.totalQuizzes || 0,
    progress: 0, // Will be calculated from quiz completions
    averageScore: 0, // Will be calculated from quiz results
    passingChance: 0, // Will be calculated from AI predictions
    lastStudied: subject.createdAt ? new Date(subject.createdAt).toLocaleDateString() : 'Never',
    upcomingQuiz: undefined, // Will be set from quiz schedule
    nextMilestone: 'Start adding materials', // Placeholder
    strongTopics: [], // Will be populated from quiz analytics
    weakTopics: [], // Will be populated from quiz analytics
    // UI helpers
    color: subject.color || 'from-blue-500 to-blue-600',
  }));

  const filteredSubjects = enrichedSubjects.filter(subject => {
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
    total: enrichedSubjects.length,
    needsAttention: enrichedSubjects.filter(s => s.passingChance < 75).length,
    onTrack: enrichedSubjects.filter(s => s.passingChance >= 75 && s.passingChance < 90).length,
    excelling: enrichedSubjects.filter(s => s.passingChance >= 90).length,
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
              disabled={loading}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Loading subjects...</p>
              </div>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No subjects found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search or filters</p>
              <button className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {filteredSubjects.map(subject => {
                const PassingIcon = getPassingChanceIcon(subject.passingChance);
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
                        className={`p-2 lg:p-3 rounded-lg ${getPassingChanceColor(subject.passingChance)}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <PassingIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                          <span className="text-[10px] lg:text-xs font-semibold">Passing</span>
                        </div>
                        <p className="text-lg lg:text-xl font-bold">{subject.passingChance}%</p>
                      </div>
                      <div className="p-2 lg:p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Trophy className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-600" />
                          <span className="text-[10px] lg:text-xs font-semibold text-slate-600">
                            Avg Score
                          </span>
                        </div>
                        <p className="text-lg lg:text-xl font-bold text-slate-900">
                          {subject.averageScore}%
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
                    {selectedSubject.progress}%
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
                    {selectedSubject.averageScore}%
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
                    {selectedSubject.strongTopics && selectedSubject.strongTopics.length > 0 ? (
                      selectedSubject.strongTopics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                          <span className="text-sm text-slate-700">{topic}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 italic">
                        Take quizzes to track strong topics
                      </p>
                    )}
                  </div>
                </div>

                {/* Weak Topics */}
                <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-900">Needs Practice</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedSubject.weakTopics && selectedSubject.weakTopics.length > 0 ? (
                      selectedSubject.weakTopics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                          <span className="text-sm text-slate-700">{topic}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 italic">
                        Take quizzes to identify areas for improvement
                      </p>
                    )}
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
                  className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubject}
                  disabled={!newSubject.name.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  Add Subject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
