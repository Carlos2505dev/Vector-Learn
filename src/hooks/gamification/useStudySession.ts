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

const ERROR_RATE_THRESHOLD = 0.7;
const FATIGUE_TIME_THRESHOLD = 10;
const BREAK_SUGGESTION_TIME = 5;

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSession.isActive) {
        const elapsedMin =
          (new Date().getTime() - currentSession.startTime.getTime()) / 60000;

        const errorRate =
          currentSession.questionsAttempted > 0
            ? 1 -
              currentSession.correctAnswers /
                currentSession.questionsAttempted
            : 0;

        if (
          (errorRate > ERROR_RATE_THRESHOLD ||
            currentSession.consecutiveErrors > 3) &&
          elapsedMin > BREAK_SUGGESTION_TIME
        ) {
          setIsFatigued(true);
          setShouldTakeBreak(true);

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

        if (elapsedMin > FATIGUE_TIME_THRESHOLD && !shouldTakeBreak) {
          const focusBonus = Math.floor((elapsedMin / FATIGUE_TIME_THRESHOLD) * 10);
          setXpBonus(focusBonus);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentSession, shouldTakeBreak]);

  const recordAnswer = useCallback((isCorrect: boolean) => {
    setCurrentSession((prev) => ({
      ...prev,
      questionsAttempted: prev.questionsAttempted + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      consecutiveErrors: isCorrect ? 0 : prev.consecutiveErrors + 1,
    }));
  }, []);

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

  const takeBreak = useCallback(() => {
    setShouldTakeBreak(false);
    setIsFatigued(false);

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

export function useStudySessionTracker() {
  const session = useStudySession();
  const { recordAnswer } = useUserProgress();

  const recordTestAnswer = useCallback(
    (questionId: string, isCorrect: boolean, timeSpent: number) => {
      session.currentSession;
    },
    [session]
  );

  return {
    ...session,
    recordTestAnswer,
  };
}
