import { AlgorithmSnapshot, AlgorithmDefinition } from './types';

export const quickSortDefinition: AlgorithmDefinition = {
  id: 'quicksort',
  name: 'QuickSort',
  module: 'Divide et Impera',
  description: 'Un algoritmo di ordinamento ricorsivo in loco (in-place) basato su divisione e conquista. Seleziona un elemento come pivot e partiziona l\'array in modo che gli elementi minori vadano a sinistra e quelli maggiori a destra.',
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n) (stack)'
  },
  variants: [
    {
      name: 'Scelta del Pivot Casuale (Randomized)',
      description: 'Seleziona un pivot in modo casuale per evitare il caso peggiore O(n²) su array pre-ordinati.'
    },
    {
      name: 'Partizionamento a Tre Vie (3-Way)',
      description: 'Partiziona l\'array in tre sezioni (minori, uguali, maggiori del pivot). Molto efficiente in presenza di molti elementi duplicati.'
    }
  ],
  pseudocode: [
    'procedure quickSort(A, low, high)',
    '    if low < high',
    '        p = partition(A, low, high)',
    '        quickSort(A, low, p - 1)',
    '        quickSort(A, p + 1, high)',
    '',
    'procedure partition(A, low, high)',
    '    pivot = A[high]',
    '    i = low - 1',
    '    for j = low to high - 1',
    '        if A[j] < pivot',
    '            i = i + 1',
    '            swap A[i] with A[j]',
    '    swap A[i + 1] with A[high]',
    '    return i + 1'
  ]
};

export function generateQuickSortSnapshots(initialArray: number[], pivotStrategy: 'first' | 'last' = 'last'): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  const A = [...initialArray];
  const stable = new Set<number>(); // Track sorted positions

  const addSnapshot = (
    codeLine: number,
    description: string,
    activeIndices: number[] = [],
    variables: Record<string, any> = {}
  ) => {
    snapshots.push({
      array: [...A],
      activeIndices,
      mergedIndices: Array.from(stable),
      codeLine,
      description,
      variables: {
        low: null,
        high: null,
        pivot: null,
        pivotIdx: null,
        i: null,
        j: null,
        ...variables
      }
    });
  };

  addSnapshot(0, "Inizio del QuickSort. Prepariamo l'array iniziale.", [], { low: 0, high: A.length - 1 });

  function qSort(low: number, high: number) {
    addSnapshot(1, `Controllo ricorsione: quickSort(A, low=${low}, high=${high})`, [], { low, high });
    if (low < high) {
      const pIdx = partition(low, high);
      qSort(low, pIdx - 1);
      qSort(pIdx + 1, high);
    } else if (low >= 0 && low < A.length) {
      stable.add(low);
      addSnapshot(0, `Caso Base: sotto-array di dimensione <= 1 ordinato. Elemento all'indice ${low} è fisso.`, [], { low, high });
    }
  }

  function partition(low: number, high: number): number {
    if (pivotStrategy === 'first') {
      addSnapshot(7, `Scelta del pivot (Primo Elemento): selezioniamo A[low] (${A[low]}) come perno della partizione.`, [low], { low, high, pivot: A[low], pivotIdx: low });
      addSnapshot(7, `Per eseguire il partizionamento Lomuto, scambiamo il pivot A[low] (${A[low]}) con A[high] (${A[high]}).`, [low, high], { low, high, pivot: A[low], pivotIdx: low });
      [A[low], A[high]] = [A[high], A[low]];
    }

    const pivot = A[high];
    addSnapshot(7, `Iniziamo il partizionamento: il pivot è ${pivot} (all'indice ${high}).`, [high], { low, high, pivot, pivotIdx: high });
    
    let i = low - 1;
    addSnapshot(8, `Inizializziamo i = low - 1 = ${i}. Scansioniamo gli elementi con j da ${low} a ${high - 1}.`, [high], { low, high, pivot, pivotIdx: high, i });

    for (let j = low; j < high; j++) {
      addSnapshot(10, `Confronto: controlliamo se A[j] (${A[j]}) < pivot (${pivot})`, [j, high], { low, high, pivot, pivotIdx: high, i, j });
      
      if (A[j] < pivot) {
        i++;
        addSnapshot(11, `A[j] è minore. Incrementiamo i = ${i} e scambiamo A[i] con A[j].`, [i, j, high], { low, high, pivot, pivotIdx: high, i, j });
        [A[i], A[j]] = [A[j], A[i]];
        addSnapshot(12, `Scambio eseguito: A[i] è ora ${A[i]}, A[j] è ora ${A[j]}.`, [i, j, high], { low, high, pivot, pivotIdx: high, i, j });
      }
    }

    const swapIdx = i + 1;
    addSnapshot(13, `Finiamo la scansione. Scambiamo il pivot A[high] (${A[high]}) con A[i + 1] (${A[swapIdx]}) per rimetterlo al centro.`, [swapIdx, high], { low, high, pivot, i, pivotIdx: high });
    [A[swapIdx], A[high]] = [A[high], A[swapIdx]];
    stable.add(swapIdx); // Pivot is now in final sorted position

    addSnapshot(14, `Partizionamento completato. Il pivot si trova all'indice ${swapIdx}. Elementi a sinistra sono <= ${pivot}, a destra sono > ${pivot}.`, [swapIdx], { low, high, pivotIdx: swapIdx });
    
    return swapIdx;
  }

  qSort(0, A.length - 1);

  // Mark all elements as stable
  for (let k = 0; k < A.length; k++) stable.add(k);
  addSnapshot(0, "QuickSort completato con successo! Tutti gli elementi sono ordinati.", []);

  return snapshots;
}
