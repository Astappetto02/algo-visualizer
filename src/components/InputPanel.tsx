import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, RefreshCw, ChevronRight } from 'lucide-react';

interface InputPanelProps {
  initialArray: number[];
  onArraySubmit: (arr: number[]) => void;
  showTargetInput?: boolean;
  targetValue?: number;
  onTargetChange?: (val: number) => void;
  targetLabel?: string;
}

export default function InputPanel({
  initialArray,
  onArraySubmit,
  showTargetInput = false,
  targetValue = 0,
  onTargetChange,
  targetLabel
}: InputPanelProps) {
  const [inputValue, setInputValue] = useState(initialArray.join(', '));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(initialArray.join(', '));
  }, [initialArray]);

  const validateAndSubmit = (val: string) => {
    // Split by commas, filter empty values, parse ints
    const parts = val.split(',').map((p) => p.trim()).filter((p) => p !== '');
    const numbers: number[] = [];

    for (const part of parts) {
      const num = parseInt(part, 10);
      if (isNaN(num)) {
        setError("L'input deve contenere solo numeri interi separati da virgole.");
        return;
      }
      if (num < 1 || num > 99) {
        setError('Si consigliano numeri compresi tra 1 e 99 per una visualizzazione chiara.');
        return;
      }
      numbers.push(num);
    }

    if (numbers.length < 4 || numbers.length > 12) {
      setError("Inserisci da 4 a 12 numeri per mantenere l'albero di ricorsione leggibile.");
      return;
    }

    setError(null);
    onArraySubmit(numbers);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndSubmit(inputValue);
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 6; // 6 to 10 elements
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 89) + 10); // 10 to 99
    setInputValue(arr.join(', '));
    setError(null);
    onArraySubmit(arr);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
        <h2 className="font-semibold text-white text-base">Pannello Input</h2>
      </div>

      <form onSubmit={handleTextSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Array di Input
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder="E.g. 24, 8, 45, 12, 36, 17"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {/* Generate random array */}
            <button
              type="button"
              onClick={generateRandomArray}
              className="px-3 rounded-xl border border-white/10 bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer flex items-center justify-center"
              title="Genera Array Casuale"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showTargetInput && onTargetChange && (
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {targetLabel || 'Valore Target da Cercare'}
            </label>
            <input
              type="number"
              value={targetValue}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onTargetChange(isNaN(val) ? 0 : val);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg font-medium">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/20 transition cursor-pointer"
        >
          <span>Aggiorna ed Esegui</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-[11px] text-slate-500 bg-slate-950/30 p-3 rounded-xl border border-white/5 leading-relaxed">
        <span className="font-semibold text-slate-400 block mb-0.5">Note didattiche:</span>
        Puoi definire da 4 a 12 elementi per vedere chiaramente sia il partizionamento della ricorsione sia le fasi di merge.
      </div>
    </div>
  );
}
