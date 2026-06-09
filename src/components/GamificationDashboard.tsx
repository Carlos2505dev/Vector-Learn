import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, TrendingUp, Award, Flame } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { BadgeSystem } from "./BadgeSystem";
import { Streaks } from "./Streaks";

export function GamificationDashboard() {
  const { 
    stats, 
    xpToNextLevel, 
    nextLevelXp, 
    currentLevelXp 
  } = useUserProgress();

  const currentLevelProgress = stats.xp - currentLevelXp;
  const xpNeededForCurrentLevelRange = nextLevelXp - currentLevelXp;
  const progressPercentage = (currentLevelProgress / xpNeededForCurrentLevelRange) * 100;

  const getWeeklyActivity = () => {
    const activity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      activity.push((stats.dailyXP || {})[dateStr] || 0);
    }
    return activity;
  };

  const weeklyActivity = getWeeklyActivity();

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy size={120} />
        </div>
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Star className="text-yellow-300 fill-yellow-300" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Nível Atual</p>
                  <h2 className="text-4xl font-black">Nível {stats.level}</h2>
                </div>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>{stats.xp} XP</span>
                <span>{nextLevelXp} XP para o Nível {stats.level + 1}</span>
              </div>
              <Progress value={progressPercentage} className="h-4 bg-white/20" />
              <p className="text-xs mt-2 opacity-80 text-right">Faltam {xpToNextLevel} XP para subir de nível</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <Card className="interactive-surface">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="text-vector-teal" />
                Estatísticas de Aprendizado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{stats.totalCorrectAnswers}</p>
                  <p className="text-xs text-muted-foreground">Respostas Certas</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{Math.round(stats.averageAccuracy)}%</p>
                  <p className="text-xs text-muted-foreground">Acurácia Média</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{stats.testsCompleted}</p>
                  <p className="text-xs text-muted-foreground">Provas Concluídas</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{stats.maxStreak}</p>
                  <p className="text-xs text-muted-foreground">Recorde de Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Streaks 
            streakData={{
              current: stats.currentStreak,
              longest: stats.maxStreak,
              thisWeek: weeklyActivity,
              thisMonth: Object.values(stats.dailyXP || {}).reduce((acc, curr) => acc + curr, 0),
              lastActivityDate: stats.lastActivity
            }} 
          />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card className="interactive-surface">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="text-vector-purple" />
                Suas Conquistas
              </CardTitle>
              <span className="text-sm font-medium text-muted-foreground">
                {stats.unlockedBadges.length} de 6 desbloqueadas
              </span>
            </CardHeader>
            <CardContent>
              <BadgeSystem unlockedBadges={stats.unlockedBadges} layout="grid" />
            </CardContent>
          </Card>

          <Card className="interactive-surface">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="text-vector-orange" />
                Próximos Marcos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stats.level >= 5 ? 'bg-vector-green text-white' : 'bg-muted text-muted-foreground'}`}>
                    5
                  </div>
                  <div className="flex-1 border-b pb-4">
                    <p className="font-bold">Especialista em Vetores</p>
                    <p className="text-sm text-muted-foreground">Alcance o nível 5 para desbloquear o certificado avançado.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stats.totalCorrectAnswers >= 50 ? 'bg-vector-green text-white' : 'bg-muted text-muted-foreground'}`}>
                    50
                  </div>
                  <div className="flex-1 border-b pb-4">
                    <p className="font-bold">Veterano de Guerra</p>
                    <p className="text-sm text-muted-foreground">Acerte 50 questões no quiz livre.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stats.maxStreak >= 10 ? 'bg-vector-green text-white' : 'bg-muted text-muted-foreground'}`}>
                    10
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">Imbatível</p>
                    <p className="text-sm text-muted-foreground">Alcance um streak de 10 acertos consecutivos.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
