import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Target, Star, Sparkles, Medal } from "lucide-react";

// 6 Badges específicos do usuário
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
  "master-fundamentals": {
    name: "🏆 Mestre dos Fundamentos",
    description: "Dominou todos os conceitos fundamentais",
    icon: Medal,
    rarity: "epic" as const
  },
  "simulator-master": {
    name: "🌟 Explorador do Simulador",
    description: "Exploração completa de todos os recursos do simulador",
    icon: Star,
    rarity: "legendary" as const
  },
  "community-explorer": {
    name: "🤝 Explorador da Comunidade",
    description: "Participou ativamente em 10 discussões",
    icon: Sparkles,
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

  // Grid Layout
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
            >
              <Card
                className={`interactive-surface border-2 p-4 text-center relative overflow-hidden cursor-pointer hover:shadow-lg transition-all ${
                  isUnlocked
                    ? `${rarityBgColors[badgeDef.rarity]}`
                    : "opacity-40 grayscale"
                } ${rarityBorderColors[badgeDef.rarity]}`}
              >
                <CardContent className="p-0">
                  <motion.div
                    animate={isUnlocked ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                    className="mb-3 flex justify-center"
                  >
                    <Icon className="w-8 h-8" />
                  </motion.div>

                  <Badge className={`mb-2 ${rarityBadgeColors[badgeDef.rarity]}`}>
                    {badgeDef.rarity === "common"
                      ? "Comum"
                      : badgeDef.rarity === "rare"
                      ? "Raro"
                      : badgeDef.rarity === "epic"
                      ? "Épico"
                      : "Lendário"}
                  </Badge>

                  <p className="font-bold text-sm mb-1">{badgeDef.name}</p>
                  <p className="text-xs text-muted-foreground">{badgeDef.description}</p>

                  {isUnlocked && (
                    <motion.p className="text-xs text-vector-teal mt-2 font-semibold">
                      ✓ Desbloqueado
                    </motion.p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // List Layout
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
            >
              <Card className={`interactive-surface border-l-4 ${rarityBgColors[badgeDef.rarity]} ${isUnlocked ? "" : "opacity-40 grayscale"} ${rarityBorderColors[badgeDef.rarity]}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold">{badgeDef.name}</p>
                      <Badge className={`text-xs ${rarityBadgeColors[badgeDef.rarity]}`}>
                        {badgeDef.rarity.charAt(0).toUpperCase() + badgeDef.rarity.slice(1)}
                      </Badge>
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
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Compact Layout
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

            {/* Tooltip */}
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
