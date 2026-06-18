import { AlgorithmSnapshot, AlgorithmDefinition, VisualInterval, VisualTreeNode } from './types';

// ==========================================
// 1. Interval Scheduling (Non Pesato)
// ==========================================
export const intervalSchedulingDefinition: AlgorithmDefinition = {
  id: 'intervalscheduling',
  name: 'Interval Scheduling (Greedy)',
  module: 'Algoritmi Greedy',
  description: 'Seleziona il sottoinsieme di cardinalità massima di intervalli mutuamente compatibili. La scelta ottima locale (greedy) consiste nel selezionare ad ogni passo l\'intervallo compatibile con il tempo di fine minimo.',
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)'
  },
  variants: [
    {
      name: 'Criterio Earliest End Time',
      description: 'L\'unico criterio greedy che garantisce la soluzione ottima globale, dimostrato tramite l\'argomento "Greedy Stays Ahead".'
    },
    {
      name: 'Altri criteri (Sub-Ottimi)',
      description: 'Criteri basati su: minor durata, minor numero di sovrapposizioni o tempo di inizio minimo. Tutti questi portano a soluzioni sub-ottime.'
    }
  ],
  pseudocode: [
    'procedure intervalScheduling(intervals)',
    '    sort intervals by end time',
    '    solution = []',
    '    last_end_time = 0',
    '    for each interval j',
    '        if j.start >= last_end_time',
    '            solution.push(j)',
    '            last_end_time = j.end',
    '    return solution'
  ]
};

export function generateIntervalSchedulingSnapshots(
  customIntervals?: { start: number; end: number }[]
): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  
  // Set of intervals
  let srcIntervals = [
    { id: 'I1', start: 1, end: 3, status: 'standard' as const },
    { id: 'I2', start: 2, end: 5, status: 'standard' as const },
    { id: 'I3', start: 3, end: 6, status: 'standard' as const },
    { id: 'I4', start: 5, end: 7, status: 'standard' as const },
    { id: 'I5', start: 6, end: 8, status: 'standard' as const },
    { id: 'I6', start: 7, end: 9, status: 'standard' as const }
  ];

  if (customIntervals && customIntervals.length > 0) {
    srcIntervals = customIntervals
      .map((inv, idx) => ({
        id: `I${idx + 1}`,
        start: inv.start,
        end: inv.end,
        status: 'standard' as const
      }))
      .sort((a, b) => a.end - b.end);
  }


  const intervalsState = (): VisualInterval[] => srcIntervals.map(inv => ({ ...inv }));

  const addSnapshot = (
    codeLine: number,
    description: string,
    intervals: VisualInterval[],
    variables: Record<string, any> = {}
  ) => {
    snapshots.push({
      intervals: [...intervals],
      codeLine,
      description,
      variables: {
        last_end_time: null,
        ...variables
      }
    });
  };

  const currentList = intervalsState();

  addSnapshot(0, "Inizializzazione: ordiniamo gli intervalli per tempo di fine crescente.", currentList, {});
  addSnapshot(2, "Inizializziamo il vettore delle soluzioni vuoto e impostiamo last_end_time = 0.", currentList, { last_end_time: 0 });

  let lastEndTime = 0;
  const solution: string[] = [];

  for (let j = 0; j < srcIntervals.length; j++) {
    const current = currentList[j];
    current.status = 'checking';
    
    addSnapshot(
      4,
      `Esaminiamo l'intervallo ${current.id}. Verifichiamo se il tempo di inizio (${current.start}) >= last_end_time (${lastEndTime}).`,
      [...currentList],
      { last_end_time: lastEndTime, esaminato: current.id }
    );

    if (current.start >= lastEndTime) {
      solution.push(current.id);
      current.status = 'selected';
      lastEndTime = current.end;
      
      addSnapshot(
        6,
        `Intervallo ${current.id} compatibile! Aggiunto alla soluzione. Aggiorniamo last_end_time = ${lastEndTime}.`,
        [...currentList],
        { last_end_time: lastEndTime, soluzione: solution.join(', ') }
      );
    } else {
      current.status = 'rejected';
      addSnapshot(
        4,
        `Intervallo ${current.id} incompatibile (si sovrappone perché start ${current.start} < last_end_time ${lastEndTime}). Viene scartato.`,
        [...currentList],
        { last_end_time: lastEndTime, soluzione: solution.join(', ') }
      );
    }
  }

  addSnapshot(8, `Algoritmo Greedy terminato. Numero massimo di intervalli compatibili = ${solution.length}. Intervalli selezionati: ${solution.join(', ')}.`, currentList, { soluzione: solution.join(', '), last_end_time: lastEndTime });

  return snapshots;
}

// ==========================================
// 2. Codifica di Huffman
// ==========================================
export const huffmanDefinition: AlgorithmDefinition = {
  id: 'huffman',
  name: 'Codifica di Huffman',
  module: 'Algoritmi Greedy',
  description: 'Un algoritmo greedy per la compressione dati senza perdita. Costruisce un albero binario a prefisso ottimo (albero di Huffman) basato sulle frequenze dei caratteri dell\'alfabeto.',
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)'
  },
  variants: [
    {
      name: 'Codifica Statica',
      description: 'Richiede la scansione preventiva del testo per contare le frequenze prima di costruire l\'albero.'
    },
    {
      name: 'Codifica Adattiva',
      description: 'Costruisce l\'albero dinamicamente man mano che il testo viene letto, senza scansioni preliminari.'
    }
  ],
  pseudocode: [
    'procedure huffman(Alphabet, Freq)',
    '    n = Alphabet.length',
    '    Q = PriorityQueue(Alphabet ordered by Freq)',
    '    for i = 1 to n - 1',
    '        create node z',
    '        z.left = x = extractMin(Q)',
    '        z.right = y = extractMin(Q)',
    '        z.freq = x.freq + y.freq',
    '        insert(Q, z)',
    '    return extractMin(Q)'
  ]
};

