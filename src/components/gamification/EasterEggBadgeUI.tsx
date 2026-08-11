import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles } from "lucide-react";
import { EASTER_EGG_DEFINITIONS, type EasterEggUnlock } from "@/hooks/gamification/useEasterEggs";

interface EasterEggNotificationProps {
  unlockedBadge: EasterEggUnlock;
  onDismiss?: () => void;
  autoHideAfter?: number;
}

export function EasterEggNotification({
  unlockedBadge,
  onDismiss,
  autoHideAfter = 5000,
}: EasterEggNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const badge = EASTER_EGG_DEFINITIONS[unlockedBadge.badgeId];

  useEffect(() => {
    if (autoHideAfter) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoHideAfter);

      return () => clearTimeout(timer);
    }
  }, [autoHideAfter, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!badge) return null;

  const rarityColors = {
    common: "from-gray-400 to-gray-600",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-yellow-600",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: "spring", damping: 15 }}
          className="fixed top-4 right-4 z-50 w-full max-w-sm"
        >
          <Card className={`bg-gradient-to-br ${rarityColors[badge.rarity]} border-0 shadow-2xl`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex-shrink-0"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-bold text-white text-sm"
                  >
                    🎉 Novo Badge Desbloqueado!
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="text-white/90 text-base font-bold mt-1"
                  >
                    {badge.name}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/80 text-xs mt-1"
                  >
                    {badge.description}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-white/70 text-xs mt-2 italic"
                  >
                    ✨ {unlockedBadge.discoveredAt}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-2"
                  >
                    <Badge className="bg-white/20 text-white border-0">
                      {badge.rarity === "common"
                        ? "Comum"
                        : badge.rarity === "rare"
                        ? "Raro"
                        : badge.rarity === "epic"
                        ? "Épico"
                        : "Lendário"}
                    </Badge>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {autoHideAfter && (
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: autoHideAfter / 1000, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-1 bg-white/40 rounded-full"
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface EasterEggBadgeGridProps {
  unlockedBadges: EasterEggUnlock[];
  showLocked?: boolean;
}

export function EasterEggBadgeGrid({
  unlockedBadges,
  showLocked = true,
}: EasterEggBadgeGridProps) {
  const unlockedIds = new Set(unlockedBadges.map((b) => b.badgeId));
  const allBadges = Object.entries(EASTER_EGG_DEFINITIONS);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-vector-teal" />
          Easter Egg Badges ({unlockedIds.size}/{allBadges.length})
        </h3>
        <span className="text-xs text-muted-foreground">Descobertos</span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {allBadges.map(([badgeId, badge], idx) => {
          const isUnlocked = unlockedIds.has(badgeId as any);
          const unlockedData = unlockedBadges.find((b) => b.badgeId === badgeId as any);

          if (!isUnlocked && !showLocked) return null;

          const rarityBgColors = {
            common: "bg-gray-100 dark:bg-gray-900",
            rare: "bg-blue-100 dark:bg-blue-900",
            epic: "bg-purple-100 dark:bg-purple-900",
            legendary: "bg-yellow-100 dark:bg-yellow-900",
          };

          const rarityBorderColors = {
            common: "border-gray-300 dark:border-gray-700",
            rare: "border-blue-300 dark:border-blue-700",
            epic: "border-purple-300 dark:border-purple-700",
            legendary: "border-yellow-300 dark:border-yellow-700",
          };

          return (
            <motion.div
              key={badgeId}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
              className={`p-3 rounded-lg border-2 text-center cursor-default transition-all ${
                isUnlocked
                  ? `${rarityBgColors[badge.rarity]} ${rarityBorderColors[badge.rarity]}`
                  : "bg-muted/50 border-muted opacity-50 grayscale"
              }`}
            >
              <div className="text-2xl mb-1">{badge.name.split(" ")[0]}</div>
              <p className="text-xs font-bold line-clamp-2">{badge.name.slice(2)}</p>

              {isUnlocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 + 0.3 }}
                  className="mt-1"
                >
                  <span className="text-xs text-vector-teal font-semibold">✓</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(unlockedData!.unlockedAt).toLocaleDateString("pt-BR")}
                  </p>
                </motion.div>
              )}

              {!isUnlocked && (
                <p className="text-xs text-muted-foreground mt-1">🔒 Oculto</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
