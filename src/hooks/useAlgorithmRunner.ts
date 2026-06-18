import { useState, useEffect } from 'react';
import { AlgorithmSnapshot } from '../algorithms/types';

export function useAlgorithmRunner(initialSnapshots: AlgorithmSnapshot[] = []) {
  const [snapshots, setSnapshots] = useState<AlgorithmSnapshot[]>(initialSnapshots);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(600); // milliseconds per step

  // Reset runner whenever new snapshots are loaded (e.g. on input change or alg change)
  useEffect(() => {
    setSnapshots(initialSnapshots);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [initialSnapshots]);

  // Autoplay effect
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= snapshots.length - 1) {
      setIsPlaying(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= snapshots.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, snapshots.length, speed]);

  const play = () => {
    if (snapshots.length === 0) return;
    if (currentStep >= snapshots.length - 1) {
      // Loop back to beginning if playing from the very end
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const stepForward = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(prev + 1, snapshots.length - 1));
  };

  const stepBackward = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const goToStep = (index: number) => {
    setIsPlaying(false);
    setCurrentStep(Math.max(0, Math.min(index, snapshots.length - 1)));
  };

  const currentSnapshot = snapshots[currentStep] || null;

  return {
    snapshots,
    currentStep,
    currentSnapshot,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    goToStep
  };
}
