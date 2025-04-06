import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-100 mb-6">About Arkaiv</h1>
          <div className="prose max-w-none">
            <div className="bg-[#1A1A1A] shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-200 mb-4">Our Mission</h2>
              <p className="text-gray-400 mb-4">
                Arkaiv is dedicated to tracking, summarizing, and displaying the latest AI tools and models from various platforms. 
                We aim to make AI discovery and monitoring more accessible and efficient for everyone.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-200 mb-4 mt-8">What We Do</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Real-time aggregation of AI tools and models</li>
                <li>Automated summarization of updates and releases</li>
                <li>Customizable digest subscriptions</li>
                <li>Trend analysis and visualization</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-200 mb-4 mt-8">Our Sources</h2>
              <p className="text-gray-400">
                We gather information from trusted sources including GitHub, Hugging Face, and ArXiv to provide you with 
                comprehensive coverage of the AI landscape.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 