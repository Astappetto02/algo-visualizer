import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, RefreshCw, ChevronRight } from 'lucide-react';

interface InputPanelProps {
  algoId: string;
  config: {
    array: number[];
    target: number;
    string1: string;
    string2: string;
    seqCosts: {
      vvMatch: number;
      vvMismatch: number;
      vcMismatch: number;
      ccMatch: number;
      ccMismatch: number;
      gap: number;
    };
    huffmanText: string;
    customIntervalsText: string;
    customEdgesText: string;
    customKnapsackText: string;
  };
  onConfigChange: (newConfig: any) => void;
}

export default function InputPanel({ algoId, config, onConfigChange }: InputPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const [arrayStr, setArrayStr] = useState(config.array.join(', '));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalConfig(config);
    setArrayStr(config.array.join(', '));
  }, [config]);

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (['mergesort', 'binarysearch', 'quicksort'].includes(algoId)) {
      const parts = arrayStr.split(',').map(p => p.trim()).filter(p => p !== '');
      const numbers: number[] = [];
      for (const part of parts) {
        const num = parseInt(part, 10);
        if (isNaN(num)) {
          setError("L'input deve contenere solo numeri interi separati da virgole.");
          return;
        }
        if (num < 1 || num > 99) {
          setError('Si consigliano numeri tra 1 e 99.');
          return;
        }
        numbers.push(num);
      }
      if (numbers.length < 4 || numbers.length > 12) {
        setError("Inserisci da 4 a 12 numeri.");
        return;
      }
      onConfigChange({ ...localConfig, array: numbers });
      setError(null);
      return;
    }

    setError(null);
    onConfigChange(localConfig);
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 6;
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 89) + 10);
    setArrayStr(arr.join(', '));
    onConfigChange({ ...localConfig, array: arr });
  };

  // Base input classes for the light theme
  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-slate-800 font-mono text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all";
  const smallInputClass = "w-full px-3 py-2 rounded-xl bg-white border border-emerald-200 text-slate-800 font-mono text-xs focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all";

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-3">
        <SlidersHorizontal className="w-5 h-5 text-emerald-500" />
        <h2 className="font-semibold text-emerald-950 text-base">Pannello Input</h2>
      </div>

      <form onSubmit={validateAndSubmit} className="flex flex-col gap-3 w-full">
        
        {['mergesort', 'binarysearch', 'quicksort'].includes(algoId) && (
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-teal-600 uppercase">Array di Input</label>
            <div className="flex gap-2 w-full">
              <input
                type="text"
                value={arrayStr}
                onChange={(e) => setArrayStr(e.target.value)}
                className={`flex-1 ${inputClass}`}
              />
              <button
                type="button"
                onClick={generateRandomArray}
                className="px-3 rounded-xl border border-emerald-200 bg-emerald-50 text-teal-600 hover:text-emerald-900 hover:bg-emerald-100 cursor-pointer transition-colors"
                title="Genera array casuale"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {['binarysearch', 'fibonacci', 'knapsack'].includes(algoId) && (
          <div className="flex flex-col gap-1.5 mt-1 w-full">
            <label className="text-xs font-semibold text-teal-600 uppercase">
              {algoId === 'fibonacci' ? 'Valore N (F(N))' : algoId === 'knapsack' ? 'Capacità W' : 'Target'}
            </label>
            <input
              type="number"
              value={localConfig.target}
              onChange={(e) => setLocalConfig({...localConfig, target: parseInt(e.target.value) || 0})}
              className={inputClass}
            />
          </div>
        )}

        {algoId === 'sequencealignment' && (
          <>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-teal-600 uppercase">Stringa 1</label>
                <input
                  type="text"
                  value={localConfig.string1}
                  onChange={(e) => setLocalConfig({...localConfig, string1: e.target.value})}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-teal-600 uppercase">Stringa 2</label>
                <input
                  type="text"
                  value={localConfig.string2}
                  onChange={(e) => setLocalConfig({...localConfig, string2: e.target.value})}
                  className={inputClass}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-1 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] sm:text-xs font-semibold text-teal-600 uppercase truncate" title="Vocale-Vocale Match">V-V Match</label>
                <input
                  type="number"
                  value={localConfig.seqCosts.vvMatch}
                  onChange={(e) => setLocalConfig({...localConfig, seqCosts: {...localConfig.seqCosts, vvMatch: parseInt(e.target.value) || 0}})}
                  className={smallInputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] sm:text-xs font-semibold text-teal-600 uppercase truncate" title="Vocale-Vocale Mismatch">V-V Mismatch</label>
                <input
                  type="number"
                  value={localConfig.seqCosts.vvMismatch}
                  onChange={(e) => setLocalConfig({...localConfig, seqCosts: {...localConfig.seqCosts, vvMismatch: parseInt(e.target.value) || 0}})}
                  className={smallInputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] sm:text-xs font-semibold text-teal-600 uppercase truncate" title="Consonante-Consonante Match">C-C Match</label>
                <input
                  type="number"
                  value={localConfig.seqCosts.ccMatch}
                  onChange={(e) => setLocalConfig({...localConfig, seqCosts: {...localConfig.seqCosts, ccMatch: parseInt(e.target.value) || 0}})}
                  className={smallInputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] sm:text-xs font-semibold text-teal-600 uppercase truncate" title="Consonante-Consonante Mismatch">C-C Mismatch</label>
                <input
                  type="number"
                  value={localConfig.seqCosts.ccMismatch}
                  onChange={(e) => setLocalConfig({...localConfig, seqCosts: {...localConfig.seqCosts, ccMismatch: parseInt(e.target.value) || 0}})}
                  className={smallInputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] sm:text-xs font-semibold text-teal-600 uppercase truncate" title="Vocale-Consonante Mismatch">V-C Mismatch</label>
                <input
                  type="number"
                  value={localConfig.seqCosts.vcMismatch}
                  onChange={(e) => setLocalConfig({...localConfig, seqCosts: {...localConfig.seqCosts, vcMismatch: parseInt(e.target.value) || 0}})}
                  className={smallInputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] sm:text-xs font-semibold text-teal-600 uppercase truncate" title="Gap Penalty">Gap Penalty</label>
                <input
                  type="number"
                  value={localConfig.seqCosts.gap}
                  onChange={(e) => setLocalConfig({...localConfig, seqCosts: {...localConfig.seqCosts, gap: parseInt(e.target.value) || 0}})}
                  className={smallInputClass}
                />
              </div>
            </div>
          </>
        )}

        {algoId === 'huffman' && (
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-teal-600 uppercase">Testo da Comprimere</label>
            <input
              type="text"
              value={localConfig.huffmanText}
              onChange={(e) => setLocalConfig({...localConfig, huffmanText: e.target.value})}
              className={inputClass}
            />
          </div>
        )}

        {['intervalscheduling', 'weightedintervals'].includes(algoId) && (
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-teal-600 uppercase">Intervalli (inizio,fine[,peso])</label>
            <textarea
              value={localConfig.customIntervalsText}
              onChange={(e) => setLocalConfig({...localConfig, customIntervalsText: e.target.value})}
              className={`${inputClass} min-h-[100px] resize-y`}
              placeholder="1,3,10\n2,5,5"
            />
          </div>
        )}

        {algoId === 'knapsack' && (
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-teal-600 uppercase">Oggetti (nome,peso,valore)</label>
            <textarea
              value={localConfig.customKnapsackText}
              onChange={(e) => setLocalConfig({...localConfig, customKnapsackText: e.target.value})}
              className={`${inputClass} min-h-[100px] resize-y`}
              placeholder="O1,2,3\nO2,3,4"
            />
          </div>
        )}

        {['bfsdfs', 'dijkstra', 'bellmanford', 'mst'].includes(algoId) && (
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-teal-500 uppercase">Archi (nodoA,nodoB[,peso])</label>
            <textarea
              value={localConfig.customEdgesText}
              onChange={(e) => setLocalConfig({...localConfig, customEdgesText: e.target.value})}
              className={`${inputClass} min-h-[100px] resize-y`}
              placeholder="A,B,4\nA,C,2"
            />
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg font-medium w-full">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition cursor-pointer"
        >
          <span>Aggiorna ed Esegui</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
