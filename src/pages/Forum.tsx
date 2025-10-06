import { useState, useEffect } from 'react';
import { Plus, Send, Filter, User, Clock } from 'lucide-react';
import { ForumPost } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { analyzeStress } from '../utils/stressDetection';
import { StressBadge } from '../components/StressBadge';

export const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'academic' | 'social' | 'personal' | 'general'>('general');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    const stored = localStorage.getItem('forum_posts');
    if (stored) {
      setPosts(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const analysis = analyzeStress(title + ' ' + content);

    const newPost: ForumPost = {
      id: Date.now().toString(),
      user_id: user!.id,
      user_name: isAnonymous ? 'Anonymous' : user!.full_name,
      avatar_url: isAnonymous ? undefined : user!.avatar_url,
      title,
      content,
      category,
      is_anonymous: isAnonymous,
      created_at: new Date().toISOString(),
      stress_analysis: { ...analysis, post_id: Date.now().toString() },
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('forum_posts', JSON.stringify(updatedPosts));

    setTitle('');
    setContent('');
    setCategory('general');
    setIsAnonymous(false);
    setShowNewPost(false);
  };

  const filteredPosts = filterCategory === 'all'
    ? posts
    : posts.filter(p => p.category === filterCategory);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Community Forum</h1>
            <p className="text-slate-600">Share your thoughts in a safe, supportive space</p>
          </div>
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            New Post
          </button>
        </div>

        {showNewPost && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Create a New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                  placeholder="What's on your mind?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition-all outline-none resize-none"
                  placeholder="Share your thoughts, feelings, or experiences..."
                  required
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                  >
                    <option value="general">General</option>
                    <option value="academic">Academic Stress</option>
                    <option value="social">Social & Relationships</option>
                    <option value="personal">Personal Growth</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-teal-500 focus:ring-teal-200"
                    />
                    <span className="text-sm font-medium text-slate-700">Post Anonymously</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                  Publish Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'general', 'academic', 'social', 'personal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">💭</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No posts yet</h3>
              <p className="text-slate-500">Be the first to share your thoughts!</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                    {post.avatar_url ? (
                      <img src={post.avatar_url} alt={post.user_name} className="w-full h-full rounded-full" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{post.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <span className="font-medium">{post.user_name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(post.created_at)}
                          </span>
                          <span>•</span>
                          <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      {post.stress_analysis && (
                        <StressBadge level={post.stress_analysis.stress_level} />
                      )}
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {post.stress_analysis && post.stress_analysis.detected_indicators.length > 0 && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm font-medium text-blue-900 mb-2">AI Analysis Insights:</p>
                        <div className="flex flex-wrap gap-2">
                          {post.stress_analysis.detected_indicators.map((indicator, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white text-blue-700 text-xs rounded-full border border-blue-200"
                            >
                              {indicator}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
