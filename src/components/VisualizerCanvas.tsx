"use client";

import React from 'react';
import { AlgorithmSnapshot, MergeSortNode } from '../algorithms/types';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualizerCanvasProps {
  snapshot: AlgorithmSnapshot | null;
  activeAlgoId: string;
}

export default function VisualizerCanvas({ snapshot, activeAlgoId }: VisualizerCanvasProps) {
  if (!snapshot) {
    return (
      <div className="glass-panel rounded-2xl p-8 flex items-center justify-center h-[550px]">
        <p className="text-slate-400 font-medium animate-pulse">
          Nessuna esecuzione attiva. Carica un algoritmo per iniziare.
        </p>
      </div>
    );
  }

  const {
    array,
    activeIndices = [],
    mergedIndices = [],
    description,
    grid,
    rowLabels = [],
    colLabels = [],
    activeRow = null,
    activeCol = null,
    nodes = [],
    edges = [],
    intervals = [],
    huffmanNodes = []
  } = snapshot;

  // Group tree nodes by depth (for recursive MergeSort tree)
  const tree = (snapshot as any).tree;
  const hasTree = Array.isArray(tree) && tree.length > 0;
  const layers: Record<number, MergeSortNode[]> = {};
  if (hasTree) {
    tree.forEach((node: MergeSortNode) => {
      const depth = node.id.split('-').length - 1;
      if (!layers[depth]) layers[depth] = [];
      layers[depth].push(node);
    });
  }

  const sortedDepths = Object.keys(layers)
    .map(Number)
    .sort((a, b) => a - b);

  // ==========================================
  // SUB-RENDERERS
  // ==========================================

  // 1. Render Bars (MergeSort, QuickSort, Binary Search)
  const renderBars = () => {
    if (!array) return null;
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main Array Bars */}
          <div className={`${hasTree ? 'lg:col-span-2' : 'lg:col-span-5'} glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[420px] shadow-xl`}>
            <div className="border-b border-white/5 pb-3 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Visualizzazione Array Principale
              </h4>
            </div>

            <div className="flex-1 flex items-end justify-center gap-2 px-2 pb-6 min-h-[220px]">
              {array.map((value, idx) => {
                const isActive = activeIndices.includes(idx);
                const isMerged = mergedIndices.includes(idx);
                const maxVal = Math.max(...array, 10);
                const heightPct = `${Math.max(12, (value / maxVal) * 85)}%`;

                let barBg = 'bg-gradient-to-t from-indigo-950/60 to-indigo-600/70 border-indigo-500/40';
                let textColor = 'text-indigo-300';
                let shadow = '';

                if (isActive) {
                  barBg = 'bg-gradient-to-t from-pink-950/80 to-pink-500 border-pink-400 animate-pulse';
                  textColor = 'text-pink-300 font-bold';
                  shadow = 'shadow-[0_0_15px_rgba(236,72,153,0.4)]';
                } else if (isMerged) {
                  barBg = 'bg-gradient-to-t from-emerald-950/70 to-emerald-500 border-emerald-400';
                  textColor = 'text-emerald-300';
                }

                return (
                  <div key={idx} className="flex flex-col items-center flex-1 transition-all duration-300" style={{ height: '100%' }}>
                    <div className="flex flex-col justify-end items-center h-full w-full relative">
                      <span className={`text-xs font-mono font-bold mb-1.5 ${textColor}`}>{value}</span>
                      <div style={{ height: heightPct }} className={`w-full rounded-t-lg border-t border-x transition-all duration-300 ${barBg} ${shadow}`} />
                      <span className="text-[10px] text-slate-500 font-mono mt-1.5 absolute -bottom-5">{idx}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-white/5 font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-indigo-950 to-indigo-600 border border-indigo-500" />
                <span>Standard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-pink-950 to-pink-500 border border-pink-400 animate-pulse" />
                <span>Attivo / Confronto</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-emerald-950 to-emerald-500 border border-emerald-400" />
                <span>Fissato / Ordinato</span>
              </div>
            </div>
          </div>

          {/* Recursion Tree (Only if active) */}
          {hasTree && (
            <div className="lg:col-span-3 glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[420px] shadow-xl overflow-x-auto">
              <div className="border-b border-white/5 pb-3 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Albero di Ricorsione (Divide, Ricorsione, Merge)
                </h4>
              </div>

              <div className="flex-1 flex flex-col justify-around items-center gap-6 min-h-[300px] py-4 select-none">
                <AnimatePresence mode="popLayout">
                  {sortedDepths.map((depth) => {
                    const depthNodes = layers[depth] || [];
                    return (
                      <motion.div key={depth} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-center items-center gap-4 w-full">
                        {depthNodes.map((node) => {
                          let nodeStyle = 'border-slate-800 bg-slate-950/40 text-slate-500';
                          let statusText = 'inattivo';

                          if (node.status === 'splitting') {
                            nodeStyle = 'border-amber-500/40 bg-amber-500/5 text-amber-300 ring-1 ring-amber-500/20';
                            statusText = 'splitting';
                          } else if (node.status === 'sorting') {
                            nodeStyle = 'border-indigo-500/40 bg-indigo-500/5 text-indigo-300';
                            statusText = 'ordinando';
                          } else if (node.status === 'merging') {
                            nodeStyle = 'border-pink-500/60 bg-pink-500/10 text-pink-300 ring-2 ring-pink-500/30 animate-pulse';
                            statusText = 'merging';
                          } else if (node.status === 'merged') {
                            nodeStyle = 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400';
                            statusText = 'ordinato';
                          }

                          return (
                            <div key={node.id} className={`px-3 py-2 rounded-xl border flex flex-col items-center gap-1 min-w-[65px] transition-all duration-300 shadow-md ${nodeStyle}`}>
                              <div className="flex items-center justify-center gap-1 font-mono text-xs font-bold">
                                {node.array.length > 0 ? (
                                  node.array.map((val, vIdx) => (
                                    <span key={vIdx} className={node.status === 'merging' ? 'text-pink-300' : ''}>{val}</span>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-slate-600">vuoto</span>
                                )}
                              </div>
                              <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-500 opacity-80">{statusText}</span>
                            </div>
                          );
                        })}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-4 border-t border-white/5 font-semibold">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-800" /> Idle</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> Divide</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-500" /> Sorting</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-pink-500" /> Merging</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Ordinato</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 2. Render DP Grid (Knapsack, Sequence Alignment, Fibonacci)
  const renderDPGrid = () => {
    if (!grid) return null;
    return (
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[420px] shadow-xl w-full">
        <div className="border-b border-white/5 pb-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Tabella di Programmazione Dinamica (DP Matrix)
          </h4>
        </div>

        <div className="flex-1 overflow-auto max-h-[320px] border border-white/5 rounded-xl bg-slate-950/30 p-2">
          <table className="w-full text-center border-collapse font-mono text-[12px]">
            <thead>
              <tr>
                <th className="p-2 border border-white/5 bg-slate-900/40 text-slate-500 select-none"></th>
                {colLabels.map((col, cIdx) => (
                  <th key={cIdx} className={`p-2 border border-white/5 bg-slate-900/60 font-semibold text-slate-300 min-w-[55px] ${
                    activeCol === cIdx ? 'text-pink-300 bg-pink-950/20' : ''
                  }`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                  <td className={`p-2 border border-white/5 bg-slate-900/60 font-semibold text-slate-300 text-left select-none max-w-[140px] truncate ${
                    activeRow === rIdx ? 'text-pink-300 bg-pink-950/20' : ''
                  }`}>
                    {rowLabels[rIdx] || `r=${rIdx}`}
                  </td>
                  {row.map((cell, cIdx) => {
                    const isActive = rIdx === activeRow && cIdx === activeCol;
                    let cellColor = 'text-slate-400';
                    let cellBg = '';

                    if (isActive) {
                      cellColor = 'text-pink-300 font-bold';
                      cellBg = 'bg-pink-500/20 border-pink-500/60 ring-2 ring-pink-500/20';
                    } else if (cell !== 0) {
                      cellColor = 'text-slate-200';
                    }

                    return (
                      <td key={cIdx} className={`p-2.5 border border-white/5 transition-all font-mono font-bold ${cellColor} ${cellBg}`}>
                        {cell === Infinity ? '∞' : cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-4 border-t border-white/5 font-semibold mt-4">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-900/60 border border-white/5" /> Cella Inattiva</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-pink-500/20 border border-pink-500/60" /> Sotto-problema Attivo</span>
        </div>
      </div>
    );
  };

  // 3. Render Graph SVG Network (BFS/DFS, Dijkstra, Bellman-Ford, Prim)
  const renderGraph = () => {
    if (!nodes || nodes.length === 0) return null;
    return (
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[420px] shadow-xl w-full">
        <div className="border-b border-white/5 pb-3 mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Struttura Grafo SVG e Rilassamento Archi
          </h4>
        </div>

        <div className="flex-1 flex items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-white/5 h-[340px]">
          <svg className="w-full h-full min-w-[500px]" viewBox="0 0 550 340">
            {/* Draw Edges */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              let stroke = 'rgba(255,255,255,0.08)';
              let strokeWidth = 1.5;
              let edgeShadow = '';

              if (edge.status === 'active') {
                stroke = '#ec4899'; // Active check pink
                strokeWidth = 3;
              } else if (edge.status === 'path') {
                stroke = '#10b981'; // Solved green
                strokeWidth = 3.5;
                edgeShadow = 'drop-shadow(0 0 4px rgba(16,185,129,0.3))';
              }

              return (
                <g key={idx} className={edgeShadow}>
                  <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke={stroke} strokeWidth={strokeWidth} className="transition-all duration-300" />
                  {/* Weight label centered */}
                  <rect x={(fromNode.x + toNode.x) / 2 - 10} y={(fromNode.y + toNode.y) / 2 - 8} width="20" height="14" rx="4" className="fill-slate-950/80 stroke-white/5 stroke" />
                  <text x={(fromNode.x + toNode.x) / 2} y={(fromNode.y + toNode.y) / 2 + 2} textAnchor="middle" fill="#94a3b8" className="text-[10px] font-bold font-mono select-none">
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              let fill = 'fill-slate-950/90 stroke-slate-800';
              let textFill = 'fill-slate-400';
              let glow = '';

              if (node.status === 'active') {
                fill = 'fill-pink-950/60 stroke-pink-500';
                textFill = 'fill-pink-200 font-bold';
                glow = 'drop-shadow(0 0 6px rgba(236,72,153,0.5))';
              } else if (node.status === 'visited') {
                fill = 'fill-amber-950/50 stroke-amber-500/80';
                textFill = 'fill-amber-300';
              } else if (node.status === 'path') {
                fill = 'fill-emerald-950/60 stroke-emerald-500';
                textFill = 'fill-emerald-200 font-bold';
                glow = 'drop-shadow(0 0 6px rgba(16,185,129,0.5))';
              }

              return (
                <g key={node.id} className={`cursor-pointer transition-all duration-300 ${glow}`}>
                  <circle cx={node.x} cy={node.y} r={17} className={`${fill} stroke-2`} />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" className={`text-xs font-mono font-bold ${textFill}`}>
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-white/5 font-semibold mt-2">
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700" /> Standard</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500" /> Frontiera / Scoperto</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-pink-500/20 border border-pink-500" /> Corrente / In esame</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500" /> Chiuso / Soluzione</div>
        </div>
      </div>
    );
  };

  // 4. Render Timeline Gantt (Interval Scheduling, Weighted Intervals)
  const renderTimeline = () => {
    if (!intervals || intervals.length === 0) return null;
    const maxEnd = Math.max(...intervals.map(i => i.end), 10);

    return (
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[420px] shadow-xl w-full">
        <div className="border-b border-white/5 pb-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Diagramma degli Intervalli Temporali
          </h4>
        </div>

        <div className="flex-1 flex flex-col gap-3.5 justify-center py-2">
          {intervals.map((inv) => {
            const leftPct = `${(inv.start / maxEnd) * 100}%`;
            const widthPct = `${((inv.end - inv.start) / maxEnd) * 100}%`;

            let color = 'bg-slate-900/60 border-white/5 text-slate-500';
            let activeGlow = '';

            if (inv.status === 'standard') {
              color = 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300';
            } else if (inv.status === 'checking') {
              color = 'bg-pink-500/20 border-pink-500/65 text-pink-300';
              activeGlow = 'ring-2 ring-pink-500/20 shadow-[0_0_12px_rgba(236,72,153,0.3)] animate-pulse';
            } else if (inv.status === 'selected') {
              color = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300';
              activeGlow = 'shadow-[0_0_12px_rgba(16,185,129,0.2)]';
            } else if (inv.status === 'rejected') {
              color = 'bg-slate-950/60 border-slate-900 text-slate-700 line-through';
            }

            return (
              <div key={inv.id} className="relative h-9 w-full bg-slate-950/20 rounded-lg border border-white/5">
                <div
                  style={{ left: leftPct, width: widthPct }}
                  className={`absolute h-7 top-0.5 rounded-md border flex items-center justify-between text-[11px] font-bold px-3 transition-all duration-300 select-none ${color} ${activeGlow}`}
                >
                  <span className="font-mono">{inv.id}</span>
                  <span className="text-[9px] opacity-70">
                    {inv.start} → {inv.end} {inv.weight ? `(w=${inv.weight})` : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline Axis ticks */}
        <div className="flex justify-between text-[10px] text-slate-500 font-mono border-t border-white/5 pt-2 select-none">
          {Array.from({ length: maxEnd + 1 }).map((_, idx) => (
            <span key={idx} className="w-4 text-center">{idx}</span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-3 font-semibold mt-2 select-none">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-indigo-500/10 border border-indigo-500/30" /> In attesa</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-pink-500/20 border border-pink-500/65" /> Valutazione</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500/60" /> Selezionato</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-950 border border-slate-900" /> Escluso</span>
        </div>
      </div>
    );
  };

  // 5. Render Huffman Prefix Binary Tree
  const renderHuffmanTree = () => {
    if (!huffmanNodes || huffmanNodes.length === 0) return null;
    return (
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[420px] shadow-xl w-full">
        <div className="border-b border-white/5 pb-3 mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Albero Binario di Huffman e Foresta di Code
          </h4>
        </div>

        <div className="flex-1 flex items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-white/5 h-[340px]">
          <svg className="w-full h-full min-w-[500px]" viewBox="0 0 550 340">
            {/* Draw Tree Branch lines */}
            {huffmanNodes.map((child, idx) => {
              if (!child.parentId) return null;
              const parent = huffmanNodes.find(n => n.id === child.parentId);
              if (!parent) return null;

              return (
                <g key={idx}>
                  <line x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1.5" />
                  {/* Left branch shows 0, right shows 1 */}
                  <text x={(parent.x + child.x) / 2 + (child.isLeft ? -10 : 8)} y={(parent.y + child.y) / 2 + 3} fill="#a78bfa" className="text-[10px] font-bold font-mono">
                    {child.isLeft ? '0' : '1'}
                  </text>
                </g>
              );
            })}

            {/* Draw Huffman Nodes */}
            {huffmanNodes.map((node) => {
              const isLeaf = !huffmanNodes.some(n => n.parentId === node.id);
              const isRoot = !node.parentId && huffmanNodes.length > 1 && huffmanNodes.every(n => n.parentId || n.id === node.id);
              
              let fill = 'fill-slate-950/95 stroke-indigo-500/50';
              let textFill = 'fill-indigo-300';
              let size = 15;

              if (isLeaf) {
                fill = 'fill-indigo-950/40 stroke-indigo-400';
                textFill = 'fill-indigo-200';
                size = 14;
              } else if (isRoot) {
                fill = 'fill-emerald-950/70 stroke-emerald-500';
                textFill = 'fill-emerald-200 font-bold';
                size = 17;
              }

              return (
                <g key={node.id} className="transition-all duration-300">
                  <circle cx={node.x} cy={node.y} r={size} className={`${fill} stroke-2`} />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" className="text-[9px] font-mono font-bold fill-white">
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-white/5 font-semibold mt-2 select-none">
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-950/40 border border-indigo-400" /> Nodo Foglia (Carattere:Frequenza)</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-indigo-500/50" /> Sotto-radice / Somma Interna</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-950/70 border border-emerald-500" /> Radice Ottima dell'Albero</div>
        </div>
      </div>
    );
  };

  // ==========================================
  // ROUTER VISUALIZATION CHANGER
  // ==========================================
  if (grid) return renderDPGrid();
  if (nodes && nodes.length > 0) return renderGraph();
  if (intervals && intervals.length > 0) return renderTimeline();
  if (huffmanNodes && huffmanNodes.length > 0) return renderHuffmanTree();
  return renderBars();
}
