import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Target, Award, Calendar } from "lucide-react";

export interface StreakData {
  current: number;
  longest: number;
  thisWeek: number[];
  thisMonth: number;
  lastActivityDate: string;
}

interface StreaksProps {
  streakData: StreakData;
  onStreakClick?: () => void;
}

export function Streaks({ streakData, onStreakClick }: StreaksProps) {
  const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
  
  // Generate last 7 days activity
  const getLast7Days = () => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date,
        dayOfWeek: daysOfWeek[date.getDay()],
        activity: streakData.thisWeek[i] || 0
      });
    }
    return days;
  };

  const last7Days = getLast7Days();
  const maxActivity = Math.max(...streakData.thisWeek, 1);

  return (
    <div className="w-full space-y-6">
      {/* Main Streak Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-3 gap-4"
      >
        {/* Current Streak */}
        <Card className="interactive-surface p-6 text-center ring-2 ring-vector-orange/50 cursor-pointer hover:ring-vector-orange transition-all" onClick={onStreakClick}>
          <CardContent className="p-0">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block mb-3"
            >
              <Flame className="w-10 h-10 text-vector-orange mx-auto" />
            </motion.div>
            <p className="text-3xl font-black text-vector-orange mb-1">{streakData.current}</p>
            <p className="text-xs text-muted-foreground">Dias Seguidos</p>
          </CardContent>
        </Card>

        {/* Longest Streak */}
        <Card className="interactive-surface p-6 text-center">
          <CardContent className="p-0">
            <Award className="w-10 h-10 text-vector-blue mx-auto mb-3" />
            <p className="text-3xl font-black text-vector-blue mb-1">{streakData.longest}</p>
            <p className="text-xs text-muted-foreground">Melhor Série</p>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card className="interactive-surface p-6 text-center">
          <CardContent className="p-0">
            <Calendar className="w-10 h-10 text-vector-teal mx-auto mb-3" />
            <p className="text-3xl font-black text-vector-teal mb-1">{streakData.thisMonth}</p>
            <p className="text-xs text-muted-foreground">Este Mês</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Activity Chart */}
      <Card className="interactive-surface p-6">
        <h4 className="font-bold mb-4">Atividade Desta Semana</h4>
        
        <div className="flex items-end justify-between gap-2" style={{ height: "150px" }}>
          {last7Days.map((day, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${(day.activity / maxActivity) * 100}%` || "10px" }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="flex-1 flex flex-col items-center justify-end group relative"
            >
              <div className={`w-full rounded-t-lg transition-all duration-300 ${
                day.activity > 0 
                  ? "bg-gradient-to-t from-vector-blue to-vector-teal" 
                  : "bg-muted"
              } hover:shadow-lg`} />
              
              <div className="text-center mt-3">
                <p className="text-xs font-bold">{day.dayOfWeek}</p>
                <p className="text-xs text-muted-foreground">{day.activity > 0 ? `${day.activity} XP` : "-"}</p>
              </div>

              {/* Tooltip */}
              {day.activity > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full mb-2 bg-card border border-border rounded p-2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                >
                  {day.activity} XP
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          última atividade em {new Date(streakData.lastActivityDate).toLocaleDateString("pt-BR")}
        </p>
      </Card>

      {/* Motivation Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-vector-orange/10 border border-vector-orange/30 rounded-lg"
      >
        <p className="text-sm font-semibold text-vector-orange">
          {streakData.current >= 7 
            ? "🎯 Você está arrasando! Mantenha o ritmo!"
            : streakData.current >= 3
            ? "🔥 Ótimo progresso! Continue estudando!"
            : "💪 Comece sua série agora! Volte amanhã!"}
        </p>
      </motion.div>
    </div>
  );
}
