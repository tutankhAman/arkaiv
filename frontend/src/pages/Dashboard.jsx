import React from 'react';
import { Hero } from '../components/ui/hero';

const Dashboard = () => {
  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // TODO: Implement search functionality
    // This will be implemented when we add the search results page
  };

  return (
    <Hero
      title="Welcome to arkaiv!"
      titleClassName="text-5xl md:text-6xl font-extrabold"
      onSearch={handleSearch}
    />
  );
};

export default Dashboard; 