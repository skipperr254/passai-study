"use client";

import React, { useState, useEffect } from 'react';
import { Sprout, Leaf, Flower2, Sun, Droplets, TrendingUp, Award, Star, Sparkles, X, Target, Heart, Zap, Trophy } from 'lucide-react';
type GardenProgressProps = {
  subject: string;
  subjectColor: string;
  level: number;
  progress: number; // 0-100
  pointsEarned: number;
  plantHealth: number; // 0-100 (consistency)
  onClose: () => void;
};
export const GardenProgress = (props: GardenProgressProps) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(props.progress - props.pointsEarned / 10);
  useEffect(() => {
    // Animate progress bar
    setTimeout(() => {
      setDisplayProgress(props.progress);
    }, 300);

    // Show growth animation
    setTimeout(() => {
      setShowAnimation(true);
    }, 800);
  }, [props.progress]);
  const getPlantStage = () => {
    if (props.level <= 1) return {
      icon: Sprout,
      label: 'Seedling',
      color: 'text-green-500'
    };
    if (props.level <= 3) return {
      icon: Leaf,
      label: 'Young Plant',
      color: 'text-green-600'
    };
    if (props.level <= 5) return {
      icon: Flower2,
      label: 'Flowering',
      color: 'text-pink-600'
    };
    return {
      icon: Trophy,
      label: 'Thriving',
      color: 'text-amber-600'
    };
  };
  const getHealthColor = () => {
    if (props.plantHealth >= 80) return 'from-emerald-500 to-green-600';
    if (props.plantHealth >= 60) return 'from-green-500 to-emerald-600';
    if (props.plantHealth >= 40) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };
  const getHealthMessage = () => {
    if (props.plantHealth >= 80) return 'Thriving! Keep up the consistent study! 🌟';
    if (props.plantHealth >= 60) return 'Healthy! Study regularly to maintain growth! 💪';
    if (props.plantHealth >= 40) return 'Needs attention. Try to study more often! 💧';
    return 'Wilting! Your garden needs regular care! 🌱';
  };
  const plantStage = getPlantStage();
  const PlantIcon = plantStage.icon;
  const leveledUp = props.progress >= 100;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4" onClick={props.onClose} data-magicpath-id="0" data-magicpath-path="GardenProgress.tsx">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()} data-magicpath-id="1" data-magicpath-path="GardenProgress.tsx">
        {/* Header */}
        <div className={`px-6 lg:px-8 py-8 bg-gradient-to-br ${props.subjectColor} text-white relative overflow-hidden`} data-magicpath-id="2" data-magicpath-path="GardenProgress.tsx">
          <button onClick={props.onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all" data-magicpath-id="3" data-magicpath-path="GardenProgress.tsx">
            <X className="w-5 h-5" data-magicpath-id="4" data-magicpath-path="GardenProgress.tsx" />
          </button>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" data-magicpath-id="5" data-magicpath-path="GardenProgress.tsx" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" data-magicpath-id="6" data-magicpath-path="GardenProgress.tsx" />

          <div className="relative z-10 text-center" data-magicpath-id="7" data-magicpath-path="GardenProgress.tsx">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4" data-magicpath-id="8" data-magicpath-path="GardenProgress.tsx">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold" data-magicpath-id="9" data-magicpath-path="GardenProgress.tsx">Garden Growth</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2" data-magicpath-id="10" data-magicpath-path="GardenProgress.tsx">{props.subject} Garden</h2>
            <p className="text-white/90 text-base" data-magicpath-id="11" data-magicpath-path="GardenProgress.tsx">Watch your knowledge bloom! 🌸</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 lg:px-8 py-8 space-y-6" data-magicpath-id="12" data-magicpath-path="GardenProgress.tsx">
          {/* Points Earned Celebration */}
          {showAnimation && <div className="text-center animate-in zoom-in-95 duration-500" data-magicpath-id="13" data-magicpath-path="GardenProgress.tsx">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-lg mb-4" data-magicpath-id="14" data-magicpath-path="GardenProgress.tsx">
                <Star className="w-8 h-8 animate-pulse" data-magicpath-id="15" data-magicpath-path="GardenProgress.tsx" />
                <div className="text-left" data-magicpath-id="16" data-magicpath-path="GardenProgress.tsx">
                  <p className="text-sm font-semibold text-white/90" data-magicpath-id="17" data-magicpath-path="GardenProgress.tsx">Points Earned</p>
                  <p className="text-3xl font-bold" data-magicpath-id="18" data-magicpath-path="GardenProgress.tsx">+{props.pointsEarned}</p>
                </div>
              </div>
            </div>}

          {/* Plant Visualization */}
          <div className="relative" data-magicpath-id="19" data-magicpath-path="GardenProgress.tsx">
            <div className="w-full h-64 bg-gradient-to-b from-sky-100 to-green-50 rounded-2xl border-2 border-slate-200 overflow-hidden relative" data-magicpath-id="20" data-magicpath-path="GardenProgress.tsx">
              {/* Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-amber-100 to-amber-200" data-magicpath-id="21" data-magicpath-path="GardenProgress.tsx" />
              
              {/* Sun */}
              <Sun className="absolute top-6 right-6 w-12 h-12 text-amber-400 animate-pulse" data-magicpath-id="22" data-magicpath-path="GardenProgress.tsx" />
              
              {/* Plant - Centered */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center" data-magicpath-id="23" data-magicpath-path="GardenProgress.tsx">
                <div className={`${showAnimation ? 'animate-in zoom-in-95 duration-1000' : 'opacity-0'}`} data-magicpath-id="24" data-magicpath-path="GardenProgress.tsx">
                  <PlantIcon className={`w-24 h-24 lg:w-32 lg:h-32 ${plantStage.color} drop-shadow-lg`} data-magicpath-id="25" data-magicpath-path="GardenProgress.tsx" />
                </div>
                
                {/* Growth sparkles */}
                {showAnimation && <>
                    <Sparkles className="absolute -top-4 -left-6 w-6 h-6 text-amber-400 animate-ping" />
                    <Sparkles className="absolute -top-6 right-0 w-5 h-5 text-green-400 animate-ping delay-100" />
                    <Sparkles className="absolute top-2 -right-8 w-4 h-4 text-pink-400 animate-ping delay-200" />
                  </>}
              </div>

              {/* Growth Level Label */}
              <div className="absolute top-4 left-4" data-magicpath-id="26" data-magicpath-path="GardenProgress.tsx">
                <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm" data-magicpath-id="27" data-magicpath-path="GardenProgress.tsx">
                  <p className="text-xs font-bold text-slate-900" data-magicpath-id="28" data-magicpath-path="GardenProgress.tsx">{plantStage.label}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6" data-magicpath-id="29" data-magicpath-path="GardenProgress.tsx">
            <div className="flex items-center justify-between mb-4" data-magicpath-id="30" data-magicpath-path="GardenProgress.tsx">
              <div className="flex items-center gap-3" data-magicpath-id="31" data-magicpath-path="GardenProgress.tsx">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${props.subjectColor} flex items-center justify-center shadow-lg`} data-magicpath-id="32" data-magicpath-path="GardenProgress.tsx">
                  <Award className="w-6 h-6 text-white" data-magicpath-id="33" data-magicpath-path="GardenProgress.tsx" />
                </div>
                <div data-magicpath-id="34" data-magicpath-path="GardenProgress.tsx">
                  <p className="text-sm font-semibold text-slate-600" data-magicpath-id="35" data-magicpath-path="GardenProgress.tsx">Current Level</p>
                  <p className="text-2xl font-bold text-slate-900" data-magicpath-id="36" data-magicpath-path="GardenProgress.tsx">Level {props.level}</p>
                </div>
              </div>
              {leveledUp && <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg animate-bounce" data-magicpath-id="37" data-magicpath-path="GardenProgress.tsx">
                  Level Up! 🎉
                </div>}
            </div>

            <div className="mb-2" data-magicpath-id="38" data-magicpath-path="GardenProgress.tsx">
              <div className="flex items-center justify-between mb-2" data-magicpath-id="39" data-magicpath-path="GardenProgress.tsx">
                <span className="text-sm font-semibold text-slate-700" data-magicpath-id="40" data-magicpath-path="GardenProgress.tsx">Growth Progress</span>
                <span className="text-sm font-bold text-blue-600" data-magicpath-id="41" data-magicpath-path="GardenProgress.tsx">{Math.round(displayProgress)}%</span>
              </div>
              <div className="h-4 bg-white rounded-full overflow-hidden shadow-inner" data-magicpath-id="42" data-magicpath-path="GardenProgress.tsx">
                <div className={`h-full bg-gradient-to-r ${props.subjectColor} rounded-full transition-all duration-1000 ease-out relative`} style={{
                width: `${displayProgress}%`
              }} data-magicpath-id="43" data-magicpath-path="GardenProgress.tsx">
                  <div className="absolute inset-0 bg-white/20 animate-pulse" data-magicpath-id="44" data-magicpath-path="GardenProgress.tsx" />
                </div>
              </div>
            </div>
            
            <p className="text-xs text-slate-600" data-magicpath-id="45" data-magicpath-path="GardenProgress.tsx">
              {leveledUp ? '🎊 Congratulations! You\'ve reached the next level!' : `${100 - Math.round(displayProgress)}% until next level`}
            </p>
          </div>

          {/* Plant Health (Consistency) */}
          <div className={`bg-gradient-to-br ${getHealthColor().replace('from-', 'from-').replace('to-', 'to-')}/10 border-2 rounded-2xl p-6`} data-magicpath-id="46" data-magicpath-path="GardenProgress.tsx">
            <div className="flex items-center gap-3 mb-4" data-magicpath-id="47" data-magicpath-path="GardenProgress.tsx">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getHealthColor()} flex items-center justify-center shadow-lg`} data-magicpath-id="48" data-magicpath-path="GardenProgress.tsx">
                <Heart className="w-6 h-6 text-white" data-magicpath-id="49" data-magicpath-path="GardenProgress.tsx" />
              </div>
              <div className="flex-1" data-magicpath-id="50" data-magicpath-path="GardenProgress.tsx">
                <p className="text-sm font-semibold text-slate-600" data-magicpath-id="51" data-magicpath-path="GardenProgress.tsx">Plant Health</p>
                <p className="text-2xl font-bold text-slate-900" data-magicpath-id="52" data-magicpath-path="GardenProgress.tsx">{props.plantHealth}%</p>
              </div>
            </div>

            <div className="h-3 bg-white rounded-full overflow-hidden mb-3 shadow-inner" data-magicpath-id="53" data-magicpath-path="GardenProgress.tsx">
              <div className={`h-full bg-gradient-to-r ${getHealthColor()} rounded-full transition-all duration-1000`} style={{
              width: `${props.plantHealth}%`
            }} data-magicpath-id="54" data-magicpath-path="GardenProgress.tsx" />
            </div>

            <p className="text-sm text-slate-700 font-medium" data-magicpath-id="55" data-magicpath-path="GardenProgress.tsx">
              {getHealthMessage()}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3" data-magicpath-id="56" data-magicpath-path="GardenProgress.tsx">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 text-center" data-magicpath-id="57" data-magicpath-path="GardenProgress.tsx">
              <Droplets className="w-6 h-6 text-purple-600 mx-auto mb-2" data-magicpath-id="58" data-magicpath-path="GardenProgress.tsx" />
              <p className="text-xs font-semibold text-slate-600 mb-1" data-magicpath-id="59" data-magicpath-path="GardenProgress.tsx">Watering</p>
              <p className="text-lg font-bold text-slate-900" data-magicpath-id="60" data-magicpath-path="GardenProgress.tsx">Daily</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 text-center" data-magicpath-id="61" data-magicpath-path="GardenProgress.tsx">
              <Sun className="w-6 h-6 text-amber-600 mx-auto mb-2" data-magicpath-id="62" data-magicpath-path="GardenProgress.tsx" />
              <p className="text-xs font-semibold text-slate-600 mb-1" data-magicpath-id="63" data-magicpath-path="GardenProgress.tsx">Sunlight</p>
              <p className="text-lg font-bold text-slate-900" data-magicpath-id="64" data-magicpath-path="GardenProgress.tsx">Full</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 text-center" data-magicpath-id="65" data-magicpath-path="GardenProgress.tsx">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" data-magicpath-id="66" data-magicpath-path="GardenProgress.tsx" />
              <p className="text-xs font-semibold text-slate-600 mb-1" data-magicpath-id="67" data-magicpath-path="GardenProgress.tsx">Growth</p>
              <p className="text-lg font-bold text-slate-900" data-magicpath-id="68" data-magicpath-path="GardenProgress.tsx">Strong</p>
            </div>
          </div>

          {/* Motivational Footer */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white text-center" data-magicpath-id="69" data-magicpath-path="GardenProgress.tsx">
            <Zap className="w-10 h-10 mx-auto mb-3 animate-bounce" data-magicpath-id="70" data-magicpath-path="GardenProgress.tsx" />
            <p className="text-lg font-bold mb-2" data-magicpath-id="71" data-magicpath-path="GardenProgress.tsx">Keep Growing! 🌱</p>
            <p className="text-sm text-white/90" data-magicpath-id="72" data-magicpath-path="GardenProgress.tsx">
              Study consistently to keep your garden healthy and thriving!
            </p>
          </div>

          {/* Close Button */}
          <button onClick={props.onClose} className="w-full px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors" data-magicpath-id="73" data-magicpath-path="GardenProgress.tsx">
            Close
          </button>
        </div>
      </div>
    </div>;
};