export function generateHuffmanSnapshots(customText?: string): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  
  let initialNodes: Array<{ id: string; label: string; freq: number }> = [];

  if (customText && customText.trim().length > 0) {
    // Compute frequencies
    const text = customText.trim().toUpperCase();
    const freqMap: Record<string, number> = {};
    for (const char of text) {
      if (char !== ' ') {
        freqMap[char] = (freqMap[char] || 0) + 1;
      }
    }
    initialNodes = Object.keys(freqMap).map(char => ({
      id: char,
      label: `${char}:${freqMap[char]}`,
      freq: freqMap[char]
    }));
  } else {
    // Starting alphabet
    initialNodes = [
      { id: 'A', label: 'A:45', freq: 45 },
      { id: 'B', label: 'B:13', freq: 13 },
      { id: 'C', label: 'C:12', freq: 12 },
      { id: 'D', label: 'D:16', freq: 16 },
      { id: 'E', label: 'E:9', freq: 9 },
      { id: 'F', label: 'F:5', freq: 5 }
    ];
  }


  // Helper to compute node layout positions dynamically based on connections
  // We represent the tree as a flat array of nodes with coordinates
  const allNodes: VisualTreeNode[] = [];
  
  const addSnapshot = (
    codeLine: number,
    description: string,
    queueIds: string[],
    variables: Record<string, any> = {}
  ) => {
    // Recompute coordinate offsets for the forest of trees
    const layoutNodes = layoutForest(allNodes);
    snapshots.push({
      huffmanNodes: layoutNodes,
      codeLine,
      description,
      variables: {
        "Coda di Priorità (Q)": queueIds.join(', '),
        ...variables
      }
    });
  };

  // 1. Initialize leaf nodes in forest
  initialNodes.forEach((node, idx) => {
    allNodes.push({
      id: node.id,
      label: node.label,
      freq: node.freq,
      x: 50 + idx * 80,
      y: 300
    });
  });

  let activeQueue = [...initialNodes].sort((a, b) => a.freq - b.freq);
  addSnapshot(2, "Inizializzazione. Creiamo un nodo foglia per ogni carattere e lo inseriamo nella coda di priorità Q ordinata per frequenza.", activeQueue.map(q => `${q.id}(${q.freq})`));

  let uniqueIdCounter = 1;

  while (activeQueue.length > 1) {
    // Extract two minimums
    const x = activeQueue.shift()!;
    const y = activeQueue.shift()!;
    
    // Create new parent node
    const parentId = `z${uniqueIdCounter++}`;
    const parentFreq = x.freq + y.freq;
    const parentLabel = `${parentFreq}`;

    // Update parent-child connections in our coordinate layout database
    const childX = allNodes.find(n => n.id === x.id)!;
    const childY = allNodes.find(n => n.id === y.id)!;
    
    childX.parentId = parentId;
    childX.isLeft = true;
    childY.parentId = parentId;
    childY.isLeft = false;

    const parentNode: VisualTreeNode = {
      id: parentId,
      label: parentLabel,
      freq: parentFreq,
      x: (childX.x + childY.x) / 2,
      y: Math.min(childX.y, childY.y) - 50
    };
    allNodes.push(parentNode);

    // Add parent to queue and sort
    const queueObj = { id: parentId, label: parentLabel, freq: parentFreq };
    activeQueue.push(queueObj);
    activeQueue.sort((a, b) => a.freq - b.freq);

    addSnapshot(
      5,
      `Estraiamo i due nodi con frequenza minima: ${x.id} (${x.freq}) e ${y.id} (${y.freq}). Creiamo il nodo padre con frequenza combinata = ${parentFreq} e lo reinseriamo in Q.`,
      activeQueue.map(q => `${q.id}(${q.freq})`),
      { estratto_x: x.id, estratto_y: y.id, nuovo_padre: parentId }
    );
  }

  addSnapshot(9, `Costruzione dell'albero di Huffman completata. L'unico nodo rimasto nella coda è la radice dell'albero (${activeQueue[0].id}).`, activeQueue.map(q => `${q.id}(${q.freq})`));

  return snapshots;
}

// Layout coordinate computer for binary tree rendering
function layoutForest(nodes: VisualTreeNode[]): VisualTreeNode[] {
  // Deep copy nodes list
  const list: VisualTreeNode[] = JSON.parse(JSON.stringify(nodes));
  
  // Find roots (nodes with no parent)
  const roots = list.filter(n => !n.parentId);
  
  // Arrange roots spread out horizontally
  const screenWidth = Math.max(550, list.length * 35);
  roots.forEach((root, idx) => {
    const rootX = ((idx + 1) * screenWidth) / (roots.length + 1);
    root.x = rootX;
    root.y = 80;
    
    // Recursively layout children
    positionChildren(list, root.id, rootX, 80, screenWidth / (roots.length * 2));
  });

  return list;
}

function positionChildren(list: VisualTreeNode[], parentId: string, parentX: number, parentY: number, offset: number) {
  const children = list.filter(n => n.parentId === parentId);
  const left = children.find(c => c.isLeft);
  const right = children.find(c => !c.isLeft);

  if (left) {
    left.x = parentX - offset;
    left.y = parentY + 60;
    positionChildren(list, left.id, left.x, left.y, offset * 0.5);
  }

  if (right) {
    right.x = parentX + offset;
    right.y = parentY + 60;
    positionChildren(list, right.id, right.x, right.y, offset * 0.5);
  }
}
