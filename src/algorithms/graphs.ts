import { AlgorithmSnapshot, AlgorithmDefinition, VisualGraphNode, VisualGraphEdge } from './types';

// Standard 5-node graph coordinates for visual rendering
const defaultNodes = (): VisualGraphNode[] => [
  { id: 'A', label: 'A', x: 275, y: 60, status: 'idle' },
  { id: 'B', label: 'B', x: 120, y: 160, status: 'idle' },
  { id: 'C', label: 'C', x: 430, y: 160, status: 'idle' },
  { id: 'D', label: 'D', x: 160, y: 280, status: 'idle' },
  { id: 'E', label: 'E', x: 390, y: 280, status: 'idle' }
];

const defaultEdges = (): VisualGraphEdge[] => [
  { from: 'A', to: 'B', weight: 4, status: 'idle' },
  { from: 'A', to: 'C', weight: 2, status: 'idle' },
  { from: 'B', to: 'C', weight: 1, status: 'idle' },
  { from: 'B', to: 'D', weight: 5, status: 'idle' },
  { from: 'C', to: 'D', weight: 8, status: 'idle' },
  { from: 'C', to: 'E', weight: 10, status: 'idle' },
  { from: 'D', to: 'E', weight: 2, status: 'idle' }
];

// ==========================================
// 1. BFS / DFS Graph Visits
// ==========================================
export const bfsDfsDefinition: AlgorithmDefinition = {
  id: 'bfsdfs',
  name: 'Visite: BFS & DFS',
  module: 'Grafi e Cammini Minimi',
  description: 'Visita sistematica dei nodi di un grafo. La visita in ampiezza (BFS) esplora i nodi a livelli concentrici tramite una Coda (FIFO), mentre la visita in profondità (DFS) si spinge lungo i rami tramite uno Stack (LIFO).',
  complexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
    space: 'O(V)'
  },
  variants: [
    {
      name: 'Breadth-First Search (BFS)',
      description: 'Trova sempre i cammini minimi in termini di numero di archi su grafi non pesati.'
    },
    {
      name: 'Depth-First Search (DFS)',
      description: 'Utile per rilevare cicli, ordinamento topologico o componenti fortemente connesse.'
    }
  ],
  pseudocode: [
    'procedure visit(Graph, startNode, isBFS)',
    '    frontier = [startNode]',
    '    visited = {startNode}',
    '    while frontier is not empty',
    '        curr = isBFS ? frontier.popFirst() : frontier.popLast()',
    '        visit curr',
    '        for each neighbor w of curr',
    '            if w is not visited',
    '                frontier.push(w)',
    '                visited.add(w)'
  ]
};

export function generateBfsDfsSnapshots(isBFS: boolean = true): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  const nodes = defaultNodes();
  const edges = defaultEdges();

  // Adjacency list
  const adj: Record<string, string[]> = {
    A: ['B', 'C'],
    B: ['A', 'C', 'D'],
    C: ['A', 'B', 'D', 'E'],
    D: ['B', 'C', 'E'],
    E: ['C', 'D']
  };

  const frontier: string[] = ['A'];
  const visited = new Set<string>(['A']);

  const addSnapshot = (
    codeLine: number,
    description: string,
    activeNodeId: string | null = null,
    variables: Record<string, any> = {}
  ) => {
    // Clone nodes and map status
    const stepNodes = nodes.map(n => {
      let status = n.status;
      if (n.id === activeNodeId) status = 'active';
      else if (frontier.includes(n.id)) status = 'visited'; // Frontier nodes highlighted as visited/reached
      else if (visited.has(n.id)) status = 'path'; // Visited nodes in final status
      return { ...n, status };
    });

    // Color edges in the frontier
    const stepEdges = edges.map(e => {
      let status = e.status;
      if (activeNodeId && (e.from === activeNodeId || e.to === activeNodeId) && (frontier.includes(e.from) || frontier.includes(e.to))) {
        status = 'active';
      }
      return { ...e, status };
    });

    snapshots.push({
      nodes: stepNodes,
      edges: stepEdges,
      codeLine,
      description,
      variables: {
        Frontiera: `[${frontier.join(', ')}]`,
        Visitati: `{${Array.from(visited).join(', ')}}`,
        Struttura: isBFS ? 'Coda (FIFO)' : 'Stack (LIFO)',
        ...variables
      }
    });
  };

  addSnapshot(1, `Inizio visita (${isBFS ? 'BFS' : 'DFS'}). Inseriamo il nodo sorgente A nella frontiera.`, null);

  while (frontier.length > 0) {
    const curr = isBFS ? frontier.shift()! : frontier.pop()!;
    
    // Update labels to show visited state
    const nodeObj = nodes.find(n => n.id === curr)!;
    nodeObj.status = 'path'; // Visited permanently

    addSnapshot(
      4,
      `Estraiamo il nodo ${curr} dalla frontiera per visitarlo. Esploriamo i suoi vicini non visitati.`,
      curr,
      { "Nodo Corrente": curr }
    );

    const neighbors = adj[curr] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        frontier.push(neighbor);

        addSnapshot(
          7,
          `Trovato vicino ${neighbor} non ancora visitato. Lo aggiungiamo alla frontiera.`,
          curr,
          { "Nodo Corrente": curr, "Scoperto": neighbor }
        );
      }
    }
  }

  addSnapshot(10, `Visita completata con successo. Tutti i nodi raggiungibili da A sono stati esplorati.`, null);

  return snapshots;
}

