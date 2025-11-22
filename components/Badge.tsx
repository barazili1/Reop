import React from 'react';
import { KeyType } from '../types';

interface BadgeProps {
  type?: KeyType;
  active?: boolean;
  text?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, active, text }) => {
  if (type) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border shadow-sm ${
        type === KeyType.PERMANENT 
          ? 'bg-indigo-950/50 text-indigo-400 border-indigo-900/50' 
          : 'bg-amber-950/50 text-amber-400 border-amber-900/50 border-dashed'
      }`}>
        {type === KeyType.PERMANENT ? 'Permanent' : 'Temporary'}
      </span>
    );
  }

  if (active !== undefined) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border shadow-[0_0_10px_rgba(0,0,0,0.2)] ${
        active 
          ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
          : 'bg-red-950/30 text-red-400 border-red-900/50'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
        {active ? 'Active' : 'Blocked'}
      </span>
    );
  }

  return (
     <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-slate-800 text-slate-300 border border-slate-700">
        {text}
      </span>
  );
};