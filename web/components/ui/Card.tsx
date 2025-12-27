import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
