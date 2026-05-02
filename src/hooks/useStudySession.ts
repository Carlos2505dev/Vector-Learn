import { useState, useRef, useEffect, useCallback } from "react";
import { useUserProgress } from "./useUserProgress";

interface StudySession {
  startTime: Date;
  endTime?: Date;
  questionsAttempted: number;
  correctAnswers: number;
  isActive: boolean;
  consecutiveErrors: number;
}

interface StudyMetrics {
  currentSession: StudySession;
  sessionHistory: StudySession[];
  isFatigued: boolean;
  shouldTakeBreak: boolean;
  suggestedBreakDuration: number;
  xpBonus: number;
}

const ERROR_RATE_THRESHOLD = 0.7; // 70% de erro
const FATIGUE_TIME_THRESHOLD = 10; // 10 minutos pra fatiga
const BREAK_SUGGESTION_TIME = 5; // A cada 5 min, verifica fadiga

export function useStudySession(): StudyMetrics {
  const { stats } = useUserProgress();
  const [currentSession, setCurrentSession] = useState<StudySession>({
    startTime: new Date(),
    questionsAttempted: 0,
    correctAnswers: 0,
    isActive: true,
    consecutiveErrors: 0,
  });

  const [sessionHistory, setSessionHistory] = useState<StudySession[]>([]);
  const [isFatigued, setIsFatigued] = useState(false);
  const [shouldTakeBreak, setShouldTakeBreak] = useState(false);
  const [suggestedBreakDuration, setSuggestedBreakDuration] = useState(5);
  const [xpBonus, setXpBonus] = useState(0);

  // Monitorar fadiga
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSession.isActive) {
        const elapsedMin =
          (new Date().getTime() - currentSession.startTime.getTime()) / 60000;

        // Verificar taxa de erro
        const errorRate =
          currentSession.questionsAttempted > 0
            ? 1 -
              currentSession.correctAnswers /
                currentSession.questionsAttempted
            : 0;

        // Detectar fadiga: erro rate > 70% OU muitos erros consecutivos
        if (
          (errorRate > ERROR_RATE_THRESHOLD ||
            currentSession.consecutiveErrors > 3) &&
          elapsedMin > BREAK_SUGGESTION_TIME
        ) {
          setIsFatigued(true);
          setShouldTakeBreak(true);

          // Sugerir break progressivo
          const breakDuration =
            currentSession.consecutiveErrors > 5
              ? 15
              : currentSession.consecutiveErrors > 3
              ? 10
              : 5;
          setSuggestedBreakDuration(breakDuration);
        } else {
          setIsFatigued(false);
        }

        // Calcular XP bonus por deep focus (sessão longa sem break)
        if (elapsedMin > FATIGUE_TIME_THRESHOLD && !shouldTakeBreak) {
          const focusBonus = Math.floor((elapsedMin / FATIGUE_TIME_THRESHOLD) * 10);
          setXpBonus(focusBonus);
        }
      }
    }, 30000); // Verifica a cada 30 segundos

    return () => clearInterval(interval);
  }, [currentSession, shouldTakeBreak]);

  // Registrar resposta na sessão
  const recordAnswer = useCallback((isCorrect: boolean) => {
    setCurrentSession((prev) => ({
      ...prev,
      questionsAttempted: prev.questionsAttempted + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      consecutiveErrors: isCorrect ? 0 : prev.consecutiveErrors + 1,
    }));
  }, []);

  // Finalizar sessão e salvar histórico
  const endSession = useCallback(() => {
    const endedSession = {
      ...currentSession,
      endTime: new Date(),
      isActive: false,
    };

    setSessionHistory((prev) => [...prev, endedSession]);
    setCurrentSession({
      startTime: new Date(),
      questionsAttempted: 0,
      correctAnswers: 0,
      isActive: true,
      consecutiveErrors: 0,
    });
    setShouldTakeBreak(false);
    setIsFatigued(false);
    setXpBonus(0);
  }, [currentSession]);

  // Registrar pausa
  const takeBreak = useCallback(() => {
    setShouldTakeBreak(false);
    setIsFatigued(false);

    // Bônus XP por reconhecer fadiga e pedir break
    setXpBonus((prev) => prev + 50);
  }, []);

  return {
    currentSession,
    sessionHistory,
    isFatigued,
    shouldTakeBreak,
    suggestedBreakDuration,
    xpBonus,
  };
}

// Hook helper para integrar com teste
export function useStudySessionTracker() {
  const session = useStudySession();
  const { recordAnswer } = useUserProgress();

  const recordTestAnswer = useCallback(
    (questionId: string, isCorrect: boolean, timeSpent: number) => {
      session.currentSession;
      // Registra no hook de study
      // recordAnswer aqui seria o do useStudySession
    },
    [session]
  );

  return {
    ...session,
    recordTestAnswer,
  };
}
