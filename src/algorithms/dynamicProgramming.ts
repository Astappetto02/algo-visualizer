import { AlgorithmSnapshot, AlgorithmDefinition, VisualInterval } from './types';

// ==========================================
// 1. Fibonacci Algorithm
// ==========================================
export const fibonacciDefinition: AlgorithmDefinition = {
  id: 'fibonacci',
  name: 'Fibonacci (DP Bottom-up)',
  module: 'Programmazione Dinamica',
  description: 'Calcola l\'n-esimo numero di Fibonacci utilizzando l\'approccio Bottom-Up (Tabulazione). Memorizza i risultati dei sotto-problemi in un array per evitare ricalcoli inutili, riducendo la complessità da O(2ⁿ) a O(n).',
  complexity: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(n) o O(1)'
  },
  variants: [
    {
      name: 'Ricorsivo Semplice',
      description: 'Lentezza esponenziale O(2ⁿ) dovuta al ricalcolo continuo degli stessi rami.'
    },
    {
      name: 'Top-Down con Memoization',
      description: 'Mantiene la ricorsione ma salva i risultati intermedi in un dizionario/array.'
    },
    {
      name: 'Bottom-Up Iterativo',
      description: 'Popola una tabella (tabulation) in modo lineare partendo dai casi base F(0) e F(1).'
    }
  ],
  pseudocode: [
    'procedure fibonacci(n)',
    '    if n <= 1 then return n',
    '    create array F of size n + 1',
    '    F[0] = 0',
    '    F[1] = 1',
    '    for i = 2 to n',
    '        F[i] = F[i-1] + F[i-2]',
    '    return F[n]'
  ]
};

export function generateFibonacciSnapshots(n: number = 8): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  const F: number[] = Array(n + 1).fill(0);
  
  const addSnapshot = (
    codeLine: number,
    description: string,
    activeCol: number | null,
    variables: Record<string, any> = {}
  ) => {
    snapshots.push({
      grid: [F], // Represent F as a 1-row matrix for Grid Visualizer
      rowLabels: ['F[i]'],
      colLabels: Array.from({ length: n + 1 }, (_, idx) => `i=${idx}`),
      activeRow: 0,
      activeCol,
      codeLine,
      description,
      variables: {
        n,
        i: null,
        ...variables
      }
    });
  };

  addSnapshot(1, `Inizio calcolo Fibonacci per n = ${n}. Controlliamo casi base.`, null);
  
  if (n >= 0) F[0] = 0;
  addSnapshot(3, "Impostiamo il caso base F[0] = 0.", 0);
  
  if (n >= 1) {
    F[1] = 1;
    addSnapshot(4, "Impostiamo il caso base F[1] = 1.", 1);
  }

  for (let i = 2; i <= n; i++) {
    addSnapshot(5, `Eseguiamo il ciclo per i = ${i}. Calcoliamo F[${i}] = F[${i-1}] + F[${i-2}].`, i, { i });
    F[i] = F[i - 1] + F[i - 2];
    addSnapshot(6, `Calcolato F[${i}] = F[${i-1}] (${F[i-1]}) + F[${i-2}] (${F[i-2]}) = ${F[i]}.`, i, { i });
  }

  addSnapshot(7, `Fibonacci(${n}) terminato. Il risultato finale è ${F[n]}.`, n, { risultato: F[n] });
  return snapshots;
}

// ==========================================
// 2. Weighted Interval Scheduling
// ==========================================
export const weightedIntervalsDefinition: AlgorithmDefinition = {
  id: 'weightedintervals',
  name: 'Weighted Interval Scheduling',
  module: 'Programmazione Dinamica',
  description: 'Trova il sottoinsieme di intervalli non sovrapposti che massimizza il peso totale. Calcola il vettore dei valori ottimali M[j] e ricostruisce la soluzione ottimale tramite backtracking.',
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)'
  },
  variants: [
    {
      name: 'Ricorsivo Esponenziale',
      description: 'Tempo pessimo O(2ⁿ) a causa dei calcoli ridondanti di sotto-intervalli sovrapposti.'
    },
    {
      name: 'DP Bottom-Up',
      description: 'Ordina gli intervalli per tempo di fine e popola linearmente la tabella M[j] in tempo O(n log n).'
    }
  ],
  pseudocode: [
    'procedure weightedIntervals(intervals)',
    '    sort intervals by end time',
    '    compute p[j] for each interval j',
    '    M[0] = 0',
    '    for j = 1 to n',
    '        M[j] = max(intervals[j].weight + M[p[j]], M[j-1])',
    '    solution = findSolution(n)'
  ]
};

