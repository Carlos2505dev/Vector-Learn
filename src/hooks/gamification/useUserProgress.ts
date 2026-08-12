import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { BadgeUnlock } from "@/components/gamification/BadgeSystem";
import { getEasterEggDetector } from "./useEasterEggs";

interface UserStats {
  totalCorrectAnswers: number;
  totalAnswers: number;
  currentStreak: number;
  maxStreak: number;
  questionsAnswered: {
    [questionId: string]: {
      correct: boolean;
      timeSpent: number;
      attempts: number;
    };
  };
  testsCompleted: number;
  averageAccuracy: number;
  unlockedBadges: BadgeUnlock[];
  lastActivity: string;
  xp: number;
  level: number;
  dailyXP: { [date: string]: number };
  averageTime: number;
  nightAnswers: number;
  sharesCount: number;
  simulatorsVisited: string[];
}

const DEFAULT_STATS: UserStats = {
  totalCorrectAnswers: 0,
  totalAnswers: 0,
  currentStreak: 0,
  maxStreak: 0,
  questionsAnswered: {},
  testsCompleted: 0,
  averageAccuracy: 0,
  unlockedBadges: [],
  lastActivity: new Date().toISOString(),
  xp: 0,
  level: 1,
  dailyXP: {},
  averageTime: 0,
  nightAnswers: 0,
  sharesCount: 0,
  simulatorsVisited: [],
};

const STORAGE_KEY = "vector-learn-user-progress";

// Valida o payload salvo no localStorage: campos ausentes são aceitos (padrões preenchem),
// mas tipos inválidos fazem a validação falhar e o progresso volta ao estado inicial,
// evitando estados corrompidos silenciosos.
const userStatsSchema = z.object({
  totalCorrectAnswers: z.number(),
  totalAnswers: z.number(),
  currentStreak: z.number(),
  maxStreak: z.number(),
  questionsAnswered: z.record(
    z.string(),
    z.object({ correct: z.boolean(), timeSpent: z.number(), attempts: z.number() })
  ),
  testsCompleted: z.number(),
  averageAccuracy: z.number(),
  unlockedBadges: z.array(z.object({ badgeId: z.string(), unlockedAt: z.string() })),
  lastActivity: z.string(),
  xp: z.number(),
  level: z.number(),
  dailyXP: z.record(z.string(), z.number()),
  averageTime: z.number(),
  nightAnswers: z.number(),
  sharesCount: z.number(),
  simulatorsVisited: z.array(z.string()),
}).partial();

const SIMULATORS = ["2d", "3d", "fluidos"] as const;