// ==========================================
// 2. Dijkstra (Shortest Path)
// ==========================================
export const dijkstraDefinition: AlgorithmDefinition = {
  id: 'dijkstra',
  name: 'Shortest Path: Dijkstra',
  module: 'Grafi e Cammini Minimi',
  description: 'Trova i cammini minimi da una sorgente singola su grafi con pesi non negativi. Mantiene un insieme di distanze stimate dist[v] e rilassa ripetutamente gli archi uscenti dal nodo con distanza minima.',
  complexity: {
    best: 'O((V + E) log V)',
    average: 'O((V + E) log V)',
    worst: 'O(V²)',
    space: 'O(V)'
  },
  variants: [
    {
      name: 'Dijkstra con Coda a Priorità',
      description: 'L\'uso di un Min-Heap riduce la selezione del minimo da O(V) a O(log V), ideale per grafi sparsi.'
    }
  ],
  pseudocode: [
    'procedure dijkstra(Graph, source)',
    '    dist[source] = 0',
    '    for each node v do dist[v] = infinity',
    '    Q = PriorityQueue(nodes ordered by dist)',
    '    while Q is not empty',
    '        u = extractMin(Q)',
    '        for each neighbor v of u',
    '            alt = dist[u] + weight(u, v)',
    '            if alt < dist[v]',
    '                dist[v] = alt',
    '                update Q'
  ]
};

