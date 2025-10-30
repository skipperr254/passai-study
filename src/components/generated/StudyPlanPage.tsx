"use client";

import React, { useState } from 'react';
import { Book, Target, Clock, Calendar, CheckCircle2, Circle, TrendingUp, Brain, Zap, Award, AlertCircle, ChevronRight, Play, Pause, RotateCcw, Sparkles, FlaskConical, BookOpen, FileText, MessageSquare, CheckCheck, Timer, X, ArrowRight, Trophy, Flame, Star, Info, BarChart3, Lightbulb, Flag } from 'lucide-react';
type Subject = {
  id: string;
  name: string;
  color: string;
  mastery: number;
  passingChance: number;
  weakTopics: string[];
  testDate: string;
  daysUntilTest: number;
};
type TopicMastery = {
  id: string;
  name: string;
  mastery: number;
  quizzesTaken: number;
  lastQuizScore: number;
  trend: 'up' | 'down' | 'stable';
};
type StudyTaskType = 'review' | 'practice' | 'quiz' | 'flashcards' | 'material';
type StudyTask = {
  id: string;
  title: string;
  type: StudyTaskType;
  topic: string;
  estimatedTime: number; // minutes
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  verified: boolean;
  description: string;
  requiresVerification: boolean;
};
type StudySession = {
  taskId: string;
  startTime: number;
  endTime?: number;
  topicsStudied: string[];
  notes: string;
};
type FlashCard = {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: number;
  confidence: 'low' | 'medium' | 'high' | null;
};
const mockSubjects: Subject[] = [{
  id: '1',
  name: 'History',
  color: 'from-blue-500 to-blue-600',
  mastery: 72,
  passingChance: 78,
  weakTopics: ['World War II', 'Renaissance Era', 'Industrial Revolution'],
  testDate: 'Dec 15, 2024',
  daysUntilTest: 8
}, {
  id: '2',
  name: 'Mathematics',
  color: 'from-green-500 to-green-600',
  mastery: 85,
  passingChance: 92,
  weakTopics: ['Calculus', 'Trigonometry'],
  testDate: 'Dec 18, 2024',
  daysUntilTest: 11
}, {
  id: '3',
  name: 'Science',
  color: 'from-orange-500 to-orange-600',
  mastery: 65,
  passingChance: 68,
  weakTopics: ['Organic Chemistry', 'Thermodynamics', 'Cell Biology'],
  testDate: 'Dec 12, 2024',
  daysUntilTest: 5
}];
const mockTopics: TopicMastery[] = [{
  id: '1',
  name: 'World War II',
  mastery: 45,
  quizzesTaken: 3,
  lastQuizScore: 52,
  trend: 'up'
}, {
  id: '2',
  name: 'Renaissance Era',
  mastery: 68,
  quizzesTaken: 4,
  lastQuizScore: 75,
  trend: 'up'
}, {
  id: '3',
  name: 'American Revolution',
  mastery: 88,
  quizzesTaken: 5,
  lastQuizScore: 92,
  trend: 'stable'
}, {
  id: '4',
  name: 'Industrial Revolution',
  mastery: 58,
  quizzesTaken: 2,
  lastQuizScore: 60,
  trend: 'down'
}];
const mockTasks: StudyTask[] = [{
  id: '1',
  title: 'Review WWII Timeline',
  type: 'material',
  topic: 'World War II',
  estimatedTime: 25,
  priority: 'high',
  completed: false,
  verified: false,
  description: 'Go through uploaded materials on WWII major events',
  requiresVerification: true
}, {
  id: '2',
  title: 'Practice Quiz: Renaissance',
  type: 'quiz',
  topic: 'Renaissance Era',
  estimatedTime: 15,
  priority: 'high',
  completed: false,
  verified: false,
  description: 'Take a 10-question quiz on Renaissance key figures',
  requiresVerification: false
}, {
  id: '3',
  title: 'Flashcard Review',
  type: 'flashcards',
  topic: 'World War II',
  estimatedTime: 10,
  priority: 'medium',
  completed: true,
  verified: true,
  description: 'Review 15 key terms and dates',
  requiresVerification: true
}, {
  id: '4',
  title: 'Deep Dive: Industrial Revolution',
  type: 'review',
  topic: 'Industrial Revolution',
  estimatedTime: 30,
  priority: 'medium',
  completed: false,
  verified: false,
  description: 'Study causes and effects in detail',
  requiresVerification: true
}];
const mockFlashcards: FlashCard[] = [{
  id: '1',
  front: 'When did World War II begin?',
  back: 'September 1, 1939 - when Germany invaded Poland',
  difficulty: 'easy',
  confidence: null
}, {
  id: '2',
  front: 'What were the main Axis powers?',
  back: 'Germany, Italy, and Japan',
  difficulty: 'easy',
  confidence: null
}, {
  id: '3',
  front: 'What was Operation Overlord?',
  back: 'The codename for the Battle of Normandy (D-Day), the Allied invasion of German-occupied Western Europe during WWII, launched on June 6, 1944.',
  difficulty: 'medium',
  confidence: null
}];
type StudyPlanPageProps = {
  preSelectedSubjectId?: string;
};
export const StudyPlanPage = ({
  preSelectedSubjectId
}: StudyPlanPageProps) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(preSelectedSubjectId ? mockSubjects.find(s => s.id === preSelectedSubjectId) || mockSubjects[0] : mockSubjects[0]);
  const [tasks, setTasks] = useState<StudyTask[]>(mockTasks);
  const [activeTask, setActiveTask] = useState<StudyTask | null>(null);
  const [studySession, setStudySession] = useState<StudySession | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showFlashcardsModal, setShowFlashcardsModal] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashCard[]>(mockFlashcards);
  const [sessionTime, setSessionTime] = useState(0);
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = completedTasks / totalTasks * 100;
  const estimatedTimeRemaining = tasks.filter(t => !t.completed).reduce((acc, t) => acc + t.estimatedTime, 0);
  const handleStartTask = (task: StudyTask) => {
    setActiveTask(task);
    setShowTaskModal(true);
    if (task.type === 'flashcards') {
      setShowFlashcardsModal(true);
      setCurrentFlashcardIndex(0);
      setShowAnswer(false);
    } else {
      // Start study session
      setStudySession({
        taskId: task.id,
        startTime: Date.now(),
        topicsStudied: [task.topic],
        notes: ''
      });
    }
  };
  const handleCompleteTask = (taskId: string, verified: boolean = false) => {
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      completed: true,
      verified
    } : t));
    if (studySession) {
      setStudySession({
        ...studySession,
        endTime: Date.now()
      });
    }
    setShowTaskModal(false);
    setActiveTask(null);
  };
  const handleFlashcardConfidence = (confidence: 'low' | 'medium' | 'high') => {
    const updatedCards = [...flashcards];
    updatedCards[currentFlashcardIndex].confidence = confidence;
    setFlashcards(updatedCards);
    if (currentFlashcardIndex < flashcards.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
      setShowAnswer(false);
    } else {
      // All cards reviewed
      if (activeTask) {
        handleCompleteTask(activeTask.id, true);
      }
      setShowFlashcardsModal(false);
    }
  };
  const getTaskIcon = (type: StudyTaskType) => {
    switch (type) {
      case 'review':
        return BookOpen;
      case 'practice':
        return Brain;
      case 'quiz':
        return FlaskConical;
      case 'flashcards':
        return Zap;
      case 'material':
        return FileText;
      default:
        return Circle;
    }
  };
  const getTaskColor = (type: StudyTaskType) => {
    switch (type) {
      case 'review':
        return 'from-blue-500 to-blue-600';
      case 'practice':
        return 'from-purple-500 to-purple-600';
      case 'quiz':
        return 'from-red-500 to-red-600';
      case 'flashcards':
        return 'from-amber-500 to-amber-600';
      case 'material':
        return 'from-green-500 to-green-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-emerald-600';
    if (mastery >= 60) return 'text-green-600';
    if (mastery >= 40) return 'text-amber-600';
    return 'text-red-600';
  };
  const getMasteryBg = (mastery: number) => {
    if (mastery >= 80) return 'from-emerald-500 to-green-600';
    if (mastery >= 60) return 'from-green-500 to-emerald-600';
    if (mastery >= 40) return 'from-amber-500 to-yellow-600';
    return 'from-red-500 to-orange-600';
  };
  return <div className="h-full overflow-y-auto pb-4" data-magicpath-id="0" data-magicpath-path="StudyPlanPage.tsx">
      {/* Header Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br from-slate-50 to-indigo-50/30 border-b border-slate-200/60" data-magicpath-id="1" data-magicpath-path="StudyPlanPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="2" data-magicpath-path="StudyPlanPage.tsx">
          {/* Subject Selector - Mobile Horizontal Scroll */}
          <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto hide-scrollbar" data-magicpath-id="3" data-magicpath-path="StudyPlanPage.tsx">
            <div className="flex gap-2 pb-1" data-magicpath-id="4" data-magicpath-path="StudyPlanPage.tsx">
              {mockSubjects.map(subject => <button key={subject.id} onClick={() => setSelectedSubject(subject)} className={`flex-shrink-0 px-3 py-2 rounded-xl transition-all active:scale-95 ${selectedSubject.id === subject.id ? `bg-gradient-to-r ${subject.color} text-white shadow-md` : 'bg-white border-2 border-slate-200 text-slate-700'}`} data-magicpath-id="5" data-magicpath-path="StudyPlanPage.tsx">
                  <div className="flex items-center gap-2" data-magicpath-id="6" data-magicpath-path="StudyPlanPage.tsx">
                    <Book className="w-4 h-4" data-magicpath-id="7" data-magicpath-path="StudyPlanPage.tsx" />
                    <span className="text-sm font-semibold whitespace-nowrap" data-magicpath-id="8" data-magicpath-path="StudyPlanPage.tsx">
                      {subject.name}
                    </span>
                  </div>
                </button>)}
            </div>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between mb-4" data-magicpath-id="9" data-magicpath-path="StudyPlanPage.tsx">
            <div data-magicpath-id="10" data-magicpath-path="StudyPlanPage.tsx">
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2" data-magicpath-id="11" data-magicpath-path="StudyPlanPage.tsx">
                Study Plan
              </h1>
              <p className="text-sm lg:text-base text-slate-600" data-magicpath-id="12" data-magicpath-path="StudyPlanPage.tsx">
                {selectedSubject.name} • {selectedSubject.daysUntilTest} days until test
              </p>
            </div>
            
            {/* Desktop Subject Selector */}
            <div className="hidden lg:block" data-magicpath-id="13" data-magicpath-path="StudyPlanPage.tsx">
              <select value={selectedSubject.id} onChange={e => setSelectedSubject(mockSubjects.find(s => s.id === e.target.value)!)} className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-semibold text-slate-900 cursor-pointer hover:border-blue-400 transition-all" data-magicpath-id="14" data-magicpath-path="StudyPlanPage.tsx">
                {mockSubjects.map(subject => <option key={subject.id} value={subject.id} data-magicpath-id="15" data-magicpath-path="StudyPlanPage.tsx">
                    {subject.name}
                  </option>)}
              </select>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4" data-magicpath-id="16" data-magicpath-path="StudyPlanPage.tsx">
            {/* Mastery */}
            <div className="bg-white rounded-xl p-3 lg:p-4 border-2 border-slate-200" data-magicpath-id="17" data-magicpath-path="StudyPlanPage.tsx">
              <div className="flex items-center gap-2 mb-2" data-magicpath-id="18" data-magicpath-path="StudyPlanPage.tsx">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getMasteryBg(selectedSubject.mastery)} flex items-center justify-center`} data-magicpath-id="19" data-magicpath-path="StudyPlanPage.tsx">
                  <Brain className="w-4 h-4 text-white" data-magicpath-id="20" data-magicpath-path="StudyPlanPage.tsx" />
                </div>
                <p className="text-xs font-semibold text-slate-600" data-magicpath-id="21" data-magicpath-path="StudyPlanPage.tsx">Mastery</p>
              </div>
              <p className={`text-2xl lg:text-3xl font-bold ${getMasteryColor(selectedSubject.mastery)}`} data-magicpath-id="22" data-magicpath-path="StudyPlanPage.tsx">
                {selectedSubject.mastery}%
              </p>
            </div>

            {/* Passing Chance */}
            <div className="bg-white rounded-xl p-3 lg:p-4 border-2 border-slate-200" data-magicpath-id="23" data-magicpath-path="StudyPlanPage.tsx">
              <div className="flex items-center gap-2 mb-2" data-magicpath-id="24" data-magicpath-path="StudyPlanPage.tsx">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center" data-magicpath-id="25" data-magicpath-path="StudyPlanPage.tsx">
                  <Target className="w-4 h-4 text-white" data-magicpath-id="26" data-magicpath-path="StudyPlanPage.tsx" />
                </div>
                <p className="text-xs font-semibold text-slate-600" data-magicpath-id="27" data-magicpath-path="StudyPlanPage.tsx">Pass %</p>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-green-600" data-magicpath-id="28" data-magicpath-path="StudyPlanPage.tsx">
                {selectedSubject.passingChance}%
              </p>
            </div>

            {/* Days Until Test */}
            <div className="bg-white rounded-xl p-3 lg:p-4 border-2 border-slate-200" data-magicpath-id="29" data-magicpath-path="StudyPlanPage.tsx">
              <div className="flex items-center gap-2 mb-2" data-magicpath-id="30" data-magicpath-path="StudyPlanPage.tsx">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center" data-magicpath-id="31" data-magicpath-path="StudyPlanPage.tsx">
                  <Calendar className="w-4 h-4 text-white" data-magicpath-id="32" data-magicpath-path="StudyPlanPage.tsx" />
                </div>
                <p className="text-xs font-semibold text-slate-600" data-magicpath-id="33" data-magicpath-path="StudyPlanPage.tsx">Days Left</p>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-orange-600" data-magicpath-id="34" data-magicpath-path="StudyPlanPage.tsx">
                {selectedSubject.daysUntilTest}
              </p>
            </div>

            {/* Time Remaining */}
            <div className="bg-white rounded-xl p-3 lg:p-4 border-2 border-slate-200" data-magicpath-id="35" data-magicpath-path="StudyPlanPage.tsx">
              <div className="flex items-center gap-2 mb-2" data-magicpath-id="36" data-magicpath-path="StudyPlanPage.tsx">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center" data-magicpath-id="37" data-magicpath-path="StudyPlanPage.tsx">
                  <Clock className="w-4 h-4 text-white" data-magicpath-id="38" data-magicpath-path="StudyPlanPage.tsx" />
                </div>
                <p className="text-xs font-semibold text-slate-600" data-magicpath-id="39" data-magicpath-path="StudyPlanPage.tsx">Est. Time</p>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-blue-600" data-magicpath-id="40" data-magicpath-path="StudyPlanPage.tsx">
                {estimatedTimeRemaining}m
              </p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4 lg:p-5" data-magicpath-id="41" data-magicpath-path="StudyPlanPage.tsx">
            <div className="flex items-center justify-between mb-3" data-magicpath-id="42" data-magicpath-path="StudyPlanPage.tsx">
              <div data-magicpath-id="43" data-magicpath-path="StudyPlanPage.tsx">
                <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-1" data-magicpath-id="44" data-magicpath-path="StudyPlanPage.tsx">
                  Today's Progress
                </h3>
                <p className="text-sm text-slate-600" data-magicpath-id="45" data-magicpath-path="StudyPlanPage.tsx">
                  {completedTasks} of {totalTasks} tasks completed
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-blue-200" data-magicpath-id="46" data-magicpath-path="StudyPlanPage.tsx">
                <Trophy className="w-5 h-5 text-amber-500" data-magicpath-id="47" data-magicpath-path="StudyPlanPage.tsx" />
                <span className="text-lg font-bold text-slate-900" data-magicpath-id="48" data-magicpath-path="StudyPlanPage.tsx">
                  {completedTasks}
                </span>
              </div>
            </div>

            <div className="relative h-3 bg-blue-100 rounded-full overflow-hidden mb-2" data-magicpath-id="49" data-magicpath-path="StudyPlanPage.tsx">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500" style={{
              width: `${progressPercentage}%`
            }} data-magicpath-id="50" data-magicpath-path="StudyPlanPage.tsx" />
            </div>
            <p className="text-xs text-slate-600 font-medium" data-magicpath-id="51" data-magicpath-path="StudyPlanPage.tsx">
              {progressPercentage.toFixed(0)}% Complete
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 lg:px-8 lg:py-6" data-magicpath-id="52" data-magicpath-path="StudyPlanPage.tsx">
        <div className="max-w-7xl mx-auto space-y-6" data-magicpath-id="53" data-magicpath-path="StudyPlanPage.tsx">
          {/* Weak Topics Section */}
          <section data-magicpath-id="54" data-magicpath-path="StudyPlanPage.tsx">
            <div className="flex items-center justify-between mb-4" data-magicpath-id="55" data-magicpath-path="StudyPlanPage.tsx">
              <div className="flex items-center gap-2" data-magicpath-id="56" data-magicpath-path="StudyPlanPage.tsx">
                <AlertCircle className="w-5 h-5 text-red-600" data-magicpath-id="57" data-magicpath-path="StudyPlanPage.tsx" />
                <h2 className="text-lg lg:text-xl font-bold text-slate-900" data-magicpath-id="58" data-magicpath-path="StudyPlanPage.tsx">
                  Focus Areas
                </h2>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1" data-magicpath-id="59" data-magicpath-path="StudyPlanPage.tsx">
                View All
                <ChevronRight className="w-4 h-4" data-magicpath-id="60" data-magicpath-path="StudyPlanPage.tsx" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3" data-magicpath-id="61" data-magicpath-path="StudyPlanPage.tsx">
              {mockTopics.filter(t => t.mastery < 75).slice(0, 3).map(topic => <div key={topic.id} className="bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-blue-300 transition-all" data-magicpath-id="62" data-magicpath-path="StudyPlanPage.tsx">
                    <div className="flex items-start justify-between mb-3" data-magicpath-id="63" data-magicpath-path="StudyPlanPage.tsx">
                      <h3 className="font-bold text-slate-900 text-sm" data-magicpath-id="64" data-magicpath-path="StudyPlanPage.tsx">
                        {topic.name}
                      </h3>
                      <div className={`px-2 py-1 rounded-lg text-xs font-bold ${topic.trend === 'up' ? 'bg-green-100 text-green-700' : topic.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`} data-magicpath-id="65" data-magicpath-path="StudyPlanPage.tsx">
                        {topic.trend === 'up' ? '↗' : topic.trend === 'down' ? '↘' : '→'}
                      </div>
                    </div>

                    <div className="space-y-2" data-magicpath-id="66" data-magicpath-path="StudyPlanPage.tsx">
                      <div className="flex items-center justify-between text-sm" data-magicpath-id="67" data-magicpath-path="StudyPlanPage.tsx">
                        <span className="text-slate-600" data-magicpath-id="68" data-magicpath-path="StudyPlanPage.tsx">Mastery</span>
                        <span className={`font-bold ${getMasteryColor(topic.mastery)}`} data-magicpath-id="69" data-magicpath-path="StudyPlanPage.tsx">
                          {topic.mastery}%
                        </span>
                      </div>
                      
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden" data-magicpath-id="70" data-magicpath-path="StudyPlanPage.tsx">
                        <div className={`h-full bg-gradient-to-r ${getMasteryBg(topic.mastery)} rounded-full transition-all`} style={{
                    width: `${topic.mastery}%`
                  }} data-magicpath-id="71" data-magicpath-path="StudyPlanPage.tsx" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600" data-magicpath-id="72" data-magicpath-path="StudyPlanPage.tsx">
                        <span data-magicpath-id="73" data-magicpath-path="StudyPlanPage.tsx">{topic.quizzesTaken} quizzes</span>
                        <span data-magicpath-id="74" data-magicpath-path="StudyPlanPage.tsx">Last: {topic.lastQuizScore}%</span>
                      </div>
                    </div>
                  </div>)}
            </div>
          </section>

          {/* Study Tasks */}
          <section data-magicpath-id="75" data-magicpath-path="StudyPlanPage.tsx">
            <div className="flex items-center justify-between mb-4" data-magicpath-id="76" data-magicpath-path="StudyPlanPage.tsx">
              <div className="flex items-center gap-2" data-magicpath-id="77" data-magicpath-path="StudyPlanPage.tsx">
                <CheckCircle2 className="w-5 h-5 text-blue-600" data-magicpath-id="78" data-magicpath-path="StudyPlanPage.tsx" />
                <h2 className="text-lg lg:text-xl font-bold text-slate-900" data-magicpath-id="79" data-magicpath-path="StudyPlanPage.tsx">
                  Study Tasks
                </h2>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1" data-magicpath-id="80" data-magicpath-path="StudyPlanPage.tsx">
                Regenerate
                <RotateCcw className="w-4 h-4" data-magicpath-id="81" data-magicpath-path="StudyPlanPage.tsx" />
              </button>
            </div>

            <div className="space-y-3" data-magicpath-id="82" data-magicpath-path="StudyPlanPage.tsx">
              {tasks.map(task => {
              const TaskIcon = getTaskIcon(task.type);
              return <div key={task.id} className={`bg-white rounded-xl border-2 p-4 lg:p-5 transition-all ${task.completed ? 'border-green-200 bg-green-50/30' : 'border-slate-200 hover:border-blue-300 hover:shadow-md'}`} data-magicpath-id="83" data-magicpath-path="StudyPlanPage.tsx">
                    <div className="flex items-start gap-3" data-magicpath-id="84" data-magicpath-path="StudyPlanPage.tsx">
                      {/* Checkbox */}
                      <button onClick={() => task.completed ? null : handleCompleteTask(task.id, !task.requiresVerification)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${task.completed ? 'bg-green-600 border-green-600' : 'border-slate-300 hover:border-blue-500'}`} data-magicpath-id="85" data-magicpath-path="StudyPlanPage.tsx">
                        {task.completed && <CheckCircle2 className="w-5 h-5 text-white" data-magicpath-id="86" data-magicpath-path="StudyPlanPage.tsx" />}
                      </button>

                      {/* Task Icon */}
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${getTaskColor(task.type)} flex items-center justify-center flex-shrink-0 shadow-sm`} data-magicpath-id="87" data-magicpath-path="StudyPlanPage.tsx">
                        <TaskIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" data-magicpath-id="88" data-magicpath-path="StudyPlanPage.tsx" />
                      </div>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0" data-magicpath-id="89" data-magicpath-path="StudyPlanPage.tsx">
                        <div className="flex items-start gap-2 mb-2" data-magicpath-id="90" data-magicpath-path="StudyPlanPage.tsx">
                          <h3 className={`font-bold text-slate-900 text-sm lg:text-base ${task.completed ? 'line-through text-slate-500' : ''}`} data-magicpath-id="91" data-magicpath-path="StudyPlanPage.tsx">
                            {task.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getPriorityColor(task.priority)} flex-shrink-0`} data-magicpath-id="92" data-magicpath-path="StudyPlanPage.tsx">
                            {task.priority}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 mb-3" data-magicpath-id="93" data-magicpath-path="StudyPlanPage.tsx">
                          {task.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs" data-magicpath-id="94" data-magicpath-path="StudyPlanPage.tsx">
                          <span className="flex items-center gap-1 text-slate-600" data-magicpath-id="95" data-magicpath-path="StudyPlanPage.tsx">
                            <Clock className="w-3.5 h-3.5" data-magicpath-id="96" data-magicpath-path="StudyPlanPage.tsx" />
                            {task.estimatedTime} min
                          </span>
                          <span className="flex items-center gap-1 text-slate-600" data-magicpath-id="97" data-magicpath-path="StudyPlanPage.tsx">
                            <BookOpen className="w-3.5 h-3.5" data-magicpath-id="98" data-magicpath-path="StudyPlanPage.tsx" />
                            {task.topic}
                          </span>
                          {task.verified && <span className="flex items-center gap-1 text-green-600 font-semibold" data-magicpath-id="99" data-magicpath-path="StudyPlanPage.tsx">
                              <CheckCheck className="w-3.5 h-3.5" data-magicpath-id="100" data-magicpath-path="StudyPlanPage.tsx" />
                              Verified
                            </span>}
                        </div>
                      </div>

                      {/* Action Button */}
                      {!task.completed && <button onClick={() => handleStartTask(task)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 flex-shrink-0" data-magicpath-id="101" data-magicpath-path="StudyPlanPage.tsx">
                          <Play className="w-4 h-4" data-magicpath-id="102" data-magicpath-path="StudyPlanPage.tsx" />
                          <span className="hidden sm:inline" data-magicpath-id="103" data-magicpath-path="StudyPlanPage.tsx">Start</span>
                        </button>}
                    </div>
                  </div>;
            })}
            </div>
          </section>

          {/* Study Tips */}
          <section className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-5 lg:p-6" data-magicpath-id="104" data-magicpath-path="StudyPlanPage.tsx">
            <div className="flex items-start gap-3" data-magicpath-id="105" data-magicpath-path="StudyPlanPage.tsx">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0" data-magicpath-id="106" data-magicpath-path="StudyPlanPage.tsx">
                <Lightbulb className="w-6 h-6 text-white" data-magicpath-id="107" data-magicpath-path="StudyPlanPage.tsx" />
              </div>
              <div data-magicpath-id="108" data-magicpath-path="StudyPlanPage.tsx">
                <h3 className="text-lg font-bold text-slate-900 mb-2" data-magicpath-id="109" data-magicpath-path="StudyPlanPage.tsx">
                  Smart Study Tip
                </h3>
                <p className="text-sm text-slate-700 mb-3" data-magicpath-id="110" data-magicpath-path="StudyPlanPage.tsx">
                  Based on your quiz performance, focus on <strong data-magicpath-id="111" data-magicpath-path="StudyPlanPage.tsx">World War II</strong> today. 
                  Spend 30-45 minutes reviewing key events and dates. Your mastery increased by 12% 
                  after the last study session!
                </p>
                <div className="flex items-center gap-2" data-magicpath-id="112" data-magicpath-path="StudyPlanPage.tsx">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-800" data-magicpath-id="113" data-magicpath-path="StudyPlanPage.tsx">
                    AI-Generated Recommendation
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Flashcards Modal */}
      {showFlashcardsModal && activeTask && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300 p-4" onClick={() => setShowFlashcardsModal(false)} data-magicpath-id="114" data-magicpath-path="StudyPlanPage.tsx">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()} data-magicpath-id="115" data-magicpath-path="StudyPlanPage.tsx">
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-slate-200" data-magicpath-id="116" data-magicpath-path="StudyPlanPage.tsx">
              <div className="flex items-center justify-between mb-4" data-magicpath-id="117" data-magicpath-path="StudyPlanPage.tsx">
                <div data-magicpath-id="118" data-magicpath-path="StudyPlanPage.tsx">
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900" data-magicpath-id="119" data-magicpath-path="StudyPlanPage.tsx">
                    Flashcard Review
                  </h2>
                  <p className="text-sm text-slate-600 mt-1" data-magicpath-id="120" data-magicpath-path="StudyPlanPage.tsx">
                    {activeTask.topic}
                  </p>
                </div>
                <button onClick={() => setShowFlashcardsModal(false)} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all" data-magicpath-id="121" data-magicpath-path="StudyPlanPage.tsx">
                  <X className="w-5 h-5" data-magicpath-id="122" data-magicpath-path="StudyPlanPage.tsx" />
                </button>
              </div>

              <div className="flex items-center justify-between" data-magicpath-id="123" data-magicpath-path="StudyPlanPage.tsx">
                <span className="text-sm font-semibold text-slate-600" data-magicpath-id="124" data-magicpath-path="StudyPlanPage.tsx">
                  Card {currentFlashcardIndex + 1} of {flashcards.length}
                </span>
                <div className="flex gap-1" data-magicpath-id="125" data-magicpath-path="StudyPlanPage.tsx">
                  {flashcards.map((_, idx) => <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentFlashcardIndex ? 'bg-blue-600' : idx < currentFlashcardIndex ? 'bg-green-600' : 'bg-slate-200'}`} data-magicpath-id="126" data-magicpath-path="StudyPlanPage.tsx" />)}
                </div>
              </div>
            </div>

            {/* Flashcard */}
            <div className="p-6 lg:p-8" data-magicpath-id="127" data-magicpath-path="StudyPlanPage.tsx">
              <div className="relative min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 cursor-pointer transition-all hover:shadow-lg" onClick={() => setShowAnswer(!showAnswer)} data-magicpath-id="128" data-magicpath-path="StudyPlanPage.tsx">
                <div className="text-center" data-magicpath-id="129" data-magicpath-path="StudyPlanPage.tsx">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-4" data-magicpath-id="130" data-magicpath-path="StudyPlanPage.tsx">
                    {showAnswer ? 'Answer' : 'Question'}
                  </p>
                  <p className="text-lg lg:text-xl font-semibold text-slate-900 leading-relaxed" data-magicpath-id="131" data-magicpath-path="StudyPlanPage.tsx">
                    {showAnswer ? flashcards[currentFlashcardIndex].back : flashcards[currentFlashcardIndex].front}
                  </p>
                </div>

                <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-medium" data-magicpath-id="132" data-magicpath-path="StudyPlanPage.tsx">
                  {showAnswer ? 'Click to see question' : 'Click to reveal answer'}
                </div>
              </div>

              {/* Confidence Buttons */}
              {showAnswer && <div className="mt-6 space-y-3" data-magicpath-id="133" data-magicpath-path="StudyPlanPage.tsx">
                  <p className="text-sm font-semibold text-slate-700 text-center" data-magicpath-id="134" data-magicpath-path="StudyPlanPage.tsx">
                    How confident are you?
                  </p>
                  <div className="grid grid-cols-3 gap-3" data-magicpath-id="135" data-magicpath-path="StudyPlanPage.tsx">
                    <button onClick={() => handleFlashcardConfidence('low')} className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-all active:scale-95" data-magicpath-id="136" data-magicpath-path="StudyPlanPage.tsx">
                      😰 Need Review
                    </button>
                    <button onClick={() => handleFlashcardConfidence('medium')} className="px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold rounded-xl transition-all active:scale-95" data-magicpath-id="137" data-magicpath-path="StudyPlanPage.tsx">
                      🤔 Somewhat
                    </button>
                    <button onClick={() => handleFlashcardConfidence('high')} className="px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-xl transition-all active:scale-95" data-magicpath-id="138" data-magicpath-path="StudyPlanPage.tsx">
                      ✅ Got it!
                    </button>
                  </div>
                </div>}
            </div>
          </div>
        </div>}

      {/* Task Modal (for other task types) */}
      {showTaskModal && activeTask && activeTask.type !== 'flashcards' && <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => {
      setShowTaskModal(false);
      setActiveTask(null);
    }} data-magicpath-id="139" data-magicpath-path="StudyPlanPage.tsx">
          <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()} data-magicpath-id="140" data-magicpath-path="StudyPlanPage.tsx">
            <div className="p-4 lg:p-6" data-magicpath-id="141" data-magicpath-path="StudyPlanPage.tsx">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 md:hidden" data-magicpath-id="142" data-magicpath-path="StudyPlanPage.tsx"></div>

              <div className="flex items-center justify-between mb-6" data-magicpath-id="143" data-magicpath-path="StudyPlanPage.tsx">
                <div data-magicpath-id="144" data-magicpath-path="StudyPlanPage.tsx">
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900" data-magicpath-id="145" data-magicpath-path="StudyPlanPage.tsx">
                    {activeTask.title}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1" data-magicpath-id="146" data-magicpath-path="StudyPlanPage.tsx">{activeTask.topic}</p>
                </div>
                <button onClick={() => {
              setShowTaskModal(false);
              setActiveTask(null);
            }} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all" data-magicpath-id="147" data-magicpath-path="StudyPlanPage.tsx">
                  <X className="w-5 h-5" data-magicpath-id="148" data-magicpath-path="StudyPlanPage.tsx" />
                </button>
              </div>

              <div className="space-y-4" data-magicpath-id="149" data-magicpath-path="StudyPlanPage.tsx">
                {/* Task Description */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl" data-magicpath-id="150" data-magicpath-path="StudyPlanPage.tsx">
                  <p className="text-sm text-slate-700" data-magicpath-id="151" data-magicpath-path="StudyPlanPage.tsx">{activeTask.description}</p>
                </div>

                {/* Study Timer */}
                <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200" data-magicpath-id="152" data-magicpath-path="StudyPlanPage.tsx">
                  <div className="text-center mb-4" data-magicpath-id="153" data-magicpath-path="StudyPlanPage.tsx">
                    <p className="text-sm font-semibold text-slate-600 mb-2" data-magicpath-id="154" data-magicpath-path="StudyPlanPage.tsx">
                      Study Time
                    </p>
                    <p className="text-5xl font-bold text-slate-900" data-magicpath-id="155" data-magicpath-path="StudyPlanPage.tsx">
                      {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2" data-magicpath-id="156" data-magicpath-path="StudyPlanPage.tsx">
                    <button onClick={() => {
                  // Toggle timer
                  setSessionTime(sessionTime + 1);
                }} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2" data-magicpath-id="157" data-magicpath-path="StudyPlanPage.tsx">
                      <Play className="w-4 h-4" data-magicpath-id="158" data-magicpath-path="StudyPlanPage.tsx" />
                      Start Timer
                    </button>
                    <button onClick={() => setSessionTime(0)} className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all active:scale-95" data-magicpath-id="159" data-magicpath-path="StudyPlanPage.tsx">
                      <RotateCcw className="w-4 h-4" data-magicpath-id="160" data-magicpath-path="StudyPlanPage.tsx" />
                    </button>
                  </div>
                </div>

                {/* Completion Section */}
                <div className="space-y-3" data-magicpath-id="161" data-magicpath-path="StudyPlanPage.tsx">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl" data-magicpath-id="162" data-magicpath-path="StudyPlanPage.tsx">
                    <div className="flex items-start gap-2" data-magicpath-id="163" data-magicpath-path="StudyPlanPage.tsx">
                      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" data-magicpath-id="164" data-magicpath-path="StudyPlanPage.tsx" />
                      <div data-magicpath-id="165" data-magicpath-path="StudyPlanPage.tsx">
                        <p className="text-sm font-semibold text-amber-900 mb-1" data-magicpath-id="166" data-magicpath-path="StudyPlanPage.tsx">
                          Verification Required
                        </p>
                        <p className="text-sm text-amber-800" data-magicpath-id="167" data-magicpath-path="StudyPlanPage.tsx">
                          After studying, we'll ask you a few quick questions to verify your understanding.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => handleCompleteTask(activeTask.id, false)} className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2" data-magicpath-id="168" data-magicpath-path="StudyPlanPage.tsx">
                    <CheckCircle2 className="w-5 h-5" data-magicpath-id="169" data-magicpath-path="StudyPlanPage.tsx" />
                    Mark Complete & Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>}

      <style data-magicpath-id="170" data-magicpath-path="StudyPlanPage.tsx">{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>;
};