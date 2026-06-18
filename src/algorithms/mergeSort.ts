import { AlgorithmSnapshot, MergeSortNode, AlgorithmDefinition } from './types';

export const mergeSortDefinition: AlgorithmDefinition = {
  id: 'mergesort',
  name: 'MergeSort',
  module: 'Divide et Impera',
  description: 'Un algoritmo di ordinamento basato sul paradigma Divide et Impera. Divide l\'array a metà, si richiama ricorsivamente sulle due parti e infine fonde (merge) i due sotto-array ordinati.',
  complexity: {
    best: 'Θ(n log n)',
    average: 'Θ(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)'
  },
  variants: [
    {
      name: 'MergeSort In-Place',
      description: 'Riduce la complessità spaziale a O(1) ma aumenta il tempo di fusione a O(n²), compromettendo l\'efficienza temporale.'
    },
    {
      name: 'Versione Iterativa (Bottom-Up)',
      description: 'Evita la ricorsione fondendo sotto-array di dimensione crescente (1, 2, 4, 8...). È utile per ottimizzare l\'uso dello stack.'
    },
    {
      name: 'Timsort (Ibrido)',
      description: 'Combina MergeSort con Insertion Sort. È l\'algoritmo di ordinamento di default in Python (list.sort) e Java, ultra efficiente su dati parzialmente ordinati.'
    }
  ],
  pseudocode: [
    'procedure mergeSort(A, left, right)',
    '    if left >= right then return',
    '    mid = floor((left + right) / 2)',
    '    mergeSort(A, left, mid)',
    '    mergeSort(A, mid + 1, right)',
    '    merge(A, left, mid, right)',
    '',
    'procedure merge(A, left, mid, right)',
    '    i = left, j = mid + 1, temp = []',
    '    while i <= mid and j <= right',
    '        if A[i] <= A[j]',
    '            temp.push(A[i++])',
    '        else',
    '            temp.push(A[j++])',
    '    aggiungi elementi rimanenti a temp',
    '    copia temp in A[left ... right]'
  ]
};

