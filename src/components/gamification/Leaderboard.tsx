import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Flame, Crown } from "lucide-react";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  level: number;
  streak?: number;
  completedChallenges?: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
  timeframe?: "week" | "month" | "all-time";
}

export function Leaderboard({ entries, currentUserRank, timeframe = "week" }: LeaderboardProps) {
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-500" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
    }
  };

  const timeframeLabel = {
    week: "Esta Semana",
    month: "Este Mês",
    "all-time": "Todos os Tempos"
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-vector-orange" />
          Ranking
        </h2>
        <span className="px-3 py-1 bg-vector-blue/10 text-vector-blue text-sm font-semibold rounded-full">
          {timeframeLabel[timeframe]}
        </span>
      </div>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <motion.div
            key={`${entry.rank}-${entry.name}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`${currentUserRank === entry.rank ? "ring-2 ring-vector-blue" : ""}`}
          >
            <Card className={`interactive-surface p-4 ${entry.rank <= 3 ? "bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-yellow-500/20" : ""}`}>
              <CardContent className="p-0 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    {getMedalIcon(entry.rank)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold">{entry.name}</h4>
                      {entry.streak !== undefined && entry.streak > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-vector-orange/10 rounded-full">
                          <Flame className="w-3 h-3 text-vector-orange" />
                          <span className="text-xs font-bold text-vector-orange">{entry.streak}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>Nível {entry.level}</span>
                      {entry.completedChallenges !== undefined && (
                        <span>{entry.completedChallenges} desafios</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold text-vector-blue">{entry.points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">pontos</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {currentUserRank && !entries.some(e => e.rank === currentUserRank) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border-t-2 border-dashed border-border pt-4 mt-4"
        >
          <Card className="interactive-surface p-4 ring-2 ring-vector-blue">
            <CardContent className="p-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-vector-blue/20 rounded-lg font-bold text-vector-blue">
                  {currentUserRank}
                </div>
                <div>
                  <h4 className="font-bold">Você</h4>
                  <p className="text-xs text-muted-foreground">Sua posição atual</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-vector-blue">...</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
