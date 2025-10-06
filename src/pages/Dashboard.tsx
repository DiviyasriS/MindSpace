import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, Users, MessageSquare } from 'lucide-react';
import { ForumPost, StressTrackingEntry } from '../types';
import { StressBadge } from '../components/StressBadge';

export const Dashboard = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [stressData, setStressData] = useState<StressTrackingEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('forum_posts');
    if (stored) {
      setPosts(JSON.parse(stored));
    }
  }, []);

  const stressLevelCounts = {
    low: posts.filter(p => p.stress_analysis?.stress_level === 'low').length,
    moderate: posts.filter(p => p.stress_analysis?.stress_level === 'moderate').length,
    high: posts.filter(p => p.stress_analysis?.stress_level === 'high').length,
    critical: posts.filter(p => p.stress_analysis?.stress_level === 'critical').length,
  };

  const totalPosts = posts.length;
  const averageStressLevel = totalPosts > 0
    ? (stressLevelCounts.low * 1 + stressLevelCounts.moderate * 2 + stressLevelCounts.high * 3 + stressLevelCounts.critical * 4) / totalPosts
    : 0;

  const recentHighStressPosts = posts
    .filter(p => p.stress_analysis && (p.stress_analysis.stress_level === 'high' || p.stress_analysis.stress_level === 'critical'))
    .slice(0, 5);

  const topIndicators = posts
    .flatMap(p => p.stress_analysis?.detected_indicators || [])
    .reduce((acc, indicator) => {
      acc[indicator] = (acc[indicator] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topIndicatorsList = Object.entries(topIndicators)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color }: any) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
      <p className="text-slate-600 text-sm">{title}</p>
      {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Community Dashboard</h1>
          <p className="text-slate-600">Real-time insights into community mental wellness</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Posts"
            value={totalPosts}
            subtitle="All community posts"
            icon={MessageSquare}
            color="bg-gradient-to-br from-blue-400 to-blue-600"
          />
          <StatCard
            title="Average Stress"
            value={averageStressLevel.toFixed(1)}
            subtitle="Out of 4.0"
            icon={Activity}
            trend={-5}
            color="bg-gradient-to-br from-teal-400 to-teal-600"
          />
          <StatCard
            title="High Stress Posts"
            value={stressLevelCounts.high + stressLevelCounts.critical}
            subtitle="Needs attention"
            icon={AlertTriangle}
            color="bg-gradient-to-br from-orange-400 to-orange-600"
          />
          <StatCard
            title="Active Users"
            value={new Set(posts.map(p => p.user_id)).size}
            subtitle="Community members"
            icon={Users}
            trend={12}
            color="bg-gradient-to-br from-green-400 to-green-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Stress Level Distribution</h2>
            <div className="space-y-4">
              {[
                { level: 'low', label: 'Low Stress', count: stressLevelCounts.low, color: 'bg-green-500' },
                { level: 'moderate', label: 'Moderate', count: stressLevelCounts.moderate, color: 'bg-amber-500' },
                { level: 'high', label: 'High Stress', count: stressLevelCounts.high, color: 'bg-orange-500' },
                { level: 'critical', label: 'Critical', count: stressLevelCounts.critical, color: 'bg-red-500' },
              ].map(({ level, label, count, color }) => {
                const percentage = totalPosts > 0 ? (count / totalPosts) * 100 : 0;
                return (
                  <div key={level}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                      <span className="text-sm text-slate-600">{count} posts ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Common Stress Indicators</h2>
            <div className="space-y-3">
              {topIndicatorsList.length > 0 ? (
                topIndicatorsList.map(([indicator, count], idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{indicator}</p>
                      <p className="text-xs text-slate-500">{count} occurrences</p>
                    </div>
                    <div className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
                      {count}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No data available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Recent High Stress Posts</h2>
          <div className="space-y-4">
            {recentHighStressPosts.length > 0 ? (
              recentHighStressPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-slate-800">{post.title}</h3>
                    <StressBadge level={post.stress_analysis!.stress_level} size="sm" />
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">{post.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.stress_analysis?.detected_indicators.slice(0, 3).map((indicator, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                      >
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No high stress posts to display</p>
                <p className="text-sm mt-1">This is a good sign!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