export function generateMergeSortSnapshots(initialArray: number[]): AlgorithmSnapshot[] {
  const snapshots: AlgorithmSnapshot[] = [];
  const currentArray = [...initialArray];
  
  // Initialize recursion tree with root node
  const tree: MergeSortNode[] = [
    {
      id: 'root',
      array: [...initialArray],
      leftIndex: 0,
      rightIndex: initialArray.length - 1,
      status: 'idle'
    }
  ];
  
  const cloneTree = (): MergeSortNode[] => JSON.parse(JSON.stringify(tree));
  
  const addSnapshot = (
    codeLine: number,
    description: string,
    activeIndices: number[] = [],
    mergedIndices: number[] = [],
    variables: Record<string, any> = {}
  ) => {
    snapshots.push({
      array: [...currentArray],
      tree: cloneTree(),
      activeIndices,
      mergedIndices,
      codeLine,
      description,
      variables: {
        left: null,
        right: null,
        mid: null,
        i: null,
        j: null,
        ...variables
      }
    });
  };
  
  // Initial snapshot before sorting starts
  addSnapshot(0, "Inizio del MergeSort. Prepariamo l'array di input.", [], [], { left: 0, right: initialArray.length - 1 });
  
  function mergeSortRec(nodeId: string, left: number, right: number) {
    const nodeIndex = tree.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return;
    
    tree[nodeIndex].status = 'splitting';
    addSnapshot(
      1,
      `Divide: analizziamo il sotto-array da indice ${left} a ${right} (lunghezza ${right - left + 1}).`,
      [],
      [],
      { left, right }
    );
    
    // Base Case Check
    if (left >= right) {
      tree[nodeIndex].status = 'merged';
      addSnapshot(
        1,
        `Caso Base: sotto-array di lunghezza <= 1 (${right - left + 1}). È già ordinato per definizione.`,
        [],
        [],
        { left, right }
      );
      return;
    }
    
    const mid = Math.floor((left + right) / 2);
    
    // Create visualization child nodes
    const leftChildId = `${nodeId}-L`;
    const rightChildId = `${nodeId}-R`;
    
    const leftSlice = currentArray.slice(left, mid + 1);
    const rightSlice = currentArray.slice(mid + 1, right + 1);
    
    tree.push({
      id: leftChildId,
      array: leftSlice,
      leftIndex: left,
      rightIndex: mid,
      status: 'idle'
    });
    
    tree.push({
      id: rightChildId,
      array: rightSlice,
      leftIndex: mid + 1,
      rightIndex: right,
      status: 'idle'
    });
    
    addSnapshot(
      2,
      `Calcoliamo il punto medio mid = ${mid}. L'array viene partizionato.`,
      [],
      [],
      { left, right, mid }
    );
    
    // Sort Left
    addSnapshot(
      3,
      `Ricorsione sinistra: risolviamo il sotto-problema sinistro [${left} ... ${mid}].`,
      [],
      [],
      { left, right, mid }
    );
    mergeSortRec(leftChildId, left, mid);
    
    // Sort Right
    addSnapshot(
      4,
      `Ricorsione destra: risolviamo il sotto-problema destro [${mid + 1} ... ${right}].`,
      [],
      [],
      { left, right, mid }
    );
    mergeSortRec(rightChildId, mid + 1, right);
    
    // Prepare for Merge
    const leftChildIdx = tree.findIndex(n => n.id === leftChildId);
    const rightChildIdx = tree.findIndex(n => n.id === rightChildId);
    
    if (leftChildIdx !== -1) tree[leftChildIdx].status = 'sorting';
    if (rightChildIdx !== -1) tree[rightChildIdx].status = 'sorting';
    tree[nodeIndex].status = 'merging';
    
    addSnapshot(
      5,
      `Unione: iniziamo la procedura di merge dei due sotto-array ordinati.`,
      [],
      [],
      { left, right, mid }
    );
    
    // Merge arrays
    const temp: number[] = [];
    let i = left;
    let j = mid + 1;
    
    addSnapshot(
      8,
      `Inizializziamo i puntatori: i = ${i} (sinistra) e j = ${j} (destra).`,
      [],
      [],
      { left, right, mid, i, j }
    );
    
    while (i <= mid && j <= right) {
      addSnapshot(
        9,
        `Confronto: verifichiamo se A[i] <= A[j] (cioè se ${currentArray[i]} <= ${currentArray[j]}).`,
        [i, j],
        temp.map((_, idx) => left + idx),
        { left, right, mid, i, j }
      );
      
      if (currentArray[i] <= currentArray[j]) {
        temp.push(currentArray[i]);
        addSnapshot(
          11,
          `Inseriamo ${currentArray[i]} nel buffer temporaneo e avanziamo il puntatore i.`,
          [i],
          temp.map((_, idx) => left + idx),
          { left, right, mid, i: i + 1, j }
        );
        i++;
      } else {
        temp.push(currentArray[j]);
        addSnapshot(
          13,
          `Inseriamo ${currentArray[j]} nel buffer temporaneo e avanziamo il puntatore j.`,
          [j],
          temp.map((_, idx) => left + idx),
          { left, right, mid, i, j: j + 1 }
        );
        j++;
      }
    }
    
    // Copy remaining items of left block
    while (i <= mid) {
      addSnapshot(
        14,
        `La metà destra è esaurita. Copiamo l'elemento sinistro rimanente ${currentArray[i]} nel buffer.`,
        [i],
        temp.map((_, idx) => left + idx),
        { left, right, mid, i }
      );
      temp.push(currentArray[i]);
      i++;
    }
    
    // Copy remaining items of right block
    while (j <= right) {
      addSnapshot(
        15,
        `La metà sinistra è esaurita. Copiamo l'elemento destro rimanente ${currentArray[j]} nel buffer.`,
        [j],
        temp.map((_, idx) => left + idx),
        { left, right, mid, j }
      );
      temp.push(currentArray[j]);
      j++;
    }
    
    // Copy buffer back to original array
    for (let k = 0; k < temp.length; k++) {
      currentArray[left + k] = temp[k];
      
      // Update visual array at this tree node
      const currentParent = tree[nodeIndex];
      const mergedPart = temp.slice(0, k + 1);
      const remainingPart = currentParent.array.slice(k + 1);
      currentParent.array = [...mergedPart, ...remainingPart];
      
      addSnapshot(
        15,
        `Copiamo il valore ordinato ${temp[k]} dal buffer temporaneo nell'array principale all'indice ${left + k}.`,
        [left + k],
        temp.map((_, idx) => left + idx),
        { left, right, mid, i, j, k: left + k }
      );
    }
    
    // Mark nodes as merged and update their representations
    tree[nodeIndex].status = 'merged';
    
    const leftChildIdxFinal = tree.findIndex(n => n.id === leftChildId);
    const rightChildIdxFinal = tree.findIndex(n => n.id === rightChildId);
    if (leftChildIdxFinal !== -1) tree[leftChildIdxFinal].status = 'merged';
    if (rightChildIdxFinal !== -1) tree[rightChildIdxFinal].status = 'merged';
    
    addSnapshot(
      15,
      `Fusione completata per l'intervallo [${left} ... ${right}].`,
      [],
      [],
      { left, right }
    );
  }
  
  mergeSortRec('root', 0, initialArray.length - 1);
  
  // Final state
  snapshots.push({
    array: [...currentArray],
    tree: tree.map(node => ({ ...node, status: 'merged' })),
    activeIndices: [],
    mergedIndices: Array.from({ length: initialArray.length }, (_, idx) => idx),
    codeLine: 0,
    description: "Ordinamento completato con successo! L'intero array è ordinato.",
    variables: { left: 0, right: initialArray.length - 1, mid: null, i: null, j: null }
  });
  
  return snapshots;
}
export type { MergeSortNode };
