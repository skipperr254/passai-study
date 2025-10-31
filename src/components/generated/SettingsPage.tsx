import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Moon, Sun, Volume2, VolumeX, Globe, Shield, HelpCircle, LogOut, ChevronRight, Check, X } from 'lucide-react';
export interface SettingsData {
  notifications: {
    quizReminders: boolean;
    studyReminders: boolean;
    achievements: boolean;
    emailUpdates: boolean;
  };
  appearance: {
    darkMode: boolean;
    soundEffects: boolean;
  };
  study: {
    dailyGoal: number;
    reminderTime: string;
    defaultQuizLength: number;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showProgress: boolean;
  };
}
export interface SettingsPageProps {
  settings?: SettingsData;
  onUpdateSettings?: (settings: SettingsData) => void;
  onLogout?: () => void;
  onBack?: () => void;
}
const defaultSettings: SettingsData = {
  notifications: {
    quizReminders: true,
    studyReminders: true,
    achievements: true,
    emailUpdates: false
  },
  appearance: {
    darkMode: false,
    soundEffects: true
  },
  study: {
    dailyGoal: 30,
    reminderTime: '18:00',
    defaultQuizLength: 10
  },
  privacy: {
    profileVisibility: 'public',
    showProgress: true
  }
};
export const SettingsPage = ({
  settings = defaultSettings,
  onUpdateSettings,
  onLogout,
  onBack
}: SettingsPageProps) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const updateSetting = (category: keyof SettingsData, key: string, value: any) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [key]: value
      }
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };
  const handleSave = () => {
    onUpdateSettings?.(localSettings);
    setHasChanges(false);
  };
  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };
  const Toggle = ({
    enabled,
    onChange
  }: {
    enabled: boolean;
    onChange: () => void;
  }) => <button onClick={onChange} className={`relative w-12 h-7 rounded-full transition-all ${enabled ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-slate-300'}`}>
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${enabled ? 'left-6' : 'left-1'}`} />
    </button>;
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">Customize your learning experience</p>
          </div>
          {onBack && <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all">
              <X className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:inline">Close</span>
            </button>}
        </div>

        {/* Save/Reset Bar */}
        {hasChanges && <div className="bg-blue-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 mb-6 flex items-center justify-between">
            <p className="text-sm font-semibold text-blue-900">You have unsaved changes</p>
            <div className="flex gap-2">
              <button onClick={handleReset} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg transition-all">
                Reset
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all">
                Save Changes
              </button>
            </div>
          </div>}

        <div className="space-y-4 sm:space-y-6">
          {/* Notifications Section */}
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                  <p className="text-xs text-slate-600">Manage how you receive updates</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Quiz Reminders</p>
                  <p className="text-xs text-slate-600">Get notified about upcoming quizzes</p>
                </div>
                <Toggle enabled={localSettings.notifications.quizReminders} onChange={() => updateSetting('notifications', 'quizReminders', !localSettings.notifications.quizReminders)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Study Reminders</p>
                  <p className="text-xs text-slate-600">Daily reminders to keep you on track</p>
                </div>
                <Toggle enabled={localSettings.notifications.studyReminders} onChange={() => updateSetting('notifications', 'studyReminders', !localSettings.notifications.studyReminders)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Achievement Alerts</p>
                  <p className="text-xs text-slate-600">Celebrate your milestones</p>
                </div>
                <Toggle enabled={localSettings.notifications.achievements} onChange={() => updateSetting('notifications', 'achievements', !localSettings.notifications.achievements)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email Updates</p>
                  <p className="text-xs text-slate-600">Weekly progress reports via email</p>
                </div>
                <Toggle enabled={localSettings.notifications.emailUpdates} onChange={() => updateSetting('notifications', 'emailUpdates', !localSettings.notifications.emailUpdates)} />
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-sm">
                  {localSettings.appearance.darkMode ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Appearance</h2>
                  <p className="text-xs text-slate-600">Customize the look and feel</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Dark Mode</p>
                  <p className="text-xs text-slate-600">Switch to dark theme</p>
                </div>
                <Toggle enabled={localSettings.appearance.darkMode} onChange={() => updateSetting('appearance', 'darkMode', !localSettings.appearance.darkMode)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">Sound Effects</p>
                  {localSettings.appearance.soundEffects ? <Volume2 className="w-4 h-4 text-slate-500" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                </div>
                <Toggle enabled={localSettings.appearance.soundEffects} onChange={() => updateSetting('appearance', 'soundEffects', !localSettings.appearance.soundEffects)} />
              </div>
            </div>
          </section>

          {/* Study Preferences Section */}
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-sm">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Study Preferences</h2>
                  <p className="text-xs text-slate-600">Configure your study settings</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Daily Study Goal (minutes)
                </label>
                <input type="number" value={localSettings.study.dailyGoal} onChange={e => updateSetting('study', 'dailyGoal', parseInt(e.target.value))} min="15" max="180" step="15" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-900 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Reminder Time</label>
                <input type="time" value={localSettings.study.reminderTime} onChange={e => updateSetting('study', 'reminderTime', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-900 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Default Quiz Length (questions)
                </label>
                <select value={localSettings.study.defaultQuizLength} onChange={e => updateSetting('study', 'defaultQuizLength', parseInt(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-900 outline-none transition-all">
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                  <option value={20}>20 questions</option>
                </select>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center shadow-sm">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Privacy</h2>
                  <p className="text-xs text-slate-600">Control your data and visibility</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Profile Visibility</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => updateSetting('privacy', 'profileVisibility', 'public')} className={`px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${localSettings.privacy.profileVisibility === 'public' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'}`}>
                    <Globe className="w-4 h-4 mx-auto mb-1" />
                    Public
                  </button>
                  <button onClick={() => updateSetting('privacy', 'profileVisibility', 'private')} className={`px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${localSettings.privacy.profileVisibility === 'private' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'}`}>
                    <Shield className="w-4 h-4 mx-auto mb-1" />
                    Private
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Show Progress</p>
                  <p className="text-xs text-slate-600">Display your study stats publicly</p>
                </div>
                <Toggle enabled={localSettings.privacy.showProgress} onChange={() => updateSetting('privacy', 'showProgress', !localSettings.privacy.showProgress)} />
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-900">Help & Support</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </button>
              <button onClick={onLogout} className="w-full flex items-center justify-between px-4 py-3 hover:bg-red-50 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-semibold text-red-600">Log Out</span>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl { backdrop-filter: blur(20px); }
        }
      `}</style>
    </div>;
};