export function generateDijkstraSnapshots(): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  const nodes = defaultNodes();
  const edges = defaultEdges();

  // Adjacency matrix representation for distance updates
  const adjList = [
    { from: 'A', to: 'B', w: 4 },
    { from: 'A', to: 'C', w: 2 },
    { from: 'B', to: 'C', w: 1 },
    { from: 'B', to: 'D', w: 5 },
    { from: 'C', to: 'D', w: 8 },
    { from: 'C', to: 'E', w: 10 },
    { from: 'D', to: 'E', w: 2 }
  ];

  const dist: Record<string, number> = { A: 0, B: Infinity, C: Infinity, D: Infinity, E: Infinity };
  const parent: Record<string, string | null> = { A: null, B: null, C: null, D: null, E: null };
  const visited = new Set<string>();

  const getDistString = () => {
    return Object.entries(dist)
      .map(([node, d]) => `${node}:${d === Infinity ? '∞' : d}`)
      .join(', ');
  };

  const addSnapshot = (
    codeLine: number,
    description: string,
    activeNodeId: string | null = null,
    activeEdge: { from: string; to: string } | null = null,
    variables: Record<string, any> = {}
  ) => {
    const stepNodes = nodes.map(n => {
      let status = n.status;
      if (n.id === activeNodeId) status = 'active';
      else if (visited.has(n.id)) status = 'path'; // Visited nodes highlighted in final green/emerald path
      else if (dist[n.id] < Infinity) status = 'visited'; // Reached but not closed
      
      const label = `${n.id}:${dist[n.id] === Infinity ? '∞' : dist[n.id]}`;
      return { ...n, status, label };
    });

    const stepEdges = edges.map(e => {
      let status = e.status;
      if (activeEdge && ((e.from === activeEdge.from && e.to === activeEdge.to) || (e.from === activeEdge.to && e.to === activeEdge.from))) {
        status = 'active';
      } else if (parent[e.to] === e.from || parent[e.from] === e.to) {
        status = 'path'; // Part of the shortest path tree
      }
      return { ...e, status };
    });

    snapshots.push({
      nodes: stepNodes,
      edges: stepEdges,
      codeLine,
      description,
      variables: {
        Distanze: getDistString(),
        Coda: Array.from(nodes.map(n => n.id).filter(id => !visited.has(id)))
          .sort((a, b) => dist[a] - dist[b])
          .map(id => `${id}(${dist[id] === Infinity ? '∞' : dist[id]})`)
          .join(', '),
        ...variables
      }
    });
  };

  addSnapshot(1, "Inizializzazione: impostiamo la distanza sorgente dist[A] = 0 e dist[altri] = ∞.", null);

  while (visited.size < nodes.length) {
    // Extract min distance node
    let u: string | null = null;
    let minD = Infinity;
    for (const node of nodes) {
      if (!visited.has(node.id) && dist[node.id] < minD) {
        minD = dist[node.id];
        u = node.id;
      }
    }

    if (u === null) break; // Remaining unvisited nodes are unreachable

    visited.add(u);
    addSnapshot(
      5,
      `Estraiamo il nodo ${u} con distanza minima dist[${u}] = ${dist[u]}. Lo chiudiamo e iniziamo ad esplorare i vicini.`,
      u,
      null,
      { "Nodo Chiuso": u }
    );

    // Find neighbors of u
    const neighbors = adjList.filter(e => e.from === u || e.to === u);
    for (const edge of neighbors) {
      const v = edge.from === u ? edge.to : edge.from;
      if (visited.has(v)) continue; // Already settled

      const alt = dist[u] + edge.w;
      
      addSnapshot(
        7,
        `Esaminiamo l'arco (${u}, ${v}) con peso ${edge.w}. Verifichiamo se dist[${u}] (${dist[u]}) + peso (${edge.w}) = ${alt} < dist[${v}] (${dist[v] === Infinity ? '∞' : dist[v]}).`,
        u,
        { from: u, to: v },
        { "Rilassamento": `arco (${u}, ${v})` }
      );

      if (alt < dist[v]) {
        dist[v] = alt;
        parent[v] = u;
        addSnapshot(
          9,
          `Aggiornamento: trovato cammino più breve per ${v}! Nuova distanza dist[${v}] = ${alt}, nodo precedente parent[${v}] = ${u}.`,
          u,
          { from: u, to: v },
          { "Rilassamento": `arco (${u}, ${v})`, "Nuova Dist": `${v}:${alt}` }
        );
      }
    }
  }

  addSnapshot(11, `Dijkstra terminato. Calcolati tutti i cammini minimi dalla sorgente A.`, null);

  return snapshots;
}

// ==========================================
// 3. Bellman-Ford (Shortest Path with negative weights)
// ==========================================
export const bellmanFordDefinition: AlgorithmDefinition = {
  id: 'bellmanford',
  name: 'Shortest Path: Bellman-Ford',
  module: 'Grafi e Cammini Minimi',
  description: 'Risolve il problema dei cammini minimi a sorgente singola anche su grafi con pesi negativi. Esegue |V|-1 iterazioni di rilassamento per tutti gli archi del grafo, e rileva cicli negativi.',
  complexity: {
    best: 'O(E)',
    average: 'O(V × E)',
    worst: 'O(V × E)',
    space: 'O(V)'
  },
  variants: [
    {
      name: 'Rilevamento Cicli Negativi',
      description: 'Esegue un\'ulteriore passata di rilassamento alla fine; se le distanze cambiano, significa che c\'è un ciclo di costo negativo.'
    }
  ],
  pseudocode: [
    'procedure bellmanFord(Graph, edges, source)',
    '    dist[source] = 0',
    '    for each node v do dist[v] = infinity',
    '    for i = 1 to |V| - 1',
    '        for each edge (u, v) with weight w',
    '            if dist[u] + w < dist[v]',
    '                dist[v] = dist[u] + w',
    '    for each edge (u, v) with weight w',
    '        if dist[u] + w < dist[v] then error "Negative cycle"'
  ]
};

