import { useState } from 'react';
import { Search, BookOpen, Video, Activity, Phone, X } from 'lucide-react';
import { Resource } from '../types';
import { mockResources } from '../data/mockData';

export const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'mindfulness', label: 'Mindfulness' },
    { id: 'coping_strategies', label: 'Coping Strategies' },
    { id: 'academic_stress', label: 'Academic Stress' },
    { id: 'professional_support', label: 'Professional Support' },
    { id: 'crisis_hotlines', label: 'Crisis Hotlines' },
    { id: 'social_support', label: 'Social Support' },
    { id: 'self_care', label: 'Self-Care' },
  ];

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return Video;
      case 'exercise': return Activity;
      case 'hotline': return Phone;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'video': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'exercise': return 'bg-green-100 text-green-700 border-green-300';
      case 'hotline': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Resource Library</h1>
          <p className="text-slate-600">Evidence-based tools and information for your mental wellness journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, topics, or tags..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div
                key={resource.id}
                onClick={() => setSelectedResource(resource)}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${getTypeColor(resource.type).replace('text-', 'bg-').replace('100', '200')} flex items-center justify-center`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2">{resource.title}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{resource.description}</p>

                <div className="flex flex-wrap gap-2">
                  {resource.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                      +{resource.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No resources found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${getTypeColor(selectedResource.type).replace('text-', 'bg-').replace('100', '200')} flex items-center justify-center`}>
                  {(() => {
                    const Icon = getTypeIcon(selectedResource.type);
                    return <Icon className="w-5 h-5" />;
                  })()}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(selectedResource.type)}`}>
                  {selectedResource.type}
                </span>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">{selectedResource.title}</h2>
              <p className="text-slate-600 mb-6">{selectedResource.description}</p>

              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 mb-6">
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedResource.content}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedResource.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
