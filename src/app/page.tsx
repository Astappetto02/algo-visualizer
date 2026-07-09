"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import VisualizerCanvas from '../components/VisualizerCanvas';
import ControlPanel from '../components/ControlPanel';
import InputPanel from '../components/InputPanel';
import ExecutionPanel from '../components/ExecutionPanel';
import AnalysisPanel from '../components/AnalysisPanel';
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
  const [config, setConfig] = useState({
    array: [42, 15, 88, 56, 7, 23, 61, 39],
    target: 23,
    string1: "AGAT",
    string2: "GATT",
    seqCosts: {
      vvMatch: 0,
      vvMismatch: 2,
      vcMismatch: 2,
      ccMatch: 0,
      ccMismatch: 2,
      gap: 1
    },
    huffmanText: "ABRACADABRA",
    huffmanMode: 'text' as 'text' | 'freq',
    customIntervalsText: "1,3,10\n2,5,20\n3,6,15\n5,7,12",
    customEdgesText: "A,B,4\nA,C,2\nB,C,1\nB,D,5\nC,D,8\nC,E,10\nD,E,2",
    customKnapsackText: "O1,2,3\nO2,3,4\nO3,4,5\nO4,5,8",
    quickSortPivot: 'last' as 'first' | 'last'
  });
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service Worker registered successfully:', reg.scope))
        .catch((err) => console.warn('Service Worker registration failed:', err));
    }
  }, []);

  // Get active algorithm metadata definition
  const algoDefinition = useMemo(() => {
    return ALGORITHMS[selectedAlgoId] || null;
  }, [selectedAlgoId]);

  // Adjust target default value based on algorithm selection to make it educational
  useEffect(() => {
    if (selectedAlgoId === 'fibonacci') {
      setConfig(prev => ({ ...prev, target: 8 }));
    } else if (selectedAlgoId === 'knapsack') {
      setConfig(prev => ({ ...prev, target: 6 }));
    } else if (selectedAlgoId === 'binarysearch') {
      setConfig(prev => ({ ...prev, target: 23 }));
    }
  }, [selectedAlgoId]);

  const parseIntervals = (text: string) => {
    return text.split('\n').map(line => {
      const parts = line.split(',').map(p => parseInt(p.trim()));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { start: parts[0], end: parts[1], weight: parts[2] || 1 };
      }
      return null;
    }).filter(Boolean) as { start: number, end: number, weight: number }[];
  };

  const parseEdges = (text: string) => {
    return text.split('\n').map(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        return { from: parts[0], to: parts[1], weight: parseInt(parts[2]) || 1 };
      }
      return null;
    }).filter(Boolean) as { from: string, to: string, weight: number }[];
  };

  const parseKnapsackItems = (text: string) => {
    return text.split('\n').map(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 3 && parts[0] && !isNaN(parseInt(parts[1])) && !isNaN(parseInt(parts[2]))) {
        return { name: parts[0], weight: parseInt(parts[1]), value: parseInt(parts[2]) };
      }
      return null;
    }).filter(Boolean) as { name: string, weight: number, value: number }[];
  };

  // Generate snapshots on selected algorithm / array / target updates
  const snapshots = useMemo(() => {
    switch (selectedAlgoId) {
      case 'mergesort':
        return generateMergeSortSnapshots(config.array);
      case 'binarysearch':
        return generateBinarySearchSnapshots(config.array, config.target);
      case 'quicksort':
        return generateQuickSortSnapshots(config.array, config.quickSortPivot);
      case 'fibonacci':
        const fibN = Math.max(2, Math.min(config.target, 10)); // keep between 2 and 10
        return generateFibonacciSnapshots(fibN);
      case 'weightedintervals':
        return generateWeightedIntervalsSnapshots(parseIntervals(config.customIntervalsText));
      case 'sequencealignment':
        return generateSequenceAlignmentSnapshots(config.string1, config.string2, config.seqCosts);
      case 'knapsack':
        const capW = Math.max(2, Math.min(config.target, 25)); // keep capacity reasonable
        return generateKnapsackSnapshots(capW, parseKnapsackItems(config.customKnapsackText));
      case 'intervalscheduling':
        return generateIntervalSchedulingSnapshots(parseIntervals(config.customIntervalsText));
      case 'huffman':
        return generateHuffmanSnapshots(config.huffmanText, config.huffmanMode);
      case 'bfsdfs':
        return generateBfsDfsSnapshots(true, parseEdges(config.customEdgesText)); // Default to BFS
      case 'dijkstra':
        return generateDijkstraSnapshots(parseEdges(config.customEdgesText));
      case 'bellmanford':
        return generateBellmanFordSnapshots(parseEdges(config.customEdgesText));
      case 'mst':
        return generateMstSnapshots(parseEdges(config.customEdgesText));
      default:
        return [];
    }
  }, [selectedAlgoId, config]);

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

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-emerald-50 text-emerald-700 font-semibold font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs tracking-wider uppercase font-bold text-teal-600">Inizializzazione Corso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-emerald-50/50 text-foreground">
      {/* Sidebar for choosing algorithms */}
      <Sidebar
        selectedAlgoId={selectedAlgoId}
        onSelectAlgo={setSelectedAlgoId}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main dashboard content area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative p-4 md:p-6 xl:p-8 pt-20 xl:pt-8 gap-6">
        


        {/* Algorithm Description Area */}
        {algoDefinition && (
          <div className="bg-gradient-to-r from-emerald-100/70 via-teal-50/50 to-transparent p-6 rounded-2xl border border-emerald-200 flex flex-col gap-2 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Syllabus Informatica - Modulo: {algoDefinition.module}
            </span>
            <h3 className="text-xl font-bold text-emerald-950 tracking-tight">
              {algoDefinition.name}
            </h3>
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 mt-1">
              <p className="text-sm text-slate-800 leading-7 font-medium max-w-5xl">
                {algoDefinition.description}
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Canvas + Sidebar Panel Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start flex-1">
          {/* Visualizer and Control Area (Takes 3/4 widths) */}
          <div className="lg:col-span-3 flex flex-col gap-6 w-full">
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
            
            {/* Analysis and Variants Panel moved here for more horizontal space */}
            {algoDefinition && (
              <AnalysisPanel
                complexity={algoDefinition.complexity}
                variants={algoDefinition.variants}
              />
            )}
          </div>

          {/* Configuration Sidebar Panel (Takes 1/4 widths on desktop, grid side-by-side on portrait tablet) */}
          <div className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-col gap-6 w-full">
            {/* Input Configurator */}
            <InputPanel
              algoId={selectedAlgoId}
              config={config}
              onConfigChange={setConfig}
            />

            {/* Execution panel back in sidebar */}
            {algoDefinition && (
              <ExecutionPanel
                pseudocode={algoDefinition.pseudocode}
                activeLine={currentSnapshot ? currentSnapshot.codeLine : -1}
                variables={currentSnapshot ? currentSnapshot.variables : {}}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
