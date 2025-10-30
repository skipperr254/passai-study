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
  }) => <button onClick={onChange} className={`relative w-12 h-7 rounded-full transition-all ${enabled ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-slate-300'}`} data-magicpath-id="0" data-magicpath-path="SettingsPage.tsx">
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${enabled ? 'left-6' : 'left-1'}`} data-magicpath-id="1" data-magicpath-path="SettingsPage.tsx" />
    </button>;
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40" data-magicpath-id="2" data-magicpath-path="SettingsPage.tsx">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8" data-magicpath-id="3" data-magicpath-path="SettingsPage.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8" data-magicpath-id="4" data-magicpath-path="SettingsPage.tsx">
          <div data-magicpath-id="5" data-magicpath-path="SettingsPage.tsx">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900" data-magicpath-id="6" data-magicpath-path="SettingsPage.tsx">Settings</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1" data-magicpath-id="7" data-magicpath-path="SettingsPage.tsx">Customize your learning experience</p>
          </div>
          {onBack && <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all" data-magicpath-id="8" data-magicpath-path="SettingsPage.tsx">
              <X className="w-5 h-5" data-magicpath-id="9" data-magicpath-path="SettingsPage.tsx" />
              <span className="text-sm font-semibold hidden sm:inline" data-magicpath-id="10" data-magicpath-path="SettingsPage.tsx">Close</span>
            </button>}
        </div>

        {/* Save/Reset Bar */}
        {hasChanges && <div className="bg-blue-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 mb-6 flex items-center justify-between" data-magicpath-id="11" data-magicpath-path="SettingsPage.tsx">
            <p className="text-sm font-semibold text-blue-900" data-magicpath-id="12" data-magicpath-path="SettingsPage.tsx">You have unsaved changes</p>
            <div className="flex gap-2" data-magicpath-id="13" data-magicpath-path="SettingsPage.tsx">
              <button onClick={handleReset} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg transition-all" data-magicpath-id="14" data-magicpath-path="SettingsPage.tsx">
                Reset
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all" data-magicpath-id="15" data-magicpath-path="SettingsPage.tsx">
                Save Changes
              </button>
            </div>
          </div>}

        <div className="space-y-4 sm:space-y-6" data-magicpath-id="16" data-magicpath-path="SettingsPage.tsx">
          {/* Notifications Section */}
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden" data-magicpath-id="17" data-magicpath-path="SettingsPage.tsx">
            <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-blue-50 to-indigo-50" data-magicpath-id="18" data-magicpath-path="SettingsPage.tsx">
              <div className="flex items-center gap-3" data-magicpath-id="19" data-magicpath-path="SettingsPage.tsx">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm" data-magicpath-id="20" data-magicpath-path="SettingsPage.tsx">
                  <Bell className="w-5 h-5 text-white" data-magicpath-id="21" data-magicpath-path="SettingsPage.tsx" />
                </div>
                <div data-magicpath-id="22" data-magicpath-path="SettingsPage.tsx">
                  <h2 className="text-lg font-bold text-slate-900" data-magicpath-id="23" data-magicpath-path="SettingsPage.tsx">Notifications</h2>
                  <p className="text-xs text-slate-600" data-magicpath-id="24" data-magicpath-path="SettingsPage.tsx">Manage how you receive updates</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4" data-magicpath-id="25" data-magicpath-path="SettingsPage.tsx">
              <div className="flex items-center justify-between" data-magicpath-id="26" data-magicpath-path="SettingsPage.tsx">
                <div data-magicpath-id="27" data-magicpath-path="SettingsPage.tsx">
                  <p className="text-sm font-semibold text-slate-900" data-magicpath-id="28" data-magicpath-path="SettingsPage.tsx">Quiz Reminders</p>
                  <p className="text-xs text-slate-600" data-magicpath-id="29" data-magicpath-path="SettingsPage.tsx">Get notified about upcoming quizzes</p>
                </div>
                <Toggle enabled={localSettings.notifications.quizReminders} onChange={() => updateSetting('notifications', 'quizReminders', !localSettings.notifications.quizReminders)} data-magicpath-id="30" data-magicpath-path="SettingsPage.tsx" />
              </div>
              <div className="flex items-center justify-between" data-magicpath-id="31" data-magicpath-path="SettingsPage.tsx">
                <div data-magicpath-id="32" data-magicpath-path="SettingsPage.tsx">
                  <p className="text-sm font-semibold text-slate-900" data-magicpath-id="33" data-magicpath-path="SettingsPage.tsx">Study Reminders</p>
                  <p className="text-xs text-slate-600" data-magicpath-id="34" data-magicpath-path="SettingsPage.tsx">Daily reminders to keep you on track</p>
                </div>
                <Toggle enabled={localSettings.notifications.studyReminders} onChange={() => updateSetting('notifications', 'studyReminders', !localSettings.notifications.studyReminders)} data-magicpath-id="35" data-magicpath-path="SettingsPage.tsx" />
              </div>
              <div className="flex items-center justify-between" data-magicpath-id="36" data-magicpath-path="SettingsPage.tsx">
                <div data-magicpath-id="37" data-magicpath-path="SettingsPage.tsx">
                  <p className="text-sm font-semibold text-slate-900" data-magicpath-id="38" data-magicpath-path="SettingsPage.tsx">Achievement Alerts</p>
                  <p className="text-xs text-slate-600" data-magicpath-id="39" data-magicpath-path="SettingsPage.tsx">Celebrate your milestones</p>
                </div>
                <Toggle enabled={localSettings.notifications.achievements} onChange={() => updateSetting('notifications', 'achievements', !localSettings.notifications.achievements)} data-magicpath-id="40" data-magicpath-path="SettingsPage.tsx" />
              </div>
              <div className="flex items-center justify-between" data-magicpath-id="41" data-magicpath-path="SettingsPage.tsx">
                <div data-magicpath-id="42" data-magicpath-path="SettingsPage.tsx">
                  <p className="text-sm font-semibold text-slate-900" data-magicpath-id="43" data-magicpath-path="SettingsPage.tsx">Email Updates</p>
                  <p className="text-xs text-slate-600" data-magicpath-id="44" data-magicpath-path="SettingsPage.tsx">Weekly progress reports via email</p>
                </div>
                <Toggle enabled={localSettings.notifications.emailUpdates} onChange={() => updateSetting('notifications', 'emailUpdates', !localSettings.notifications.emailUpdates)} data-magicpath-id="45" data-magicpath-path="SettingsPage.tsx" />
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden" data-magicpath-id="46" data-magicpath-path="SettingsPage.tsx">
            <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-purple-50 to-pink-50" data-magicpath-id="47" data-magicpath-path="SettingsPage.tsx">
              <div className="flex items-center gap-3" data-magicpath-id="48" data-magicpath-path="SettingsPage.tsx">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-sm" data-magicpath-id="49" data-magicpath-path="SettingsPage.tsx">
                  {localSettings.appearance.darkMode ? <Moon className="w-5 h-5 text-white" data-magicpath-id="50" data-magicpath-path="SettingsPage.tsx" /> : <Sun className="w-5 h-5 text-white" data-magicpath-id="51" data-magicpath-path="SettingsPage.tsx" />}
                </div>
                <div data-magicpath-id="52" data-magicpath-path="SettingsPage.tsx">
                  <h2 className="text-lg font-bold text-slate-900" data-magicpath-id="53" data-magicpath-path="SettingsPage.tsx">Appearance</h2>
                  <p className="text-xs text-slate-600" data-magicpath-id="54" data-magicpath-path="SettingsPage.tsx">Customize the look and feel</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4" data-magicpath-id="55" data-magicpath-path="SettingsPage.tsx">
              <div className="flex items-center justify-between" data-magicpath-id="56" data-magicpath-path="SettingsPage.tsx">
                <div data-magicpath-id="57" data-magicpath-path="SettingsPage.tsx">
                  <p className="text-sm font-semibold text-slate-900" data-magicpath-id="58" data-magicpath-path="SettingsPage.tsx">Dark Mode</p>
                  <p className="text-xs text-slate-600" data-magicpath-id="59" data-magicpath-path="SettingsPage.tsx">Switch to dark theme</p>
                </div>
                <Toggle enabled={localSettings.appearance.darkMode} onChange={() => updateSetting('appearance', 'darkMode', !localSettings.appearance.darkMode)} data-magicpath-id="60" data-magicpath-path="SettingsPage.tsx" />
              </div>
              <div className="flex items-center justify-between" data-magicpath-id="61" data-magicpath-path="SettingsPage.tsx">
                <div className="flex items-center gap-2" data-magicpath-id="62" data-magicpath-path="SettingsPage.tsx">
                  <p className="text-sm font-semibold text-slate-900" data-magicpath-id="63" data-magicpath-path="SettingsPage.tsx">Sound Effects</p>
                  {localSettings.appearance.soundEffects ? <Volume2 className="w-4 h-4 text-slate-500" data-magicpath-id="64" data-magicpath-path="SettingsPage.tsx" /> : <VolumeX className="w-4 h-4 text-slate-500" data-magicpath-id="65" data-magicpath-path="SettingsPage.tsx" />}
                </div>
                <Toggle enabled={localSettings.appearance.soundEffects} onChange={() => updateSetting('appearance', 'soundEffects', !localSettings.appearance.soundEffects)} data-magicpath-id="66" data-magicpath-path="SettingsPage.tsx" />
              </div>
            </div>
          </section>

          {/* Study Preferences Section */}
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden" data-magicpath-id="67" data-magicpath-path="SettingsPage.tsx">
            <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-green-50 to-emerald-50" data-magicpath-id="68" data-magicpath-path="SettingsPage.tsx">
              <div className="flex items-center gap-3" data-magicpath-id="69" data-magicpath-path="SettingsPage.tsx">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-sm" data-magicpath-id="70" data-magicpath-path="SettingsPage.tsx">
                  <SettingsIcon className="w-5 h-5 text-white" data-magicpath-id="71" data-magicpath-path="SettingsPage.tsx" />
                </div>
                <div data-magicpath-id="72" data-magicpath-path="SettingsPage.tsx">
                  <h2 className="text-lg font-bold text-slate-900" data-magicpath-id="73" data-magicpath-path="SettingsPage.tsx">Study Preferences</h2>
                  <p className="text-xs text-slate-600" data-magicpath-id="74" data-magicpath-path="SettingsPage.tsx">Configure your study settings</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4" data-magicpath-id="75" data-magicpath-path="SettingsPage.tsx">
              <div data-magicpath-id="76" data-magicpath-path="SettingsPage.tsx">
                <label className="block text-sm font-semibold text-slate-900 mb-2" data-magicpath-id="77" data-magicpath-path="SettingsPage.tsx">
                  Daily Study Goal (minutes)
                </label>
                <input type="number" value={localSettings.study.dailyGoal} onChange={e => updateSetting('study', 'dailyGoal', parseInt(e.target.value))} min="15" max="180" step="15" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-900 outline-none transition-all" data-magicpath-id="78" data-magicpath-path="SettingsPage.tsx" />
              </div>
              <div data-magicpath-id="79" data-magicpath-path="SettingsPage.tsx">
                <label className="block text-sm font-semibold text-slate-900 mb-2" data-magicpath-id="80" data-magicpath-path="SettingsPage.tsx">Reminder Time</label>
                <input type="time" value={localSettings.study.reminderTime} onChange={e => updateSetting('study', 'reminderTime', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-900 outline-none transition-all" data-magicpath-id="81" data-magicpath-path="SettingsPage.tsx" />
              </div>
              <div data-magicpath-id="82" data-magicpath-path="SettingsPage.tsx">
                <label className="block text-sm font-semibold text-slate-900 mb-2" data-magicpath-id="83" data-magicpath-path="SettingsPage.tsx">
                  Default Quiz Length (questions)
                </label>
                <select value={localSettings.study.defaultQuizLength} onChange={e => updateSetting('study', 'defaultQuizLength', parseInt(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-900 outline-none transition-all" data-magicpath-id="84" data-magicpath-path="SettingsPage.tsx">
                  <option value={5} data-magicpath-id="85" data-magicpath-path="SettingsPage.tsx">5 questions</option>
                  <option value={10} data-magicpath-id="86" data-magicpath-path="SettingsPage.tsx">10 questions</option>
                  <option value={15} data-magicpath-id="87" data-magicpath-path="SettingsPage.tsx">15 questions</option>
                  <option value={20} data-magicpath-id="88" data-magicpath-path="SettingsPage.tsx">20 questions</option>
                </select>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden" data-magicpath-id="89" data-magicpath-path="SettingsPage.tsx">
            <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-orange-50 to-amber-50" data-magicpath-id="90" data-magicpath-path="SettingsPage.tsx">
              <div className="flex items-center gap-3" data-magicpath-id="91" data-magicpath-path="SettingsPage.tsx">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center shadow-sm" data-magicpath-id="92" data-magicpath-path="SettingsPage.tsx">
                  <Shield className="w-5 h-5 text-white" data-magicpath-id="93" data-magicpath-path="SettingsPage.tsx" />
                </div>
                <div data-magicpath-id="94" data-magicpath-path="SettingsPage.tsx">
                  <h2 className="text-lg font-bold text-slate-900" data-magicpath-id="95" data-magicpath-path="SettingsPage.tsx">Privacy</h2>
                  <p className="text-xs text-slate-600" data-magicpath-id="96" data-magicpath-path="SettingsPage.tsx">Control your data and visibility</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4" data-magicpath-id="97" data-magicpath-path="SettingsPage.tsx">
              <div data-magicpath-id="98" data-magicpath-path="SettingsPage.tsx">
                <label className="block text-sm font-semibold text-slate-900 mb-2" data-magicpath-id="99" data-magicpath-path="SettingsPage.tsx">Profile Visibility</label>
                <div className="grid grid-cols-2 gap-2" data-magicpath-id="100" data-magicpath-path="SettingsPage.tsx">
                  <button onClick={() => updateSetting('privacy', 'profileVisibility', 'public')} className={`px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${localSettings.privacy.profileVisibility === 'public' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'}`} data-magicpath-id="101" data-magicpath-path="SettingsPage.tsx">
                    <Globe className="w-4 h-4 mx-auto mb-1" data-magicpath-id="102" data-magicpath-path="SettingsPage.tsx" />
                    Public
                  </button>
                  <button onClick={() => updateSetting('privacy', 'profileVisibility', 'private')} className={`px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${localSettings.privacy.profileVisibility === 'private' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'}`} data-magicpath-id="103" data-magicpath-path="SettingsPage.tsx">
                    <Shield className="w-4 h-4 mx-auto mb-1" data-magicpath-id="104" data-magicpath-path="SettingsPage.tsx" />
                    Private
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between" data-magicpath-id="105" data-magicpath-path="SettingsPage.tsx">
                <div data-magicpath-id="106" data-magicpath-path="SettingsPage.tsx">
                  <p className="text-sm font-semibold text-slate-900" data-magicpath-id="107" data-magicpath-path="SettingsPage.tsx">Show Progress</p>
                  <p className="text-xs text-slate-600" data-magicpath-id="108" data-magicpath-path="SettingsPage.tsx">Display your study stats publicly</p>
                </div>
                <Toggle enabled={localSettings.privacy.showProgress} onChange={() => updateSetting('privacy', 'showProgress', !localSettings.privacy.showProgress)} data-magicpath-id="109" data-magicpath-path="SettingsPage.tsx" />
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden" data-magicpath-id="110" data-magicpath-path="SettingsPage.tsx">
            <div className="p-4 space-y-2" data-magicpath-id="111" data-magicpath-path="SettingsPage.tsx">
              <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-xl transition-all group" data-magicpath-id="112" data-magicpath-path="SettingsPage.tsx">
                <div className="flex items-center gap-3" data-magicpath-id="113" data-magicpath-path="SettingsPage.tsx">
                  <HelpCircle className="w-5 h-5 text-slate-600" data-magicpath-id="114" data-magicpath-path="SettingsPage.tsx" />
                  <span className="text-sm font-semibold text-slate-900" data-magicpath-id="115" data-magicpath-path="SettingsPage.tsx">Help & Support</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" data-magicpath-id="116" data-magicpath-path="SettingsPage.tsx" />
              </button>
              <button onClick={onLogout} className="w-full flex items-center justify-between px-4 py-3 hover:bg-red-50 rounded-xl transition-all group" data-magicpath-id="117" data-magicpath-path="SettingsPage.tsx">
                <div className="flex items-center gap-3" data-magicpath-id="118" data-magicpath-path="SettingsPage.tsx">
                  <LogOut className="w-5 h-5 text-red-600" data-magicpath-id="119" data-magicpath-path="SettingsPage.tsx" />
                  <span className="text-sm font-semibold text-red-600" data-magicpath-id="120" data-magicpath-path="SettingsPage.tsx">Log Out</span>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" data-magicpath-id="121" data-magicpath-path="SettingsPage.tsx" />
              </button>
            </div>
          </section>
        </div>
      </div>

      <style data-magicpath-id="122" data-magicpath-path="SettingsPage.tsx">{`
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl { backdrop-filter: blur(20px); }
        }
      `}</style>
    </div>;
};