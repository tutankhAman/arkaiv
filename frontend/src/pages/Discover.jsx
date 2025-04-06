import React, { useState, useEffect } from 'react';
import { AIToolCard } from '../components/ui/ai-tool-card';
import { HuggingFaceCard } from '../components/ui/huggingface-card';
import { Loader2, Search, Download, Github, BookOpen, Database } from 'lucide-react';

const Discover = () => {
  const [selectedSource, setSelectedSource] = useState('github');
  const [tools, setTools] = useState({
    github: [],
    huggingface: [],
    arxiv: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minDownloads: ''
  });

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/tools/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch tools');
        const data = await response.json();
        setTools(data);
      } catch (error) {
        console.error('Error fetching tools:', error);
        setError(error.message);
        setTools({
          github: [],
          huggingface: [],
          arxiv: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFilteredTools = (sourceTools) => {
    if (!Array.isArray(sourceTools)) return [];
    
    return sourceTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilters = (
        (!filters.minDownloads || tool.metrics?.downloads >= parseInt(filters.minDownloads))
      );

      return matchesSearch && matchesFilters;
    });
  };

  const currentTools = getFilteredTools(tools[selectedSource]);

  const sourceIcons = {
    github: <Github className="w-5 h-5" />,
    huggingface: <Database className="w-5 h-5" />,
    arxiv: <BookOpen className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header Section */}
      <div className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Discover AI Tools</h1>
          <p className="text-gray-400">Explore and find the perfect AI tools for your needs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-800">
            Error: {error}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Source Selection */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Sources</h2>
              <div className="space-y-2">
                {['github', 'huggingface', 'arxiv'].map((source) => (
                  <button
                    key={source}
                    onClick={() => setSelectedSource(source)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      selectedSource === source
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-gray-300 hover:bg-zinc-800/50 border border-zinc-800'
                    }`}
                  >
                    {sourceIcons[source]}
                    <span>{source.charAt(0).toUpperCase() + source.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tools by name or description..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 text-gray-200 rounded-xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30"
                />
              </div>
              <div className="sm:w-64">
                <div className="relative">
                  <Download className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="minDownloads"
                    value={filters.minDownloads}
                    onChange={handleFilterChange}
                    placeholder="Min Downloads"
                    className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 text-gray-200 rounded-xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30"
                  />
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : currentTools.length === 0 ? (
              <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div className="text-gray-400 text-lg">
                  {searchQuery || filters.minDownloads
                    ? 'No tools match your search criteria'
                    : 'No tools found for this source'}
                </div>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentTools.map((tool) => {
                  if (selectedSource === 'huggingface') {
                    return (
                      <HuggingFaceCard
                        key={tool._id}
                        name={tool.name}
                        description={tool.description}
                        url={tool.url}
                        type={tool.type}
                        metrics={{
                          likes: tool.metrics?.stars || 0,
                          downloads: tool.metrics?.downloads || 0
                        }}
                      />
                    );
                  }
                  return (
                    <AIToolCard
                      key={tool._id}
                      name={tool.name}
                      description={tool.description}
                      url={tool.url}
                      source={tool.source}
                      type={tool.type}
                      metrics={{
                        stars: tool.metrics?.stars || 0,
                        downloads: tool.metrics?.downloads || 0,
                        citations: tool.metrics?.citations || 0
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Results Count */}
            {!isLoading && currentTools.length > 0 && (
              <div className="mt-6 text-sm text-gray-400">
                Showing {currentTools.length} {currentTools.length === 1 ? 'tool' : 'tools'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;