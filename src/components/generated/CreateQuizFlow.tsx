"use client";

import React, { useState, useEffect } from 'react';
import { X, FileText, Book, Video, FileCheck, CheckCircle2, ChevronRight, Brain, Sparkles, Calendar, Clock, Zap, Target, Loader2, Check, ArrowRight, Play, Settings, AlignLeft, Hash, Timer, TrendingUp, BookOpen, Lightbulb, Bell } from 'lucide-react';
type Material = {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'notes' | 'textbook' | 'slides';
  subject: string;
  uploadedDate: string;
  pageCount?: number;
  duration?: string;
  selected?: boolean;
};
type QuizSettings = {
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  timeLimit: number; // in minutes
  questionTypes: {
    multipleChoice: boolean;
    trueFalse: boolean;
    shortAnswer: boolean;
    matching: boolean;
  };
  focusAreas: string;
};
type CreateQuizFlowProps = {
  onClose: () => void;
  onQuizCreated?: (quizId: string, scheduleTime?: string) => void;
  preSelectedSubject?: string;
};
type GenerationStep = 'analyzing-materials' | 'identifying-topics' | 'generating-questions' | 'creating-explanations' | 'finalizing' | 'complete';
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
  const [step, setStep] = useState<'select-materials' | 'configure' | 'generating' | 'schedule'>('select-materials');
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    questionCount: 20,
    difficulty: 'medium',
    timeLimit: 30,
    questionTypes: {
      multipleChoice: true,
      trueFalse: true,
      shortAnswer: false,
      matching: false
    },
    focusAreas: ''
  });
  const [generationProgress, setGenerationProgress] = useState<GenerationStep>('analyzing-materials');
  const [scheduleOption, setScheduleOption] = useState<'now' | 'later'>('now');
  const [scheduleDateTime, setScheduleDateTime] = useState('');

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
      }, 2000); // Each step takes 2 seconds

      return () => clearInterval(interval);
    }
  }, [step]);
  const toggleMaterialSelection = (materialId: string) => {
    setSelectedMaterials(prev => prev.includes(materialId) ? prev.filter(id => id !== materialId) : [...prev, materialId]);
  };
  const selectAllMaterials = () => {
    setSelectedMaterials(materials.map(m => m.id));
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
  const canProceedFromMaterials = selectedMaterials.length > 0;
  const canProceedFromConfig = true; // Can always proceed from config

  return <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={props.onClose} data-magicpath-id="0" data-magicpath-path="CreateQuizFlow.tsx">
      <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-4xl max-h-[95vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()} data-magicpath-id="1" data-magicpath-path="CreateQuizFlow.tsx">
        {/* Header */}
        <div className="flex-shrink-0 px-4 lg:px-6 py-4 lg:py-5 border-b border-slate-200 bg-gradient-to-br from-blue-500 to-indigo-600" data-magicpath-id="2" data-magicpath-path="CreateQuizFlow.tsx">
          <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden" data-magicpath-id="3" data-magicpath-path="CreateQuizFlow.tsx"></div>
          <div className="flex items-center gap-4" data-magicpath-id="4" data-magicpath-path="CreateQuizFlow.tsx">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0" data-magicpath-id="5" data-magicpath-path="CreateQuizFlow.tsx">
              <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="flex-1" data-magicpath-id="6" data-magicpath-path="CreateQuizFlow.tsx">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-0.5" data-magicpath-id="7" data-magicpath-path="CreateQuizFlow.tsx">Create AI Quiz</h2>
              <p className="text-sm text-white/90" data-magicpath-id="8" data-magicpath-path="CreateQuizFlow.tsx">
                {step === 'select-materials' && 'Select materials to generate from'}
                {step === 'configure' && 'Configure quiz settings'}
                {step === 'generating' && 'Generating your personalized quiz...'}
                {step === 'schedule' && 'Ready to start or schedule'}
              </p>
            </div>
            <button onClick={props.onClose} className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all flex-shrink-0" data-magicpath-id="9" data-magicpath-path="CreateQuizFlow.tsx">
              <X className="w-5 h-5 text-white" data-magicpath-id="10" data-magicpath-path="CreateQuizFlow.tsx" />
            </button>
          </div>

          {/* Progress Indicator */}
          {step !== 'generating' && <div className="mt-4 flex items-center gap-2" data-magicpath-id="11" data-magicpath-path="CreateQuizFlow.tsx">
              <div className={`flex-1 h-1.5 rounded-full ${step === 'select-materials' ? 'bg-white' : 'bg-white/30'}`} data-magicpath-id="12" data-magicpath-path="CreateQuizFlow.tsx" />
              <div className={`flex-1 h-1.5 rounded-full ${step === 'configure' || step === 'schedule' ? 'bg-white' : 'bg-white/30'}`} data-magicpath-id="13" data-magicpath-path="CreateQuizFlow.tsx" />
              <div className={`flex-1 h-1.5 rounded-full ${step === 'schedule' ? 'bg-white' : 'bg-white/30'}`} data-magicpath-id="14" data-magicpath-path="CreateQuizFlow.tsx" />
            </div>}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" data-magicpath-id="15" data-magicpath-path="CreateQuizFlow.tsx">
          {/* Step 1: Select Materials */}
          {step === 'select-materials' && <div className="p-4 lg:p-6" data-magicpath-id="16" data-magicpath-path="CreateQuizFlow.tsx">
              <div className="mb-4 lg:mb-6" data-magicpath-id="17" data-magicpath-path="CreateQuizFlow.tsx">
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2" data-magicpath-id="18" data-magicpath-path="CreateQuizFlow.tsx">
                  Select Study Materials
                </h3>
                <p className="text-sm text-slate-600" data-magicpath-id="19" data-magicpath-path="CreateQuizFlow.tsx">
                  Choose which materials the AI should use to generate quiz questions
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 mb-4" data-magicpath-id="20" data-magicpath-path="CreateQuizFlow.tsx">
                <button onClick={selectAllMaterials} className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" data-magicpath-id="21" data-magicpath-path="CreateQuizFlow.tsx">
                  Select All
                </button>
                <button onClick={deselectAllMaterials} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" data-magicpath-id="22" data-magicpath-path="CreateQuizFlow.tsx">
                  Clear All
                </button>
                <div className="ml-auto text-xs font-semibold text-slate-600" data-magicpath-id="23" data-magicpath-path="CreateQuizFlow.tsx">
                  {selectedMaterials.length} selected
                </div>
              </div>

              {/* Materials List */}
              <div className="space-y-2" data-magicpath-id="24" data-magicpath-path="CreateQuizFlow.tsx">
                {materials.map(material => {
              const Icon = getMaterialIcon(material.type);
              const isSelected = selectedMaterials.includes(material.id);
              return <button key={material.id} onClick={() => toggleMaterialSelection(material.id)} className={`w-full p-3 lg:p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`} data-magicpath-id="25" data-magicpath-path="CreateQuizFlow.tsx">
                      <div className="flex items-center gap-3" data-magicpath-id="26" data-magicpath-path="CreateQuizFlow.tsx">
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br ${getMaterialColor(material.type)} flex items-center justify-center flex-shrink-0`} data-magicpath-id="27" data-magicpath-path="CreateQuizFlow.tsx">
                          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" data-magicpath-id="28" data-magicpath-path="CreateQuizFlow.tsx" />
                        </div>
                        <div className="flex-1 text-left min-w-0" data-magicpath-id="29" data-magicpath-path="CreateQuizFlow.tsx">
                          <p className="font-bold text-slate-900 text-sm lg:text-base truncate" data-magicpath-id="30" data-magicpath-path="CreateQuizFlow.tsx">
                            {material.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5" data-magicpath-id="31" data-magicpath-path="CreateQuizFlow.tsx">
                            <span className="text-xs text-slate-600" data-magicpath-id="32" data-magicpath-path="CreateQuizFlow.tsx">{material.subject}</span>
                            {material.pageCount && <>
                                <span className="w-1 h-1 bg-slate-400 rounded-full" data-magicpath-id="33" data-magicpath-path="CreateQuizFlow.tsx" />
                                <span className="text-xs text-slate-600" data-magicpath-id="34" data-magicpath-path="CreateQuizFlow.tsx">{material.pageCount} pages</span>
                              </>}
                            {material.duration && <>
                                <span className="w-1 h-1 bg-slate-400 rounded-full" data-magicpath-id="35" data-magicpath-path="CreateQuizFlow.tsx" />
                                <span className="text-xs text-slate-600" data-magicpath-id="36" data-magicpath-path="CreateQuizFlow.tsx">{material.duration}</span>
                              </>}
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`} data-magicpath-id="37" data-magicpath-path="CreateQuizFlow.tsx">
                          {isSelected && <Check className="w-4 h-4 text-white" data-magicpath-id="38" data-magicpath-path="CreateQuizFlow.tsx" />}
                        </div>
                      </div>
                    </button>;
            })}
              </div>
            </div>}

          {/* Step 2: Configure Quiz */}
          {step === 'configure' && <div className="p-4 lg:p-6" data-magicpath-id="39" data-magicpath-path="CreateQuizFlow.tsx">
              <div className="mb-4 lg:mb-6" data-magicpath-id="40" data-magicpath-path="CreateQuizFlow.tsx">
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2" data-magicpath-id="41" data-magicpath-path="CreateQuizFlow.tsx">
                  Configure Quiz Settings
                </h3>
                <p className="text-sm text-slate-600" data-magicpath-id="42" data-magicpath-path="CreateQuizFlow.tsx">
                  Customize your quiz parameters
                </p>
              </div>

              <div className="space-y-5 lg:space-y-6" data-magicpath-id="43" data-magicpath-path="CreateQuizFlow.tsx">
                {/* Question Count */}
                <div data-magicpath-id="44" data-magicpath-path="CreateQuizFlow.tsx">
                  <label className="block text-sm font-bold text-slate-900 mb-3" data-magicpath-id="45" data-magicpath-path="CreateQuizFlow.tsx">
                    <div className="flex items-center gap-2" data-magicpath-id="46" data-magicpath-path="CreateQuizFlow.tsx">
                      <Hash className="w-4 h-4 text-slate-600" data-magicpath-id="47" data-magicpath-path="CreateQuizFlow.tsx" />
                      <span data-magicpath-id="48" data-magicpath-path="CreateQuizFlow.tsx">Number of Questions</span>
                    </div>
                  </label>
                  <div className="flex items-center gap-4" data-magicpath-id="49" data-magicpath-path="CreateQuizFlow.tsx">
                    <input type="range" min="5" max="50" step="5" value={quizSettings.questionCount} onChange={e => setQuizSettings({
                  ...quizSettings,
                  questionCount: parseInt(e.target.value)
                })} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" data-magicpath-id="50" data-magicpath-path="CreateQuizFlow.tsx" />
                    <span className="text-2xl font-bold text-blue-600 w-12 text-right" data-magicpath-id="51" data-magicpath-path="CreateQuizFlow.tsx">
                      {quizSettings.questionCount}
                    </span>
                  </div>
                </div>

                {/* Difficulty */}
                <div data-magicpath-id="52" data-magicpath-path="CreateQuizFlow.tsx">
                  <label className="block text-sm font-bold text-slate-900 mb-3" data-magicpath-id="53" data-magicpath-path="CreateQuizFlow.tsx">
                    <div className="flex items-center gap-2" data-magicpath-id="54" data-magicpath-path="CreateQuizFlow.tsx">
                      <TrendingUp className="w-4 h-4 text-slate-600" data-magicpath-id="55" data-magicpath-path="CreateQuizFlow.tsx" />
                      <span data-magicpath-id="56" data-magicpath-path="CreateQuizFlow.tsx">Difficulty Level</span>
                    </div>
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3" data-magicpath-id="57" data-magicpath-path="CreateQuizFlow.tsx">
                    {(['easy', 'medium', 'hard', 'adaptive'] as const).map(level => <button key={level} onClick={() => setQuizSettings({
                  ...quizSettings,
                  difficulty: level
                })} className={`p-3 rounded-xl border-2 font-semibold text-sm capitalize transition-all active:scale-95 ${quizSettings.difficulty === level ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`} data-magicpath-id="58" data-magicpath-path="CreateQuizFlow.tsx">
                        {level}
                      </button>)}
                  </div>
                  {quizSettings.difficulty === 'adaptive' && <p className="text-xs text-blue-600 mt-2 flex items-center gap-1.5" data-magicpath-id="59" data-magicpath-path="CreateQuizFlow.tsx">
                      <Sparkles className="w-3.5 h-3.5" />
                      Quiz difficulty will adapt based on your performance
                    </p>}
                </div>

                {/* Time Limit */}
                <div data-magicpath-id="60" data-magicpath-path="CreateQuizFlow.tsx">
                  <label className="block text-sm font-bold text-slate-900 mb-3" data-magicpath-id="61" data-magicpath-path="CreateQuizFlow.tsx">
                    <div className="flex items-center gap-2" data-magicpath-id="62" data-magicpath-path="CreateQuizFlow.tsx">
                      <Timer className="w-4 h-4 text-slate-600" data-magicpath-id="63" data-magicpath-path="CreateQuizFlow.tsx" />
                      <span data-magicpath-id="64" data-magicpath-path="CreateQuizFlow.tsx">Time Limit (minutes)</span>
                    </div>
                  </label>
                  <div className="grid grid-cols-5 gap-2" data-magicpath-id="65" data-magicpath-path="CreateQuizFlow.tsx">
                    {[15, 20, 30, 45, 60].map(time => <button key={time} onClick={() => setQuizSettings({
                  ...quizSettings,
                  timeLimit: time
                })} className={`p-3 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${quizSettings.timeLimit === time ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`} data-magicpath-id="66" data-magicpath-path="CreateQuizFlow.tsx">
                        {time}
                      </button>)}
                  </div>
                </div>

                {/* Question Types */}
                <div data-magicpath-id="67" data-magicpath-path="CreateQuizFlow.tsx">
                  <label className="block text-sm font-bold text-slate-900 mb-3" data-magicpath-id="68" data-magicpath-path="CreateQuizFlow.tsx">
                    <div className="flex items-center gap-2" data-magicpath-id="69" data-magicpath-path="CreateQuizFlow.tsx">
                      <Settings className="w-4 h-4 text-slate-600" data-magicpath-id="70" data-magicpath-path="CreateQuizFlow.tsx" />
                      <span data-magicpath-id="71" data-magicpath-path="CreateQuizFlow.tsx">Question Types</span>
                    </div>
                  </label>
                  <div className="grid grid-cols-2 gap-3" data-magicpath-id="72" data-magicpath-path="CreateQuizFlow.tsx">
                    {Object.entries(quizSettings.questionTypes).map(([type, enabled]) => <button key={type} onClick={() => setQuizSettings({
                  ...quizSettings,
                  questionTypes: {
                    ...quizSettings.questionTypes,
                    [type]: !enabled
                  }
                })} className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all active:scale-95 ${enabled ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`} data-magicpath-id="73" data-magicpath-path="CreateQuizFlow.tsx">
                        <div className="flex items-center gap-2" data-magicpath-id="74" data-magicpath-path="CreateQuizFlow.tsx">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${enabled ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300'}`} data-magicpath-id="75" data-magicpath-path="CreateQuizFlow.tsx">
                            {enabled && <Check className="w-3 h-3 text-white" data-magicpath-id="76" data-magicpath-path="CreateQuizFlow.tsx" />}
                          </div>
                          <span className="capitalize" data-magicpath-id="77" data-magicpath-path="CreateQuizFlow.tsx">
                            {type.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      </button>)}
                  </div>
                </div>

                {/* Focus Areas */}
                <div data-magicpath-id="78" data-magicpath-path="CreateQuizFlow.tsx">
                  <label htmlFor="focus-areas" className="block text-sm font-bold text-slate-900 mb-3" data-magicpath-id="79" data-magicpath-path="CreateQuizFlow.tsx">
                    <div className="flex items-center gap-2" data-magicpath-id="80" data-magicpath-path="CreateQuizFlow.tsx">
                      <Target className="w-4 h-4 text-slate-600" data-magicpath-id="81" data-magicpath-path="CreateQuizFlow.tsx" />
                      <span data-magicpath-id="82" data-magicpath-path="CreateQuizFlow.tsx">Focus Areas or Notes</span>
                      <span className="text-slate-400 font-normal" data-magicpath-id="83" data-magicpath-path="CreateQuizFlow.tsx">(Optional)</span>
                    </div>
                  </label>
                  <textarea id="focus-areas" value={quizSettings.focusAreas} onChange={e => setQuizSettings({
                ...quizSettings,
                focusAreas: e.target.value
              })} placeholder="e.g., Focus more on World War II battles, include questions about key dates, emphasize cause and effect relationships..." rows={4} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none" data-magicpath-id="84" data-magicpath-path="CreateQuizFlow.tsx" />
                  <p className="text-xs text-slate-500 mt-2" data-magicpath-id="85" data-magicpath-path="CreateQuizFlow.tsx">
                    Add any specific topics or areas you'd like the AI to focus on
                  </p>
                </div>
              </div>
            </div>}

          {/* Step 3: Generating */}
          {step === 'generating' && <div className="p-6 lg:p-12" data-magicpath-id="86" data-magicpath-path="CreateQuizFlow.tsx">
              <div className="max-w-md mx-auto text-center" data-magicpath-id="87" data-magicpath-path="CreateQuizFlow.tsx">
                {/* Animated Brain Icon */}
                <div className="relative w-24 h-24 mx-auto mb-8" data-magicpath-id="88" data-magicpath-path="CreateQuizFlow.tsx">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full animate-pulse opacity-20" data-magicpath-id="89" data-magicpath-path="CreateQuizFlow.tsx" />
                  <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center" data-magicpath-id="90" data-magicpath-path="CreateQuizFlow.tsx">
                    <Brain className="w-12 h-12 text-white animate-pulse" data-magicpath-id="91" data-magicpath-path="CreateQuizFlow.tsx" />
                  </div>
                  <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" style={{
                animationDuration: '2s'
              }} data-magicpath-id="92" data-magicpath-path="CreateQuizFlow.tsx" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2" data-magicpath-id="93" data-magicpath-path="CreateQuizFlow.tsx">
                  Generating Your Quiz
                </h3>
                <p className="text-slate-600 mb-8" data-magicpath-id="94" data-magicpath-path="CreateQuizFlow.tsx">
                  Our AI is analyzing your materials and creating personalized questions
                </p>

                {/* Generation Steps */}
                <div className="space-y-4" data-magicpath-id="95" data-magicpath-path="CreateQuizFlow.tsx">
                  {generationSteps.map((item, index) => {
                const Icon = item.icon;
                const currentStepIndex = generationSteps.findIndex(s => s.step === generationProgress);
                const itemIndex = index;
                const isComplete = itemIndex < currentStepIndex;
                const isCurrent = itemIndex === currentStepIndex;
                const isPending = itemIndex > currentStepIndex;
                return <div key={item.step} className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${isComplete ? 'bg-emerald-50 border-2 border-emerald-200' : isCurrent ? 'bg-blue-50 border-2 border-blue-500 scale-105' : 'bg-slate-50 border-2 border-slate-200 opacity-50'}`} data-magicpath-id="96" data-magicpath-path="CreateQuizFlow.tsx">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-emerald-600' : isCurrent ? 'bg-blue-600' : 'bg-slate-300'}`} data-magicpath-id="97" data-magicpath-path="CreateQuizFlow.tsx">
                          {isComplete ? <Check className="w-5 h-5 text-white" data-magicpath-id="98" data-magicpath-path="CreateQuizFlow.tsx" /> : isCurrent ? <Loader2 className="w-5 h-5 text-white animate-spin" data-magicpath-id="99" data-magicpath-path="CreateQuizFlow.tsx" /> : <Icon className="w-5 h-5 text-white" data-magicpath-id="100" data-magicpath-path="CreateQuizFlow.tsx" />}
                        </div>
                        <span className={`font-semibold text-sm lg:text-base ${isComplete ? 'text-emerald-700' : isCurrent ? 'text-blue-700' : 'text-slate-600'}`} data-magicpath-id="101" data-magicpath-path="CreateQuizFlow.tsx">
                          {item.label}
                        </span>
                      </div>;
              })}
                </div>
              </div>
            </div>}

          {/* Step 4: Schedule */}
          {step === 'schedule' && <div className="p-4 lg:p-6" data-magicpath-id="102" data-magicpath-path="CreateQuizFlow.tsx">
              <div className="mb-6 text-center" data-magicpath-id="103" data-magicpath-path="CreateQuizFlow.tsx">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4" data-magicpath-id="104" data-magicpath-path="CreateQuizFlow.tsx">
                  <CheckCircle2 className="w-8 h-8 text-white" data-magicpath-id="105" data-magicpath-path="CreateQuizFlow.tsx" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2" data-magicpath-id="106" data-magicpath-path="CreateQuizFlow.tsx">
                  Quiz Generated Successfully! 🎉
                </h3>
                <p className="text-slate-600" data-magicpath-id="107" data-magicpath-path="CreateQuizFlow.tsx">
                  Your personalized quiz with {quizSettings.questionCount} questions is ready
                </p>
              </div>

              {/* Schedule Options */}
              <div className="space-y-4 max-w-lg mx-auto" data-magicpath-id="108" data-magicpath-path="CreateQuizFlow.tsx">
                <h4 className="text-sm font-bold text-slate-900 mb-3" data-magicpath-id="109" data-magicpath-path="CreateQuizFlow.tsx">
                  When would you like to take this quiz?
                </h4>

                {/* Take Now */}
                <button onClick={() => setScheduleOption('now')} className={`w-full p-4 lg:p-5 rounded-xl border-2 transition-all active:scale-[0.98] ${scheduleOption === 'now' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`} data-magicpath-id="110" data-magicpath-path="CreateQuizFlow.tsx">
                  <div className="flex items-center gap-4" data-magicpath-id="111" data-magicpath-path="CreateQuizFlow.tsx">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheduleOption === 'now' ? 'bg-blue-600' : 'bg-slate-100'}`} data-magicpath-id="112" data-magicpath-path="CreateQuizFlow.tsx">
                      <Play className={`w-6 h-6 ${scheduleOption === 'now' ? 'text-white' : 'text-slate-600'}`} data-magicpath-id="113" data-magicpath-path="CreateQuizFlow.tsx" />
                    </div>
                    <div className="flex-1 text-left" data-magicpath-id="114" data-magicpath-path="CreateQuizFlow.tsx">
                      <p className="font-bold text-slate-900 mb-0.5" data-magicpath-id="115" data-magicpath-path="CreateQuizFlow.tsx">Start Now</p>
                      <p className="text-sm text-slate-600" data-magicpath-id="116" data-magicpath-path="CreateQuizFlow.tsx">Begin the quiz immediately</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${scheduleOption === 'now' ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`} data-magicpath-id="117" data-magicpath-path="CreateQuizFlow.tsx">
                      {scheduleOption === 'now' && <Check className="w-4 h-4 text-white" data-magicpath-id="118" data-magicpath-path="CreateQuizFlow.tsx" />}
                    </div>
                  </div>
                </button>

                {/* Schedule for Later */}
                <button onClick={() => setScheduleOption('later')} className={`w-full p-4 lg:p-5 rounded-xl border-2 transition-all active:scale-[0.98] ${scheduleOption === 'later' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`} data-magicpath-id="119" data-magicpath-path="CreateQuizFlow.tsx">
                  <div className="flex items-center gap-4" data-magicpath-id="120" data-magicpath-path="CreateQuizFlow.tsx">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheduleOption === 'later' ? 'bg-blue-600' : 'bg-slate-100'}`} data-magicpath-id="121" data-magicpath-path="CreateQuizFlow.tsx">
                      <Calendar className={`w-6 h-6 ${scheduleOption === 'later' ? 'text-white' : 'text-slate-600'}`} data-magicpath-id="122" data-magicpath-path="CreateQuizFlow.tsx" />
                    </div>
                    <div className="flex-1 text-left" data-magicpath-id="123" data-magicpath-path="CreateQuizFlow.tsx">
                      <p className="font-bold text-slate-900 mb-0.5" data-magicpath-id="124" data-magicpath-path="CreateQuizFlow.tsx">Schedule for Later</p>
                      <p className="text-sm text-slate-600" data-magicpath-id="125" data-magicpath-path="CreateQuizFlow.tsx">Get a reminder at a specific time</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${scheduleOption === 'later' ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`} data-magicpath-id="126" data-magicpath-path="CreateQuizFlow.tsx">
                      {scheduleOption === 'later' && <Check className="w-4 h-4 text-white" data-magicpath-id="127" data-magicpath-path="CreateQuizFlow.tsx" />}
                    </div>
                  </div>
                </button>

                {/* Date/Time Picker */}
                {scheduleOption === 'later' && <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl animate-in slide-in-from-top duration-300" data-magicpath-id="128" data-magicpath-path="CreateQuizFlow.tsx">
                    <label htmlFor="schedule-datetime" className="block text-sm font-bold text-slate-900 mb-3" data-magicpath-id="129" data-magicpath-path="CreateQuizFlow.tsx">
                      <div className="flex items-center gap-2" data-magicpath-id="130" data-magicpath-path="CreateQuizFlow.tsx">
                        <Bell className="w-4 h-4 text-blue-600" data-magicpath-id="131" data-magicpath-path="CreateQuizFlow.tsx" />
                        <span data-magicpath-id="132" data-magicpath-path="CreateQuizFlow.tsx">Reminder Date & Time</span>
                      </div>
                    </label>
                    <input id="schedule-datetime" type="datetime-local" value={scheduleDateTime} onChange={e => setScheduleDateTime(e.target.value)} min={new Date().toISOString().slice(0, 16)} className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" data-magicpath-id="133" data-magicpath-path="CreateQuizFlow.tsx" />
                    <p className="text-xs text-blue-700 mt-2 flex items-center gap-1.5" data-magicpath-id="134" data-magicpath-path="CreateQuizFlow.tsx">
                      <Zap className="w-3.5 h-3.5" data-magicpath-id="135" data-magicpath-path="CreateQuizFlow.tsx" />
                      You'll receive a notification when it's time to take your quiz
                    </p>
                  </div>}

                {/* Quiz Preview Info */}
                <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl" data-magicpath-id="136" data-magicpath-path="CreateQuizFlow.tsx">
                  <p className="text-xs font-bold text-slate-600 mb-3" data-magicpath-id="137" data-magicpath-path="CreateQuizFlow.tsx">QUIZ SUMMARY</p>
                  <div className="grid grid-cols-2 gap-3" data-magicpath-id="138" data-magicpath-path="CreateQuizFlow.tsx">
                    <div data-magicpath-id="139" data-magicpath-path="CreateQuizFlow.tsx">
                      <p className="text-xs text-slate-600 mb-0.5" data-magicpath-id="140" data-magicpath-path="CreateQuizFlow.tsx">Questions</p>
                      <p className="text-lg font-bold text-slate-900" data-magicpath-id="141" data-magicpath-path="CreateQuizFlow.tsx">{quizSettings.questionCount}</p>
                    </div>
                    <div data-magicpath-id="142" data-magicpath-path="CreateQuizFlow.tsx">
                      <p className="text-xs text-slate-600 mb-0.5" data-magicpath-id="143" data-magicpath-path="CreateQuizFlow.tsx">Time Limit</p>
                      <p className="text-lg font-bold text-slate-900" data-magicpath-id="144" data-magicpath-path="CreateQuizFlow.tsx">{quizSettings.timeLimit} min</p>
                    </div>
                    <div data-magicpath-id="145" data-magicpath-path="CreateQuizFlow.tsx">
                      <p className="text-xs text-slate-600 mb-0.5" data-magicpath-id="146" data-magicpath-path="CreateQuizFlow.tsx">Difficulty</p>
                      <p className="text-lg font-bold text-slate-900 capitalize" data-magicpath-id="147" data-magicpath-path="CreateQuizFlow.tsx">{quizSettings.difficulty}</p>
                    </div>
                    <div data-magicpath-id="148" data-magicpath-path="CreateQuizFlow.tsx">
                      <p className="text-xs text-slate-600 mb-0.5" data-magicpath-id="149" data-magicpath-path="CreateQuizFlow.tsx">Materials</p>
                      <p className="text-lg font-bold text-slate-900" data-magicpath-id="150" data-magicpath-path="CreateQuizFlow.tsx">{selectedMaterials.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 px-4 lg:px-6 py-4 border-t border-slate-200 bg-slate-50" data-magicpath-id="151" data-magicpath-path="CreateQuizFlow.tsx">
          <div className="flex gap-3" data-magicpath-id="152" data-magicpath-path="CreateQuizFlow.tsx">
            {step !== 'generating' && <>
                {step !== 'select-materials' && step !== 'schedule' && <button onClick={() => {
              if (step === 'configure') setStep('select-materials');
            }} className="px-4 lg:px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all" data-magicpath-id="153" data-magicpath-path="CreateQuizFlow.tsx">
                    Back
                  </button>}
                
                <button onClick={() => {
              if (step === 'select-materials' && canProceedFromMaterials) {
                setStep('configure');
              } else if (step === 'configure') {
                handleGenerateQuiz();
              } else if (step === 'schedule') {
                handleScheduleQuiz();
              }
            }} disabled={step === 'select-materials' && !canProceedFromMaterials || step === 'schedule' && scheduleOption === 'later' && !scheduleDateTime} className="flex-1 flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100" data-magicpath-id="154" data-magicpath-path="CreateQuizFlow.tsx">
                  <span data-magicpath-id="155" data-magicpath-path="CreateQuizFlow.tsx">
                    {step === 'select-materials' && 'Continue'}
                    {step === 'configure' && 'Generate Quiz'}
                    {step === 'schedule' && (scheduleOption === 'now' ? 'Start Quiz' : 'Schedule Quiz')}
                  </span>
                  {step !== 'schedule' ? <ChevronRight className="w-5 h-5" data-magicpath-id="156" data-magicpath-path="CreateQuizFlow.tsx" /> : scheduleOption === 'now' ? <Play className="w-5 h-5" data-magicpath-id="157" data-magicpath-path="CreateQuizFlow.tsx" /> : <Bell className="w-5 h-5" data-magicpath-id="158" data-magicpath-path="CreateQuizFlow.tsx" />}
                </button>
              </>}
          </div>
        </div>
      </div>
    </div>;
};