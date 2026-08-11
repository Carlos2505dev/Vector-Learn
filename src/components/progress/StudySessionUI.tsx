import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle, CheckCircle, Coffee } from "lucide-react";
import { useStudySession } from "@/hooks/useStudySession";

interface StudySessionUIProps {
  onBreakSuggested?: () => void;
  onBreakTaken?: () => void;
  showAdvancedMetrics?: boolean;
}

export function StudySessionUI({
  onBreakSuggested,
  onBreakTaken,
  showAdvancedMetrics = false,
}: StudySessionUIProps) {
  const session = useStudySession();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showBreakAlert, setShowBreakAlert] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (session.shouldTakeBreak && !showBreakAlert) {
      setShowBreakAlert(true);
      onBreakSuggested?.();
    }
  }, [session.shouldTakeBreak, showBreakAlert, onBreakSuggested]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const errorRate =
    session.currentSession.questionsAttempted > 0
      ? Math.round(
          ((session.currentSession.questionsAttempted -
            session.currentSession.correctAnswers) /
            session.currentSession.questionsAttempted) *
            100
        )
      : 0;

  const isSessionHealthy = errorRate < 40;

  return (
    <div className="w-full space-y-3">
      <Card
        className={`border-2 transition-all ${
          session.isFatigued
            ? "border-red-400 bg-red-50/50 dark:bg-red-950/30"
            : isSessionHealthy
            ? "border-green-400 bg-green-50/50 dark:bg-green-950/30"
            : "border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/30"
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <CardTitle>Sessão de Estudo</CardTitle>
            </div>
            <Badge
              variant={session.isFatigued ? "destructive" : isSessionHealthy ? "default" : "secondary"}
            >
              {session.isFatigued ? "🔴 Cansaço" : isSessionHealthy ? "🟢 Saudável" : "🟡 Aviso"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <motion.div
            className="text-center py-6"
            animate={{ scale: session.isFatigued ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: session.isFatigued ? Infinity : 0, duration: 1.5 }}
          >
            <p className="text-5xl font-bold font-mono text-foreground">
              {formatTime(elapsedSeconds)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Tempo decorrido</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="p-2 rounded-lg bg-background/50">
              <p className="font-bold text-lg text-foreground">
                {session.currentSession.questionsAttempted}
              </p>
              <p className="text-xs text-muted-foreground">Questões</p>
            </div>
            <div className="p-2 rounded-lg bg-background/50">
              <p className="font-bold text-lg text-green-600">
                {session.currentSession.correctAnswers}
              </p>
              <p className="text-xs text-muted-foreground">Corretas</p>
            </div>
            <div
              className={`p-2 rounded-lg bg-background/50 ${
                errorRate > 50 ? "text-red-600" : "text-foreground"
              }`}
            >
              <p className="font-bold text-lg">{errorRate}%</p>
              <p className="text-xs text-muted-foreground">Erro</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Qualidade da Sessão</span>
              <span className="font-semibold">{isSessionHealthy ? "✅" : session.isFatigued ? "❌" : "⚠️"}</span>
            </div>
            <Progress
              value={Math.max(0, 100 - errorRate)}
              className="h-2"
            />
          </div>

          {session.currentSession.consecutiveErrors > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-xs text-red-700 dark:text-red-300"
            >
              ⚠️ {session.currentSession.consecutiveErrors} erro(s) consecutivo(s)
            </motion.div>
          )}

          {session.xpBonus > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-xs text-amber-700 dark:text-amber-300 text-center font-semibold"
            >
              ⭐ +{session.xpBonus} XP Bonus por Focus!
            </motion.div>
          )}

          <div className="flex gap-2 pt-2">
            <Button className="flex-1" size="sm">
              Continuar Estudando
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Finalizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showBreakAlert && session.shouldTakeBreak && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-400 dark:border-amber-700"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 dark:text-amber-200">
                  Você está cansado! 😴
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                  {errorRate > 70
                    ? `Taxa de erro está em ${errorRate}%. `
                    : "Detectamos"}
                  Recomendamos um intervalo de {session.suggestedBreakDuration} minutos.
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                  💡 Quando você voltar, ganhará +50 XP!
                </p>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => {
                      session.currentSession;
                      onBreakTaken?.();
                      setShowBreakAlert(false);
                    }}
                  >
                    <Coffee className="w-4 h-4 mr-1" />
                    Tomar Pausa
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowBreakAlert(false)}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAdvancedMetrics && session.sessionHistory.length > 0 && (
        <Card className="border border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Histórico de Sessões</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {session.sessionHistory.slice(-3).map((sess, idx) => {
              const accuracy =
                sess.questionsAttempted > 0
                  ? Math.round((sess.correctAnswers / sess.questionsAttempted) * 100)
                  : 0;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-background/50"
                >
                  <span>Sessão {idx + 1}</span>
                  <span className="font-semibold">
                    {accuracy}% • {sess.questionsAttempted} Q
                  </span>
                  {accuracy >= 80 && <CheckCircle className="w-3 h-3 text-green-600" />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
