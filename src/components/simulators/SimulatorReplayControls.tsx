import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  SkipBack,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Bookmark,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { useSimulatorReplayControls, type SimulatorSnapshot } from "@/hooks/useSimulatorHistory";
import { Badge } from "@/components/ui/badge";

interface SimulatorReplayControlsProps {
  replayControls: ReturnType<typeof useSimulatorReplayControls>;
  onStepChange?: (snapshot: SimulatorSnapshot) => void;
  isPlaying?: boolean;
  onPlayToggle?: (playing: boolean) => void;
}

export function SimulatorReplayControls({
  replayControls,
  onStepChange,
  isPlaying = false,
  onPlayToggle,
}: SimulatorReplayControlsProps) {
  const metadata = replayControls.getSessionMetadata();
  const hasQuickAccess = Math.abs(replayControls.currentStepIndex) < replayControls.history.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-3"
    >
      <Card className="border-2 border-vector-teal/20 bg-background/95 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">⏱️ Session Replay</CardTitle>
              {metadata && (
                <p className="text-xs text-muted-foreground mt-1">
                  Passo {replayControls.currentStepIndex + 1} de {replayControls.history.length} •{" "}
                  {Math.round(metadata.duration)}s
                </p>
              )}
            </div>
            <motion.div
              animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Badge variant={isPlaying ? "default" : "secondary"}>
                {isPlaying ? "▶️ Reproduzindo" : "⏸️ Pausado"}
              </Badge>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Timeline</span>
              <span className="text-xs font-semibold">
                {Math.round(replayControls.progress * 100)}%
              </span>
            </div>
            <Slider
              value={[replayControls.currentStepIndex]}
              max={Math.max(replayControls.history.length - 1, 0)}
              min={0}
              step={1}
              onValueChange={(vals) => {
                const snapshot = replayControls.goToStep(vals[0]);
                if (snapshot) onStepChange?.(snapshot);
              }}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  const snapshot = replayControls.replayFromStart();
                  if (snapshot) onStepChange?.(snapshot);
                }}
                title="Voltar pro início"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                variant="outline"
                disabled={!replayControls.canGoBack}
                onClick={() => {
                  const snapshot = replayControls.previousStep();
                  if (snapshot) onStepChange?.(snapshot);
                }}
                title="Passo anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                className="bg-vector-teal hover:bg-vector-teal/90"
                onClick={() => onPlayToggle?.(!isPlaying)}
                title={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                variant="outline"
                disabled={!replayControls.canGoForward}
                onClick={() => {
                  const snapshot = replayControls.nextStep();
                  if (snapshot) onStepChange?.(snapshot);
                }}
                title="Próximo passo"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  const snapshot = replayControls.goToStep(
                    replayControls.history.length - 1
                  );
                  if (snapshot) onStepChange?.(snapshot);
                }}
                title="Ir pro final"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                variant={replayControls.checkpoint ? "default" : "outline"}
                onClick={() => {
                  if (replayControls.checkpoint) {
                    const snapshot = replayControls.goToCheckpoint();
                    if (snapshot) onStepChange?.(snapshot);
                  } else {
                    replayControls.createCheckpoint();
                  }
                }}
                title={
                  replayControls.checkpoint
                    ? "Ir pro checkpoint"
                    : "Criar checkpoint"
                }
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {replayControls.checkpoint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-200"
            >
              📍 Checkpoint salvo no passo {replayControls.checkpoint.stepIndex + 1}
            </motion.div>
          )}

          {metadata && (
            <div className="pt-2 border-t grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="font-semibold text-foreground">{metadata.totalSteps}</p>
                <p className="text-muted-foreground">Passos</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">{metadata.operationCount}</p>
                <p className="text-muted-foreground">Operações</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">{Math.round(metadata.duration)}s</p>
                <p className="text-muted-foreground">Duração</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-200"
      >
        <p className="font-semibold mb-1">💡 Dica:</p>
        <p>
          Use Session Replay para experimentar sem culpa! Volte para qualquer passo e tente um
          método diferente. É como "git" da sua aprendizagem!
        </p>
      </motion.div>
    </motion.div>
  );
}
