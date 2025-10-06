import { useState, useEffect } from 'react';
import { User, Mail, Building2, BookOpen, Calendar, TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ForumPost } from '../types';
import { StressBadge } from '../components/StressBadge';

export const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  useEffect(() => {
    const stored = localStorage.getItem('forum_posts');
    if (stored) {
      const allPosts = JSON.parse(stored);
      setPosts(allPosts.filter((p: ForumPost) => p.user_id === user?.id));
    }
  }, [user]);

  const userStressData = posts
    .filter(p => p.stress_analysis)
    .map(p => ({
      date: new Date(p.created_at),
      level: p.stress_analysis!.stress_level,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const stressLevelMap = { low: 1, moderate: 2, high: 3, critical: 4 };
  const averageStress = userStressData.length > 0
    ? userStressData.reduce((sum, d) => sum + stressLevelMap[d.level], 0) / userStressData.length
    : 0;

  const recentTrend = userStressData.length >= 2
    ? stressLevelMap[userStressData[userStressData.length - 1].level] -
      stressLevelMap[userStressData[0].level]
    : 0;

  const last7Days = userStressData.slice(-7);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-teal-400 via-blue-500 to-green-400"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 mb-6">
              <img
                src={user?.avatar_url}
                alt={user?.full_name}
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg"
              />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">{user?.full_name}</h1>
                <div className="flex flex-col md:flex-row gap-4 text-slate-600">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  {user?.institution && (
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">{user.institution}</span>
                    </div>
                  )}
                  {user?.field_of_study && (
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">{user.field_of_study}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {user?.bio && (
              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <p className="text-slate-700">{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Posts</p>
                <p className="text-2xl font-bold text-slate-800">{posts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Avg. Stress Level</p>
                <p className="text-2xl font-bold text-slate-800">{averageStress.toFixed(1)}/4</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl ${recentTrend <= 0 ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-orange-400 to-orange-600'} flex items-center justify-center`}>
                {recentTrend <= 0 ? (
                  <TrendingDown className="w-6 h-6 text-white" />
                ) : (
                  <TrendingUp className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <p className="text-sm text-slate-600">Recent Trend</p>
                <p className="text-2xl font-bold text-slate-800">
                  {recentTrend <= 0 ? 'Improving' : 'Increasing'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Stress Level Over Time</h2>
          {last7Days.length > 0 ? (
            <div className="space-y-4">
              {last7Days.map((data, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-slate-600">
                    {data.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3 ${
                          data.level === 'low' ? 'bg-green-500' :
                          data.level === 'moderate' ? 'bg-amber-500' :
                          data.level === 'high' ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(stressLevelMap[data.level] / 4) * 100}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          {data.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No stress tracking data yet</p>
              <p className="text-sm mt-1">Post to the forum to start tracking</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Your Recent Posts</h2>
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-slate-800">{post.title}</h3>
                    {post.stress_analysis && (
                      <StressBadge level={post.stress_analysis.stress_level} size="sm" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">{post.content}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="px-2 py-1 bg-slate-100 rounded-full">{post.category}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>You haven't posted yet</p>
                <p className="text-sm mt-1">Share your thoughts in the forum</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
