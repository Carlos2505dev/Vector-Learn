const STORAGE_KEY = "vector-learn-easter-eggs";

export const EASTER_EGG_DEFINITIONS = {
  "descobridor-de-atalhos": {
    name: "🔍 Descobridor de Atalhos",
    description: "Executou uma operação não ensinada no currículo",
    condition: "unTaughtOperationDetected",
    rarity: "epic" as const,
    hidden: true,
  },
  "ninja-matematico": {
    name: "🥷 Ninja Matemático",
    description: "Resolveu 3 desafios usando métodos alternativos",
    condition: "alternativeMethodCount",
    threshold: 3,
    rarity: "epic" as const,
    hidden: true,
  },
  "relampago": {
    name: "⚡ Relâmpago",
    description: "100 operações sem erros em menos de 5 minutos",
    condition: "speedRun",
    rarity: "legendary" as const,
    hidden: true,
  },
  "pesquisador-insaciavel": {
    name: "📚 Pesquisador Insaciável",
    description: "Leu 100% do FAQ e Fundamentos",
    condition: "fullDocumentRead",
    rarity: "epic" as const,
    hidden: true,
  },
  "experimentador": {
    name: "🧪 Experimentador",
    description: "Testou todas as combinações de operações em um simulador",
    condition: "allOperationsCombined",
    rarity: "rare" as const,
    hidden: true,
  },
  "perfeccionista": {
    name: "💎 Perfeccionista",
    description: "Atingiu 100% de acurácia em 20 questões consecutivas",
    condition: "perfectStreak",
    threshold: 20,
    rarity: "legendary" as const,
    hidden: true,
  },
  "noite-insone": {
    name: "🌙 Noite Insone",
    description: "Estudou entre 23:00 e 06:00 por mais de 2 horas",
    condition: "lateNightStudy",
    rarity: "rare" as const,
    hidden: true,
  },
  "multidimensional": {
    name: "📐 Multidimensional",
    description: "Usou simulador 2D, 3D e comparador no mesmo dia",
    condition: "allSimulatorTypes",
    rarity: "epic" as const,
    hidden: true,
  },
  "mentor": {
    name: "🎓 Mentor",
    description: "Compartilhou sua solução de um desafio 10 vezes",
    condition: "shareSolutionCount",
    threshold: 10,
    rarity: "epic" as const,
    hidden: true,
  },
  "zero-hesitacao": {
    name: "🎯 Zero Hesitação",
    description: "Respondeu 5 questões consecutivas em menos de 10 segundos cada",
    condition: "fastReactionTime",
    rarity: "rare" as const,
    hidden: true,
  },
};

export interface EasterEggContext {
  operationsPerformed: string[];
  alternativeMethods: number;
  recentOperationSpeed: number[];
  pagesRead: string[];
  operationsCombinationsTested: string[];
  perfectStreak: number;
  lastActivityTime: number;
  nightStudyHours: number;
  simulatorsUsedToday: string[];
  shareSolutionCount: number;
  reactionTimes: number[];
}

interface EasterEggRecord {
  unlockedAt: string;
  discoveredAt: string;
}

export class EasterEggDetector {
  private context: EasterEggContext;
  private unlockedRecords: Record<string, EasterEggRecord> = {};

  constructor() {
    this.context = {
      operationsPerformed: [],
      alternativeMethods: 0,
      recentOperationSpeed: [],
      pagesRead: [],
      operationsCombinationsTested: [],
      perfectStreak: 0,
      lastActivityTime: Date.now(),
      nightStudyHours: 0,
      simulatorsUsedToday: [],
      shareSolutionCount: 0,
      reactionTimes: [],
    };
    this.load();
  }

  checkAllEasterEggs(): EasterEggUnlock[] {
    const unlocked: EasterEggUnlock[] = [];

    if (this.detectUntaughtOperation()) {
      this.markUnlocked(unlocked, "descobridor-de-atalhos", "Operação não ensinada executada!");
    }

    if (this.context.alternativeMethods >= 3) {
      this.markUnlocked(unlocked, "ninja-matematico", "3 métodos alternativos usados!");
    }

    if (this.detectSpeedRun()) {
      this.markUnlocked(unlocked, "relampago", "100 operações em menos de 5 minutos!");
    }

    if (
      this.context.pagesRead.includes("FAQ") &&
      this.context.pagesRead.includes("Fundamentos")
    ) {
      this.markUnlocked(unlocked, "pesquisador-insaciavel", "100% de documentação lida!");
    }

    if (this.context.operationsCombinationsTested.length >= 6) {
      this.markUnlocked(unlocked, "experimentador", "Todas as combinações de operações testadas!");
    }

    if (this.context.perfectStreak >= 20) {
      this.markUnlocked(unlocked, "perfeccionista", "20 questões perfeitas seguidas!");
    }

    if (this.context.nightStudyHours >= 2) {
      this.markUnlocked(unlocked, "noite-insone", "2+ horas estudando de madrugada!");
    }

    if (this.context.simulatorsUsedToday.length >= 3) {
      this.markUnlocked(unlocked, "multidimensional", "Todos os simuladores usados no mesmo dia!");
    }

    if (this.context.shareSolutionCount >= 10) {
      this.markUnlocked(unlocked, "mentor", "10 soluções compartilhadas!");
    }

    if (this.detectFastReactionTime()) {
      this.markUnlocked(unlocked, "zero-hesitacao", "5 respostas super rápidas em sequência!");
    }

    this.persist();
    return unlocked;
  }