export function generateBellmanFordSnapshots(): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  const nodes = defaultNodes();
  const edges = defaultEdges();

  // For Bellman-Ford, let's inject a negative weight on edge B-D to show its capability!
  const bfEdges = defaultEdges();
  bfEdges.find(e => e.from === 'B' && e.to === 'D')!.weight = -2; // B-D weight is -2

  const dist: Record<string, number> = { A: 0, B: Infinity, C: Infinity, D: Infinity, E: Infinity };
  const parent: Record<string, string | null> = { A: null, B: null, C: null, D: null, E: null };

  const getDistString = () => {
    return Object.entries(dist)
      .map(([node, d]) => `${node}:${d === Infinity ? '∞' : d}`)
      .join(', ');
  };

  const addSnapshot = (
    codeLine: number,
    description: string,
    activeEdge: { from: string; to: string } | null = null,
    variables: Record<string, any> = {}
  ) => {
    const stepNodes = nodes.map(n => {
      let status = n.status;
      if (activeEdge && (n.id === activeEdge.from || n.id === activeEdge.to)) status = 'active';
      else if (dist[n.id] < Infinity) status = 'visited';
      const label = `${n.id}:${dist[n.id] === Infinity ? '∞' : dist[n.id]}`;
      return { ...n, status, label };
    });

    const stepEdges = bfEdges.map(e => {
      let status = e.status;
      if (activeEdge && ((e.from === activeEdge.from && e.to === activeEdge.to) || (e.from === activeEdge.to && e.to === activeEdge.from))) {
        status = 'active';
      } else if (parent[e.to] === e.from || parent[e.from] === e.to) {
        status = 'path';
      }
      return { ...e, status };
    });

    snapshots.push({
      nodes: stepNodes,
      edges: stepEdges,
      codeLine,
      description,
      variables: {
        Distanze: getDistString(),
        ...variables
      }
    });
  };

  addSnapshot(1, "Inizializzazione: dist[A] = 0 e dist[altri] = ∞. Inietteremo un peso negativo -2 sull'arco B-D.", null);

  const V = nodes.length;

  for (let i = 1; i <= V - 1; i++) {
    addSnapshot(3, `Inizio iterazione di rilassamento ${i} di ${V - 1}. Rilasseremo tutti gli archi del grafo.`, null, { iterazione: i });

    for (const edge of bfEdges) {
      const u = edge.from;
      const v = edge.to;
      const w = edge.weight;

      // Relax forward (directed representation for simulation simplicity)
      if (dist[u] < Infinity && dist[u] + w < dist[v]) {
        const prevDist = dist[v];
        dist[v] = dist[u] + w;
        parent[v] = u;
        addSnapshot(
          5,
          `Iterazione ${i}: Rilassamento arco (${u}, ${v}) peso ${w}. Trovato valore minore: dist[${u}] (${dist[u]}) + peso (${w}) = ${dist[v]} < dist[${v}] (${prevDist === Infinity ? '∞' : prevDist}). Aggiornato.`,
          { from: u, to: v },
          { iterazione: i, "Aggiornato": `${v}:${dist[v]}` }
        );
      } else {
        addSnapshot(
          4,
          `Iterazione ${i}: Controllo arco (${u}, ${v}) peso ${w}. Nessun miglioramento (dist[${u}] (${dist[u] === Infinity ? '∞' : dist[u]}) + peso (${w}) >= dist[${v}] (${dist[v] === Infinity ? '∞' : dist[v]})).`,
          { from: u, to: v },
          { iterazione: i }
        );
      }
    }
  }

  // Check for negative cycles
  addSnapshot(7, "Controllo cicli negativi: eseguiamo una passata finale per verificare la presenza di cicli di costo negativo.", null);
  let negativeCycle = false;

  for (const edge of bfEdges) {
    const u = edge.from;
    const v = edge.to;
    const w = edge.weight;

    if (dist[u] < Infinity && dist[u] + w < dist[v]) {
      negativeCycle = true;
      addSnapshot(
        8,
        `CICLO NEGATIVO RILEVATO! L'arco (${u}, ${v}) permette ancora di diminuire la distanza. Il grafo contiene un ciclo di costo negativo.`,
        { from: u, to: v },
        { ciclo_negativo: true }
      );
      break;
    }
  }

  if (!negativeCycle) {
    addSnapshot(9, "Nessun ciclo negativo rilevato. Distanze ottimali calcolate con successo.", null);
  }

  return snapshots;
}

