"use client";

import React from 'react';
import { Sprout, Leaf, Flower2, Trophy, TrendingUp, Heart, Star } from 'lucide-react';
type GardenWidgetProps = {
  subject: string;
  subjectColor: string;
  level: number;
  progress: number; // 0-100
  plantHealth: number; // 0-100
  onClick?: () => void;
  compact?: boolean;
};
export const GardenWidget = (props: GardenWidgetProps) => {
  const getPlantIcon = () => {
    if (props.level <= 1) return Sprout;
    if (props.level <= 3) return Leaf;
    if (props.level <= 5) return Flower2;
    return Trophy;
  };
  const getPlantColor = () => {
    if (props.level <= 1) return 'text-green-500';
    if (props.level <= 3) return 'text-green-600';
    if (props.level <= 5) return 'text-pink-600';
    return 'text-amber-600';
  };
  const getHealthColor = () => {
    if (props.plantHealth >= 80) return 'bg-emerald-500';
    if (props.plantHealth >= 60) return 'bg-green-500';
    if (props.plantHealth >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };
  const PlantIcon = getPlantIcon();
  if (props.compact) {
    return <button onClick={props.onClick} className="w-full bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-3 hover:shadow-md transition-all active:scale-95" data-magicpath-id="0" data-magicpath-path="GardenWidget.tsx">
        <div className="flex items-center gap-3" data-magicpath-id="1" data-magicpath-path="GardenWidget.tsx">
          <div className="relative" data-magicpath-id="2" data-magicpath-path="GardenWidget.tsx">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${props.subjectColor} flex items-center justify-center`} data-magicpath-id="3" data-magicpath-path="GardenWidget.tsx">
              <PlantIcon className={`w-6 h-6 ${getPlantColor()}`} data-magicpath-id="4" data-magicpath-path="GardenWidget.tsx" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-emerald-500" data-magicpath-id="5" data-magicpath-path="GardenWidget.tsx">
              <span className="text-xs font-bold text-emerald-600" data-magicpath-id="6" data-magicpath-path="GardenWidget.tsx">{props.level}</span>
            </div>
          </div>
          <div className="flex-1 text-left" data-magicpath-id="7" data-magicpath-path="GardenWidget.tsx">
            <p className="text-xs font-semibold text-slate-600 mb-1" data-magicpath-id="8" data-magicpath-path="GardenWidget.tsx">🌱 Garden</p>
            <div className="h-1.5 bg-white rounded-full overflow-hidden mb-1" data-magicpath-id="9" data-magicpath-path="GardenWidget.tsx">
              <div className={`h-full bg-gradient-to-r ${props.subjectColor} rounded-full transition-all`} style={{
              width: `${props.progress}%`
            }} data-magicpath-id="10" data-magicpath-path="GardenWidget.tsx" />
            </div>
            <p className="text-xs text-slate-600" data-magicpath-id="11" data-magicpath-path="GardenWidget.tsx">
              <span className="font-bold text-slate-900" data-magicpath-id="12" data-magicpath-path="GardenWidget.tsx">{props.progress}%</span> to Level {props.level + 1}
            </p>
          </div>
        </div>
      </button>;
  }
  return <button onClick={props.onClick} className="w-full bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-lg transition-all active:scale-[0.98] group" data-magicpath-id="13" data-magicpath-path="GardenWidget.tsx">
      <div className="flex items-center gap-4 mb-4" data-magicpath-id="14" data-magicpath-path="GardenWidget.tsx">
        <div className="relative" data-magicpath-id="15" data-magicpath-path="GardenWidget.tsx">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${props.subjectColor} flex items-center justify-center shadow-md`} data-magicpath-id="16" data-magicpath-path="GardenWidget.tsx">
            <PlantIcon className={`w-8 h-8 ${getPlantColor()}`} data-magicpath-id="17" data-magicpath-path="GardenWidget.tsx" />
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center border-2 border-emerald-500 shadow-sm" data-magicpath-id="18" data-magicpath-path="GardenWidget.tsx">
            <span className="text-sm font-bold text-emerald-600" data-magicpath-id="19" data-magicpath-path="GardenWidget.tsx">{props.level}</span>
          </div>
        </div>
        <div className="flex-1 text-left" data-magicpath-id="20" data-magicpath-path="GardenWidget.tsx">
          <div className="flex items-center gap-2 mb-1" data-magicpath-id="21" data-magicpath-path="GardenWidget.tsx">
            <Sprout className="w-4 h-4 text-emerald-600" data-magicpath-id="22" data-magicpath-path="GardenWidget.tsx" />
            <p className="text-sm font-bold text-slate-900" data-magicpath-id="23" data-magicpath-path="GardenWidget.tsx">{props.subject} Garden</p>
          </div>
          <p className="text-xs text-slate-600" data-magicpath-id="24" data-magicpath-path="GardenWidget.tsx">Level {props.level} • Growing Strong</p>
        </div>
      </div>

      {/* Progress to Next Level */}
      <div className="mb-4" data-magicpath-id="25" data-magicpath-path="GardenWidget.tsx">
        <div className="flex items-center justify-between mb-2" data-magicpath-id="26" data-magicpath-path="GardenWidget.tsx">
          <div className="flex items-center gap-1.5" data-magicpath-id="27" data-magicpath-path="GardenWidget.tsx">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" data-magicpath-id="28" data-magicpath-path="GardenWidget.tsx" />
            <span className="text-xs font-semibold text-slate-600" data-magicpath-id="29" data-magicpath-path="GardenWidget.tsx">Growth</span>
          </div>
          <span className="text-xs font-bold text-blue-600" data-magicpath-id="30" data-magicpath-path="GardenWidget.tsx">{props.progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden" data-magicpath-id="31" data-magicpath-path="GardenWidget.tsx">
          <div className={`h-full bg-gradient-to-r ${props.subjectColor} rounded-full transition-all duration-500 relative`} style={{
          width: `${props.progress}%`
        }} data-magicpath-id="32" data-magicpath-path="GardenWidget.tsx">
            <div className="absolute inset-0 bg-white/20 animate-pulse" data-magicpath-id="33" data-magicpath-path="GardenWidget.tsx" />
          </div>
        </div>
      </div>

      {/* Plant Health */}
      <div className="flex items-center justify-between" data-magicpath-id="34" data-magicpath-path="GardenWidget.tsx">
        <div className="flex items-center gap-2" data-magicpath-id="35" data-magicpath-path="GardenWidget.tsx">
          <Heart className="w-4 h-4 text-red-500" data-magicpath-id="36" data-magicpath-path="GardenWidget.tsx" />
          <span className="text-xs font-semibold text-slate-600" data-magicpath-id="37" data-magicpath-path="GardenWidget.tsx">Health</span>
        </div>
        <div className="flex items-center gap-2" data-magicpath-id="38" data-magicpath-path="GardenWidget.tsx">
          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden" data-magicpath-id="39" data-magicpath-path="GardenWidget.tsx">
            <div className={`h-full ${getHealthColor()} rounded-full transition-all`} style={{
            width: `${props.plantHealth}%`
          }} data-magicpath-id="40" data-magicpath-path="GardenWidget.tsx" />
          </div>
          <span className="text-xs font-bold text-slate-900" data-magicpath-id="41" data-magicpath-path="GardenWidget.tsx">{props.plantHealth}%</span>
        </div>
      </div>

      {/* Hover hint */}
      <p className="text-xs text-center text-slate-400 mt-3 group-hover:text-emerald-600 transition-colors" data-magicpath-id="42" data-magicpath-path="GardenWidget.tsx">
        Click to view full garden →
      </p>
    </button>;
};