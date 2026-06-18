# 🎓 Algorithmic Design Suite — SPA Visualizer

An interactive, premium Single Page Application (SPA) designed as an educational tool for university courses in **Algorithm Design & Analysis** (Progettazione e Analisi di Algoritmi). Built with Next.js, React, Tailwind CSS, and Framer Motion.

---

## 🌟 Key Features

* **13 Fully Visualized Algorithms**: Spanning all major curriculum paradigms (Divide & Conquer, Dynamic Programming, Greedy, and Graphs).
* **Multi-Mode Visualization Canvas**: Automatically routes and renders the active step state into 5 custom layout engines:
  1. **Bars Chart & Recursion Tree**: To display split divisions and merges (MergeSort, QuickSort, Binary Search).
  2. **DP Matrix Grid**: 2D data matrix cells with active subproblem highlights (Fibonacci, Knapsack, Sequence Alignment).
  3. **SVG Graph Layout**: Vector network nodes and edge weight lines with frontier traversal styling (BFS, DFS, Dijkstra, Bellman-Ford, Prim).
  4. **Timeline Gantt**: Horizontal overlap segments mapped to a synchronized time axis (Interval Scheduling, Weighted Intervals).
  5. **Prefix Binary Tree**: Binary hierarchy layout computed via weight queues (Huffman Coding).
* **Step-by-Step Playback / Time-Travel**: Interactive media controllers (Play, Pause, Step Forward/Backward, and Speed scrubbers) to sweep through algorithm snapshots.
* **Real-time Pseudocode & Variables Inspector**: Highlights the executing line of pseudocode side-by-side with local pointer variables (`low`, `high`, `mid`, `i`, `j`, etc.).
* **Complexity & Theory Reference**: Theoretical panel mapping time bounds ($\Theta(n \log n)$ best/average/worst) and academic variants (In-place, Bottom-up, Timsort).
* **Hydration Mismatch Shield**: Embedded React mount guards preventing browser extension conflicts.

---

## 🛠️ Technology Stack

* **Framework**: React 19 / Next.js 16 (App Router)
* **Styling**: Tailwind CSS v4 (Glassmorphic panels, neon borders, and custom scrollbar animations)
* **Animations**: Framer Motion
* **Compiler**: Webpack (resolves dot-directory Turbopack watch restrictions)
* **Language**: TypeScript

---

## 📂 Project Layout

```
algo-visualizer/
├── src/
│   ├── app/                         
│   │   ├── layout.tsx               # Fonts and suppressHydrationWarning configs
│   │   ├── globals.css              # Custom styling tokens
│   │   └── page.tsx                 # Main entry dashboard page
│   ├── components/                  
│   │   ├── Sidebar.tsx              # Syllabus selection drawer
│   │   ├── VisualizerCanvas.tsx     # 5-mode render canvas router
│   │   ├── ControlPanel.tsx         # Media controllers
│   │   ├── CodePanel.tsx            # Code highlighter & inspector tabs
│   │   └── InputPanel.tsx           # Validations and random arrays
│   ├── algorithms/                  
│   │   ├── types.ts                 # Unified Snapshot type models
│   │   ├── index.ts                 # Syllabus registries
│   │   ├── mergeSort.ts             
│   │   ├── binarySearch.ts          
│   │   ├── quickSort.ts             
│   │   ├── dynamicProgramming.ts    # DP Algorithms
│   │   ├── greedy.ts                # Greedy Algorithms
│   │   └── graphs.ts                # Graph Algorithms
│   └── hooks/                       
│       └── useAlgorithmRunner.ts    # Playback scrubber timer hook
```

---

## 🚀 Getting Started

### Prerequisites

You need [Node.js](https://nodejs.org/) installed on your computer.

### Installation & Run

1. Open a terminal in the project directory:
   ```bash
   cd algo-visualizer
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Webpack-forced development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

## 📊 Syllabus Summary

### Module 1: Divide et Impera
* **Binary Search**: Highlights the low/high search space and mid index.
* **MergeSort**: Visualizes the divide phase and array element merging.
* **QuickSort**: Lomuto partition swaps and pivot stabilizations.

### Module 2: Programmazione Dinamica
* **Fibonacci**: Bottom-up tabulation vector filling.
* **Weighted Interval Scheduling**: M[j] computation, p[j] compatibility tracking, and solution backtracking.
* **Sequence Alignment**: Global alignment matrix filling (Gap penalty = 1, Mismatch = 2).
* **Knapsack**: DP capacity grid values and backtracking.

### Module 3: Algoritmi Greedy
* **Interval Scheduling**: Greedily picks earliest end-time compatible intervals.
* **Huffman Coding**: Min-heap priority queue merges to build a prefix binary tree.

### Module 4: Grafi e Cammini Minimi
* **BFS & DFS Visits**: Explores adjacency list using FIFO queues or LIFO stacks.
* **Dijkstra**: Single-source shortest path relaxation (weights non-negative).
* **Bellman-Ford**: Negative weight edge relaxation and cycle check.
* **Prim's MST**: Spanning tree cut selections.
