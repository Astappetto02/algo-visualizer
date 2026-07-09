# 🎓 Algo Visualizer — Impara gli Algoritmi Senza Piangere!

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Provalo%20Ora!-blue?style=for-the-badge)](https://astappetto02.github.io/algo-visualizer/)

Benvenuto in **Algo Visualizer**, un'applicazione web interattiva creata per salvarti la vita (e l'esame) in Progettazione e Analisi di Algoritmi. 🎉

Dimentica i vecchi libri polverosi o i fogli di carta pieni di scarabocchi incomprensibili. Qui puoi vedere **esattamente** cosa succede "sotto il cofano" mentre l'algoritmo gira, passo dopo passo!

---

## ✨ Cosa c'è dentro?

Abbiamo racchiuso 13 degli algoritmi più temuti dagli studenti di informatica, suddivisi per paradigma:

* **Divide et Impera**: Binary Search, MergeSort, QuickSort. *(Sì, finalmente capirai come funziona il pivot).*
* **Programmazione Dinamica**: Fibonacci, Weighted Interval Scheduling, Sequence Alignment, Knapsack. *(Le matrici non avranno più segreti).*
* **Greedy**: Interval Scheduling, Huffman Coding.
* **Grafi**: BFS, DFS, Dijkstra, Bellman-Ford, Prim's MST. *(I nodi e gli archi prenderanno letteralmente vita).*

## 🎮 Come funziona?

È facilissimo! L'app trasforma il codice noioso in bellissime visualizzazioni grafiche:
- **Barre e Alberi** per gli algoritmi di ordinamento.
- **Griglie 2D** che si colorano in tempo reale per la Programmazione Dinamica.
- **Nodi vettoriali** (SVG) per esplorare i Grafi.
- **Timeline a blocchi** per simulare le tempistiche (es. Interval Scheduling).

Mentre l'algoritmo gira, puoi usare i controlli per mettere in **Pausa**, andare **Avanti** o **Indietro** nel tempo, o persino cambiare la velocità di esecuzione. C'è anche un comodo pannello laterale che ti mostra il codice riga per riga e il valore attuale delle variabili!

## 🛠️ Dietro le Quinte (per i Nerd)

Se sei curioso di sapere come è stato costruito questo progetto:
* **React 19 & Next.js 16**: Perché ci piace la velocità.
* **Tailwind CSS v4**: Per un look elegante, moderno e minimal.
* **Framer Motion**: Per le animazioni fluide che ti terranno incollato allo schermo.
* **TypeScript**: Perché vogliamo bene al nostro codice e odiamo gli errori a runtime.

## 🚀 Provalo in Locale!

Vuoi metterci le mani sopra? Ottima idea.
Assicurati di avere [Node.js](https://nodejs.org/) installato, poi apri il terminale e digita:

```bash
# 1. Clona il progetto
git clone https://github.com/Astappetto02/algo-visualizer.git

# 2. Entra nella cartella
cd algo-visualizer

# 3. Installa le dipendenze
npm install

# 4. Accendi i motori!
npm run dev
```

Ora apri il tuo browser preferito, vai su [http://localhost:3000](http://localhost:3000) e divertiti! 🎈
