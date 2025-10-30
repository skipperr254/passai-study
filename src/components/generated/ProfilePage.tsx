import React, { useState } from 'react';
import { User, Mail, Calendar, Award, TrendingUp, Edit2, Camera, Save, X, CheckCircle } from 'lucide-react';
export interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  avatar?: string;
  bio?: string;
  studyGoal?: string;
  stats: {
    totalQuizzes: number;
    averageScore: number;
    studyStreak: number;
    subjectsStudied: number;
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
  }[];
}
export interface ProfilePageProps {
  user?: UserProfile;
  onUpdateProfile?: (data: Partial<UserProfile>) => void;
  onBack?: () => void;
}
const defaultUser: UserProfile = {
  name: 'Jake Anderson',
  email: 'jake@example.com',
  joinDate: 'January 2024',
  bio: 'Passionate student preparing for final exams. Love learning new things every day!',
  studyGoal: 'Pass all subjects with A grades',
  stats: {
    totalQuizzes: 127,
    averageScore: 85,
    studyStreak: 12,
    subjectsStudied: 4
  },
  achievements: [{
    id: '1',
    title: 'First Quiz',
    description: 'Completed your first quiz',
    icon: '🎯',
    earned: true,
    earnedDate: 'Jan 15, 2024'
  }, {
    id: '2',
    title: 'Perfect Score',
    description: 'Scored 100% on a quiz',
    icon: '⭐',
    earned: true,
    earnedDate: 'Feb 3, 2024'
  }, {
    id: '3',
    title: 'Week Warrior',
    description: 'Study streak of 7 days',
    icon: '🔥',
    earned: true,
    earnedDate: 'Feb 20, 2024'
  }, {
    id: '4',
    title: 'Century Club',
    description: 'Complete 100 quizzes',
    icon: '💯',
    earned: true,
    earnedDate: 'Mar 5, 2024'
  }, {
    id: '5',
    title: 'Subject Master',
    description: 'Score 90%+ on all quizzes in a subject',
    icon: '👑',
    earned: false
  }, {
    id: '6',
    title: 'Marathon Runner',
    description: 'Study streak of 30 days',
    icon: '🏃',
    earned: false
  }]
};
export const ProfilePage = ({
  user = defaultUser,
  onUpdateProfile,
  onBack
}: ProfilePageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user.name,
    bio: user.bio || '',
    studyGoal: user.studyGoal || ''
  });
  const handleSave = () => {
    onUpdateProfile?.(editedData);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditedData({
      name: user.name,
      bio: user.bio || '',
      studyGoal: user.studyGoal || ''
    });
    setIsEditing(false);
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40" data-magicpath-id="0" data-magicpath-path="ProfilePage.tsx">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8" data-magicpath-id="1" data-magicpath-path="ProfilePage.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8" data-magicpath-id="2" data-magicpath-path="ProfilePage.tsx">
          <div data-magicpath-id="3" data-magicpath-path="ProfilePage.tsx">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900" data-magicpath-id="4" data-magicpath-path="ProfilePage.tsx">Profile</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1" data-magicpath-id="5" data-magicpath-path="ProfilePage.tsx">Manage your account and track your progress</p>
          </div>
          {onBack && <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all" data-magicpath-id="6" data-magicpath-path="ProfilePage.tsx">
              <X className="w-5 h-5" data-magicpath-id="7" data-magicpath-path="ProfilePage.tsx" />
              <span className="text-sm font-semibold hidden sm:inline" data-magicpath-id="8" data-magicpath-path="ProfilePage.tsx">Close</span>
            </button>}
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden mb-6" data-magicpath-id="9" data-magicpath-path="ProfilePage.tsx">
          {/* Cover Image */}
          <div className="h-24 sm:h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative" data-magicpath-id="10" data-magicpath-path="ProfilePage.tsx">
            <div className="absolute inset-0 bg-black/10" data-magicpath-id="11" data-magicpath-path="ProfilePage.tsx"></div>
          </div>

          {/* Profile Info */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8" data-magicpath-id="12" data-magicpath-path="ProfilePage.tsx">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-16 mb-6" data-magicpath-id="13" data-magicpath-path="ProfilePage.tsx">
              {/* Avatar */}
              <div className="relative" data-magicpath-id="14" data-magicpath-path="ProfilePage.tsx">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-white shadow-xl flex items-center justify-center" data-magicpath-id="15" data-magicpath-path="ProfilePage.tsx">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" data-magicpath-id="16" data-magicpath-path="ProfilePage.tsx" />
                </div>
                <button className="absolute bottom-1 right-1 w-8 h-8 sm:w-10 sm:h-10 bg-white hover:bg-slate-50 rounded-xl shadow-lg border-2 border-slate-200 flex items-center justify-center transition-all active:scale-95" data-magicpath-id="17" data-magicpath-path="ProfilePage.tsx">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                </button>
              </div>

              {/* Edit Button */}
              {!isEditing ? <button onClick={() => setIsEditing(true)} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all active:scale-95" data-magicpath-id="18" data-magicpath-path="ProfilePage.tsx">
                  <Edit2 className="w-4 h-4" data-magicpath-id="19" data-magicpath-path="ProfilePage.tsx" />
                  <span data-magicpath-id="20" data-magicpath-path="ProfilePage.tsx">Edit Profile</span>
                </button> : <div className="flex gap-2" data-magicpath-id="21" data-magicpath-path="ProfilePage.tsx">
                  <button onClick={handleCancel} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all active:scale-95" data-magicpath-id="22" data-magicpath-path="ProfilePage.tsx">
                    <X className="w-4 h-4" data-magicpath-id="23" data-magicpath-path="ProfilePage.tsx" />
                    <span data-magicpath-id="24" data-magicpath-path="ProfilePage.tsx">Cancel</span>
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-green-500/25 transition-all active:scale-95" data-magicpath-id="25" data-magicpath-path="ProfilePage.tsx">
                    <Save className="w-4 h-4" data-magicpath-id="26" data-magicpath-path="ProfilePage.tsx" />
                    <span data-magicpath-id="27" data-magicpath-path="ProfilePage.tsx">Save</span>
                  </button>
                </div>}
            </div>

            {/* Name & Info */}
            <div className="space-y-4" data-magicpath-id="28" data-magicpath-path="ProfilePage.tsx">
              {!isEditing ? <>
                  <div data-magicpath-id="29" data-magicpath-path="ProfilePage.tsx">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1" data-magicpath-id="30" data-magicpath-path="ProfilePage.tsx">{user.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600" data-magicpath-id="31" data-magicpath-path="ProfilePage.tsx">
                      <div className="flex items-center gap-1.5" data-magicpath-id="32" data-magicpath-path="ProfilePage.tsx">
                        <Mail className="w-4 h-4" data-magicpath-id="33" data-magicpath-path="ProfilePage.tsx" />
                        <span data-magicpath-id="34" data-magicpath-path="ProfilePage.tsx">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5" data-magicpath-id="35" data-magicpath-path="ProfilePage.tsx">
                        <Calendar className="w-4 h-4" data-magicpath-id="36" data-magicpath-path="ProfilePage.tsx" />
                        <span data-magicpath-id="37" data-magicpath-path="ProfilePage.tsx">Joined {user.joinDate}</span>
                      </div>
                    </div>
                  </div>
                  {user.bio && <p className="text-sm sm:text-base text-slate-700 leading-relaxed" data-magicpath-id="38" data-magicpath-path="ProfilePage.tsx">{user.bio}</p>}
                  {user.studyGoal && <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl" data-magicpath-id="39" data-magicpath-path="ProfilePage.tsx">
                      <Award className="w-4 h-4 text-blue-600" data-magicpath-id="40" data-magicpath-path="ProfilePage.tsx" />
                      <span className="text-sm font-medium text-blue-700" data-magicpath-id="41" data-magicpath-path="ProfilePage.tsx">Goal: {user.studyGoal}</span>
                    </div>}
                </> : <div className="space-y-4" data-magicpath-id="42" data-magicpath-path="ProfilePage.tsx">
                  <div data-magicpath-id="43" data-magicpath-path="ProfilePage.tsx">
                    <label className="block text-sm font-semibold text-slate-700 mb-2" data-magicpath-id="44" data-magicpath-path="ProfilePage.tsx">Name</label>
                    <input type="text" value={editedData.name} onChange={e => setEditedData({
                  ...editedData,
                  name: e.target.value
                })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-900 outline-none transition-all" data-magicpath-id="45" data-magicpath-path="ProfilePage.tsx" />
                  </div>
                  <div data-magicpath-id="46" data-magicpath-path="ProfilePage.tsx">
                    <label className="block text-sm font-semibold text-slate-700 mb-2" data-magicpath-id="47" data-magicpath-path="ProfilePage.tsx">Bio</label>
                    <textarea value={editedData.bio} onChange={e => setEditedData({
                  ...editedData,
                  bio: e.target.value
                })} rows={3} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-900 outline-none transition-all resize-none" placeholder="Tell us about yourself..." data-magicpath-id="48" data-magicpath-path="ProfilePage.tsx" />
                  </div>
                  <div data-magicpath-id="49" data-magicpath-path="ProfilePage.tsx">
                    <label className="block text-sm font-semibold text-slate-700 mb-2" data-magicpath-id="50" data-magicpath-path="ProfilePage.tsx">Study Goal</label>
                    <input type="text" value={editedData.studyGoal} onChange={e => setEditedData({
                  ...editedData,
                  studyGoal: e.target.value
                })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-900 outline-none transition-all" placeholder="What's your study goal?" data-magicpath-id="51" data-magicpath-path="ProfilePage.tsx" />
                  </div>
                </div>}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6" data-magicpath-id="52" data-magicpath-path="ProfilePage.tsx">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/60 shadow-sm" data-magicpath-id="53" data-magicpath-path="ProfilePage.tsx">
            <div className="flex items-center gap-3 mb-2" data-magicpath-id="54" data-magicpath-path="ProfilePage.tsx">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm" data-magicpath-id="55" data-magicpath-path="ProfilePage.tsx">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" data-magicpath-id="56" data-magicpath-path="ProfilePage.tsx" />
              </div>
              <div data-magicpath-id="57" data-magicpath-path="ProfilePage.tsx">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900" data-magicpath-id="58" data-magicpath-path="ProfilePage.tsx">{user.stats.totalQuizzes}</p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium" data-magicpath-id="59" data-magicpath-path="ProfilePage.tsx">Total Quizzes</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/60 shadow-sm" data-magicpath-id="60" data-magicpath-path="ProfilePage.tsx">
            <div className="flex items-center gap-3 mb-2" data-magicpath-id="61" data-magicpath-path="ProfilePage.tsx">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm" data-magicpath-id="62" data-magicpath-path="ProfilePage.tsx">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" data-magicpath-id="63" data-magicpath-path="ProfilePage.tsx" />
              </div>
              <div data-magicpath-id="64" data-magicpath-path="ProfilePage.tsx">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900" data-magicpath-id="65" data-magicpath-path="ProfilePage.tsx">{user.stats.averageScore}%</p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium" data-magicpath-id="66" data-magicpath-path="ProfilePage.tsx">Avg Score</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/60 shadow-sm" data-magicpath-id="67" data-magicpath-path="ProfilePage.tsx">
            <div className="flex items-center gap-3 mb-2" data-magicpath-id="68" data-magicpath-path="ProfilePage.tsx">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm" data-magicpath-id="69" data-magicpath-path="ProfilePage.tsx">
                <span className="text-xl sm:text-2xl" data-magicpath-id="70" data-magicpath-path="ProfilePage.tsx">🔥</span>
              </div>
              <div data-magicpath-id="71" data-magicpath-path="ProfilePage.tsx">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900" data-magicpath-id="72" data-magicpath-path="ProfilePage.tsx">{user.stats.studyStreak}</p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium" data-magicpath-id="73" data-magicpath-path="ProfilePage.tsx">Day Streak</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/60 shadow-sm" data-magicpath-id="74" data-magicpath-path="ProfilePage.tsx">
            <div className="flex items-center gap-3 mb-2" data-magicpath-id="75" data-magicpath-path="ProfilePage.tsx">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm" data-magicpath-id="76" data-magicpath-path="ProfilePage.tsx">
                <span className="text-xl sm:text-2xl" data-magicpath-id="77" data-magicpath-path="ProfilePage.tsx">📚</span>
              </div>
              <div data-magicpath-id="78" data-magicpath-path="ProfilePage.tsx">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900" data-magicpath-id="79" data-magicpath-path="ProfilePage.tsx">{user.stats.subjectsStudied}</p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium" data-magicpath-id="80" data-magicpath-path="ProfilePage.tsx">Subjects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8" data-magicpath-id="81" data-magicpath-path="ProfilePage.tsx">
          <div className="flex items-center justify-between mb-6" data-magicpath-id="82" data-magicpath-path="ProfilePage.tsx">
            <div data-magicpath-id="83" data-magicpath-path="ProfilePage.tsx">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900" data-magicpath-id="84" data-magicpath-path="ProfilePage.tsx">Achievements</h3>
              <p className="text-sm text-slate-600 mt-1" data-magicpath-id="85" data-magicpath-path="ProfilePage.tsx">
                {user.achievements.filter(a => a.earned).length} of {user.achievements.length} unlocked
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" data-magicpath-id="86" data-magicpath-path="ProfilePage.tsx">
            {user.achievements.map(achievement => <div key={achievement.id} className={`relative rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 transition-all ${achievement.earned ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`} data-magicpath-id="87" data-magicpath-path="ProfilePage.tsx">
                {achievement.earned && <div className="absolute top-3 right-3" data-magicpath-id="88" data-magicpath-path="ProfilePage.tsx">
                    <CheckCircle className="w-5 h-5 text-green-600" data-magicpath-id="89" data-magicpath-path="ProfilePage.tsx" />
                  </div>}
                <div className="flex items-start gap-3" data-magicpath-id="90" data-magicpath-path="ProfilePage.tsx">
                  <div className="text-3xl sm:text-4xl flex-shrink-0" data-magicpath-id="91" data-magicpath-path="ProfilePage.tsx">{achievement.icon}</div>
                  <div className="flex-1 min-w-0" data-magicpath-id="92" data-magicpath-path="ProfilePage.tsx">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1 truncate" data-magicpath-id="93" data-magicpath-path="ProfilePage.tsx">
                      {achievement.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mb-2" data-magicpath-id="94" data-magicpath-path="ProfilePage.tsx">{achievement.description}</p>
                    {achievement.earned && achievement.earnedDate && <p className="text-xs text-blue-600 font-medium" data-magicpath-id="95" data-magicpath-path="ProfilePage.tsx">Earned {achievement.earnedDate}</p>}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>

      <style data-magicpath-id="96" data-magicpath-path="ProfilePage.tsx">{`
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl { backdrop-filter: blur(20px); }
          .backdrop-blur-sm { backdrop-filter: blur(10px); }
        }
      `}</style>
    </div>;
};