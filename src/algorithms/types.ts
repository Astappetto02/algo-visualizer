export interface MergeSortNode {
  id: string;
  array: number[];
  leftIndex: number;
  rightIndex: number;
  status: 'idle' | 'splitting' | 'sorting' | 'merging' | 'merged';
}

export interface VisualGraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  status: 'idle' | 'visited' | 'active' | 'path';
}

export interface VisualGraphEdge {
  from: string;
  to: string;
  weight: number;
  status: 'idle' | 'active' | 'path';
}

export interface VisualInterval {
  id: string;
  start: number;
  end: number;
  weight?: number;
  status: 'standard' | 'checking' | 'selected' | 'rejected';
}

export interface VisualTreeNode {
  id: string;
  label: string;
  freq: number;
  x: number;
  y: number;
  parentId?: string;
  isLeft?: boolean;
}

export interface AlgorithmSnapshot {
  // Base fields
  codeLine: number;
  description: string;
  variables: Record<string, any>;

  // Bars & Tree Mode (MergeSort, QuickSort, Binary Search)
  array?: number[];
  activeIndices?: number[];
  mergedIndices?: number[];
  tree?: MergeSortNode[]; // Recursive splits

  // Grid Mode (Knapsack, Sequence Alignment, Fibonacci)
  grid?: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  activeRow?: number | null;
  activeCol?: number | null;
  gridPath?: {r: number, c: number}[];
  selectedRows?: number[];

  // Graph Mode (BFS/DFS, Dijkstra, Bellman-Ford, Prim, Kruskal)
  nodes?: VisualGraphNode[];
  edges?: VisualGraphEdge[];

  // Timeline Mode (Interval Scheduling, Weighted Interval Scheduling)
  intervals?: VisualInterval[];

  // Huffman Tree Mode
  huffmanNodes?: VisualTreeNode[];
}

export interface AlgorithmComplexity {
  best: string;
  average: string;
  worst: string;
  space: string;
}

export interface AlgorithmVariant {
  name: string;
  description: string;
}

export interface AlgorithmDefinition {
  id: string;
  name: string;
  module: string;
  description: string;
  pseudocode: string[];
  complexity?: AlgorithmComplexity;
  variants?: AlgorithmVariant[];
}
