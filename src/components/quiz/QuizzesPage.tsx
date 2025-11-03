import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileQuestion,
  Play,
  Clock,
  Target,
  TrendingUp,
  Trophy,
  Calendar,
  ChevronRight,
  Book,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  Star,
  Plus,
  Filter,
  BarChart3,
  Brain,
  X,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { CreateQuizFlow } from './CreateQuizFlow';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useSubjects } from '@/hooks/useSubjects';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import type { Subject } from '@/types/subject';
import type { Quiz } from '@/types/quiz';
type QuizzesPageProps = {
  selectedSubjectId?: string;
  onQuizClick?: (quizId: string) => void;
};

export const QuizzesPage = (props: QuizzesPageProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { quizzes, loading: quizzesLoading, removeQuiz } = useQuizzes();

  // Create "All Subjects" option
  const allSubjectsOption: Subject = {
    id: 'all',
    name: 'All Subjects',
    color: 'from-slate-600 to-slate-700',
    userId: user?.id || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const subjectsWithAll = [allSubjectsOption, ...subjects];
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'draft' | 'ready' | 'in-progress' | 'completed'
  >('all');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(
    subjectsWithAll.find(s => s.id === props.selectedSubjectId) || allSubjectsOption
  );
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);

  // Show loading state
  if (subjectsLoading || quizzesLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your quizzes...</p>
        </div>
      </div>
    );
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
      case 'ready':
        return 'text-green-600 bg-green-50';
      case 'draft':
        return 'text-slate-600 bg-slate-50';
      case 'archived':
        return 'text-amber-600 bg-amber-50';
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
      case 'ready':
        return Target;
      case 'draft':
        return AlertCircle;
      case 'archived':
        return Calendar;
      default:
        return AlertCircle;
    }
  };
  // Helper function to get subject for quiz
  const getSubjectForQuiz = (quiz: Quiz) => {
    return subjects.find(s => s.id === quiz.subjectId);
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesStatus = filterStatus === 'all' || quiz.status === filterStatus;
    const matchesSubject = selectedSubject.id === 'all' || quiz.subjectId === selectedSubject.id;
    return matchesStatus && matchesSubject;
  });

  const stats = {
    total: filteredQuizzes.length,
    completed: filteredQuizzes.filter(q => q.status === 'completed').length,
    ready: filteredQuizzes.filter(q => q.status === 'ready').length,
    draft: filteredQuizzes.filter(q => q.status === 'draft').length,
    inProgress: filteredQuizzes.filter(q => q.status === 'in-progress').length,
    averageScore: 0, // TODO: Calculate from quiz_attempts table
  };
  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Header Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-4 lg:mb-6">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2">
                My Quizzes
              </h1>
              <p className="text-sm lg:text-base text-slate-600">
                Practice and track your performance
              </p>
            </div>
            <button
              onClick={() => setShowCreateQuiz(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create Quiz</span>
            </button>
          </div>

          {/* Subject Filter - Mobile Horizontal Scroll */}
          <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 pb-1">
              {subjectsWithAll.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl transition-all active:scale-95 ${selectedSubject.id === subject.id ? `bg-gradient-to-r ${subject.color} text-white shadow-md` : 'bg-white border-2 border-slate-200 text-slate-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <Book className="w-4 h-4" />
                    <span className="text-sm font-semibold whitespace-nowrap">{subject.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Subject Filter - Desktop Dropdown */}
          <div className="hidden lg:block mb-4">
            <div className="relative inline-block">
              <button
                onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all bg-gradient-to-r ${selectedSubject.color} text-white shadow-md hover:shadow-lg`}
              >
                <Book className="w-5 h-5" />
                <span className="font-semibold">{selectedSubject.name}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isSubjectDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isSubjectDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border-2 border-slate-200 shadow-xl z-10">
                  {subjectsWithAll.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setIsSubjectDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${selectedSubject.id === subject.id ? 'bg-blue-50' : ''}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center`}
                      >
                        <Book className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left font-semibold text-slate-900">
                        {subject.name}
                      </span>
                      {selectedSubject.id === subject.id && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'all' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}
            >
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">Total</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900">{stats.total}</p>
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'completed' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'}`}
            >
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">Done</p>
              <p className="text-xl lg:text-3xl font-bold text-emerald-600">{stats.completed}</p>
            </button>
            <button
              onClick={() => setFilterStatus('in-progress')}
              className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'in-progress' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}
            >
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">In Progress</p>
              <p className="text-xl lg:text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </button>
            <button
              onClick={() => setFilterStatus('ready')}
              className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'ready' ? 'border-green-500 ring-2 ring-green-100' : 'border-slate-200'}`}
            >
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">Ready</p>
              <p className="text-xl lg:text-3xl font-bold text-green-600">{stats.ready}</p>
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${filterStatus === 'draft' ? 'border-slate-500 ring-2 ring-slate-100' : 'border-slate-200'}`}
            >
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">Draft</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900">{stats.draft}</p>
            </button>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="px-4 py-4 lg:px-8 lg:py-6">
        <div className="max-w-7xl mx-auto">
          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No quizzes found</h3>
              <p className="text-slate-600 mb-4">
                {selectedSubject.id !== 'all'
                  ? `No quizzes for ${selectedSubject.name}`
                  : 'Try adjusting your filters'}
              </p>
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setSelectedSubject(allSubjectsOption);
                }}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3 lg:space-y-4">
              {filteredQuizzes.map(quiz => {
                const StatusIcon = getStatusIcon(quiz.status);
                const subject = getSubjectForQuiz(quiz);
                const subjectColor = subject?.color || 'from-slate-500 to-slate-600';
                const subjectName = subject?.name || 'Unknown';
                const timeLimit = quiz.timeLimit || 0;

                return (
                  <div
                    key={quiz.id}
                    onClick={() => navigate(`/app/quizzes/${quiz.id}`)}
                    className="bg-white rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-slate-300 p-4 lg:p-5 transition-all hover:shadow-lg cursor-pointer active:scale-[0.98] group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Quiz Icon & Subject */}
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${subjectColor} flex items-center justify-center shadow-md flex-shrink-0`}
                        >
                          <FileQuestion className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {quiz.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs lg:text-sm text-slate-600 font-medium">
                              {subjectName}
                            </span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                            <span className="text-xs lg:text-sm text-slate-600">
                              {quiz.questionCount} questions
                            </span>
                            {timeLimit > 0 && (
                              <>
                                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                <span className="text-xs lg:text-sm text-slate-600">
                                  {timeLimit} min
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quiz Stats - Mobile */}
                      <div className="flex items-center gap-2 lg:hidden">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(quiz.difficulty)}`}
                        >
                          {quiz.difficulty}
                        </span>
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${getStatusColor(quiz.status)}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold capitalize">{quiz.status}</span>
                        </div>
                      </div>

                      {/* Quiz Stats - Desktop */}
                      <div className="hidden lg:flex items-center gap-3">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${getDifficultyColor(quiz.difficulty)}`}
                        >
                          {quiz.difficulty}
                        </span>

                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getStatusColor(quiz.status)}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-sm font-semibold capitalize">{quiz.status}</span>
                        </div>

                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>

                    {/* Scheduled Date Badge */}
                    {quiz.scheduledFor && (
                      <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-blue-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-semibold">
                          Scheduled for {new Date(quiz.scheduledFor).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setShowCreateQuiz(true)}
        className="lg:hidden fixed bottom-20 right-4 z-30 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Quiz Flow Modal */}
      {showCreateQuiz && (
        <CreateQuizFlow
          onClose={() => setShowCreateQuiz(false)}
          onQuizCreated={(quizId, scheduleTime) => {
            setShowCreateQuiz(false);
            if (!scheduleTime) {
              // Navigate to quiz detail page
              navigate(`/app/quizzes/${quizId}`);
            } else {
              // If scheduled, show success toast
              toast.success('Quiz scheduled successfully!');
            }
          }}
        />
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
