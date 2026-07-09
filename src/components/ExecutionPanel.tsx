"use client";

import React from 'react';
import { Terminal, Eye } from 'lucide-react';

interface ExecutionPanelProps {
  pseudocode: string[];
  activeLine: number;
  variables: Record<string, any>;
}

export default function ExecutionPanel({
  pseudocode,
  activeLine,
  variables,
}: ExecutionPanelProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col gap-5 min-h-[460px]">
      <div className="flex border-b border-emerald-500/10 pb-2.5 items-center select-none">
        <div className="flex items-center gap-1.5 px-1">
          <Terminal className="w-4 h-4 text-emerald-600" />
          <h3 className="font-semibold text-emerald-950 text-sm tracking-wider">Esecuzione</h3>
        </div>
      </div>

      <div className="flex flex-col gap-5 flex-1">
        {/* Pseudocode Box */}
        <div className="flex-1 bg-white/80 rounded-xl p-4 border border-emerald-500/10 overflow-auto max-h-[260px] font-mono text-[12.5px] leading-relaxed select-text">
          {pseudocode.map((line, index) => {
            const isHighlighted = index === activeLine;
            return (
              <div
                key={index}
                className={`flex items-start -mx-4 px-4 py-0.5 transition-colors duration-150 ${
                  isHighlighted
                    ? 'bg-emerald-500/20 border-l-4 border-emerald-500 text-emerald-950 font-bold shadow-[inset_4px_0_12px_rgba(16,185,129,0.15)]'
                    : 'text-teal-700 border-l-4 border-transparent'
                }`}
              >
                <span className="w-6 text-teal-500 text-[10px] select-none text-right pr-2 mt-0.5 font-semibold">
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
            <Eye className="w-4 h-4 text-cyan-500" />
            <h3 className="font-semibold text-emerald-950 text-xs uppercase tracking-wider">
              Ispezione Variabili
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-500/10 font-mono text-xs">
            {Object.entries(variables).map(([name, value]) => {
              const hasValue = value !== null && value !== undefined;
              return (
                <div
                  key={name}
                  className="flex justify-between items-center px-2.5 py-1.5 bg-white/60 border border-emerald-500/10 rounded-lg"
                >
                  <span className="text-emerald-800 font-semibold">{name}</span>
                  <span
                    className={`font-semibold ${
                      hasValue ? 'text-cyan-600 font-bold font-mono' : 'text-emerald-200'
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
    </div>
  );
}
