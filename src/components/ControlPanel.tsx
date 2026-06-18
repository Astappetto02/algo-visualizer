import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onGoToStep: (index: number) => void;
}

export default function ControlPanel({
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  currentStep,
  totalSteps,
  speed,
  onSpeedChange,
  onGoToStep,
}: ControlPanelProps) {
  // Convert speed ms into descriptive levels or readable multipliers
  // 100ms is fast, 2000ms is slow. Let's make the slider representation inverted:
  // higher slider value = faster speed (less ms delay)
  const handleSliderSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // map slider 1-10 to ms (e.g. 10 -> 100ms, 1 -> 2000ms)
    // Formula: ms = 2100 - (slider * 200)
    const ms = 2100 - value * 200;
    onSpeedChange(ms);
  };

  const getSliderValue = () => {
    return Math.round((2100 - speed) / 200);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 w-full shadow-2xl">
      {/* Step Status & Time-scrubbing */}
      <div className="flex-1 w-full flex flex-col gap-2">
        <div className="flex justify-between text-sm text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            Stato Esecuzione:
          </span>
          <span className="text-white font-mono bg-slate-900/60 px-2 py-0.5 border border-white/5 rounded-md">
            Step {currentStep} / {totalSteps > 0 ? totalSteps - 1 : 0}
          </span>
        </div>
        {/* Step Slider */}
        <input
          type="range"
          min={0}
          max={totalSteps > 0 ? totalSteps - 1 : 0}
          value={currentStep}
          onChange={(e) => onGoToStep(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg bg-slate-800 accent-indigo-500 cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        />
      </div>

      {/* Playback Buttons */}
      <div className="flex items-center gap-3">
        {/* Reset Button */}
        <button
          onClick={onReset}
          className="p-3 rounded-xl border border-white/5 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200 cursor-pointer"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Step Back Button */}
        <button
          onClick={onStepBackward}
          disabled={currentStep === 0}
          className="p-3 rounded-xl border border-white/5 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-40 disabled:hover:bg-slate-900/40 disabled:hover:text-slate-300 transition-all duration-200 cursor-pointer"
          title="Indietro"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        {/* Play/Pause Main Button */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="p-4 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-650/35 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          title={isPlaying ? "Pausa" : "Avvia"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-white" />
          ) : (
            <Play className="w-6 h-6 fill-white translation-x-0.5" />
          )}
        </button>

        {/* Step Forward Button */}
        <button
          onClick={onStepForward}
          disabled={totalSteps === 0 || currentStep === totalSteps - 1}
          className="p-3 rounded-xl border border-white/5 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-40 disabled:hover:bg-slate-900/40 disabled:hover:text-slate-300 transition-all duration-200 cursor-pointer"
          title="Avanti"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Playback Speed controller */}
      <div className="w-full md:w-56 flex flex-col gap-2">
        <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span>Velocità</span>
          <span className="text-indigo-400 font-mono">
            {speed <= 100 ? 'Velocissimo' : speed >= 1700 ? 'Lentissimo' : `${(1000 / speed).toFixed(1)}x`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Min</span>
          <input
            type="range"
            min={1}
            max={10}
            value={getSliderValue()}
            onChange={handleSliderSpeedChange}
            className="flex-1 h-1.5 rounded-lg bg-slate-800 accent-indigo-500 cursor-pointer appearance-none outline-none transition-all"
          />
          <span className="text-xs text-slate-500">Max</span>
        </div>
      </div>
    </div>
  );
}
