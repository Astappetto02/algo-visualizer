import React from 'react';
import { MODULES } from '../algorithms';
import { Code, BookOpen, Lock, CheckCircle2, Menu, X, Sparkles } from 'lucide-react';

interface SidebarProps {
  selectedAlgoId: string;
  onSelectAlgo: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ selectedAlgoId, onSelectAlgo, isOpen, setIsOpen }: SidebarProps) {
  const getModuleColorClass = (index: number) => {
    switch (index) {
      case 0: return "text-emerald-600";
      case 1: return "text-cyan-600";
      case 2: return "text-indigo-500";
      case 3: return "text-rose-500";
      default: return "text-teal-600";
    }
  };

  // Map module index to Lucide icons for premium looks
  const getModuleIcon = (index: number) => {
    switch (index) {
      case 0: return <BookOpen className="w-5 h-5 text-emerald-500" />;
      case 1: return <Sparkles className="w-5 h-5 text-cyan-500" />;
      case 2: return <Code className="w-5 h-5 text-indigo-500" />;
      case 3: return <Code className="w-5 h-5 text-rose-500" />;
      default: return <BookOpen className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white/80 border border-emerald-200 text-emerald-950 backdrop-blur-md cursor-pointer hover:bg-emerald-50 transition"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-45 w-72 glass-panel flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-emerald-500/10 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="font-bold text-white text-sm">AV</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-700 bg-clip-text text-transparent">
                Algo Visualizer
              </h1>
              <p className="text-xs text-emerald-600/80 mt-1 font-semibold tracking-wider uppercase">
                Progettazione Algoritmi
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Algorithms List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 select-none">
          {MODULES.map((module, mIdx) => (
            <div key={module.name} className="space-y-3">
              <div className={`flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wider ${getModuleColorClass(mIdx)}`}>
                {getModuleIcon(mIdx)}
                <span>{module.name}</span>
              </div>
              <ul className="space-y-1">
                {module.algorithms.map((algo) => {
                  const isSelected = selectedAlgoId === algo.id;
                  return (
                    <li key={algo.id}>
                      <button
                        onClick={() => {
                          if (algo.implemented) {
                            onSelectAlgo(algo.id);
                            setIsOpen(false); // Close on mobile selection
                          }
                        }}
                        disabled={!algo.implemented}
                        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-900 shadow-sm shadow-emerald-900/5'
                            : algo.implemented
                            ? 'text-teal-700 hover:bg-emerald-500/10 border border-transparent hover:text-emerald-900 cursor-pointer'
                            : 'text-teal-500 border border-transparent cursor-not-allowed'
                        }`}
                      >
                        <span className="text-sm font-medium">{algo.name}</span>
                        {algo.implemented ? (
                          isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] font-semibold bg-teal-100 border border-emerald-500/5 text-teal-600 px-1.5 py-0.5 rounded-md uppercase tracking-tight">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Syllabus</span>
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-emerald-500/10 bg-emerald-50/50 text-center">
          <p className="text-[10px] text-teal-600">
            Corso di Laurea in Informatica
          </p>
          <p className="text-[10px] text-emerald-600/60 font-medium mt-0.5">
            Supporto Didattico Integrativo
          </p>
        </div>
      </aside>
    </>
  );
}
