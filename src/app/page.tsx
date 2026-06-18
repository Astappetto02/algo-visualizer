"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import VisualizerCanvas from '../components/VisualizerCanvas';
import ControlPanel from '../components/ControlPanel';
import InputPanel from '../components/InputPanel';
import CodePanel from '../components/CodePanel';
import { useAlgorithmRunner } from '../hooks/useAlgorithmRunner';
import { ALGORITHMS } from '../algorithms';
import { Sparkles, HelpCircle, GraduationCap } from 'lucide-react';

// Algorithms
import { generateMergeSortSnapshots } from '../algorithms/mergeSort';
import { generateBinarySearchSnapshots } from '../algorithms/binarySearch';
import { generateQuickSortSnapshots } from '../algorithms/quickSort';
import {
  generateFibonacciSnapshots,
  generateWeightedIntervalsSnapshots,
  generateSequenceAlignmentSnapshots,
  generateKnapsackSnapshots
} from '../algorithms/dynamicProgramming';
import {
  generateIntervalSchedulingSnapshots,
  generateHuffmanSnapshots
} from '../algorithms/greedy';
import {
  generateBfsDfsSnapshots,
  generateDijkstraSnapshots,
  generateBellmanFordSnapshots,
  generateMstSnapshots
} from '../algorithms/graphs';

export default function Home() {
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('mergesort');
  const [array, setArray] = useState<number[]>([42, 15, 88, 56, 7, 23, 61, 39]);
  const [target, setTarget] = useState<number>(23);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get active algorithm metadata definition
  const algoDefinition = useMemo(() => {
    return ALGORITHMS[selectedAlgoId] || null;
  }, [selectedAlgoId]);

  // Adjust target default value based on algorithm selection to make it educational
  useEffect(() => {
    if (selectedAlgoId === 'fibonacci') {
      setTarget(8); // Default N = 8
    } else if (selectedAlgoId === 'knapsack') {
      setTarget(6); // Default Capacity W = 6
    } else if (selectedAlgoId === 'binarysearch') {
      setTarget(23); // Default search target = 23
    }
  }, [selectedAlgoId]);

  // Generate snapshots on selected algorithm / array / target updates
  const snapshots = useMemo(() => {
    switch (selectedAlgoId) {
      case 'mergesort':
        return generateMergeSortSnapshots(array);
      case 'binarysearch':
        return generateBinarySearchSnapshots(array, target);
      case 'quicksort':
        return generateQuickSortSnapshots(array);
      case 'fibonacci':
        const fibN = Math.max(2, Math.min(target, 10)); // keep between 2 and 10
        return generateFibonacciSnapshots(fibN);
      case 'weightedintervals':
        return generateWeightedIntervalsSnapshots();
      case 'sequencealignment':
        return generateSequenceAlignmentSnapshots("AGAT", "GATT");
      case 'knapsack':
        const capW = Math.max(2, Math.min(target, 10)); // keep capacity reasonable
        return generateKnapsackSnapshots(capW);
      case 'intervalscheduling':
        return generateIntervalSchedulingSnapshots();
      case 'huffman':
        return generateHuffmanSnapshots();
      case 'bfsdfs':
        return generateBfsDfsSnapshots(true); // Default to BFS
      case 'dijkstra':
        return generateDijkstraSnapshots();
      case 'bellmanford':
        return generateBellmanFordSnapshots();
      case 'mst':
        return generateMstSnapshots();
      default:
        return [];
    }
  }, [selectedAlgoId, array, target]);

  // Connect the hooks algorithm runner
  const {
    currentStep,
    currentSnapshot,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    goToStep
  } = useAlgorithmRunner(snapshots);

  const handleArraySubmit = (newArray: number[]) => {
    setArray(newArray);
  };

  const showTargetInput = ['binarysearch', 'fibonacci', 'knapsack'].includes(selectedAlgoId);

  const targetLabel = useMemo(() => {
    if (selectedAlgoId === 'fibonacci') return 'Valore N da Calcolare (F(N))';
    if (selectedAlgoId === 'knapsack') return 'Capacità dello Zaino (W)';
    return 'Valore Target da Cercare';
  }, [selectedAlgoId]);

  const showArrayInput = ['mergesort', 'binarysearch', 'quicksort'].includes(selectedAlgoId);

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg-dark text-slate-400 font-semibold font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs tracking-wider uppercase font-bold text-slate-500">Inizializzazione Corso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-dark text-foreground">
      {/* Sidebar for choosing algorithms */}
      <Sidebar
        selectedAlgoId={selectedAlgoId}
        onSelectAlgo={setSelectedAlgoId}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main dashboard content area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative p-6 lg:p-8 pt-20 lg:pt-8 gap-6">
        
        {/* Dashboard Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Dashboard Didattica
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-0.5 tracking-tight flex items-center gap-2">
              Visualizzatore Algoritmi Universitario
              <Sparkles className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 border border-white/5 px-4 py-2 rounded-xl text-xs text-slate-400 select-none">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Seleziona un algoritmo nella sidebar per caricare il modulo didattico.</span>
          </div>
        </header>

        {/* Algorithm Description Area */}
        {algoDefinition && (
          <div className="bg-gradient-to-r from-indigo-950/20 via-purple-950/10 to-transparent p-5 rounded-2xl border border-indigo-500/10 flex flex-col gap-1 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Syllabus Informatica - Modulo: {algoDefinition.module}
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {algoDefinition.name}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-4xl mt-1.5 font-medium">
              {algoDefinition.description}
            </p>
          </div>
        )}

        {/* Dynamic Canvas + Sidebar Panel Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start flex-1">
          {/* Visualizer and Control Area (Takes 3/4 widths) */}
          <div className="xl:col-span-3 flex flex-col gap-6 w-full">
            {/* Visual Canvas containing Bars, DP Grid, or SVG Graph */}
            <VisualizerCanvas snapshot={currentSnapshot} activeAlgoId={selectedAlgoId} />
            {/* Controller interface */}
            <ControlPanel
              isPlaying={isPlaying}
              onPlay={play}
              onPause={pause}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onReset={reset}
              currentStep={currentStep}
              totalSteps={snapshots.length}
              speed={speed}
              onSpeedChange={setSpeed}
              onGoToStep={goToStep}
            />
          </div>

          {/* Configuration and Code Inspector Sidebar Panel (Takes 1/4 widths) */}
          <div className="flex flex-col gap-6 w-full">
            {/* Input Configurator (Hide array input for graphs/static algorithms) */}
            {(showArrayInput || showTargetInput) && (
              <InputPanel
                initialArray={array}
                onArraySubmit={handleArraySubmit}
                showTargetInput={showTargetInput}
                targetValue={target}
                onTargetChange={setTarget}
                targetLabel={targetLabel}
              />
            )}
            
            {/* Realtime Pseudocode panel */}
            {algoDefinition && (
              <CodePanel
                pseudocode={algoDefinition.pseudocode}
                activeLine={currentSnapshot ? currentSnapshot.codeLine : -1}
                variables={currentSnapshot ? currentSnapshot.variables : {}}
                complexity={algoDefinition.complexity}
                variants={algoDefinition.variants}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
