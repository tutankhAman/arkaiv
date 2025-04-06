import React from 'react';
import { Github, Database, BookOpen } from 'lucide-react';

const About = () => {
  const teamMembers = [
    { name: 'Koustubh Pande', role: 'Backend Developer' },
    { name: 'Aman Aziz', role: 'Frontend Developer' },
    { name: 'Mukul Singhal', role: 'Full Stack Developer' },
    { name: 'Harsh Paryani', role: 'Data Engineer' },
    { name: 'Smriti Bisht', role: 'UI/UX Designer' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header Section */}
      <div className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">About Arkaiv</h1>
          <p className="text-gray-400">Making AI Discovery Simple and Accessible</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              Arkaiv is dedicated to tracking, summarizing, and displaying the latest AI tools and models from various platforms. 
              We aim to make AI discovery and monitoring more accessible and efficient for everyone.
            </p>
          </div>

          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">What We Do</h2>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Real-time aggregation of AI tools and models
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Automated summarization of updates and releases
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Customizable digest subscriptions
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Trend analysis and visualization
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-200 mb-6 text-center">Our Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-800/50 rounded-lg p-6 text-center">
              <Github className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-200 mb-2">GitHub</h3>
              <p className="text-gray-400">Latest AI repositories and tools</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-6 text-center">
              <Database className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-200 mb-2">Hugging Face</h3>
              <p className="text-gray-400">State-of-the-art AI models</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-6 text-center">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-200 mb-2">ArXiv</h3>
              <p className="text-gray-400">Cutting-edge research papers</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-2xl font-semibold text-gray-200 mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-zinc-800/50 rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 