export function generateWeightedIntervalsSnapshots(): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  
  // Static set of weighted intervals sorted by end time
  const srcIntervals = [
    { id: 'I1', start: 1, end: 4, weight: 3, status: 'standard' as const },
    { id: 'I2', start: 3, end: 5, weight: 2, status: 'standard' as const },
    { id: 'I3', start: 0, end: 6, weight: 4, status: 'standard' as const },
    { id: 'I4', start: 4, end: 7, weight: 4, status: 'standard' as const },
    { id: 'I5', start: 5, end: 9, weight: 6, status: 'standard' as const },
    { id: 'I6', start: 8, end: 10, weight: 3, status: 'standard' as const }
  ];

  const n = srcIntervals.length;
  // Compute p[j] (highest index i < j such that interval i is compatible with j)
  const p: number[] = Array(n + 1).fill(0); // 1-based indexing for intervals
  for (let j = 1; j <= n; j++) {
    const current = srcIntervals[j - 1];
    let maxCompatible = 0;
    for (let i = j - 1; i >= 1; i--) {
      const prev = srcIntervals[i - 1];
      if (prev.end <= current.start) {
        maxCompatible = i;
        break;
      }
    }
    p[j] = maxCompatible;
  }

  const M: number[] = Array(n + 1).fill(0);
  const intervalsState = (): VisualInterval[] => srcIntervals.map(inv => ({ ...inv }));

  const addSnapshot = (
    codeLine: number,
    description: string,
    activeCol: number | null,
    intervals: VisualInterval[],
    variables: Record<string, any> = {}
  ) => {
    snapshots.push({
      intervals,
      grid: [M],
      rowLabels: ['M[j]'],
      colLabels: Array.from({ length: n + 1 }, (_, idx) => `j=${idx}`),
      activeRow: 0,
      activeCol,
      codeLine,
      description,
      variables: {
        ...variables
      }
    });
  };

  addSnapshot(0, "Inizializzazione. Ordiniamo gli intervalli per tempo di fine crescente.", null, intervalsState(), {});
  addSnapshot(2, "Calcoliamo p[j]: il sotto-intervallo compatibile più vicino a sinistra.", null, intervalsState(), { "p[j]": `[${p.join(', ')}]` });

  M[0] = 0;
  addSnapshot(3, "Impostiamo il caso base M[0] = 0.", 0, intervalsState(), {});

  for (let j = 1; j <= n; j++) {
    const current = srcIntervals[j - 1];
    const prevM = M[j - 1];
    const compM = M[p[j]];
    const takeValue = current.weight + compM;
    
    // Highlight the active interval being examined
    const stepIntervals = intervalsState();
    stepIntervals[j - 1].status = 'checking';

    addSnapshot(
      4,
      `Passo j = ${j} (${current.id}): decidiamo se includerlo. Escludendolo: M[j-1]=${prevM}. Includendolo: peso(${current.weight}) + M[p[j]](${compM}) = ${takeValue}.`,
      j,
      stepIntervals,
      { j, val_excl: prevM, val_incl: takeValue, p_j: p[j] }
    );

    M[j] = Math.max(takeValue, prevM);
    
    const finalStepIntervals = intervalsState();
    finalStepIntervals[j - 1].status = takeValue >= prevM ? 'selected' : 'rejected';
    
    addSnapshot(
      5,
      `M[${j}] = max(${takeValue}, ${prevM}) = ${M[j]}.`,
      j,
      finalStepIntervals,
      { j, "M[j]": M[j] }
    );
  }

  // Backtracking to find optimal subset
  const selectedIds: string[] = [];
  let jBack = n;
  const backtrackIntervals = intervalsState();

  addSnapshot(6, "Iniziamo il backtracking da j = n per ricostruire il sottoinsieme ottimo di intervalli.", M.length - 1, backtrackIntervals, { j: jBack });

  while (jBack > 0) {
    const current = srcIntervals[jBack - 1];
    const compM = M[p[jBack]];
    
    if (current.weight + compM >= M[jBack - 1]) {
      selectedIds.push(current.id);
      backtrackIntervals[jBack - 1].status = 'selected';
      
      addSnapshot(
        6,
        `Ricostruzione: M[${jBack}] (${M[jBack]}) deriva dalla scelta di includere ${current.id}. Aggiunto alla soluzione. Passiamo a p[${jBack}] = ${p[jBack]}.`,
        jBack,
        [...backtrackIntervals],
        { j: jBack, incluso: current.id, prossimo: p[jBack] }
      );
      jBack = p[jBack];
    } else {
      backtrackIntervals[jBack - 1].status = 'rejected';
      addSnapshot(
        6,
        `Ricostruzione: M[${jBack}] (${M[jBack]}) deriva dalla scelta di escludere ${current.id}. Passiamo a j - 1 = ${jBack - 1}.`,
        jBack,
        [...backtrackIntervals],
        { j: jBack, escluso: current.id, prossimo: jBack - 1 }
      );
      jBack--;
    }
  }

  // Update states representing final solution
  const finalSolIntervals = intervalsState().map(inv => ({
    ...inv,
    status: selectedIds.includes(inv.id) ? ('selected' as const) : ('rejected' as const)
  }));

  addSnapshot(6, `Backtracking terminato. La soluzione ottima ha peso totale M[n] = ${M[n]} e contiene gli intervalli: ${selectedIds.reverse().join(', ')}.`, null, finalSolSolIntervals(finalSolIntervals), { "Soluzione Ottima": selectedIds.join(', ') });

  return snapshots;
}

