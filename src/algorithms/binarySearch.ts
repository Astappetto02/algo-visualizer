import { AlgorithmSnapshot, AlgorithmDefinition } from './types';

export const binarySearchDefinition: AlgorithmDefinition = {
  id: 'binarysearch',
  name: 'Ricerca Binaria',
  module: 'Divide et Impera',
  description: 'Un algoritmo di ricerca che individua la posizione di un valore target in un array ordinato. Riduce lo spazio di ricerca del 50% ad ogni iterazione confrontando il target con il valore centrale.',
  complexity: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
    space: 'O(1)'
  },
  variants: [
    {
      name: 'Ricerca Binaria Iterativa',
      description: 'Implementata con un ciclo semplice. Utilizza uno spazio ausiliario ottimale di O(1).'
    },
    {
      name: 'Ricerca Binaria Ricorsiva',
      description: 'Implementata tramite chiamate ricorsive. Richiede uno spazio di stack O(log n) a causa della ricorsione.'
    }
  ],
  pseudocode: [
    'procedure binarySearch(A, target)',
    '    low = 0, high = A.length - 1',
    '    while low <= high',
    '        mid = floor((low + high) / 2)',
    '        if A[mid] == target',
    '            return mid',
    '        else if A[mid] < target',
    '            low = mid + 1',
    '        else',
    '            high = mid - 1',
    '    return -1'
  ]
};

export function generateBinarySearchSnapshots(initialArray: number[], target: number): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  
  // Binary Search requires a sorted array. Sort first for the visualizer.
  const array = [...initialArray].sort((a, b) => a - b);
  
  const addSnapshot = (
    codeLine: number,
    description: string,
    activeIndices: number[] = [],
    mergedIndices: number[] = [],
    variables: Record<string, any> = {}
  ) => {
    snapshots.push({
      array: [...array],
      activeIndices,
      mergedIndices,
      codeLine,
      description,
      variables: {
        low: null,
        high: null,
        mid: null,
        target,
        found: false,
        ...variables
      }
    });
  };

  let low = 0;
  let justifySearchSpace = () => Array.from({ length: high - low + 1 }, (_, k) => low + k);

  let high = array.length - 1;
  addSnapshot(
    1,
    `Inizializziamo i limiti dell'intervallo di ricerca: low = 0 e high = ${high}. L'array viene prima ordinato.`,
    [],
    justifySearchSpace(),
    { low, high }
  );

  let found = false;

  while (low <= high) {
    const searchSpace = justifySearchSpace();
    addSnapshot(
      2,
      `Verifichiamo la condizione del ciclo: low <= high (cioè ${low} <= ${high}).`,
      [],
      searchSpace,
      { low, high }
    );

    const mid = Math.floor((low + high) / 2);
    addSnapshot(
      3,
      `Calcoliamo l'indice mediano: mid = floor((${low} + ${high}) / 2) = ${mid}.`,
      [mid],
      searchSpace,
      { low, high, mid }
    );

    addSnapshot(
      4,
      `Confronto: controlliamo se l'elemento A[mid] (${array[mid]}) è uguale al target (${target}).`,
      [mid],
      searchSpace,
      { low, high, mid }
    );

    if (array[mid] === target) {
      found = true;
      addSnapshot(
        5,
        `Elemento trovato! A[mid] (${array[mid]}) corrisponde al target (${target}).`,
        [mid],
        [mid],
        { low, high, mid, found: true }
      );
      break;
    } else if (array[mid] < target) {
      addSnapshot(
        7,
        `Poiché A[mid] (${array[mid]}) < target (${target}), il target deve trovarsi nella metà destra.`,
        [mid],
        searchSpace,
        { low, high, mid }
      );
      low = mid + 1;
      addSnapshot(
        8,
        `Avanziamo il limite sinistro: low = mid + 1 = ${low}.`,
        [],
        justifySearchSpace(),
        { low, high, mid }
      );
    } else {
      addSnapshot(
        9,
        `Poiché A[mid] (${array[mid]}) > target (${target}), il target deve trovarsi nella metà sinistra.`,
        [mid],
        searchSpace,
        { low, high, mid }
      );
      high = mid - 1;
      addSnapshot(
        10,
        `Riduciamo il limite destro: high = mid - 1 = ${high}.`,
        [],
        justifySearchSpace(),
        { low, high, mid }
      );
    }
  }

  if (!found) {
    addSnapshot(
      11,
      `Il ciclo termina perché low > high (${low} > ${high}). Il target (${target}) non è presente nell'array.`,
      [],
      [],
      { low, high, found: false }
    );
  }

  return snapshots;
}