export function useUserProgress() {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = userStatsSchema.parse(JSON.parse(saved));
        setStats({ ...DEFAULT_STATS, ...parsed } as UserStats);
      } catch (e) {
        console.error("Failed to load user progress:", e);
        setStats(DEFAULT_STATS);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }, [stats, isLoaded]);

  const recordAnswer = useCallback(
    (questionId: string, isCorrect: boolean, timeSpent: number = 0) => {
      // Feedbacks para os easter eggs (perfeccionista, zero-hesitação, noite insone)
      const detector = getEasterEggDetector();
      detector.updatePerfectStreak(isCorrect);
      if (timeSpent > 0 && timeSpent < 10) {
        detector.recordReactionTime(timeSpent);
      }
      detector.recordNightStudy(timeSpent / 3600);

      setStats((prev) => {
        const newStats = { ...prev };
        const QUICK_SOLVE_THRESHOLD = 60;

        if (!newStats.questionsAnswered[questionId]) {
          newStats.questionsAnswered[questionId] = {
            correct: isCorrect,
            timeSpent,
            attempts: 1,
          };
        } else {
          newStats.questionsAnswered[questionId].attempts += 1;
          if (isCorrect) {
            newStats.questionsAnswered[questionId].correct = true;
            newStats.questionsAnswered[questionId].timeSpent = timeSpent;
          }
        }

        newStats.totalAnswers += 1;

        // Coruja Noturna: respostas entre 23h e 6h
        const hour = new Date().getHours();
        if (hour < 6 || hour >= 23) {
          newStats.nightAnswers = (newStats.nightAnswers || 0) + 1;
        }

        if (isCorrect) {
          newStats.totalCorrectAnswers += 1;
          newStats.currentStreak += 1;
          if (newStats.currentStreak > newStats.maxStreak) {
            newStats.maxStreak = newStats.currentStreak;
          }

          if (
            timeSpent > 0 &&
            timeSpent < QUICK_SOLVE_THRESHOLD &&
            !newStats.unlockedBadges.some((b) => b.badgeId === "quick-solve")
          ) {
            unlockBadge(newStats, "quick-solve");
          }
        } else {
          newStats.currentStreak = 0;
        }

        if (newStats.totalAnswers > 0) {
          newStats.averageAccuracy =
            (newStats.totalCorrectAnswers / newStats.totalAnswers) * 100;
        }

        if (isCorrect) {
          const xpGained = 10;
          newStats.xp += xpGained;
          newStats.level = calculateLevel(newStats.xp);

          const today = new Date().toISOString().split('T')[0];
          if (!newStats.dailyXP) newStats.dailyXP = {};
          newStats.dailyXP[today] = (newStats.dailyXP[today] || 0) + xpGained;
        }

        if (timeSpent > 0) {
          if (newStats.averageTime === 0) {
            newStats.averageTime = timeSpent;
          } else {
            newStats.averageTime = (newStats.averageTime * 0.9) + (timeSpent * 0.1);
          }
        }

        checkBadges(newStats);

        newStats.lastActivity = new Date().toISOString();
        return newStats;
      });
    },
    []
  );

  const recordTestCompletion = useCallback((score: number, totalQuestions: number) => {
    setStats((prev) => {
      const newStats = { ...prev };
      newStats.testsCompleted += 1;

      const testXp = score * 20 + 50;
      newStats.xp += testXp;
      newStats.level = calculateLevel(newStats.xp);

      const today = new Date().toISOString().split('T')[0];
      if (!newStats.dailyXP) newStats.dailyXP = {};
      newStats.dailyXP[today] = (newStats.dailyXP[today] || 0) + testXp;

      checkBadges(newStats);

      newStats.lastActivity = new Date().toISOString();
      return newStats;
    });
  }, []);

  const addXP = useCallback((amount: number) => {
    setStats((prev) => {
      const newStats = { ...prev };
      newStats.xp += amount;
      newStats.level = calculateLevel(newStats.xp);
      checkBadges(newStats);
      return newStats;
    });
  }, []);

  const unlockBadgeManually = useCallback((badgeId: BadgeUnlock["badgeId"]) => {
    setStats((prev) => {
      const newStats = { ...prev };
      unlockBadge(newStats, badgeId);
      return newStats;
    });
  }, []);

  const recordShare = useCallback(() => {
    setStats((prev) => {
      const newStats = { ...prev };
      newStats.sharesCount = (newStats.sharesCount || 0) + 1;
      checkBadges(newStats);
      return newStats;
    });
  }, []);

  const recordSimulatorVisit = useCallback((simulatorType: string) => {
    setStats((prev) => {
      const newStats = { ...prev };
      if (!newStats.simulatorsVisited.includes(simulatorType)) {
        newStats.simulatorsVisited = [...newStats.simulatorsVisited, simulatorType];
      }
      checkBadges(newStats);
      return newStats;
    });
  }, []);

  const checkMasterFundamentals = useCallback(() => {
    if (
      stats.averageAccuracy >= 90 &&
      stats.totalAnswers >= 10 &&
      !stats.unlockedBadges.some((b) => b.badgeId === "master-fundamentals")
    ) {
      unlockBadgeManually("master-fundamentals");
    }
  }, [stats, unlockBadgeManually]);

  const resetProgress = useCallback(() => {
    setStats(DEFAULT_STATS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isUnlocked = useCallback(
    (badgeId: BadgeUnlock["badgeId"]) => {
      return stats.unlockedBadges.some((b) => b.badgeId === badgeId);
    },
    [stats.unlockedBadges]
  );

  return {
    stats,
    recordAnswer,
    recordTestCompletion,
    addXP,
    unlockBadgeManually,
    recordShare,
    recordSimulatorVisit,
    checkMasterFundamentals,
    resetProgress,
    isUnlocked,
    isLoaded,
    xpToNextLevel: calculateXPForNextLevel(stats.level) - stats.xp,
    nextLevelXp: calculateXPForNextLevel(stats.level),
    currentLevelXp: calculateXPForLevel(stats.level),
  };
}

function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function calculateXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

function calculateXPForNextLevel(level: number): number {
  return Math.pow(level, 2) * 100;
}

function unlockBadge(stats: UserStats, badgeId: BadgeUnlock["badgeId"]) {
  const existing = stats.unlockedBadges.find((b) => b.badgeId === badgeId);
  if (!existing) {
    // Cria uma nova referência de array para que efeitos que observam unlockedBadges sejam notificados
    stats.unlockedBadges = [
      ...stats.unlockedBadges,
      {
        badgeId,
        unlockedAt: new Date().toISOString(),
      },
    ];
  }
}

function checkBadges(newStats: UserStats) {
  const has = (badgeId: BadgeUnlock["badgeId"]) =>
    newStats.unlockedBadges.some((b) => b.badgeId === badgeId);

  if (newStats.totalCorrectAnswers >= 1 && !has("first-correct")) {
    unlockBadge(newStats, "first-correct");
  }
  if (newStats.currentStreak >= 5 && !has("5-streak")) {
    unlockBadge(newStats, "5-streak");
  }
  if (newStats.totalCorrectAnswers >= 10 && !has("10-correct")) {
    unlockBadge(newStats, "10-correct");
  }
  if (newStats.totalCorrectAnswers >= 50 && !has("50-correct")) {
    unlockBadge(newStats, "50-correct");
  }
  if (newStats.totalCorrectAnswers >= 100 && !has("100-correct")) {
    unlockBadge(newStats, "100-correct");
  }
  if (newStats.maxStreak >= 10 && !has("10-streak")) {
    unlockBadge(newStats, "10-streak");
  }
  if (newStats.testsCompleted >= 1 && !has("first-test")) {
    unlockBadge(newStats, "first-test");
  }
  if (newStats.testsCompleted >= 5 && !has("5-tests")) {
    unlockBadge(newStats, "5-tests");
  }
  if (newStats.level >= 5 && !has("level-5")) {
    unlockBadge(newStats, "level-5");
  }
  if (newStats.level >= 10 && !has("level-10")) {
    unlockBadge(newStats, "level-10");
  }
  if ((newStats.nightAnswers || 0) >= 10 && !has("night-owl")) {
    unlockBadge(newStats, "night-owl");
  }
  if ((newStats.sharesCount || 0) >= 3 && !has("community-explorer")) {
    unlockBadge(newStats, "community-explorer");
  }
  if (
    SIMULATORS.every((s) => newStats.simulatorsVisited.includes(s)) &&
    !has("simulator-master")
  ) {
    unlockBadge(newStats, "simulator-master");
  }
  if (
    newStats.averageAccuracy >= 90 &&
    newStats.totalAnswers >= 10 &&
    !has("master-fundamentals")
  ) {
    unlockBadge(newStats, "master-fundamentals");
  }
}
