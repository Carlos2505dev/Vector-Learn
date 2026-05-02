/** Easter Egg Badges - Desafios ocultos para exploração */
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
  /** Operações usadas (rastreia não ensinadas) */
  operationsPerformed: string[];
  /** Métodos alternativos usados em desafios */
  alternativeMethods: number;
  /** Velocidade total de operações recentes */
  recentOperationSpeed: number[]; // tempo em segundos
  /** Páginas lidas completamente */
  pagesRead: string[];
  /** Combinações de operações testadas */
  operationsCombinationsTested: string[]; // Changed from Set to array
  /** Streak perfeito atual */
  perfectStreak: number;
  /** Timestamp de última atividade */
  lastActivityTime: number;
  /** Horas estudadas em período noturno */
  nightStudyHours: number;
  /** Simuladores usados hoje */
  simulatorsUsedToday: string[]; // Changed from Set to array
  /** Vezes que compartilhou solução */
  shareSolutionCount: number;
  /** Tempos de reação recentes */
  reactionTimes: number[];
}

export class EasterEggDetector {
  private context: EasterEggContext;

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
  }

  /** Verifica todos os easter eggs baseado no contexto atual */
  checkAllEasterEggs(userStats: any): EasterEggUnlock[] {
    const unlocked: EasterEggUnlock[] = [];

    // 1. Descobridor de Atalhos
    if (this.detectUntaughtOperation()) {
      unlocked.push({
        badgeId: "descobridor-de-atalhos" as const,
        unlockedAt: new Date().toISOString(),
        discoveredAt: "Operação não ensinada executada!",
      });
    }

    // 2. Ninja Matemático
    if (this.context.alternativeMethods >= 3) {
      unlocked.push({
        badgeId: "ninja-matematico" as const,
        unlockedAt: new Date().toISOString(),
        discoveredAt: "3 métodos alternativos usados!",
      });
    }

    // 3. Relâmpago
    if (this.detectSpeedRun()) {
      unlocked.push({
        badgeId: "relampago" as const,
        unlockedAt: new Date().toISOString(),
        discoveredAt: "100 operações em menos de 5 minutos!",
      });
    }

    // 4. Pesquisador Insaciável
    if (
      this.context.pagesRead.includes("FAQ") &&
      this.context.pagesRead.includes("Fundamentos")
    ) {
      unlocked.push({
        badgeId: "pesquisador-insaciavel" as const,
        unlockedAt: new Date().toISOString(),
        discoveredAt: "100% de documentação lida!",
      });
    }

    // 5. Experimentador
    if (this.context.operationsCombinationsTested.length >= 6) {
      unlocked.push({
        badgeId: "experimentador" as const,
        unlockedAt: new Date().toISOString(),
        discoveredAt: "Todas as combinações de operações testadas!",
      });
    }

    // 6. Perfeccionista
    if (this.context.perfectStreak >= 20) {
      unlocked.push({
        badgeId: "perfeccionista" as const,
        unlockedAt: new Date().toISOString(),
        discoveredAt: "20 questões perfeitas seguidas!",
      });
    }

    // 7. Noite Insone
    if (this.context.nightStudyHours >= 2) {
      unlocked.push({
        badgeId: "noite-insone" as const,
        unlockedAt: new Date().toISOString(),
        discoveredAt: "2+ horas estudando de madrugada!",
      });
    }

    // 8. Multidimensional
    if (this.context.simulatorsUsedToday.length >= 3) {
      unlocked.push({
        badgeId: "multidimensional" as const,
        unlockedAt: new Date().toISOString(),
        discoveredAt: "Todos os simuladores usados no mesmo dia!",
      });
    }

    // 9. Mentor
    if (this.context.shareSolutionCount >= 10) {
      unlocked.push({
        badgeId: "mentor" as const,
        unlockedAt: new Date().toISOString(),
        discoveredAt: "10 soluções compartilhadas!",
      });
    }

    // 10. Zero Hesitação
    if (this.detectFastReactionTime()) {
      unlocked.push({
        badgeId: "zero-hesitacao" as const,
        unlockedAt: new Date().toISOString(),
        discoveredAt: "5 respostas super rápidas em sequência!",
      });
    }

    return unlocked;
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
    return this.context.recentOperationSpeed.length === 100 && avgSpeed < 3; // < 3 seg por operação
  }

  private detectFastReactionTime(): boolean {
    if (this.context.reactionTimes.length < 5) return false;
    const last5 = this.context.reactionTimes.slice(-5);
    return last5.every((time) => time < 10); // < 10 segundos cada
  }

  // Métodos para atualizar contexto
  recordOperation(operation: string) {
    this.context.operationsPerformed.push(operation);
    // Log para debug
  }

  recordAlternativeMethod() {
    this.context.alternativeMethods += 1;
  }

  recordOperationSpeed(seconds: number) {
    this.context.recentOperationSpeed.push(seconds);
    // Manter apenas últimas 100
    if (this.context.recentOperationSpeed.length > 100) {
      this.context.recentOperationSpeed.shift();
    }
  }

  recordPageRead(page: string) {
    if (!this.context.pagesRead.includes(page)) {
      this.context.pagesRead.push(page);
    }
  }

  recordOperationCombination(combo: string) {
    if (!this.context.operationsCombinationsTested.includes(combo)) {
      this.context.operationsCombinationsTested.push(combo);
    }
  }

  updatePerfectStreak(correct: boolean) {
    this.context.perfectStreak = correct ? this.context.perfectStreak + 1 : 0;
  }

  recordSimulatorUsage(simulatorType: string) {
    if (!this.context.simulatorsUsedToday.includes(simulatorType)) {
      this.context.simulatorsUsedToday.push(simulatorType);
    }
  }

  recordShareSolution() {
    this.context.shareSolutionCount += 1;
  }

  recordReactionTime(seconds: number) {
    this.context.reactionTimes.push(seconds);
    if (this.context.reactionTimes.length > 10) {
      this.context.reactionTimes.shift();
    }
  }

  recordNightStudy(hours: number) {
    const now = new Date();
    const isNight = now.getHours() < 6 || now.getHours() >= 23;
    if (isNight) {
      this.context.nightStudyHours += hours;
    }
  }
}

export interface EasterEggUnlock {
  badgeId: keyof typeof EASTER_EGG_DEFINITIONS;
  unlockedAt: string;
  discoveredAt: string; // Mensagem de descoberta
}

// Singleton para rastrear easter eggs globalmente
let detectorInstance: EasterEggDetector | null = null;

export function getEasterEggDetector(): EasterEggDetector {
  if (!detectorInstance) {
    detectorInstance = new EasterEggDetector();
  }
  return detectorInstance;
}
