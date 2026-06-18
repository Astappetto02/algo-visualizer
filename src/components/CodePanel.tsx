"use client";

import React, { useState } from 'react';
import { Terminal, Eye, BookOpen, Clock, Layers, ShieldCheck } from 'lucide-react';
import { AlgorithmComplexity, AlgorithmVariant } from '../algorithms/types';

interface CodePanelProps {
  pseudocode: string[];
  activeLine: number;
  variables: Record<string, any>;
  complexity?: AlgorithmComplexity;
  variants?: AlgorithmVariant[];
}

export default function CodePanel({
  pseudocode,
  activeLine,
  variables,
  complexity,
  variants,
}: CodePanelProps) {
  const [activeTab, setActiveTab] = useState<'execution' | 'analysis'>('execution');

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col gap-5 h-full min-h-[460px]">
      
      {/* Header Tabs */}
      <div className="flex border-b border-white/5 pb-2.5 justify-between items-center select-none">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('execution')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'execution'
                ? 'bg-indigo-650/45 text-white border border-indigo-500/30 shadow-md shadow-indigo-950/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-400" />
            Esecuzione
          </button>
          
          {(complexity || variants) && (
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'analysis'
                  ? 'bg-indigo-650/45 text-white border border-indigo-500/30 shadow-md shadow-indigo-950/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4 text-pink-400" />
              Analisi & Varianti
            </button>
          )}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'execution' ? (
        <div className="flex flex-col gap-5 flex-1">
          {/* Pseudocode Box */}
          <div className="flex-1 bg-slate-950/80 rounded-xl p-4 border border-white/5 overflow-auto max-h-[260px] font-mono text-[12.5px] leading-relaxed select-text">
            {pseudocode.map((line, index) => {
              const isHighlighted = index === activeLine;
              return (
                <div
                  key={index}
                  className={`flex items-start -mx-4 px-4 py-0.5 transition-colors duration-150 ${
                    isHighlighted
                      ? 'bg-indigo-500/20 border-l-4 border-indigo-500 text-white font-medium shadow-[inset_4px_0_12px_rgba(99,102,241,0.1)]'
                      : 'text-slate-400 border-l-4 border-transparent'
                  }`}
                >
                  <span className="w-6 text-slate-600 text-[10px] select-none text-right pr-2 mt-0.5 font-semibold">
                    {index + 1}
                  </span>
                  <pre className="whitespace-pre-wrap font-mono flex-1">{line || ' '}</pre>
                </div>
              );
            })}
          </div>

          {/* Variables Inspector Box */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 px-1">
              <Eye className="w-4 h-4 text-pink-400" />
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
                Ispezione Variabili
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2 bg-slate-900/30 p-3 rounded-xl border border-white/5 font-mono text-xs">
              {Object.entries(variables).map(([name, value]) => {
                const hasValue = value !== null && value !== undefined;
                return (
                  <div
                    key={name}
                    className="flex justify-between items-center px-2.5 py-1.5 bg-slate-950/50 border border-white/5 rounded-lg"
                  >
                    <span className="text-slate-500 font-semibold">{name}</span>
                    <span
                      className={`font-semibold ${
                        hasValue ? 'text-pink-300 font-bold font-mono' : 'text-slate-700'
                      }`}
                    >
                      {hasValue ? (Array.isArray(value) ? `[${value.join(', ')}]` : String(value)) : '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 flex-1 select-text">
          {/* Complexity Cards */}
          {complexity && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 px-1">
                <Clock className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
                  Complessità Computazionale
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="bg-slate-950/60 p-2.5 border border-white/5 rounded-xl flex flex-col gap-0.5">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-tight">Caso Ottimo</span>
                  <span className="text-white font-bold text-sm text-indigo-300">{complexity.best}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 border border-white/5 rounded-xl flex flex-col gap-0.5">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-tight">Caso Medio</span>
                  <span className="text-white font-bold text-sm text-indigo-300">{complexity.average}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 border border-white/5 rounded-xl flex flex-col gap-0.5">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-tight">Caso Pessimo</span>
                  <span className="text-white font-bold text-sm text-pink-400">{complexity.worst}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 border border-white/5 rounded-xl flex flex-col gap-0.5">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-tight">Spazio Ausiliario</span>
                  <span className="text-white font-bold text-sm text-emerald-400">{complexity.space}</span>
                </div>
              </div>
            </div>
          )}

          {/* Variants List */}
          {variants && variants.length > 0 && (
            <div className="space-y-2.5 flex-1 flex flex-col">
              <div className="flex items-center gap-1.5 px-1">
                <Layers className="w-4 h-4 text-pink-400" />
                <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
                  Varianti & Dettagli Teorici
                </h3>
              </div>

              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[220px] pr-1">
                {variants.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-bold text-slate-200">{v.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      {v.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
