import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

interface ToolArsenalProps {
  activeTool: string;
  onSelectTool: (tool: string) => void;
}

export default function ToolArsenal({ activeTool, onSelectTool }: ToolArsenalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const tools = [
    { id: 'vector', label: 'Vector', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
    )},
    { id: 'cube', label: 'Cube Mesh', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    )},
    { id: 'sphere', label: 'Sphere Mesh', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h20" /></svg>
    )},
  ];

  const handleSelect = (id: string) => {
    onSelectTool(id);
    setIsExpanded(false);
  };

  return (
    <div className="absolute bottom-8 right-8 flex flex-col-reverse items-end gap-4 z-20">
      {/* Main Action Button */}
      <m.button 
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center relative z-30 shadow-emerald-500/25"
      >
        <m.svg 
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-8 h-8"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </m.svg>
      </m.button>

      {/* Expanded Tools Menu */}
      <AnimatePresence>
        {isExpanded && (
          <m.div 
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0, scale: 0.8, y: 20 },
              visible: { 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: { type: "spring", stiffness: 400, damping: 25, staggerChildren: 0.05, delayChildren: 0.05 }
              }
            }}
            className="flex flex-col gap-3 origin-bottom relative z-20"
          >
            {tools.map(tool => (
              <m.button
                key={tool.id}
                variants={{
                  hidden: { opacity: 0, x: 20, scale: 0.9 },
                  visible: { opacity: 1, x: 0, scale: 1 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(tool.id)}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl backdrop-blur-md shadow-lg transition-colors border min-w-[160px] ${
                  activeTool === tool.id 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                    : 'bg-zinc-900/80 border-zinc-700 text-white hover:bg-zinc-800'
                }`}
              >
                <span className="font-medium text-sm">{tool.label}</span>
                <div className={activeTool === tool.id ? 'text-emerald-400' : 'text-zinc-400'}>
                  {tool.icon}
                </div>
              </m.button>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