function finalSolSolIntervals(invs: VisualInterval[]) {
  return invs;
}

// ==========================================
// 3. Sequence Alignment (Needleman-Wunsch)
// ==========================================
export const sequenceAlignmentDefinition: AlgorithmDefinition = {
  id: 'sequencealignment',
  name: 'Allineamento di Sequenze',
  module: 'Programmazione Dinamica',
  description: 'Calcola la distanza minima o lo score di allineamento massimo tra due stringhe (es. allineamento globale di Needleman-Wunsch). Utilizza una matrice DP per calcolare i costi accumulati di Gap e Mismatch.',
  complexity: {
    best: 'O(m × n)',
    average: 'O(m × n)',
    worst: 'O(m × n)',
    space: 'O(m × n)'
  },
  variants: [
    {
      name: 'Allineamento Globale (Needleman-Wunsch)',
      description: 'Allinea le due sequenze da cima a fondo, applicando penalità fisse per mismatch e gap.'
    },
    {
      name: 'Allineamento Locale (Smith-Waterman)',
      description: 'Trova la regione di massima similarità tra sotto-sequenze, azzerando i punteggi negativi nella matrice.'
    }
  ],
  pseudocode: [
    'procedure sequenceAlignment(X, Y)',
    '    m = X.length, n = Y.length',
    '    create matrix dp of size (m+1) x (n+1)',
    '    for i = 0 to m do dp[i][0] = i * gap_penalty',
    '    for j = 0 to n do dp[0][j] = j * gap_penalty',
    '    for i = 1 to m',
    '        for j = 1 to n',
    '            match = dp[i-1][j-1] + (X[i] == Y[j] ? 0 : mismatch)',
    '            delete = dp[i-1][j] + gap_penalty',
    '            insert = dp[i][j-1] + gap_penalty',
    '            dp[i][j] = min(match, delete, insert)',
    '    return dp[m][n]'
  ]
};

