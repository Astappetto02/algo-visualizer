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
        <p className="text-emerald-700 font-medium animate-pulse">
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
            <div className="border-b border-emerald-500/10 pb-3 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Visualizzazione Array Principale
              </h4>
            </div>

            <div className="flex-1 flex items-end justify-center gap-2 px-2 pb-6 min-h-[220px]">
              {array.map((value, idx) => {
                const isActive = activeIndices.includes(idx);
                const isMerged = mergedIndices.includes(idx);
                const maxVal = Math.max(...array, 10);
                const heightPct = `${Math.max(12, (value / maxVal) * 85)}%`;

                let barBg = 'bg-gradient-to-t from-teal-100 to-teal-300 border-teal-300';
                let textColor = 'text-teal-700';
                let shadow = '';

                if (isActive) {
                  barBg = 'bg-gradient-to-t from-rose-300 to-rose-500 border-rose-400 animate-pulse';
                  textColor = 'text-rose-700 font-bold';
                  shadow = 'shadow-[0_0_15px_rgba(244,63,94,0.5)]';
                } else if (isMerged) {
                  barBg = 'bg-gradient-to-t from-emerald-400 to-emerald-600 border-emerald-500';
                  textColor = 'text-emerald-900 font-bold';
                }

                return (
                  <div key={idx} className="flex flex-col items-center flex-1 transition-all duration-300" style={{ height: '100%' }}>
                    <div className="flex flex-col justify-end items-center h-full w-full relative">
                      <span className={`text-xs font-mono font-bold mb-1.5 ${textColor}`}>{value}</span>
                      <div style={{ height: heightPct }} className={`w-full rounded-t-lg border-t border-x transition-all duration-300 ${barBg} ${shadow}`} />
                      <span className="text-[10px] text-teal-600 font-mono mt-1.5 absolute -bottom-5">{idx}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-slate-700 pt-4 border-t border-emerald-500/10 font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-teal-100 to-teal-300 border border-teal-300" />
                <span>Standard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-rose-300 to-rose-500 border border-rose-400 animate-pulse" />
                <span>Attivo / Confronto</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-emerald-400 to-emerald-600 border border-emerald-500" />
                <span>Fissato / Ordinato</span>
              </div>
            </div>
          </div>

          {/* Recursion Tree (Only if active) */}
          {hasTree && (
            <div className="lg:col-span-3 glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[420px] shadow-xl overflow-x-auto">
              <div className="border-b border-emerald-500/10 pb-3 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Albero di Ricorsione (Divide, Ricorsione, Merge)
                </h4>
              </div>

              <div className="flex-1 flex flex-col justify-around items-center gap-6 min-h-[300px] py-4 select-none">
                <AnimatePresence mode="popLayout">
                  {sortedDepths.map((depth) => {
                    const depthNodes = layers[depth] || [];
                    const isCrowded = depthNodes.length > 4 || (depthNodes.length === 1 && depthNodes[0].array.length > 8);
                    const isVeryCrowded = depthNodes.length > 8;

                    return (
                      <motion.div key={depth} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`flex justify-center items-center w-full ${isVeryCrowded ? 'gap-1' : isCrowded ? 'gap-2' : 'gap-4'}`}>
                        {depthNodes.map((node) => {
                          let nodeStyle = 'border-teal-200 bg-white/60 text-teal-700';
                          let statusText = 'inattivo';

                          if (node.status === 'splitting') {
                            nodeStyle = 'border-rose-400 bg-rose-50 text-rose-700 ring-1 ring-rose-200';
                            statusText = 'splitting';
                          } else if (node.status === 'sorting') {
                            nodeStyle = 'border-indigo-400 bg-indigo-50 text-indigo-700';
                            statusText = 'ordinando';
                          } else if (node.status === 'merging') {
                            nodeStyle = 'border-fuchsia-400 bg-fuchsia-50 text-fuchsia-700 ring-2 ring-fuchsia-200 animate-pulse';
                            statusText = 'merging';
                          } else if (node.status === 'merged') {
                            nodeStyle = 'border-emerald-500 bg-emerald-100 text-emerald-900 font-bold';
                            statusText = 'ordinato';
                          }

                          return (
                            <div key={node.id} className={`${isVeryCrowded ? 'px-1.5 py-1 min-w-[25px] rounded-lg' : isCrowded ? 'px-2 py-1.5 min-w-[40px] rounded-xl' : 'px-3 py-2 min-w-[65px] rounded-xl'} border flex flex-col items-center gap-1 transition-all duration-300 shadow-sm ${nodeStyle}`}>
                              <div className={`flex items-center justify-center font-mono font-bold ${isVeryCrowded ? 'text-[9px] gap-0.5' : isCrowded ? 'text-[10px] gap-0.5' : 'text-xs gap-1'}`}>
                                {node.array.length > 0 ? (
                                  node.array.map((val, vIdx) => (
                                    <span key={vIdx} className={node.status === 'merging' ? 'text-fuchsia-600' : ''}>{val}</span>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-teal-500">vuoto</span>
                                )}
                              </div>
                              <span className={`${isVeryCrowded ? 'text-[6px]' : isCrowded ? 'text-[7px]' : 'text-[8px]'} font-semibold uppercase tracking-wider opacity-80`}>{statusText}</span>
                            </div>
                          );
                        })}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-700 pt-4 border-t border-emerald-500/10 font-semibold">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-teal-200" /> Idle</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-400" /> Divide</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-400" /> Sorting</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-fuchsia-400" /> Merging</span>
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
    const { gridPath } = snapshot;

    return (
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[420px] shadow-xl w-full">
        <div className="border-b border-emerald-500/10 pb-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Tabella di Programmazione Dinamica (DP Matrix)
          </h4>
        </div>

        <div className="flex-1 overflow-auto max-h-[320px] border border-emerald-500/10 rounded-xl bg-emerald-50 p-2">
          <table className="w-full text-center border-collapse font-mono text-[12px]">
            <thead>
              <tr>
                <th className="p-2 border border-emerald-200 bg-white/60 text-teal-600 select-none"></th>
                {colLabels.map((col, cIdx) => (
                  <th key={cIdx} className={`p-2 border border-emerald-200 bg-white/80 font-semibold text-teal-800 min-w-[55px] ${
                    activeCol === cIdx ? 'text-rose-700 bg-rose-100' : ''
                  }`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, rIdx) => {
                const isSelectedRow = snapshot.selectedRows?.includes(rIdx);
                
                return (
                <tr key={rIdx} className="hover:bg-emerald-100/50 transition-colors">
                  <td className={`p-2 border border-emerald-200 font-semibold text-left select-none max-w-[140px] truncate transition-colors ${
                    activeRow === rIdx 
                      ? 'text-rose-700 bg-rose-100' 
                      : isSelectedRow 
                        ? 'text-indigo-800 bg-indigo-100 border-l-[3px] border-l-indigo-500' 
                        : 'text-teal-700 bg-white/60'
                  }`}>
                    {rowLabels[rIdx] || `r=${rIdx}`}
                  </td>
                  {row.map((cell, cIdx) => {
                    const isActive = rIdx === activeRow && cIdx === activeCol;
                    const isInPath = gridPath && gridPath.some(p => p.r === rIdx && p.c === cIdx);
                    
                    let cellColor = 'text-teal-700';
                    let cellBg = '';

                    if (isActive) {
                      cellColor = 'text-rose-700 font-bold';
                      cellBg = 'bg-rose-100 border-rose-400 ring-2 ring-rose-200';
                    } else if (isInPath) {
                      cellColor = 'text-emerald-900 font-bold';
                      cellBg = 'bg-emerald-200 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
                    } else if (cell !== 0) {
                      cellColor = 'text-teal-900 font-medium';
                    } else {
                      cellColor = 'text-slate-400';
                    }

                    return (
                      <td key={cIdx} className={`p-2.5 border border-emerald-200 transition-all font-mono ${cellColor} ${cellBg}`}>
                        {cell === Infinity ? '∞' : cell}
                      </td>
                    );
                  })}
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-slate-700 pt-4 border-t border-emerald-500/10 font-semibold mt-4">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-white/60 border border-emerald-200" /> Cella Inattiva</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-100 border border-rose-400" /> Sotto-problema Attivo</span>
          {snapshot.gridPath && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-200 border border-emerald-500" /> Percorso Backtracking</span>}
          {snapshot.selectedRows && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-100 border border-indigo-500" /> Oggetto Selezionato</span>}
        </div>
      </div>
    );
  };

  // 3. Render Graph SVG Network (BFS/DFS, Dijkstra, Bellman-Ford, Prim)
  const renderGraph = () => {
    if (!nodes || nodes.length === 0) return null;

    // Calculate dynamic viewBox
    const padding = 60;
    const minX = Math.min(...nodes.map(n => n.x)) - padding;
    const maxX = Math.max(...nodes.map(n => n.x)) + padding;
    const minY = Math.min(...nodes.map(n => n.y)) - padding;
    const maxY = Math.max(...nodes.map(n => n.y)) + padding;
    
    // Default to at least 550x340
    const width = Math.max(550, maxX - minX);
    const height = Math.max(340, maxY - minY);
    // Center if the calculated width/height is smaller than default
    const vbX = width > 550 ? minX : (minX + maxX) / 2 - 275;
    const vbY = height > 340 ? minY : (minY + maxY) / 2 - 170;

    const viewBox = `${vbX} ${vbY} ${width} ${height}`;

    return (
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[420px] shadow-xl w-full">
        <div className="border-b border-emerald-500/10 pb-3 mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Struttura Grafo SVG e Rilassamento Archi
          </h4>
        </div>

        <div className="flex-1 flex items-center justify-center p-2 rounded-xl bg-white/60 border border-emerald-500/10 h-[340px]">
          <svg className="w-full h-full min-w-[500px]" viewBox={viewBox}>
            {/* Draw Edges */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              let stroke = 'rgba(20,184,166,0.3)'; // Teal 500 transparent
              let strokeWidth = 1.5;
              let edgeShadow = '';

              if (edge.status === 'active') {
                stroke = '#f43f5e'; // Rose active
                strokeWidth = 3;
              } else if (edge.status === 'path') {
                stroke = '#10b981'; // Emerald path
                strokeWidth = 3.5;
                edgeShadow = 'drop-shadow(0 0 4px rgba(16,185,129,0.3))';
              }

              return (
                <g key={idx} className={edgeShadow}>
                  <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke={stroke} strokeWidth={strokeWidth} className="transition-all duration-300" />
                  {/* Weight label centered */}
                  <rect x={(fromNode.x + toNode.x) / 2 - 10} y={(fromNode.y + toNode.y) / 2 - 8} width="20" height="14" rx="4" className="fill-white stroke-emerald-200 stroke" />
                  <text x={(fromNode.x + toNode.x) / 2} y={(fromNode.y + toNode.y) / 2 + 3} textAnchor="middle" fill="#334155" className="text-[10px] font-bold font-mono select-none">
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              let fill = 'fill-white stroke-teal-300';
              let textFill = 'fill-teal-700';
              let glow = '';

              if (node.status === 'active') {
                fill = 'fill-rose-50 stroke-rose-400';
                textFill = 'fill-rose-700 font-bold';
                glow = 'drop-shadow(0 0 6px rgba(244,63,94,0.3))';
              } else if (node.status === 'visited') {
                fill = 'fill-indigo-50 stroke-indigo-400';
                textFill = 'fill-indigo-700';
              } else if (node.status === 'path') {
                fill = 'fill-emerald-100 stroke-emerald-600';
                textFill = 'fill-emerald-900 font-bold';
                glow = 'drop-shadow(0 0 6px rgba(16,185,129,0.3))';
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

        <div className="flex items-center justify-between text-[10px] text-slate-700 pt-3 border-t border-emerald-500/10 font-semibold mt-2">
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-white border border-teal-300" /> Standard</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-50 border border-indigo-400" /> Frontiera / Scoperto</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-50 border border-rose-400" /> Corrente / In esame</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-100 border border-emerald-600" /> Chiuso / Soluzione</div>
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
        <div className="border-b border-emerald-500/10 pb-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Diagramma degli Intervalli Temporali
          </h4>
        </div>

        <div className="flex-1 flex flex-col gap-3.5 justify-center py-2">
          {intervals.map((inv) => {
            const leftPct = `${(inv.start / maxEnd) * 100}%`;
            const widthPct = `${((inv.end - inv.start) / maxEnd) * 100}%`;

            let color = 'bg-white/80 border-teal-200 text-teal-700';
            let activeGlow = '';

            if (inv.status === 'standard') {
              color = 'bg-teal-50 border-teal-300 text-teal-800';
            } else if (inv.status === 'checking') {
              color = 'bg-rose-100 border-rose-400 text-rose-700';
              activeGlow = 'ring-2 ring-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse';
            } else if (inv.status === 'selected') {
              color = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
              activeGlow = 'shadow-[0_0_12px_rgba(16,185,129,0.3)]';
            } else if (inv.status === 'rejected') {
              color = 'bg-slate-100 border-slate-300 text-slate-400 line-through';
            }

            return (
              <div key={inv.id} className="relative h-9 w-full bg-emerald-50 border border-emerald-100 rounded-lg">
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
        <div className="flex justify-between text-[10px] text-teal-600 font-mono border-t border-emerald-500/10 pt-2 select-none">
          {Array.from({ length: maxEnd + 1 }).map((_, idx) => (
            <span key={idx} className="w-4 text-center">{idx}</span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-[10px] text-slate-700 pt-3 font-semibold mt-2 select-none">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-teal-50 border border-teal-300" /> In attesa</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-400" /> Valutazione</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-500" /> Selezionato</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-300" /> Escluso</span>
        </div>
      </div>
    );
  };

  // 5. Render Huffman Prefix Binary Tree
  const renderHuffmanTree = () => {
    if (!huffmanNodes || huffmanNodes.length === 0) return null;

    // Calculate dynamic viewBox
    const padding = 60;
    const minX = Math.min(...huffmanNodes.map(n => n.x)) - padding;
    const maxX = Math.max(...huffmanNodes.map(n => n.x)) + padding;
    const minY = Math.min(...huffmanNodes.map(n => n.y)) - padding;
    const maxY = Math.max(...huffmanNodes.map(n => n.y)) + padding;

    const width = Math.max(550, maxX - minX);
    const height = Math.max(340, maxY - minY);
    const vbX = width > 550 ? minX : (minX + maxX) / 2 - 275;
    const vbY = height > 340 ? minY : (minY + maxY) / 2 - 170;

    const viewBox = `${vbX} ${vbY} ${width} ${height}`;

    return (
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[420px] shadow-xl w-full">
        <div className="border-b border-emerald-500/10 pb-3 mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Albero Binario di Huffman e Foresta di Code
          </h4>
        </div>

        <div className="flex-1 flex items-center justify-center p-2 rounded-xl bg-white/60 border border-emerald-500/10 h-[340px]">
          <svg className="w-full h-full min-w-[500px]" viewBox={viewBox}>
            {/* Draw Tree Branch lines */}
            {huffmanNodes.map((child, idx) => {
              if (!child.parentId) return null;
              const parent = huffmanNodes.find(n => n.id === child.parentId);
              if (!parent) return null;

              return (
                <g key={idx}>
                  <line x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
                  {/* Left branch shows 0, right shows 1 */}
                  <text x={(parent.x + child.x) / 2 + (child.isLeft ? -10 : 8)} y={(parent.y + child.y) / 2 + 3} fill="#059669" className="text-[10px] font-bold font-mono">
                    {child.isLeft ? '0' : '1'}
                  </text>
                </g>
              );
            })}

            {/* Draw Huffman Nodes */}
            {huffmanNodes.map((node) => {
              const isLeaf = !huffmanNodes.some(n => n.parentId === node.id);
              const isRoot = !node.parentId && huffmanNodes.length > 1 && huffmanNodes.every(n => n.parentId || n.id === node.id);
              
              let fill = 'fill-white stroke-teal-400';
              let textFill = 'fill-teal-800';
              let size = 15;

              if (isLeaf) {
                fill = 'fill-teal-50 stroke-teal-500';
                textFill = 'fill-teal-700';
                size = 14;
              } else if (isRoot) {
                fill = 'fill-emerald-100 stroke-emerald-600';
                textFill = 'fill-emerald-900 font-bold';
                size = 17;
              }

              return (
                <g key={node.id} className="transition-all duration-300">
                  <circle cx={node.x} cy={node.y} r={size} className={`${fill} stroke-2`} />
                  <text x={node.x} y={node.y + 3.5} textAnchor="middle" className={`text-[9px] font-mono font-bold ${textFill}`}>
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-700 pt-3 border-t border-emerald-500/10 font-semibold mt-2 select-none">
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-50 border border-teal-500" /> Nodo Foglia (Carattere:Frequenza)</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-white border border-teal-400" /> Sotto-radice / Somma Interna</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-100 border border-emerald-600" /> Radice Ottima dell'Albero</div>
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
