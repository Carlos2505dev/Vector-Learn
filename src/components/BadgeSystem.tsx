import { motion } from "framer-motion";
import { Trophy, Zap, Target, Star, Medal, CheckCircle2, Flame, Gem, Swords, ClipboardCheck, GraduationCap, Rocket, Crown, Moon, Brain, Share2 } from "lucide-react";

export const BADGE_DEFINITIONS = {
  "first-correct": {
    name: "🥇 Primeiro Acerto",
    description: "Acertou sua primeira questão",
    icon: Trophy,
    rarity: "common" as const
  },
  "5-streak": {
    name: "🎯 5 Acertos Seguidos",
    description: "Resolveu 5 questões consecutivas corretamente",
    icon: Target,
    rarity: "rare" as const
  },
  "quick-solve": {
    name: "⚡ Resolvedor Rápido",
    description: "Completou uma questão em menos de 60 segundos",
    icon: Zap,
    rarity: "rare" as const
  },
  "10-correct": {
    name: "🎯 Primeira Dezena",
    description: "Acertou 10 questões no total",
    icon: CheckCircle2,
    rarity: "common" as const
  },
  "50-correct": {
    name: "🔥 Metade do Caminho",
    description: "Acertou 50 questões no total",
    icon: Flame,
    rarity: "rare" as const
  },
  "100-correct": {
    name: "💯 Centurião",
    description: "Acertou 100 questões no total",
    icon: Gem,
    rarity: "epic" as const
  },
  "10-streak": {
    name: "⚔️ Fogo Contínuo",
    description: "Alcançou 10 acertos consecutivos",
    icon: Swords,
    rarity: "epic" as const
  },
  "first-test": {
    name: "📝 Primeira Prova",
    description: "Concluiu sua primeira prova no modo certificado",
    icon: ClipboardCheck,
    rarity: "common" as const
  },
  "5-tests": {
    name: "🎓 Veterano de Provas",
    description: "Concluiu 5 provas no modo certificado",
    icon: GraduationCap,
    rarity: "rare" as const
  },
  "level-5": {
    name: "🚀 Ascensão",
    description: "Alcançou o nível 5",
    icon: Rocket,
    rarity: "rare" as const
  },
  "level-10": {
    name: "👑 Domínio Absoluto",
    description: "Alcançou o nível 10",
    icon: Crown,
    rarity: "legendary" as const
  },
  "night-owl": {
    name: "🌙 Coruja Noturna",
    description: "Respondeu 10 questões entre 23h e 6h",
    icon: Moon,
    rarity: "rare" as const
  },
  "master-fundamentals": {
    name: "🏆 Mestre dos Fundamentos",
    description: "Dominou todos os conceitos fundamentais",
    icon: Medal,
    rarity: "epic" as const
  },
  "smart-solver": {
    name: "🧠 Mente Brilhante",
    description: "Usou o Resolvedor Inteligente do simulador",
    icon: Brain,
    rarity: "rare" as const
  },
  "simulator-master": {
    name: "🌟 Explorador do Simulador",
    description: "Visitou todos os simuladores (2D, 3D e Fluidos)",
    icon: Star,
    rarity: "legendary" as const
  },
  "community-explorer": {
    name: "🎤 Embaixador",
    description: "Compartilhou seu progresso 3 vezes",
    icon: Share2,
    rarity: "epic" as const
  }
};

export interface BadgeUnlock {
  badgeId: keyof typeof BADGE_DEFINITIONS;
  unlockedAt: string;
}

interface BadgeSystemProps {
  unlockedBadges: BadgeUnlock[];
  layout?: "grid" | "list" | "compact";
  showLocked?: boolean;
}

