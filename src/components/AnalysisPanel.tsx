"use client";

import React from 'react';
import { BookOpen, Clock, Layers, ShieldCheck } from 'lucide-react';
import { AlgorithmComplexity, AlgorithmVariant } from '../algorithms/types';

interface AnalysisPanelProps {
  complexity?: AlgorithmComplexity;
  variants?: AlgorithmVariant[];
}

export default function AnalysisPanel({
  complexity,
  variants,
}: AnalysisPanelProps) {
  if (!complexity && (!variants || variants.length === 0)) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col gap-6">
      <div className="flex border-b border-emerald-500/10 pb-2.5 items-center select-none">
        <div className="flex items-center gap-1.5 px-1">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-950 text-base tracking-wider">Analisi & Varianti</h3>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 select-text">
        {/* Complexity Cards */}
        {complexity && (
          <div className="space-y-3 flex-[1]">
            <div className="flex items-center gap-1.5 px-1">
              <Clock className="w-4 h-4 text-teal-600" />
              <h3 className="font-semibold text-emerald-950 text-xs uppercase tracking-wider">
                Complessità Computazionale
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-sm">
              <div className="bg-white/80 p-4 border border-emerald-500/10 rounded-xl flex flex-col gap-1">
                <span className="text-emerald-700 text-[10px] uppercase font-bold tracking-tight">Caso Ottimo</span>
                <span className="text-emerald-950 font-bold text-base text-teal-700">{complexity.best}</span>
              </div>
              <div className="bg-white/80 p-4 border border-emerald-500/10 rounded-xl flex flex-col gap-1">
                <span className="text-emerald-700 text-[10px] uppercase font-bold tracking-tight">Caso Medio</span>
                <span className="text-emerald-950 font-bold text-base text-teal-700">{complexity.average}</span>
              </div>
              <div className="bg-white/80 p-4 border border-emerald-500/10 rounded-xl flex flex-col gap-1">
                <span className="text-emerald-700 text-[10px] uppercase font-bold tracking-tight">Caso Pessimo</span>
                <span className="text-emerald-950 font-bold text-base text-cyan-600">{complexity.worst}</span>
              </div>
              <div className="bg-white/80 p-4 border border-emerald-500/10 rounded-xl flex flex-col gap-1">
                <span className="text-emerald-700 text-[10px] uppercase font-bold tracking-tight">Spazio Ausiliario</span>
                <span className="text-emerald-950 font-bold text-base text-emerald-600">{complexity.space}</span>
              </div>
            </div>
          </div>
        )}

        {/* Variants List */}
        {variants && variants.length > 0 && (
          <div className="space-y-3 flex-[1.5] flex flex-col">
            <div className="flex items-center gap-1.5 px-1">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="font-semibold text-emerald-950 text-xs uppercase tracking-wider">
                Varianti & Dettagli Teorici
              </h3>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-amber-50/60 border border-amber-200/50 rounded-xl flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="text-base font-bold text-emerald-950">{v.name}</span>
                  </div>
                  <p className="text-sm text-slate-800 leading-7 font-medium">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