export function generateSequenceAlignmentSnapshots(
  X: string = "AGAT",
  Y: string = "GATT"
): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  const m = X.length;
  const n = Y.length;

  const GAP = 1;
  const MISMATCH = 2;

  // Initialize (m+1) x (n+1) grid
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  const rowLabels = ['-', ...X.split('')];
  const colLabels = ['-', ...Y.split('')];

  const addSnapshot = (
    codeLine: number,
    description: string,
    activeRow: number | null,
    activeCol: number | null,
    variables: Record<string, any> = {}
  ) => {
    snapshots.push({
      grid: dp.map(row => [...row]),
      rowLabels,
      colLabels,
      activeRow,
      activeCol,
      codeLine,
      description,
      variables: {
        X, Y,
        i: activeRow,
        j: activeCol,
        ...variables
      }
    });
  };

  addSnapshot(1, `Allineamento globale tra X = "${X}" e Y = "${Y}". Penalità: Gap = ${GAP}, Mismatch = ${MISMATCH}.`, 0, 0);

  // Initialize Gap columns
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i * GAP;
    if (i > 0) addSnapshot(4, `Inizializziamo prima colonna (gap in Y): dp[${i}][0] = ${dp[i][0]}`, i, 0);
  }

  // Initialize Gap rows
  for (let j = 1; j <= n; j++) {
    dp[0][j] = j * GAP;
    addSnapshot(5, `Inizializziamo prima riga (gap in X): dp[0][${j}] = ${dp[0][j]}`, 0, j);
  }

  // Double loop
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const matchScore = X[i - 1] === Y[j - 1] ? 0 : MISMATCH;
      const match = dp[i - 1][j - 1] + matchScore;
      const del = dp[i - 1][j] + GAP;
      const ins = dp[i][j - 1] + GAP;
      
      const charX = X[i - 1];
      const charY = Y[j - 1];
      const eq = charX === charY;

      addSnapshot(
        8,
        `Confronto caratteri: X[${i}]='${charX}' e Y[${j}]='${charY}'. Match/Mismatch score = ${matchScore}.`,
        i, j,
        { matchScore, equal: eq }
      );

      dp[i][j] = Math.min(match, del, ins);
      
      addSnapshot(
        10,
        `Calcolo dp[${i}][${j}] = min(Diag+Match: ${match}, Sopra+Gap: ${del}, Sinistra+Gap: ${ins}) = ${dp[i][j]}.`,
        i, j,
        { dp_match: match, dp_delete: del, dp_insert: ins, scelto: dp[i][j] }
      );
    }
  }

  addSnapshot(11, `Costo minimo di allineamento finale calcolato: dp[m][n] = ${dp[m][n]}`, m, n);
  return snapshots;
}

// ==========================================
// 4. Knapsack (Problema dello Zaino)
// ==========================================
export const knapsackDefinition: AlgorithmDefinition = {
  id: 'knapsack',
  name: 'Problema dello Zaino (Knapsack)',
  module: 'Programmazione Dinamica',
  description: 'Seleziona un sottoinsieme di oggetti da inserire in uno zaino di capacità massima W, in modo da massimizzare il valore (profitto) totale senza superare il peso massimo.',
  complexity: {
    best: 'O(n × W)',
    average: 'O(n × W)',
    worst: 'O(n × W)',
    space: 'O(n × W)'
  },
  variants: [
    {
      name: 'Zaino 0-1 (0-1 Knapsack)',
      description: 'Ogni oggetto può essere preso al massimo una volta (non frazionabile). Risolvibile in tempo pseudopolinomiale O(nW).'
    },
    {
      name: 'Zaino Frazionario (Fractional)',
      description: 'Gli oggetti sono divisibili. Si risolve in modo ottimo tramite un approccio greedy (ordina per valore specifico v/w) in O(n log n).'
    }
  ],
  pseudocode: [
    'procedure knapsack(items, W)',
    '    n = items.length',
    '    create matrix dp of size (n+1) x (W+1)',
    '    for i = 0 to n do dp[i][0] = 0',
    '    for w = 0 to W do dp[0][w] = 0',
    '    for i = 1 to n',
    '        val = items[i-1].val, wt = items[i-1].wt',
    '        for w = 1 to W',
    '            if wt <= w',
    '                dp[i][w] = max(val + dp[i-1][w-wt], dp[i-1][w])',
    '            else',
    '                dp[i][w] = dp[i-1][w]',
    '    return dp[n][W]'
  ]
};

interface KnapsackItem {
  name: string;
  weight: number;
  value: number;
}

