import React, { useEffect, useState } from 'react';
import { Hero } from '../components/ui/hero';
import { AIToolCard } from '../components/ui/ai-tool-card';
import { TextShimmer } from '../components/ui/text-shimmer';
import { Loader2 } from 'lucide-react';
import SubscriptionModal from '../components/ui/subscription-modal';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [trendingTools, setTrendingTools] = useState({
    github: [],
    huggingface: [],
    arxiv: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUserEmail(userData.email);

    const fetchTrendingTools = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3001/api/tools');
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        const data = await response.json();
        setTrendingTools(data);
      } catch (error) {
        console.error('Error fetching trending tools:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const checkSubscription = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/subscription/status?email=${userData.email}`);
        if (response.ok) {
          const data = await response.json();
          setIsSubscribed(data.isSubscribed);
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    };

    fetchTrendingTools();
    checkSubscription();
  }, [navigate]);

  const handleSubscribe = async () => {
    try {
      setSubscriptionLoading(true);
      const response = await fetch('http://localhost:3001/api/subscription/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSubscribed(true);
        alert('Successfully subscribed! Check your email for confirmation.');
      } else {
        alert(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('An error occurred while subscribing. Please try again.');
    } finally {
      setSubscriptionLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // TODO: Implement search functionality
  };

  const renderToolsColumn = (tools, source, icon) => (
    <div>
      <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
        {icon}
        {source}
      </h3>
      <div className="space-y-4">
        {tools.map((tool) => (
          <AIToolCard
            key={tool._id}
            name={tool.name}
            description={source !== "arXiv" ? tool.description : undefined}
            url={tool.url}
            source={source}
            type={tool.type}
            metrics={{
              stars: tool.metrics?.stars || 0,
              downloads: tool.metrics?.downloads || 0,
              citations: tool.metrics?.citations || 0
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <Hero
        title="Welcome to arkaiv!"
        titleClassName="text-5xl md:text-6xl font-extrabold"
        onSearch={handleSearch}
      />
      
      <div className="container mx-auto px-4 py-4 flex justify-center">
        <Button
          onClick={() => isSubscribed ? null : setIsModalOpen(true)}
          className={`${
            isSubscribed
              ? 'bg-green-600 hover:bg-green-700 cursor-default'
              : 'bg-primary hover:bg-primary/90'
          } text-white`}
          disabled={subscriptionLoading}
        >
          {subscriptionLoading ? 'Subscribing...' : isSubscribed ? 'Already Subscribed' : 'Subscribe to AI Digest'}
        </Button>
      </div>
      
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubscribe}
      />
      
      <section className="container mx-auto px-4 py-12">
        <TextShimmer
          as="h2"
          className="text-3xl font-bold text-center mb-12"
        >
          Today's trending AI's:
        </TextShimmer>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p>Error loading trending tools: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {renderToolsColumn(
              trendingTools.github,
              'GitHub',
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            )}
            
            {renderToolsColumn(
              trendingTools.huggingface,
              'HuggingFace',
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            )}
            
            {renderToolsColumn(
              trendingTools.arxiv,
              'arXiv',
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard; 