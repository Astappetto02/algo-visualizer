import { AlgorithmDefinition } from './types';
import { mergeSortDefinition } from './mergeSort';
import { binarySearchDefinition } from './binarySearch';
import { quickSortDefinition } from './quickSort';
import {
  fibonacciDefinition,
  weightedIntervalsDefinition,
  sequenceAlignmentDefinition,
  knapsackDefinition
} from './dynamicProgramming';
import {
  intervalSchedulingDefinition,
  huffmanDefinition
} from './greedy';
import {
  bfsDfsDefinition,
  dijkstraDefinition,
  bellmanFordDefinition,
  mstDefinition
} from './graphs';

export const ALGORITHMS: Record<string, AlgorithmDefinition> = {
  mergesort: mergeSortDefinition,
  binarysearch: binarySearchDefinition,
  quicksort: quickSortDefinition,
  fibonacci: fibonacciDefinition,
  weightedintervals: weightedIntervalsDefinition,
  sequencealignment: sequenceAlignmentDefinition,
  knapsack: knapsackDefinition,
  intervalscheduling: intervalSchedulingDefinition,
  huffman: huffmanDefinition,
  bfsdfs: bfsDfsDefinition,
  dijkstra: dijkstraDefinition,
  bellmanford: bellmanFordDefinition,
  mst: mstDefinition
};

export interface ModuleAlgorithmRef {
  id: string;
  name: string;
  implemented: boolean;
}

export interface ModuleDefinition {
  name: string;
  algorithms: ModuleAlgorithmRef[];
}

export const MODULES: ModuleDefinition[] = [
  {
    name: 'Modulo 1: Divide et Impera',
    algorithms: [
      { id: 'binarysearch', name: 'Ricerca Binaria', implemented: true },
      { id: 'mergesort', name: 'MergeSort', implemented: true },
      { id: 'quicksort', name: 'QuickSort', implemented: true }
    ]
  },
  {
    name: 'Modulo 2: Programmazione Dinamica',
    algorithms: [
      { id: 'fibonacci', name: 'Fibonacci', implemented: true },
      { id: 'weightedintervals', name: 'Weighted Interval Scheduling', implemented: true },
      { id: 'sequencealignment', name: 'Allineamento di Sequenze', implemented: true },
      { id: 'knapsack', name: 'Problema dello Zaino', implemented: true }
    ]
  },
  {
    name: 'Modulo 3: Algoritmi Greedy',
    algorithms: [
      { id: 'intervalscheduling', name: 'Interval Scheduling', implemented: true },
      { id: 'huffman', name: 'Codifica di Huffman', implemented: true }
    ]
  },
  {
    name: 'Modulo 4: Grafi e Cammini Minimi',
    algorithms: [
      { id: 'bfsdfs', name: 'Visite (BFS / DFS)', implemented: true },
      { id: 'bellmanford', name: 'Bellman-Ford', implemented: true },
      { id: 'dijkstra', name: 'Dijkstra', implemented: true },
      { id: 'mst', name: 'Minimum Spanning Tree (MST)', implemented: true }
    ]
  }
];
