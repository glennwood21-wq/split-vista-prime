
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-theSplit-teal to-theSplit-aqua rounded-xl opacity-0 group-hover:opacity-40 blur-sm transition-opacity duration-300"></div>
      <div className="glass-card rounded-xl p-6 relative transition-all duration-300 group-hover:translate-y-[-4px]">
        <div className="p-3 bg-theSplit-teal/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-theSplit-aqua" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-theSplit-white">{title}</h3>
        <p className="text-theSplit-light/80">{description}</p>
      </div>
    </div>
  );
}

export default FeatureCard;
