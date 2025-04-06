import React, { useState, useEffect } from 'react';
import { Loader2, Calendar, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Digest = () => {
  const [digests, setDigests] = useState([]);
  const [selectedDigest, setSelectedDigest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDigests = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/digests`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch digests');
        const data = await response.json();
        setDigests(data);
        // Set the most recent digest as selected
        if (data.length > 0) {
          setSelectedDigest(data[0]);
        }
      } catch (error) {
        console.error('Error fetching digests:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDigests();
  }, []);

  // Group digests by month and year
  const groupedDigests = digests.reduce((groups, digest) => {
    const date = new Date(digest.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(digest);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header Section */}
      <div className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Daily AI Digest</h1>
          <p className="text-gray-400">Stay updated with the latest trends in AI tools and research</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-800">
            Error: {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content - Selected Digest */}
            <div className="flex-1">
              {selectedDigest ? (
                <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
                  <div className="prose prose-invert max-w-none">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">
                      {new Date(selectedDigest.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h2>
                    
                    {/* Overview Section */}
                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400">Total Tools</div>
                        <div className="text-2xl font-bold text-gray-200">{selectedDigest.totalTools}</div>
                      </div>
                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400">New Tools</div>
                        <div className="text-2xl font-bold text-gray-200">{selectedDigest.newTools}</div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">Summary</h3>
                      <p className="text-gray-400">{selectedDigest.summary}</p>
                    </div>

                    {/* Top Tools Sections */}
                    <div className="space-y-6">
                      {['github', 'huggingface', 'arxiv'].map((source) => (
                        <div key={source}>
                          <h3 className="text-lg font-semibold text-gray-200 mb-3">
                            Top {source.charAt(0).toUpperCase() + source.slice(1)} Tools
                          </h3>
                          <div className="space-y-3">
                            {selectedDigest.topEntries[source].map((tool, index) => (
                              <div key={index} className="bg-zinc-800/50 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-base font-medium text-gray-200">{tool.name}</h4>
                                  <a
                                    href={tool.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:text-primary/80"
                                  >
                                    View Tool
                                  </a>
                                </div>
                                <p className="text-sm text-gray-400 mb-2">{tool.description}</p>
                                <div className="text-xs text-gray-500">
                                  {source === 'github' && `${tool.metrics.stars.toLocaleString()} stars`}
                                  {source === 'huggingface' && `${tool.metrics.downloads.toLocaleString()} downloads`}
                                  {source === 'arxiv' && `${tool.metrics.citations.toLocaleString()} citations`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <div className="text-gray-400 text-lg">No digest selected</div>
                  <p className="text-gray-500 mt-2">Select a digest from the right to view its contents</p>
                </div>
              )}
            </div>

            {/* Right Sidebar - Digest List */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
                <h2 className="text-lg font-semibold text-gray-200 mb-4">Past Digests</h2>
                <div className="space-y-4">
                  {Object.entries(groupedDigests)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([yearMonth, monthDigests]) => {
                      const [year, month] = yearMonth.split('-');
                      const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
                      
                      return (
                        <div key={yearMonth} className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                            <Calendar className="w-4 h-4" />
                            {monthName} {year}
                          </div>
                          <div className="space-y-1 pl-6">
                            {monthDigests
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .map((digest) => (
                                <motion.button
                                  key={digest._id}
                                  onClick={() => setSelectedDigest(digest)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                    selectedDigest?._id === digest._id
                                      ? 'bg-primary/20 text-primary'
                                      : 'text-gray-400 hover:bg-zinc-800/50'
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  {new Date(digest.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </motion.button>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Digest;