  getUnlockedEasterEggs(): EasterEggUnlock[] {
    return Object.entries(this.unlockedRecords).map(([badgeId, record]) => ({
      badgeId: badgeId as keyof typeof EASTER_EGG_DEFINITIONS,
      unlockedAt: record.unlockedAt,
      discoveredAt: record.discoveredAt,
    }));
  }

  private markUnlocked(
    unlocked: EasterEggUnlock[],
    badgeId: keyof typeof EASTER_EGG_DEFINITIONS,
    discoveredAt: string
  ) {
    if (this.unlockedRecords[badgeId]) return;
    this.unlockedRecords[badgeId] = {
      unlockedAt: new Date().toISOString(),
      discoveredAt,
    };
    unlocked.push({
      badgeId,
      unlockedAt: this.unlockedRecords[badgeId].unlockedAt,
      discoveredAt,
    });
  }

  private detectUntaughtOperation(): boolean {
    const taughtOperations = ["magnitude", "direction", "dot-product", "cross-product"];
    const untaught = this.context.operationsPerformed.some(
      (op) => !taughtOperations.includes(op)
    );
    return untaught;
  }

  private detectSpeedRun(): boolean {
    if (this.context.recentOperationSpeed.length < 100) return false;
    const total = this.context.recentOperationSpeed.reduce((a, b) => a + b, 0);
    const avgSpeed = total / this.context.recentOperationSpeed.length;
    return this.context.recentOperationSpeed.length === 100 && avgSpeed < 3;
  }

  private detectFastReactionTime(): boolean {
    if (this.context.reactionTimes.length < 5) return false;
    const last5 = this.context.reactionTimes.slice(-5);
    return last5.every((time) => time < 10);
  }

  recordOperation(operation: string) {
    this.context.operationsPerformed.push(operation);
    this.persist();
  }

  recordAlternativeMethod() {
    this.context.alternativeMethods += 1;
    this.persist();
  }

  recordOperationSpeed(seconds: number) {
    this.context.recentOperationSpeed.push(seconds);
    if (this.context.recentOperationSpeed.length > 100) {
      this.context.recentOperationSpeed.shift();
    }
    this.persist();
  }

  recordPageRead(page: string) {
    if (!this.context.pagesRead.includes(page)) {
      this.context.pagesRead.push(page);
    }
    this.persist();
  }

  recordOperationCombination(combo: string) {
    if (!this.context.operationsCombinationsTested.includes(combo)) {
      this.context.operationsCombinationsTested.push(combo);
    }
    this.persist();
  }

  updatePerfectStreak(correct: boolean) {
    this.context.perfectStreak = correct ? this.context.perfectStreak + 1 : 0;
    this.persist();
  }

  recordSimulatorUsage(simulatorType: string) {
    if (!this.context.simulatorsUsedToday.includes(simulatorType)) {
      this.context.simulatorsUsedToday.push(simulatorType);
    }
    this.persist();
  }

  recordShareSolution() {
    this.context.shareSolutionCount += 1;
    this.persist();
  }

  recordReactionTime(seconds: number) {
    this.context.reactionTimes.push(seconds);
    if (this.context.reactionTimes.length > 10) {
      this.context.reactionTimes.shift();
    }
    this.persist();
  }

  recordNightStudy(hours: number) {
    const now = new Date();
    const isNight = now.getHours() < 6 || now.getHours() >= 23;
    if (isNight) {
      this.context.nightStudyHours += hours;
    }
    this.persist();
  }

  private load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.context) {
          this.context = { ...this.context, ...parsed.context };
        }
        if (parsed.unlockedRecords) {
          // Descarta chaves desconhecidas vindas de localStorage (dados antigos ou corrompidos),
          // mantendo apenas easter eggs que ainda existem nas definições.
          const validKeys = new Set(Object.keys(EASTER_EGG_DEFINITIONS));
          this.unlockedRecords = Object.fromEntries(
            Object.entries(parsed.unlockedRecords as Record<string, EasterEggRecord>)
              .filter(([badgeId]) => validKeys.has(badgeId))
          );
        }
      }
    } catch (e) {
      // Dados corrompidos são ignorados silenciosamente
    }
  }

  private persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          context: this.context,
          unlockedRecords: this.unlockedRecords,
        })
      );
    } catch (e) {
      // Falha ao persistir não deve interromper a experiência
    }
  }
}

export interface EasterEggUnlock {
  badgeId: keyof typeof EASTER_EGG_DEFINITIONS;
  unlockedAt: string;
  discoveredAt: string;
}

let detectorInstance: EasterEggDetector | null = null;

export function getEasterEggDetector(): EasterEggDetector {
  if (!detectorInstance) {
    detectorInstance = new EasterEggDetector();
  }
  return detectorInstance;
}
