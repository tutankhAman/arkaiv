import React, { useState, useEffect } from 'react';
import { AIToolCard } from '../components/ui/ai-tool-card';
import { HuggingFaceCard } from '../components/ui/huggingface-card';
import { Loader2, Search, Download, Github, BookOpen, Database } from 'lucide-react';

const Discover = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-800">
            Error: {error}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ... sidebar section ... */}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* ... search and filter bar ... */}

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