// ==========================================
// 4. Minimum Spanning Tree (MST - Prim's Algorithm)
// ==========================================
export const mstDefinition: AlgorithmDefinition = {
  id: 'mst',
  name: 'Minimum Spanning Tree (Prim)',
  module: 'Grafi e Cammini Minimi',
  description: 'Trova l\'albero ricoprente minimo (MST) di un grafo pesato e connesso. Espande gradualmente l\'albero a partire da un nodo sorgente aggiungendo ad ogni passo l\'arco di costo minimo che collega un nodo dell\'albero a un nodo esterno.',
  complexity: {
    best: 'O(E log V)',
    average: 'O(E log V)',
    worst: 'O(V²)',
    space: 'O(V)'
  },
  variants: [
    {
      name: 'Algoritmo di Prim',
      description: 'Cresce un singolo albero a partire da un nodo. Veloce su grafi densi.'
    },
    {
      name: 'Algoritmo di Kruskal',
      description: 'Ordina gli archi e aggiunge gradualmente l\'arco più corto senza chiudere cicli, usando una struttura dati Disjoint-Set (Union-Find).'
    }
  ],
  pseudocode: [
    'procedure prim(Graph, startNode)',
    '    MST = {}',
    '    visited = {startNode}',
    '    while visited does not contain all nodes',
    '        find cheaper edge (u, v) with u in visited and v not in visited',
    '        add (u, v) to MST',
    '        add v to visited',
    '    return MST'
  ]
};

export function generateMstSnapshots(): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  const nodes = defaultNodes();
  const edges = defaultEdges();

  const visited = new Set<string>(['A']);
  const mstEdges: Array<{ from: string; to: string }> = [];

  const addSnapshot = (
    codeLine: number,
    description: string,
    activeEdge: { from: string; to: string } | null = null,
    variables: Record<string, any> = {}
  ) => {
    const stepNodes = nodes.map(n => {
      let status = n.status;
      if (visited.has(n.id)) status = 'path'; // Inside the MST nodes
      return { ...n, status };
    });

    const stepEdges = edges.map(e => {
      let status = e.status;
      const isMst = mstEdges.some(m => (m.from === e.from && m.to === e.to) || (m.from === e.to && m.to === e.from));
      const isActive = activeEdge && ((e.from === activeEdge.from && e.to === activeEdge.to) || (e.from === activeEdge.to && e.to === activeEdge.from));

      if (isMst) status = 'path'; // Green emerald for MST edges
      else if (isActive) status = 'active'; // Pink highlights for evaluating edge

      return { ...e, status };
    });

    snapshots.push({
      nodes: stepNodes,
      edges: stepEdges,
      codeLine,
      description,
      variables: {
        "Nodi MST": `{${Array.from(visited).join(', ')}}`,
        "Archi MST": mstEdges.map(m => `(${m.from}-${m.to})`).join(', '),
        ...variables
      }
    });
  };

  addSnapshot(1, "Inizio Algoritmo di Prim. Inseriamo il nodo sorgente A nell'albero MST.", null);

  while (visited.size < nodes.length) {
    let minW = Infinity;
    let selectedEdge: { from: string; to: string } | null = null;
    let nextNode: string | null = null;

    // Evaluate all edges outgoing from the current tree to unvisited nodes
    for (const edge of edges) {
      const inFrom = visited.has(edge.from);
      const inTo = visited.has(edge.to);

      // XOR: one node in tree, one node outside
      if ((inFrom && !inTo) || (!inFrom && inTo)) {
        if (edge.weight < minW) {
          minW = edge.weight;
          selectedEdge = { from: edge.from, to: edge.to };
          nextNode = inFrom ? edge.to : edge.from;
        }
      }
    }

    if (!selectedEdge || !nextNode) break; // Graph is disconnected

    addSnapshot(
      4,
      `Trovato arco minimo uscente dal taglio: (${selectedEdge.from}, ${selectedEdge.to}) con peso = ${minW}.`,
      selectedEdge,
      { arco_candidato: `(${selectedEdge.from}-${selectedEdge.to})`, peso: minW }
    );

    mstEdges.push(selectedEdge);
    visited.add(nextNode);

    addSnapshot(
      5,
      `Aggiungiamo l'arco (${selectedEdge.from}, ${selectedEdge.to}) all'albero MST ed espandiamo il taglio includendo il nodo ${nextNode}.`,
      null,
      { "Nodo Aggiunto": nextNode }
    );
  }

  addSnapshot(7, `Algoritmo di Prim completato. Trovato l'albero ricoprente minimo. Peso totale = ${mstEdges.reduce((acc, m) => {
    const e = edges.find(edge => (edge.from === m.from && edge.to === m.to) || (edge.from === m.to && edge.to === m.from))!;
    return acc + e.weight;
  }, 0)}.`, null);

  return snapshots;
}
