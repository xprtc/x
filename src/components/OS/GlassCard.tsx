import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
