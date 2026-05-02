import { useState, useEffect, useCallback } from "react";
import { BadgeUnlock } from "@/components/BadgeSystem";

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
};

const STORAGE_KEY = "vector-learn-user-progress";

export function useUserProgress() {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStats({ ...DEFAULT_STATS, ...parsed });
      } catch (e) {
        console.error("Failed to load user progress:", e);
        setStats(DEFAULT_STATS);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever stats change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }, [stats, isLoaded]);

  // Register a question answer and check for badge unlocks
  const recordAnswer = useCallback(
    (questionId: string, isCorrect: boolean, timeSpent: number = 0) => {
      setStats((prev) => {
        const newStats = { ...prev };
        const STREAK_THRESHOLD = 5;
        const QUICK_SOLVE_THRESHOLD = 60;

        // Update question record
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

        // Update streak and correct count
        if (isCorrect) {
          newStats.totalCorrectAnswers += 1;
          newStats.currentStreak += 1;
          if (newStats.currentStreak > newStats.maxStreak) {
            newStats.maxStreak = newStats.currentStreak;
          }

          // Check for first-correct badge
          if (
            newStats.totalCorrectAnswers === 1 &&
            !newStats.unlockedBadges.some((b) => b.badgeId === "first-correct")
          ) {
            unlockBadge(newStats, "first-correct");
          }

          // Check for 5-streak badge
          if (
            newStats.currentStreak >= STREAK_THRESHOLD &&
            !newStats.unlockedBadges.some((b) => b.badgeId === "5-streak")
          ) {
            unlockBadge(newStats, "5-streak");
          }

          // Check for quick-solve badge
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

        // Update average accuracy
        if (newStats.totalAnswers > 0) {
          newStats.averageAccuracy =
            (newStats.totalCorrectAnswers / newStats.totalAnswers) * 100;
        }

        // Grant XP for correct answer
        if (isCorrect) {
          const xpGained = 10;
          newStats.xp += xpGained;
          newStats.level = calculateLevel(newStats.xp);
          
          // Update daily XP
          const today = new Date().toISOString().split('T')[0];
          if (!newStats.dailyXP) newStats.dailyXP = {};
          newStats.dailyXP[today] = (newStats.dailyXP[today] || 0) + xpGained;
        }

        // Update average time (moving average)
        if (timeSpent > 0) {
          if (newStats.averageTime === 0) {
            newStats.averageTime = timeSpent;
          } else {
            // Smooth moving average: 90% old, 10% new
            newStats.averageTime = (newStats.averageTime * 0.9) + (timeSpent * 0.1);
          }
        }

        // Check for master-fundamentals badge (90%+ accuracy)
        if (
          newStats.averageAccuracy >= 90 &&
          newStats.totalAnswers >= 10 &&
          !newStats.unlockedBadges.some((b) => b.badgeId === "master-fundamentals")
        ) {
          unlockBadge(newStats, "master-fundamentals");
        }

        newStats.lastActivity = new Date().toISOString();
        return newStats;
      });
    },
    []
  );

  // Record a completed test
  const recordTestCompletion = useCallback((score: number, totalQuestions: number) => {
    setStats((prev) => {
      const newStats = { ...prev };
      newStats.testsCompleted += 1;

      // Grant XP for test completion
      const testXp = score * 20 + 50; // 20 XP per correct answer + 50 XP bonus
      newStats.xp += testXp;
      newStats.level = calculateLevel(newStats.xp);

      // Update daily XP
      const today = new Date().toISOString().split('T')[0];
      if (!newStats.dailyXP) newStats.dailyXP = {};
      newStats.dailyXP[today] = (newStats.dailyXP[today] || 0) + testXp;

      // Check for badges based on test performance
      const testAccuracy = (score / totalQuestions) * 100;

      // If 70%+ on test, they could be eligible for certificate
      if (testAccuracy >= 70) {
        // This could trigger certificate eligibility
      }

      newStats.lastActivity = new Date().toISOString();
      return newStats;
    });
  }, []);

  // Add XP manually
  const addXP = useCallback((amount: number) => {
    setStats((prev) => {
      const newStats = { ...prev };
      newStats.xp += amount;
      newStats.level = calculateLevel(newStats.xp);
      return newStats;
    });
  }, []);

  // Manually unlock a badge
  const unlockBadgeManually = useCallback((badgeId: string) => {
    setStats((prev) => {
      const newStats = { ...prev };
      unlockBadge(newStats, badgeId as any);
      return newStats;
    });
  }, []);

  // Check and potentially unlock master-fundamentals badge
  const checkMasterFundamentals = useCallback(() => {
    if (
      stats.averageAccuracy >= 90 &&
      stats.totalAnswers >= 10 &&
      !stats.unlockedBadges.some((b) => b.badgeId === "master-fundamentals")
    ) {
      unlockBadgeManually("master-fundamentals");
    }
  }, [stats, unlockBadgeManually]);

  // Reset all progress
  const resetProgress = useCallback(() => {
    setStats(DEFAULT_STATS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get badge unlock status
  const isUnlocked = useCallback(
    (badgeId: string) => {
      return stats.unlockedBadges.some((b) => b.badgeId === badgeId as any);
    },
    [stats.unlockedBadges]
  );

  return {
    stats,
    recordAnswer,
    recordTestCompletion,
    addXP,
    unlockBadgeManually,
    checkMasterFundamentals,
    resetProgress,
    isUnlocked,
    isLoaded,
    xpToNextLevel: calculateXPForNextLevel(stats.level) - stats.xp,
    nextLevelXp: calculateXPForNextLevel(stats.level),
    currentLevelXp: calculateXPForLevel(stats.level),
  };
}

// Helper function to calculate level based on XP
// Formula: Level = floor(sqrt(XP / 100)) + 1
// Level 1: 0-99 XP
// Level 2: 100-399 XP
// Level 3: 400-899 XP
function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Helper to get total XP needed for a specific level
function calculateXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

// Helper to get total XP needed for the next level
function calculateXPForNextLevel(level: number): number {
  return Math.pow(level, 2) * 100;
}

// Helper function to unlock a badge
function unlockBadge(stats: UserStats, badgeId: string) {
  const existing = stats.unlockedBadges.find((b) => b.badgeId === badgeId as any);
  if (!existing) {
    stats.unlockedBadges.push({
      badgeId: badgeId as any,
      unlockedAt: new Date().toISOString(),
    });
  }
}
