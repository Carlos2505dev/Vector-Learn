import { useState, useCallback, useRef } from "react";

export interface SimulatorSnapshot {
  timestamp: number;
  stepIndex: number;
  vectorA?: { x: number; y: number; z?: number };
  vectorB?: { x: number; y: number; z?: number };
  operation?: string;
  result?: any;
  metadata?: {
    description: string;
    isCheckpoint?: boolean;
  };
}

export function useSimulatorHistory(maxSnapshots: number = 50) {
  const [history, setHistory] = useState<SimulatorSnapshot[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isReplaying, setIsReplaying] = useState(false);
  const checkpointRef = useRef<SimulatorSnapshot | null>(null);

  const recordSnapshot = useCallback(
    (snapshot: Omit<SimulatorSnapshot, "timestamp" | "stepIndex">) => {
      setHistory((prevHistory) => {
        const newSnapshot: SimulatorSnapshot = {
          ...snapshot,
          timestamp: Date.now(),
          stepIndex: prevHistory.length,
        };

        const updated = [...prevHistory, newSnapshot];

        if (updated.length > maxSnapshots) {
          updated.shift();
        }

        return updated;
      });

      setCurrentStepIndex((prev) => prev + 1);
    },
    [maxSnapshots]
  );

  const goToStep = useCallback((stepIndex: number): SimulatorSnapshot | null => {
    if (stepIndex < 0 || stepIndex >= history.length) {
      console.warn(`Invalid step index: ${stepIndex}`);
      return null;
    }

    setCurrentStepIndex(stepIndex);
    setIsReplaying(true);
    return history[stepIndex];
  }, [history]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < history.length - 1) {
      const nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
      return history[nextStep];
    }
    setIsReplaying(false);
    return null;
  }, [currentStepIndex, history]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevStep = currentStepIndex - 1;
      setCurrentStepIndex(prevStep);
      return history[prevStep];
    }
    return null;
  }, [currentStepIndex, history]);

  const replayFromStart = useCallback(() => {
    setCurrentStepIndex(0);
    setIsReplaying(true);
    return history[0] || null;
  }, [history]);

  const createCheckpoint = useCallback(() => {
    if (currentStepIndex >= 0 && currentStepIndex < history.length) {
      const checkpoint = {
        ...history[currentStepIndex],
        metadata: {
          ...history[currentStepIndex].metadata,
          isCheckpoint: true,
          description: `Checkpoint em passo ${currentStepIndex}`,
        },
      };
      checkpointRef.current = checkpoint;
      return checkpoint;
    }
  }, [currentStepIndex, history]);

  const goToCheckpoint = useCallback(() => {
    if (checkpointRef.current) {
      const checkpointStep = history.findIndex(
        (s) =>
          s.timestamp === checkpointRef.current!.timestamp &&
          s.stepIndex === checkpointRef.current!.stepIndex
      );

      if (checkpointStep >= 0) {
        setCurrentStepIndex(checkpointStep);
        setIsReplaying(true);
        return history[checkpointStep];
      }
    }
    return null;
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentStepIndex(-1);
    setIsReplaying(false);
    checkpointRef.current = null;
  }, []);

  const exportHistory = useCallback(() => {
    return JSON.stringify(
      {
        sessionStart: history[0]?.timestamp,
        sessionEnd: history[history.length - 1]?.timestamp,
        totalSteps: history.length,
        snapshots: history,
        checkpoint: checkpointRef.current,
      },
      null,
      2
    );
  }, [history]);

  const importHistory = useCallback((jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      setHistory(parsed.snapshots || []);
      if (parsed.checkpoint) {
        checkpointRef.current = parsed.checkpoint;
      }
      return true;
    } catch (error) {
      console.error("Failed to import history:", error);
      return false;
    }
  }, []);

  const getSessionMetadata = useCallback(() => {
    if (history.length === 0) {
      return null;
    }

    return {
      totalSteps: history.length,
      startTime: new Date(history[0].timestamp),
      endTime: new Date(history[history.length - 1].timestamp),
      duration: Math.round(
        (history[history.length - 1].timestamp - history[0].timestamp) / 1000
      ),
      operationCount: history.filter((s) => s.operation).length,
      currentPosition: currentStepIndex + 1,
      checkpoint: checkpointRef.current,
    };
  }, [history, currentStepIndex]);

  return {
    history,
    currentStepIndex,
    isReplaying,
    currentSnapshot: currentStepIndex >= 0 ? history[currentStepIndex] : null,
    checkpoint: checkpointRef.current,

    recordSnapshot,
    goToStep,
    nextStep,
    previousStep,
    replayFromStart,
    createCheckpoint,
    goToCheckpoint,
    clearHistory,
    exportHistory,
    importHistory,
    getSessionMetadata,
  };
}
