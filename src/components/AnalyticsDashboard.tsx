import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Target, Zap, BookOpen, Clock } from "lucide-react";

export interface AnalyticsData {
  totalChallengesCompleted: number;
  totalHoursLearned: number;
  averageAccuracy: number;
  conceptsMastered: number;
  recentProgress: { date: string; improvement: number }[];
  strongConcepts: string[];
  weakConcepts: string[];
  learningPace: "slow" | "moderate" | "fast";
}

interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
}

export function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  const statsCards = [
    {
      title: "Desafios Completos",
      value: analytics.totalChallengesCompleted,
      icon: Target,
      color: "vector-blue",
      bgColor: "bg-blue-50"
    },
    {
      title: "Horas Estudadas",
      value: `${analytics.totalHoursLearned}h`,
      icon: Clock,
      color: "vector-teal",
      bgColor: "bg-teal-50"
    },
    {
      title: "Precisão Média",
      value: `${analytics.averageAccuracy}%`,
      icon: Target,
      color: "vector-orange",
      bgColor: "bg-orange-50"
    },
    {
      title: "Conceitos Dominados",
      value: analytics.conceptsMastered,
      icon: Brain,
      color: "vector-blue",
      bgColor: "bg-blue-50"
    }
  ];

  const paceColors = {
    slow: "text-yellow-600 bg-yellow-50",
    moderate: "text-blue-600 bg-blue-50",
    fast: "text-green-600 bg-green-50"
  };

  const paceLabels = {
    slow: "Ritmo Moderado",
    moderate: "Ritmo Acelerado",
    fast: "Ritmo Avançado"
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <Card className={`interactive-surface h-full ${stat.bgColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Icon className={`w-8 h-8 text-${stat.color}`} />
                    <Zap className="w-4 h-4 text-vector-orange opacity-60" />
                  </div>
                  <p className="text-3xl font-black mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strong vs Weak Concepts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="interactive-surface h-full">
            <CardHeader className="pb-4">
              <h3 className="font-bold flex items-center gap-2">
                <span className="text-green-600">✓</span> Pontos Fortes
              </h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {analytics.strongConcepts.map((concept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (0.3 + index * 0.05) }}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <span className="text-sm font-medium">{concept}</span>
                  <Badge className="bg-green-600 hover:bg-green-700">
                    Dominado
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="interactive-surface h-full">
            <CardHeader className="pb-4">
              <h3 className="font-bold flex items-center gap-2">
                <span className="text-orange-600">!</span> Pontos Fracos
              </h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {analytics.weakConcepts.map((concept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (0.3 + index * 0.05) }}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <span className="text-sm font-medium">{concept}</span>
                  <Badge className="bg-orange-600 hover:bg-orange-700">
                    A Melhorar
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Learning Pace & Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="interactive-surface">
          <CardHeader className="pb-4">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-vector-blue" />
              Seu Ritmo de Aprendizado
            </h3>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg ${paceColors[analytics.learningPace]}`}>
              <p className="text-lg font-bold mb-2">{paceLabels[analytics.learningPace]}</p>
              <p className="text-sm">
                {analytics.learningPace === "fast"
                  ? "Você está superando nossas expectativas! Continue assim! 🚀"
                  : analytics.learningPace === "moderate"
                  ? "Ritmo excelente! Você está progredindo bem! 💪"
                  : "Sem pressa! Qualidade é melhor que velocidade! 📚"}
              </p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: analytics.learningPace === "fast" ? "100%" : analytics.learningPace === "moderate" ? "70%" : "40%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-vector-blue to-vector-teal"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="interactive-surface">
          <CardHeader className="pb-4">
            <h3 className="font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-vector-teal" />
              Progresso Recente
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentProgress.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-2 border-l-4 border-vector-teal bg-teal-50/50 rounded"
                >
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                  <span className="text-sm font-bold text-vector-teal">
                    +{item.improvement}%
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 bg-vector-blue/10 border border-vector-blue/30 rounded-lg"
      >
        <p className="text-sm">
          <span className="font-bold text-vector-blue">💡 Recomendação:</span>
          <br />
          {analytics.weakConcepts.length > 0
            ? `Você ainda precisa melhorar em ${analytics.weakConcepts[0]}. Recomendamos revisar esse conceito com nossos desafios personalizados!`
            : "Parabéns! Você está com um desempenho excelente em todos os conceitos!"}
        </p>
      </motion.div>
    </div>
  );
}
