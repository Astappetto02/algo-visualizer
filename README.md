# Algo Visualizer

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat-square)](https://astappetto02.github.io/algo-visualizer/)

A web-based interactive tool for visualizing computer science algorithms, built for students studying Algorithm Design and Analysis. 

The application provides step-by-step visualizations of data structures and algorithms, helping users understand how they work under the hood.

## Features

- **13 Algorithms Supported**: Covers major paradigms including Divide & Conquer, Dynamic Programming, Greedy, and Graphs.
- **Dynamic Renderings**: Different layout engines for different algorithm types:
  - Bar charts and recursion trees (sorting, binary search)
  - 2D DP matrices (Fibonacci, Knapsack, Sequence Alignment)
  - Node graphs (BFS, DFS, Dijkstra, Bellman-Ford, Prim)
  - Gantt charts (Interval Scheduling)
  - Binary trees (Huffman Coding)
- **Execution Controls**: Play, pause, step forward/backward, and adjust playback speed.
- **State Inspector**: Real-time tracking of pseudocode execution and local variables.
- **Complexity Analysis**: Big-O bounds and theoretical notes for each algorithm.

## Stack

- React 19 / Next.js 16
- Tailwind CSS
- Framer Motion
- TypeScript

## Local Development

### Setup

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Astappetto02/algo-visualizer.git
cd algo-visualizer
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Covered Algorithms

- **Divide & Conquer**: Binary Search, MergeSort, QuickSort
- **Dynamic Programming**: Fibonacci, Weighted Interval Scheduling, Sequence Alignment, 0/1 Knapsack
- **Greedy**: Interval Scheduling, Huffman Coding
- **Graphs**: BFS, DFS, Dijkstra, Bellman-Ford, Prim
