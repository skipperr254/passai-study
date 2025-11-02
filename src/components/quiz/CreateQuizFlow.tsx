"use client";

import React, { useState, useEffect } from 'react';
import { X, FileText, Book, Video, FileCheck, CheckCircle2, ChevronRight, Brain, Sparkles, Calendar, Clock, Zap, Target, Loader2, Check, ArrowRight, Play, Settings, AlignLeft, Hash, Timer, TrendingUp, BookOpen, Lightbulb, Bell, ChevronDown, Edit3 } from 'lucide-react';
type Subject = {
  id: string;
  name: string;
  color: string;
};
type Material = {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'notes' | 'textbook' | 'slides';
  subject: string;
  uploadedDate: string;
  pageCount?: number;
  duration?: string;
};
type CognitiveMix = {
  recall: number;
  understanding: number;
  application: number;
};
type QuizSettings = {
  customTitle: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  timeLimit: number;
  questionTypes: {
    multipleChoice: boolean;
    trueFalse: boolean;
    shortAnswer: boolean;
    matching: boolean;
  };
  cognitiveMix: CognitiveMix;
  focusAreas: string;
};
type CreateQuizFlowProps = {
  onClose: () => void;
  onQuizCreated?: (quizId: string, scheduleTime?: string) => void;
  preSelectedSubject?: string;
};
type GenerationStep = 'analyzing-materials' | 'identifying-topics' | 'generating-questions' | 'creating-explanations' | 'finalizing' | 'complete';
const mockSubjects: Subject[] = [{
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
const mockMaterials: Material[] = [{
  id: '1',
  name: 'World War II Timeline.pdf',
  type: 'pdf',
  subject: 'History',
  uploadedDate: '1 week ago',
  pageCount: 45
}, {
  id: '2',
  name: 'WWII Documentary Notes',
  type: 'notes',
  subject: 'History',
  uploadedDate: '1 week ago'
}, {
  id: '3',
  name: 'History Textbook Chapter 8',
  type: 'textbook',
  subject: 'History',
  uploadedDate: '2 weeks ago',
  pageCount: 32
}, {
  id: '4',
  name: 'Calculus Derivatives Lecture',
  type: 'video',
  subject: 'Mathematics',
  uploadedDate: '3 days ago',
  duration: '45 min'
}, {
  id: '5',
  name: 'Algebra Study Guide.pdf',
  type: 'pdf',
  subject: 'Mathematics',
  uploadedDate: '1 week ago',
  pageCount: 28
}, {
  id: '6',
  name: 'Poetry Analysis Notes',
  type: 'notes',
  subject: 'English',
  uploadedDate: '4 days ago'
}, {
  id: '7',
  name: 'Chemistry Lecture Notes',
  type: 'notes',
  subject: 'Science',
  uploadedDate: '2 days ago'
}];
const generationSteps: {
  step: GenerationStep;
  label: string;
  icon: React.ElementType;
}[] = [{
  step: 'analyzing-materials',
  label: 'Analyzing your materials',
  icon: BookOpen
}, {
  step: 'identifying-topics',
  label: 'Identifying key topics',
  icon: Lightbulb
}, {
  step: 'generating-questions',
  label: 'Generating questions',
  icon: Brain
}, {
  step: 'creating-explanations',
  label: 'Creating explanations',
  icon: FileText
}, {
  step: 'finalizing',
  label: 'Finalizing your quiz',
  icon: Sparkles
}, {
  step: 'complete',
  label: 'Quiz ready!',
  icon: Check
}];
export const CreateQuizFlow = (props: CreateQuizFlowProps) => {
  const needsSubjectSelection = !props.preSelectedSubject;
  const [step, setStep] = useState<'select-subject' | 'select-materials' | 'configure' | 'generating' | 'schedule'>(needsSubjectSelection ? 'select-subject' : 'select-materials');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(props.preSelectedSubject ? mockSubjects.find(s => s.name === props.preSelectedSubject) || null : null);
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    customTitle: '',
    questionCount: 10,
    difficulty: 'medium',
    timeLimit: 30,
    questionTypes: {
      multipleChoice: true,
      trueFalse: true,
      shortAnswer: false,
      matching: false
    },
    cognitiveMix: {
      recall: 30,
      understanding: 50,
      application: 20
    },
    focusAreas: ''
  });
  const [generationProgress, setGenerationProgress] = useState<GenerationStep>('analyzing-materials');
  const [scheduleOption, setScheduleOption] = useState<'now' | 'later'>('now');
  const [scheduleDateTime, setScheduleDateTime] = useState('');

  // Filter materials by selected subject
  const filteredMaterials = selectedSubject ? materials.filter(m => m.subject === selectedSubject.name) : materials;

  // Simulate AI generation progress
  useEffect(() => {
    if (step === 'generating') {
      const steps: GenerationStep[] = ['analyzing-materials', 'identifying-topics', 'generating-questions', 'creating-explanations', 'finalizing', 'complete'];
      let currentStepIndex = 0;
      const interval = setInterval(() => {
        if (currentStepIndex < steps.length - 1) {
          currentStepIndex++;
          setGenerationProgress(steps[currentStepIndex]);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setStep('schedule');
          }, 1000);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step]);
  const toggleMaterialSelection = (materialId: string) => {
    setSelectedMaterials(prev => prev.includes(materialId) ? prev.filter(id => id !== materialId) : [...prev, materialId]);
  };
  const selectAllMaterials = () => {
    setSelectedMaterials(filteredMaterials.map(m => m.id));
  };
  const deselectAllMaterials = () => {
    setSelectedMaterials([]);
  };
  const handleGenerateQuiz = () => {
    setStep('generating');
    setGenerationProgress('analyzing-materials');
  };
  const handleScheduleQuiz = () => {
    if (scheduleOption === 'now') {
      props.onQuizCreated?.('quiz-new-id');
    } else {
      props.onQuizCreated?.('quiz-new-id', scheduleDateTime);
    }
    props.onClose();
  };
  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'video':
        return Video;
      case 'notes':
        return AlignLeft;
      case 'textbook':
        return Book;
      case 'slides':
        return FileCheck;
      default:
        return FileText;
    }
  };
  const getMaterialColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'from-red-500 to-pink-600';
      case 'video':
        return 'from-purple-500 to-indigo-600';
      case 'notes':
        return 'from-blue-500 to-cyan-600';
      case 'textbook':
        return 'from-green-500 to-emerald-600';
      case 'slides':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };
  const canProceedFromSubject = !!selectedSubject;
  const canProceedFromMaterials = selectedMaterials.length > 0;

  // Get progress step indicators
  const totalSteps = needsSubjectSelection ? 4 : 3;
  const currentStepNumber = step === 'select-subject' ? 1 : step === 'select-materials' ? needsSubjectSelection ? 2 : 1 : step === 'configure' ? needsSubjectSelection ? 3 : 2 : step === 'schedule' ? totalSteps : 0;
  return <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={props.onClose}>
      <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-4xl max-h-[95vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex-shrink-0 px-4 lg:px-6 py-4 lg:py-5 border-b border-slate-200 bg-gradient-to-br from-blue-500 to-indigo-600">
          <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-0.5">Create AI Quiz</h2>
              <p className="text-sm text-white/90">
                {step === 'select-subject' && 'Choose a subject'}
                {step === 'select-materials' && 'Select materials'}
                {step === 'configure' && 'Configure quiz details'}
                {step === 'generating' && 'Generating your quiz...'}
                {step === 'schedule' && 'Ready to start or schedule'}
              </p>
            </div>
            <button onClick={props.onClose} className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all flex-shrink-0">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress Indicator */}
          {step !== 'generating' && <div className="mt-4 flex items-center gap-2">
              {Array.from({
            length: totalSteps
          }).map((_, idx) => <div key={idx} className={`flex-1 h-1.5 rounded-full transition-all ${idx < currentStepNumber ? 'bg-white' : 'bg-white/30'}`} />)}
            </div>}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Step 0: Select Subject (if needed) */}
          {step === 'select-subject' && <div className="p-4 lg:p-6">
              <div className="mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2">
                  Select Subject
                </h3>
                <p className="text-sm text-slate-600">
                  Choose which subject this quiz is for
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mockSubjects.map(subject => <button key={subject.id} onClick={() => setSelectedSubject(subject)} className={`p-4 lg:p-5 rounded-xl border-2 transition-all active:scale-[0.98] ${selectedSubject?.id === subject.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-md`}>
                        <Book className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-slate-900">{subject.name}</p>
                        <p className="text-xs text-slate-600">
                          {materials.filter(m => m.subject === subject.name).length} materials
                        </p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedSubject?.id === subject.id ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                        {selectedSubject?.id === subject.id && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </button>)}
              </div>
            </div>}

          {/* Step 1: Select Materials */}
          {step === 'select-materials' && <div className="p-4 lg:p-6">
              <div className="mb-4 lg:mb-6">
                <div className="flex items-center gap-3 mb-2">
                  {selectedSubject && <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${selectedSubject.color} text-white text-sm font-semibold`}>
                      {selectedSubject.name}
                    </div>}
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2">
                  Select Study Materials
                </h3>
                <p className="text-sm text-slate-600">
                  Choose materials for the AI to generate questions from
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 mb-4">
                <button onClick={selectAllMaterials} className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  Select All
                </button>
                <button onClick={deselectAllMaterials} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  Clear All
                </button>
                <div className="ml-auto text-xs font-semibold text-slate-600">
                  {selectedMaterials.length} selected
                </div>
              </div>

              {/* Materials List */}
              <div className="space-y-2">
                {filteredMaterials.length === 0 ? <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Book className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium">No materials found</p>
                    <p className="text-sm text-slate-500 mt-1">Upload materials for {selectedSubject?.name}</p>
                  </div> : filteredMaterials.map(material => {
              const Icon = getMaterialIcon(material.type);
              const isSelected = selectedMaterials.includes(material.id);
              return <button key={material.id} onClick={() => toggleMaterialSelection(material.id)} className={`w-full p-3 lg:p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br ${getMaterialColor(material.type)} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-bold text-slate-900 text-sm lg:text-base truncate">
                              {material.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-600">{material.uploadedDate}</span>
                              {material.pageCount && <>
                                  <span className="w-1 h-1 bg-slate-400 rounded-full" />
                                  <span className="text-xs text-slate-600">{material.pageCount} pages</span>
                                </>}
                              {material.duration && <>
                                  <span className="w-1 h-1 bg-slate-400 rounded-full" />
                                  <span className="text-xs text-slate-600">{material.duration}</span>
                                </>}
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                      </button>;
            })}
              </div>
            </div>}

          {/* Step 2: Configure Quiz */}
          {step === 'configure' && <div className="p-4 lg:p-6">
              <div className="mb-4 lg:mb-6">
                <div className="flex items-center gap-3 mb-2">
                  {selectedSubject && <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${selectedSubject.color} text-white text-sm font-semibold`}>
                      {selectedSubject.name}
                    </div>}
                  <span className="text-xs text-slate-600">
                    {selectedMaterials.length} material{selectedMaterials.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2">
                  Configure Quiz Details
                </h3>
                <p className="text-sm text-slate-600">
                  Customize your quiz or use AI-generated defaults
                </p>
              </div>

              <div className="space-y-5 lg:space-y-6">
                {/* Custom Title (Optional) */}
                <div>
                  <label htmlFor="quiz-title" className="block text-sm font-bold text-slate-900 mb-3">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-slate-600" />
                      <span>Quiz Title</span>
                      <span className="text-slate-400 font-normal text-xs">(Optional - AI will generate if left blank)</span>
                    </div>
                  </label>
                  <input id="quiz-title" type="text" value={quizSettings.customTitle} onChange={e => setQuizSettings({
                ...quizSettings,
                customTitle: e.target.value
              })} placeholder="e.g., World War II Analysis Quiz" className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>

                {/* Focus Areas / Notes */}
                <div>
                  <label htmlFor="focus-areas" className="block text-sm font-bold text-slate-900 mb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-slate-600" />
                      <span>Focus Areas or Notes</span>
                      <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                    </div>
                  </label>
                  <textarea id="focus-areas" value={quizSettings.focusAreas} onChange={e => setQuizSettings({
                ...quizSettings,
                focusAreas: e.target.value
              })} placeholder="e.g., Focus more on World War II battles, include questions about key dates and locations, emphasize cause and effect relationships..." rows={4} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none" />
                  <p className="text-xs text-slate-500 mt-2">
                    Tell the AI what topics or areas you'd like emphasized in the quiz
                  </p>
                </div>

                {/* Advanced Options Toggle */}
                <div>
                  <button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-slate-600" />
                      <div className="text-left">
                        <p className="font-bold text-slate-900">Advanced Options</p>
                        <p className="text-xs text-slate-600">
                          {quizSettings.questionCount} questions • {quizSettings.difficulty} • {quizSettings.timeLimit} min
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Advanced Options Content */}
                  {showAdvancedOptions && <div className="mt-4 p-4 lg:p-5 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-5 animate-in slide-in-from-top duration-300">
                      {/* Question Count */}
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-3">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-slate-600" />
                            <span>Number of Questions</span>
                          </div>
                        </label>
                        <div className="flex items-center gap-4">
                          <input type="range" min="5" max="50" step="5" value={quizSettings.questionCount} onChange={e => setQuizSettings({
                      ...quizSettings,
                      questionCount: parseInt(e.target.value)
                    })} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                          <span className="text-2xl font-bold text-blue-600 w-12 text-right">
                            {quizSettings.questionCount}
                          </span>
                        </div>
                      </div>

                      {/* Difficulty */}
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-slate-600" />
                            <span>Difficulty Level</span>
                          </div>
                        </label>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                          {(['easy', 'medium', 'hard', 'adaptive'] as const).map(level => <button key={level} onClick={() => setQuizSettings({
                      ...quizSettings,
                      difficulty: level
                    })} className={`p-3 rounded-xl border-2 font-semibold text-sm capitalize transition-all active:scale-95 ${quizSettings.difficulty === level ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                              {level}
                            </button>)}
                        </div>
                      </div>

                      {/* Time Limit */}
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-3">
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-slate-600" />
                            <span>Time Limit (minutes)</span>
                          </div>
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                          {[15, 20, 30, 45, 60].map(time => <button key={time} onClick={() => setQuizSettings({
                      ...quizSettings,
                      timeLimit: time
                    })} className={`p-3 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${quizSettings.timeLimit === time ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                              {time}
                            </button>)}
                        </div>
                      </div>

                      {/* Question Types */}
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-3">
                          Question Types
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(quizSettings.questionTypes).map(([type, enabled]) => <button key={type} onClick={() => setQuizSettings({
                      ...quizSettings,
                      questionTypes: {
                        ...quizSettings.questionTypes,
                        [type]: !enabled
                      }
                    })} className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all active:scale-95 ${enabled ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                              <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${enabled ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300'}`}>
                                  {enabled && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="capitalize">
                                  {type.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              </div>
                            </button>)}
                        </div>
                      </div>

                      {/* Cognitive Mix */}
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-3">
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-slate-600" />
                            <span>Cognitive Mix</span>
                          </div>
                        </label>
                        <div className="space-y-4">
                          {/* Recall */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-slate-700">Recall</span>
                              <span className="text-sm font-bold text-blue-600">{quizSettings.cognitiveMix.recall}%</span>
                            </div>
                            <input type="range" min="0" max="100" step="10" value={quizSettings.cognitiveMix.recall} onChange={e => {
                        const newRecall = parseInt(e.target.value);
                        const remaining = 100 - newRecall;
                        const understandingRatio = quizSettings.cognitiveMix.understanding / (quizSettings.cognitiveMix.understanding + quizSettings.cognitiveMix.application);
                        setQuizSettings({
                          ...quizSettings,
                          cognitiveMix: {
                            recall: newRecall,
                            understanding: Math.round(remaining * understandingRatio),
                            application: Math.round(remaining * (1 - understandingRatio))
                          }
                        });
                      }} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                            <p className="text-xs text-slate-500 mt-1">Basic facts and definitions</p>
                          </div>

                          {/* Understanding */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-slate-700">Understanding</span>
                              <span className="text-sm font-bold text-purple-600">{quizSettings.cognitiveMix.understanding}%</span>
                            </div>
                            <input type="range" min="0" max="100" step="10" value={quizSettings.cognitiveMix.understanding} onChange={e => {
                        const newUnderstanding = parseInt(e.target.value);
                        const remaining = 100 - newUnderstanding;
                        const recallRatio = quizSettings.cognitiveMix.recall / (quizSettings.cognitiveMix.recall + quizSettings.cognitiveMix.application);
                        setQuizSettings({
                          ...quizSettings,
                          cognitiveMix: {
                            recall: Math.round(remaining * recallRatio),
                            understanding: newUnderstanding,
                            application: Math.round(remaining * (1 - recallRatio))
                          }
                        });
                      }} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                            <p className="text-xs text-slate-500 mt-1">Concepts and explanations</p>
                          </div>

                          {/* Application */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-slate-700">Application</span>
                              <span className="text-sm font-bold text-emerald-600">{quizSettings.cognitiveMix.application}%</span>
                            </div>
                            <input type="range" min="0" max="100" step="10" value={quizSettings.cognitiveMix.application} onChange={e => {
                        const newApplication = parseInt(e.target.value);
                        const remaining = 100 - newApplication;
                        const recallRatio = quizSettings.cognitiveMix.recall / (quizSettings.cognitiveMix.recall + quizSettings.cognitiveMix.understanding);
                        setQuizSettings({
                          ...quizSettings,
                          cognitiveMix: {
                            recall: Math.round(remaining * recallRatio),
                            understanding: Math.round(remaining * (1 - recallRatio)),
                            application: newApplication
                          }
                        });
                      }} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                            <p className="text-xs text-slate-500 mt-1">Problem-solving and analysis</p>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
              </div>
            </div>}

          {/* Step 3: Generating */}
          {step === 'generating' && <div className="p-6 lg:p-12">
              <div className="max-w-md mx-auto text-center">
                {/* Animated Brain Icon */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full animate-pulse opacity-20" />
                  <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Brain className="w-12 h-12 text-white animate-pulse" />
                  </div>
                  <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" style={{
                animationDuration: '2s'
              }} />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Generating Your Quiz
                </h3>
                <p className="text-slate-600 mb-8">
                  Our AI is analyzing your materials and creating personalized questions
                </p>

                {/* Generation Steps */}
                <div className="space-y-4">
                  {generationSteps.map((item, index) => {
                const Icon = item.icon;
                const currentStepIndex = generationSteps.findIndex(s => s.step === generationProgress);
                const itemIndex = index;
                const isComplete = itemIndex < currentStepIndex;
                const isCurrent = itemIndex === currentStepIndex;
                return <div key={item.step} className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${isComplete ? 'bg-emerald-50 border-2 border-emerald-200' : isCurrent ? 'bg-blue-50 border-2 border-blue-500 scale-105' : 'bg-slate-50 border-2 border-slate-200 opacity-50'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-emerald-600' : isCurrent ? 'bg-blue-600' : 'bg-slate-300'}`}>
                          {isComplete ? <Check className="w-5 h-5 text-white" /> : isCurrent ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Icon className="w-5 h-5 text-white" />}
                        </div>
                        <span className={`font-semibold text-sm lg:text-base ${isComplete ? 'text-emerald-700' : isCurrent ? 'text-blue-700' : 'text-slate-600'}`}>
                          {item.label}
                        </span>
                      </div>;
              })}
                </div>
              </div>
            </div>}

          {/* Step 4: Schedule */}
          {step === 'schedule' && <div className="p-4 lg:p-6">
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
                  Quiz Generated Successfully! 🎉
                </h3>
                <p className="text-slate-600">
                  Your personalized {selectedSubject?.name} quiz with {quizSettings.questionCount} questions is ready
                </p>
              </div>

              {/* Schedule Options */}
              <div className="space-y-4 max-w-lg mx-auto">
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  When would you like to take this quiz?
                </h4>

                {/* Take Now */}
                <button onClick={() => setScheduleOption('now')} className={`w-full p-4 lg:p-5 rounded-xl border-2 transition-all active:scale-[0.98] ${scheduleOption === 'now' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheduleOption === 'now' ? 'bg-blue-600' : 'bg-slate-100'}`}>
                      <Play className={`w-6 h-6 ${scheduleOption === 'now' ? 'text-white' : 'text-slate-600'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-slate-900 mb-0.5">Start Now</p>
                      <p className="text-sm text-slate-600">Begin the quiz immediately</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${scheduleOption === 'now' ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                      {scheduleOption === 'now' && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>

                {/* Schedule for Later */}
                <button onClick={() => setScheduleOption('later')} className={`w-full p-4 lg:p-5 rounded-xl border-2 transition-all active:scale-[0.98] ${scheduleOption === 'later' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheduleOption === 'later' ? 'bg-blue-600' : 'bg-slate-100'}`}>
                      <Calendar className={`w-6 h-6 ${scheduleOption === 'later' ? 'text-white' : 'text-slate-600'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-slate-900 mb-0.5">Schedule for Later</p>
                      <p className="text-sm text-slate-600">Get a reminder at a specific time</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${scheduleOption === 'later' ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                      {scheduleOption === 'later' && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>

                {/* Date/Time Picker */}
                {scheduleOption === 'later' && <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl animate-in slide-in-from-top duration-300">
                    <label htmlFor="schedule-datetime" className="block text-sm font-bold text-slate-900 mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-600" />
                        <span>Reminder Date & Time</span>
                      </div>
                    </label>
                    <input id="schedule-datetime" type="datetime-local" value={scheduleDateTime} onChange={e => setScheduleDateTime(e.target.value)} min={new Date().toISOString().slice(0, 16)} className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                    <p className="text-xs text-blue-700 mt-2 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      You'll receive a notification when it's time to take your quiz
                    </p>
                  </div>}

                {/* Quiz Preview Info */}
                <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-xs font-bold text-slate-600 mb-3">QUIZ SUMMARY</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-600 mb-0.5">Subject</p>
                      <p className="text-sm font-bold text-slate-900">{selectedSubject?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-0.5">Questions</p>
                      <p className="text-sm font-bold text-slate-900">{quizSettings.questionCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-0.5">Difficulty</p>
                      <p className="text-sm font-bold text-slate-900 capitalize">{quizSettings.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-0.5">Time Limit</p>
                      <p className="text-sm font-bold text-slate-900">{quizSettings.timeLimit} min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 px-4 lg:px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-3">
            {step !== 'generating' && <>
                {step !== 'select-subject' && step !== 'schedule' && <button onClick={() => {
              if (step === 'configure') setStep('select-materials');else if (step === 'select-materials') {
                if (needsSubjectSelection) setStep('select-subject');
              }
            }} className="px-4 lg:px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all">
                    Back
                  </button>}
                
                <button onClick={() => {
              if (step === 'select-subject' && canProceedFromSubject) {
                setStep('select-materials');
              } else if (step === 'select-materials' && canProceedFromMaterials) {
                setStep('configure');
              } else if (step === 'configure') {
                handleGenerateQuiz();
              } else if (step === 'schedule') {
                handleScheduleQuiz();
              }
            }} disabled={step === 'select-subject' && !canProceedFromSubject || step === 'select-materials' && !canProceedFromMaterials || step === 'schedule' && scheduleOption === 'later' && !scheduleDateTime} className="flex-1 flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100">
                  <span>
                    {step === 'select-subject' && 'Continue'}
                    {step === 'select-materials' && 'Continue'}
                    {step === 'configure' && 'Generate Quiz'}
                    {step === 'schedule' && (scheduleOption === 'now' ? 'Start Quiz' : 'Schedule Quiz')}
                  </span>
                  {step !== 'schedule' ? <ChevronRight className="w-5 h-5" /> : scheduleOption === 'now' ? <Play className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </button>
              </>}
          </div>
        </div>
      </div>
    </div>;
};