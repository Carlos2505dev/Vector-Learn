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

export interface SimulatorReplayState {
  snapshots: SimulatorSnapshot[];
  currentStepIndex: number;
  isReplaying: boolean;
  maxSnapshots: number;
}

/**
 * Hook para Session Replay - permite viagem no tempo no simulador
 * Ideal para learning through experimentation
 */
export function useSimulatorHistory(maxSnapshots: number = 50) {
  const [history, setHistory] = useState<SimulatorSnapshot[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isReplaying, setIsReplaying] = useState(false);
  const checkpointRef = useRef<SimulatorSnapshot | null>(null);

  /**
   * Registra um snapshot do estado atual do simulador
   */
  const recordSnapshot = useCallback(
    (snapshot: Omit<SimulatorSnapshot, "timestamp" | "stepIndex">) => {
      setHistory((prevHistory) => {
        const newSnapshot: SimulatorSnapshot = {
          ...snapshot,
          timestamp: Date.now(),
          stepIndex: prevHistory.length,
        };

        const updated = [...prevHistory, newSnapshot];

        // Manter apenas últimos N snapshots (memory limit)
        if (updated.length > maxSnapshots) {
          updated.shift();
        }

        return updated;
      });

      setCurrentStepIndex((prev) => prev + 1);
    },
    [maxSnapshots]
  );

  /**
   * Volta para um passo específico do histórico
   */
  const goToStep = useCallback((stepIndex: number): SimulatorSnapshot | null => {
    if (stepIndex < 0 || stepIndex >= history.length) {
      console.warn(`Invalid step index: ${stepIndex}`);
      return null;
    }

    setCurrentStepIndex(stepIndex);
    setIsReplaying(true);
    return history[stepIndex];
  }, [history]);

  /**
   * Próximo passo
   */
  const nextStep = useCallback(() => {
    if (currentStepIndex < history.length - 1) {
      const nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
      return history[nextStep];
    }
    setIsReplaying(false);
    return null;
  }, [currentStepIndex, history]);

  /**
   * Passo anterior
   */
  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevStep = currentStepIndex - 1;
      setCurrentStepIndex(prevStep);
      return history[prevStep];
    }
    return null;
  }, [currentStepIndex, history]);

  /**
   * Volta para o início
   */
  const replayFromStart = useCallback(() => {
    setCurrentStepIndex(0);
    setIsReplaying(true);
    return history[0] || null;
  }, [history]);

  /**
   * Cria um checkpoint para voltar depois
   */
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

  /**
   * Volta para o checkpoint
   */
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

  /**
   * Limpa o histórico
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentStepIndex(-1);
    setIsReplaying(false);
    checkpointRef.current = null;
  }, []);

  /**
   * Exporta histórico como JSON
   */
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

  /**
   * Importa histórico de JSON
   */
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

  /**
   * Retorna metadata resumida da sessão
   */
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
    // State
    history,
    currentStepIndex,
    isReplaying,
    currentSnapshot: currentStepIndex >= 0 ? history[currentStepIndex] : null,
    checkpoint: checkpointRef.current,

    // Methods
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

/**
 * Hook adjunto para integrar replay com controles UI
 */
export function useSimulatorReplayControls(simulatorHistory: ReturnType<typeof useSimulatorHistory>) {
  return {
    canGoBack: simulatorHistory.currentStepIndex > 0,
    canGoForward: simulatorHistory.currentStepIndex < simulatorHistory.history.length - 1,
    progress: (simulatorHistory.currentStepIndex + 1) / (simulatorHistory.history.length || 1),
    ...simulatorHistory,
  };
}
