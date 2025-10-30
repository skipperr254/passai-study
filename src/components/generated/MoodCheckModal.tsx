"use client";

import React, { useState } from 'react';
import { Smile, Meh, Frown, TrendingUp, TrendingDown, Brain, Zap, Coffee, Target } from 'lucide-react';
type Mood = 'confident' | 'okay' | 'struggling' | 'confused';
type MoodOption = {
  id: Mood;
  emoji: string;
  label: string;
  color: string;
  icon: React.ElementType;
};
type MoodCheckModalProps = {
  onComplete: (mood: Mood) => void;
  currentScore: number;
};
const moodOptions: MoodOption[] = [{
  id: 'confident',
  emoji: '🎯',
  label: 'Confident',
  color: 'from-emerald-500 to-green-600',
  icon: Target
}, {
  id: 'okay',
  emoji: '👍',
  label: 'Doing Okay',
  color: 'from-blue-500 to-indigo-600',
  icon: TrendingUp
}, {
  id: 'struggling',
  emoji: '🤔',
  label: 'Struggling',
  color: 'from-amber-500 to-orange-600',
  icon: Brain
}, {
  id: 'confused',
  emoji: '😕',
  label: 'Confused',
  color: 'from-red-500 to-pink-600',
  icon: TrendingDown
}];
export const MoodCheckModal = (props: MoodCheckModalProps) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const handleContinue = () => {
    if (selectedMood) {
      // Here you would send mood data to your backend for adaptive quiz adjustment
      props.onComplete(selectedMood);
    }
  };
  const getScoreMessage = () => {
    if (props.currentScore >= 80) return 'You\'re doing great! 🌟';
    if (props.currentScore >= 60) return 'Good progress so far! 💪';
    return 'Keep going, you\'ve got this! 🚀';
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4" data-magicpath-id="0" data-magicpath-path="MoodCheckModal.tsx">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-300" data-magicpath-id="1" data-magicpath-path="MoodCheckModal.tsx">
        {/* Header */}
        <div className="px-6 lg:px-8 pt-8 pb-6 border-b border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-3xl" data-magicpath-id="2" data-magicpath-path="MoodCheckModal.tsx">
          <div className="text-center" data-magicpath-id="3" data-magicpath-path="MoodCheckModal.tsx">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" data-magicpath-id="4" data-magicpath-path="MoodCheckModal.tsx">
              <Brain className="w-8 h-8 text-white" data-magicpath-id="5" data-magicpath-path="MoodCheckModal.tsx" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2" data-magicpath-id="6" data-magicpath-path="MoodCheckModal.tsx">Quick Check-In</h2>
            <p className="text-sm lg:text-base text-slate-600" data-magicpath-id="7" data-magicpath-path="MoodCheckModal.tsx">You're halfway through! Let's see how you're feeling.</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 lg:px-8 py-6" data-magicpath-id="8" data-magicpath-path="MoodCheckModal.tsx">
          {/* Current Performance */}
          <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl" data-magicpath-id="9" data-magicpath-path="MoodCheckModal.tsx">
            <div className="flex items-center justify-between mb-2" data-magicpath-id="10" data-magicpath-path="MoodCheckModal.tsx">
              <span className="text-sm font-semibold text-slate-700" data-magicpath-id="11" data-magicpath-path="MoodCheckModal.tsx">Current Score</span>
              <span className="text-2xl font-bold text-emerald-600" data-magicpath-id="12" data-magicpath-path="MoodCheckModal.tsx">{props.currentScore}%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden" data-magicpath-id="13" data-magicpath-path="MoodCheckModal.tsx">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500" style={{
              width: `${props.currentScore}%`
            }} data-magicpath-id="14" data-magicpath-path="MoodCheckModal.tsx" />
            </div>
            <p className="text-xs font-semibold text-emerald-700 mt-2" data-magicpath-id="15" data-magicpath-path="MoodCheckModal.tsx">{getScoreMessage()}</p>
          </div>

          {/* Mood Selection */}
          <div className="mb-6" data-magicpath-id="16" data-magicpath-path="MoodCheckModal.tsx">
            <label className="block text-sm font-bold text-slate-900 mb-3" data-magicpath-id="17" data-magicpath-path="MoodCheckModal.tsx">
              How are you feeling about the quiz so far?
            </label>
            <div className="grid grid-cols-2 gap-3" data-magicpath-id="18" data-magicpath-path="MoodCheckModal.tsx">
              {moodOptions.map(mood => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.id;
              return <button key={mood.id} onClick={() => setSelectedMood(mood.id)} className={`relative p-4 rounded-xl border-2 transition-all active:scale-95 ${isSelected ? `bg-gradient-to-br ${mood.color} text-white border-transparent shadow-lg` : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'}`} data-magicpath-id="19" data-magicpath-path="MoodCheckModal.tsx">
                    <div className="text-center" data-magicpath-id="20" data-magicpath-path="MoodCheckModal.tsx">
                      <div className={`text-4xl mb-2 ${isSelected ? 'scale-110' : ''} transition-transform`} data-magicpath-id="21" data-magicpath-path="MoodCheckModal.tsx">
                        {mood.emoji}
                      </div>
                      <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`} data-magicpath-id="22" data-magicpath-path="MoodCheckModal.tsx">
                        {mood.label}
                      </p>
                    </div>
                    {isSelected && <div className="absolute top-2 right-2" data-magicpath-id="23" data-magicpath-path="MoodCheckModal.tsx">
                        <div className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center" data-magicpath-id="24" data-magicpath-path="MoodCheckModal.tsx">
                          <Icon className="w-4 h-4 text-white" data-magicpath-id="25" data-magicpath-path="MoodCheckModal.tsx" />
                        </div>
                      </div>}
                  </button>;
            })}
            </div>
          </div>

          {/* Energy Level */}
          <div className="mb-6" data-magicpath-id="26" data-magicpath-path="MoodCheckModal.tsx">
            <label className="block text-sm font-bold text-slate-900 mb-3" data-magicpath-id="27" data-magicpath-path="MoodCheckModal.tsx">
              <div className="flex items-center gap-2" data-magicpath-id="28" data-magicpath-path="MoodCheckModal.tsx">
                <Coffee className="w-4 h-4 text-slate-600" data-magicpath-id="29" data-magicpath-path="MoodCheckModal.tsx" />
                <span data-magicpath-id="30" data-magicpath-path="MoodCheckModal.tsx">Energy Level</span>
              </div>
            </label>
            <div className="px-2" data-magicpath-id="31" data-magicpath-path="MoodCheckModal.tsx">
              <input type="range" min="1" max="10" value={energyLevel} onChange={e => setEnergyLevel(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" style={{
              background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${energyLevel * 10}%, rgb(226, 232, 240) ${energyLevel * 10}%, rgb(226, 232, 240) 100%)`
            }} data-magicpath-id="32" data-magicpath-path="MoodCheckModal.tsx" />
              <div className="flex items-center justify-between mt-2" data-magicpath-id="33" data-magicpath-path="MoodCheckModal.tsx">
                <span className="text-xs text-slate-600 font-medium" data-magicpath-id="34" data-magicpath-path="MoodCheckModal.tsx">Tired</span>
                <span className="text-sm font-bold text-blue-600" data-magicpath-id="35" data-magicpath-path="MoodCheckModal.tsx">{energyLevel}/10</span>
                <span className="text-xs text-slate-600 font-medium" data-magicpath-id="36" data-magicpath-path="MoodCheckModal.tsx">Energized</span>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          {selectedMood && <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl animate-in slide-in-from-top duration-300" data-magicpath-id="37" data-magicpath-path="MoodCheckModal.tsx">
              <div className="flex items-start gap-3" data-magicpath-id="38" data-magicpath-path="MoodCheckModal.tsx">
                <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" data-magicpath-id="39" data-magicpath-path="MoodCheckModal.tsx" />
                <div data-magicpath-id="40" data-magicpath-path="MoodCheckModal.tsx">
                  <p className="text-sm font-semibold text-slate-900 mb-1" data-magicpath-id="41" data-magicpath-path="MoodCheckModal.tsx">
                    {selectedMood === 'confident' && 'Fantastic! Keep that momentum going! 🚀'}
                    {selectedMood === 'okay' && 'You\'re doing well! Stay focused! 💪'}
                    {selectedMood === 'struggling' && 'That\'s okay! We\'ll adjust to help you succeed! 🌟'}
                    {selectedMood === 'confused' && 'No worries! We\'ll provide more support! 🤝'}
                  </p>
                  <p className="text-xs text-slate-600" data-magicpath-id="42" data-magicpath-path="MoodCheckModal.tsx">
                    We'll adapt the remaining questions based on your feedback.
                  </p>
                </div>
              </div>
            </div>}
        </div>

        {/* Footer */}
        <div className="px-6 lg:px-8 pb-8" data-magicpath-id="43" data-magicpath-path="MoodCheckModal.tsx">
          <button onClick={handleContinue} disabled={!selectedMood} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100" data-magicpath-id="44" data-magicpath-path="MoodCheckModal.tsx">
            <span data-magicpath-id="45" data-magicpath-path="MoodCheckModal.tsx">Continue Quiz</span>
            <Zap className="w-5 h-5" data-magicpath-id="46" data-magicpath-path="MoodCheckModal.tsx" />
          </button>
          <p className="text-xs text-center text-slate-500 mt-3" data-magicpath-id="47" data-magicpath-path="MoodCheckModal.tsx">
            Your feedback helps us personalize your learning experience
          </p>
        </div>
      </div>
    </div>;
};