export function BadgeSystem({ unlockedBadges, layout = "grid", showLocked = true }: BadgeSystemProps) {
  const unlockedIds = new Set(unlockedBadges.map(b => b.badgeId));
  const allBadges = Object.entries(BADGE_DEFINITIONS);

  const rarityBadgeColors = {
    common: "bg-gray-600",
    rare: "bg-blue-600",
    epic: "bg-purple-600",
    legendary: "bg-yellow-600"
  };

  const rarityBorderColors = {
    common: "border-gray-300 dark:border-gray-600",
    rare: "border-blue-300 dark:border-blue-600",
    epic: "border-purple-300 dark:border-purple-600",
    legendary: "border-yellow-300 dark:border-yellow-600"
  };

  const rarityBgColors = {
    common: "bg-gray-50 dark:bg-gray-900",
    rare: "bg-blue-50 dark:bg-blue-900",
    epic: "bg-purple-50 dark:bg-purple-900",
    legendary: "bg-yellow-50 dark:bg-yellow-900"
  };

  if (layout === "grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allBadges.map(([badgeId, badgeDef], index) => {
          const Icon = badgeDef.icon;
          const isUnlocked = unlockedIds.has(badgeId as keyof typeof BADGE_DEFINITIONS);

          if (!isUnlocked && !showLocked) return null;

          return (
            <motion.div
              key={badgeId}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`interactive-surface border-2 p-4 text-center relative overflow-hidden cursor-pointer hover:shadow-lg transition-all rounded-lg ${
                isUnlocked
                  ? `${rarityBgColors[badgeDef.rarity]}`
                  : "opacity-40 grayscale"
              } ${rarityBorderColors[badgeDef.rarity]}`}
            >
              <motion.div
                animate={isUnlocked ? { scale: [1, 1.15, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                className="mb-3 flex justify-center"
              >
                <Icon className="w-8 h-8" />
              </motion.div>

              <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-2 border-transparent text-white ${rarityBadgeColors[badgeDef.rarity]}`}>
                {badgeDef.rarity === "common"
                  ? "Comum"
                  : badgeDef.rarity === "rare"
                  ? "Raro"
                  : badgeDef.rarity === "epic"
                  ? "Épico"
                  : "Lendário"}
              </div>

              <p className="font-bold text-sm mb-1">{badgeDef.name}</p>
              <p className="text-xs text-muted-foreground">{badgeDef.description}</p>

              {isUnlocked && (
                <motion.p className="text-xs text-vector-teal mt-2 font-semibold">
                  ✓ Desbloqueado
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div className="space-y-3">
        {allBadges.map(([badgeId, badgeDef], index) => {
          const Icon = badgeDef.icon;
          const isUnlocked = unlockedIds.has(badgeId as keyof typeof BADGE_DEFINITIONS);
          const unlockedData = unlockedBadges.find(b => b.badgeId === badgeId);

          if (!isUnlocked && !showLocked) return null;

          return (
            <motion.div
              key={badgeId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`interactive-surface border-l-4 rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex items-center gap-4 ${rarityBgColors[badgeDef.rarity]} ${isUnlocked ? "" : "opacity-40 grayscale"} ${rarityBorderColors[badgeDef.rarity]}`}
            >
              <div className="flex-shrink-0">
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold">{badgeDef.name}</p>
                  <div className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-white ${rarityBadgeColors[badgeDef.rarity]}`}>
                    {badgeDef.rarity.charAt(0).toUpperCase() + badgeDef.rarity.slice(1)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{badgeDef.description}</p>
              </div>

              {isUnlocked && (
                <div className="text-right">
                  <p className="text-sm font-semibold text-vector-teal">✓</p>
                  {unlockedData && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(unlockedData.unlockedAt).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {allBadges.map(([badgeId, badgeDef], index) => {
        const Icon = badgeDef.icon;
        const isUnlocked = unlockedIds.has(badgeId as keyof typeof BADGE_DEFINITIONS);

        if (!isUnlocked && !showLocked) return null;

        return (
          <motion.div
            key={badgeId}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className="relative group"
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                isUnlocked
                  ? `bg-gradient-to-br ${
                      badgeDef.rarity === "common"
                        ? "from-gray-200 to-gray-300"
                        : badgeDef.rarity === "rare"
                        ? "from-blue-200 to-blue-300"
                        : badgeDef.rarity === "epic"
                        ? "from-purple-200 to-purple-300"
                        : "from-yellow-200 to-yellow-300"
                    }`
                  : "bg-muted opacity-30 grayscale"
              }`}
            >
              <Icon className="w-6 h-6" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded p-2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg"
            >
              <p className="font-semibold">{badgeDef.name}</p>
              <p className="text-muted-foreground">{badgeDef.description}</p>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
