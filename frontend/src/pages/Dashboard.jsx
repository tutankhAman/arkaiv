import React from 'react';
import { Hero } from '../components/ui/hero';

const Dashboard = () => {
  return (
    <Hero
      title="Welcome to arkaiv!"
      subtitle="Your personal knowledge management system. Organize, discover, and grow your knowledge."
      actions={[
        {
          label: "Get Started",
          href: "#",
          variant: "default"
        },
        {
          label: "Learn More",
          href: "#",
          variant: "outline"
        }
      ]}
      titleClassName="text-5xl md:text-6xl font-extrabold"
      subtitleClassName="text-lg md:text-xl max-w-[600px]"
      actionsClassName="mt-8"
    />
  );
};

export default Dashboard; 