export function generateKnapsackSnapshots(
  customW: number = 6,
  customItems?: KnapsackItem[]
): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  const W = customW;
  
  // Default items: Name (weight, value)
  const items = customItems || [
    { name: 'O1', weight: 2, value: 3 },
    { name: 'O2', weight: 3, value: 4 },
    { name: 'O3', weight: 4, value: 5 },
    { name: 'O4', weight: 5, value: 8 }
  ];

  const n = items.length;
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(W + 1).fill(0));

  const rowLabels = ['-', ...items.map(it => `${it.name}(w=${it.weight},v=${it.value})`)];
  const colLabels = Array.from({ length: W + 1 }, (_, w) => `w=${w}`);

  const addSnapshot = (
    codeLine: number,
    description: string,
    activeRow: number | null,
    activeCol: number | null,
    variables: Record<string, any> = {}
  ) => {
    snapshots.push({
      grid: dp.map(row => [...row]),
      rowLabels,
      colLabels,
      activeRow,
      activeCol,
      codeLine,
      description,
      variables: {
        Capacita: W,
        ...variables
      }
    });
  };

  addSnapshot(1, `Avvio Problema dello Zaino 0-1. Capacità massima W = ${W}.`, 0, 0);

  // Initialize base rows/columns to 0
  for (let i = 0; i <= n; i++) dp[i][0] = 0;
  for (let w = 0; w <= W; w++) dp[0][w] = 0;
  addSnapshot(3, "Inizializziamo i casi base: riga 0 e colonna 0 impostati a profitto 0.", 0, 0);

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    const val = item.value;
    const wt = item.weight;

    for (let w = 1; w <= W; w++) {
      addSnapshot(8, `Oggetto ${item.name} (peso=${wt}, valore=${val}). Capacità dello zaino corrente w = ${w}.`, i, w, { i, w, "peso_ogg": wt, "valore_ogg": val });

      if (wt <= w) {
        // We can choose to take it
        const take = val + dp[i - 1][w - wt];
        const leave = dp[i - 1][w];
        dp[i][w] = Math.max(take, leave);
        
        addSnapshot(
          9,
          `Il peso ci permette di prenderlo. Se lo prendiamo: profitto(${val}) + dp[i-1][w-wt](${dp[i-1][w-wt]}) = ${take}. Se lo lasciamo: dp[i-1][w] = ${leave}. Scegliamo max = ${dp[i][w]}.`,
          i, w,
          { i, w, valore_prendendo: take, valore_lasciando: leave, profitto: dp[i][w] }
        );
      } else {
        // We cannot take it
        dp[i][w] = dp[i - 1][w];
        addSnapshot(
          11,
          `L'oggetto ${item.name} è troppo pesante (wt=${wt} > w=${w}). Dobbiamo escluderlo. Copiamo il profitto precedente dp[i-1][w] = ${dp[i][w]}.`,
          i, w,
          { i, w, profitto: dp[i][w] }
        );
      }
    }
  }

  // Backtracking to find selection
  const selected: string[] = [];
  let currW = W;
  addSnapshot(12, `Profitto massimo calcolato: ${dp[n][W]}. Avviamo il backtracking per trovare gli oggetti selezionati.`, n, W);

  for (let i = n; i > 0; i--) {
    if (dp[i][currW] !== dp[i - 1][currW]) {
      const item = items[i - 1];
      selected.push(item.name);
      addSnapshot(
        12,
        `Rilevato cambio di valore dp[${i}][${currW}] (${dp[i][currW]}) != dp[${i-1}][${currW}] (${dp[i-1][currW]}). L'oggetto ${item.name} è stato incluso nello zaino. Riducendo capacità rimasta w = w - wt = ${currW - item.weight}.`,
        i, currW,
        { i, w: currW, preso: item.name }
      );
      currW -= item.weight;
    } else {
      addSnapshot(
        12,
        `Valore dp[${i}][${currW}] (${dp[i][currW]}) invariato rispetto a dp[${i-1}][${currW}]. Oggetto ${items[i-1].name} escluso.`,
        i, currW,
        { i, w: currW, escluso: items[i-1].name }
      );
    }
  }

  addSnapshot(12, `Backtracking terminato. Gli oggetti che massimizzano il profitto sono: ${selected.reverse().join(', ')}.`, null, null, { "Soluzione Ottima": selected.join(', '), profitto_totale: dp[n][W] });

  return snapshots;
}
