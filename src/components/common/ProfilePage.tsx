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
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Profile</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">Manage your account and track your progress</p>
          </div>
          {onBack && <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all">
              <X className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:inline">Close</span>
            </button>}
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-24 sm:h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Info */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-16 mb-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-white shadow-xl flex items-center justify-center">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
                </div>
                <button className="absolute bottom-1 right-1 w-8 h-8 sm:w-10 sm:h-10 bg-white hover:bg-slate-50 rounded-xl shadow-lg border-2 border-slate-200 flex items-center justify-center transition-all active:scale-95">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                </button>
              </div>

              {/* Edit Button */}
              {!isEditing ? <button onClick={() => setIsEditing(true)} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all active:scale-95">
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button> : <div className="flex gap-2">
                  <button onClick={handleCancel} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all active:scale-95">
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-green-500/25 transition-all active:scale-95">
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>}
            </div>

            {/* Name & Info */}
            <div className="space-y-4">
              {!isEditing ? <>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{user.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {user.joinDate}</span>
                      </div>
                    </div>
                  </div>
                  {user.bio && <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{user.bio}</p>}
                  {user.studyGoal && <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Goal: {user.studyGoal}</span>
                    </div>}
                </> : <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                    <input type="text" value={editedData.name} onChange={e => setEditedData({
                  ...editedData,
                  name: e.target.value
                })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-900 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                    <textarea value={editedData.bio} onChange={e => setEditedData({
                  ...editedData,
                  bio: e.target.value
                })} rows={3} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-900 outline-none transition-all resize-none" placeholder="Tell us about yourself..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Study Goal</label>
                    <input type="text" value={editedData.studyGoal} onChange={e => setEditedData({
                  ...editedData,
                  studyGoal: e.target.value
                })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-slate-900 outline-none transition-all" placeholder="What's your study goal?" />
                  </div>
                </div>}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{user.stats.totalQuizzes}</p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Total Quizzes</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{user.stats.averageScore}%</p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Avg Score</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                <span className="text-xl sm:text-2xl">🔥</span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{user.stats.studyStreak}</p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Day Streak</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                <span className="text-xl sm:text-2xl">📚</span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{user.stats.subjectsStudied}</p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Subjects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Achievements</h3>
              <p className="text-sm text-slate-600 mt-1">
                {user.achievements.filter(a => a.earned).length} of {user.achievements.length} unlocked
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {user.achievements.map(achievement => <div key={achievement.id} className={`relative rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 transition-all ${achievement.earned ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                {achievement.earned && <div className="absolute top-3 right-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>}
                <div className="flex items-start gap-3">
                  <div className="text-3xl sm:text-4xl flex-shrink-0">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1 truncate">
                      {achievement.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mb-2">{achievement.description}</p>
                    {achievement.earned && achievement.earnedDate && <p className="text-xs text-blue-600 font-medium">Earned {achievement.earnedDate}</p>}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>

      <style>{`
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl { backdrop-filter: blur(20px); }
          .backdrop-blur-sm { backdrop-filter: blur(10px); }
        }
      `}</style>
    </div>;
};