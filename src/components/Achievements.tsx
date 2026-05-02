import { motion } from "framer-motion";
import { Trophy, Star, Zap, Target, Flame, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface AchievementsProps {
  achievements: Achievement[];
  layout?: "grid" | "list" | "compact";
}

const rarityColors = {
  common: "from-gray-400 to-gray-500",
  uncommon: "from-green-400 to-green-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-orange-400 to-orange-600"
};

const rarityBadgeColors = {
  common: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  uncommon: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  rare: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  epic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  legendary: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
};

export function Achievements({ achievements, layout = "grid" }: AchievementsProps) {
  if (layout === "compact") {
    return (
      <div className="flex flex-wrap gap-3">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          const isUnlocked = !!achievement.unlockedAt;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${rarityColors[achievement.rarity]} flex items-center justify-center ${!isUnlocked && "opacity-40 grayscale"} transition-all duration-300 group-hover:scale-110`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              {achievement.maxProgress && achievement.progress! < achievement.maxProgress && (
                <div className="absolute bottom-0 right-0 bg-muted text-xs font-bold rounded-full -mr-2 -mb-2 w-6 h-6 flex items-center justify-center">
                  {achievement.progress}/{achievement.maxProgress}
                </div>
              )}
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                <div className="bg-card border border-border rounded-lg p-2 text-xs whitespace-nowrap shadow-lg">
                  {achievement.name}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div className="space-y-3">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          const isUnlocked = !!achievement.unlockedAt;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${!isUnlocked && "opacity-60 grayscale"}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${rarityColors[achievement.rarity]} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{achievement.name}</h4>
                      <Badge className={rarityBadgeColors[achievement.rarity]}>
                        {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    
                    {achievement.maxProgress && achievement.progress! < achievement.maxProgress && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-vector-blue to-vector-teal transition-all duration-300"
                            style={{ width: `${(achievement.progress! / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {isUnlocked && (
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {achievements.map((achievement, index) => {
        const Icon = achievement.icon;
        const isUnlocked = !!achievement.unlockedAt;

        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="group"
          >
            <Card className={`h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${!isUnlocked && "opacity-50 grayscale"}`}>
              <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${rarityColors[achievement.rarity]} flex items-center justify-center mb-3 transition-all group-hover:shadow-lg`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              
              <h4 className="font-semibold text-sm mb-1">{achievement.name}</h4>
              <Badge className={`${rarityBadgeColors[achievement.rarity]} text-xs mb-2`}>
                {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
              </Badge>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
              
              {achievement.maxProgress && achievement.progress! < achievement.maxProgress && (
                <div className="mt-3 w-full">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                    <div 
                      className="h-full bg-gradient-to-r from-vector-blue to-vector-teal transition-all duration-300"
                      style={{ width: `${(achievement.progress! / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
