import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  hint?: string;
  image?: string;
  target?: string; // CSS selector to highlight
  action?: string;
}

interface OnboardingTutorialProps {
  steps: TutorialStep[];
  onComplete?: () => void;
  autoStart?: boolean;
}

export function OnboardingTutorial({ 
  steps, 
  onComplete, 
  autoStart = false 
}: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(autoStart);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("tutorial-seen");
    setHasSeenTutorial(!!seen);
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("tutorial-seen", "true");
    setIsOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem("tutorial-seen", "true");
    setIsOpen(false);
  };

  if (!isOpen || hasSeenTutorial) {
    return !hasSeenTutorial && !autoStart ? (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-vector-blue to-vector-teal text-white rounded-full shadow-lg hover:shadow-2xl transition-shadow"
        title="Ver tutorial"
      >
        <Play className="w-5 h-5" />
      </motion.button>
    ) : null;
  }

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Tutorial Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-8 right-8 z-50 w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-br from-vector-blue/20 to-vector-teal/20 flex items-center justify-center border-b border-border">
              {step.image ? (
                <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center px-6">
                  <div className="inline-block p-4 bg-vector-blue/20 rounded-xl mb-4">
                    <Play className="w-8 h-8 text-vector-blue" />
                  </div>
                </div>
              )}

              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>

                {step.hint && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-vector-orange/10 border border-vector-orange/20 rounded-lg"
                  >
                    <p className="text-xs text-vector-orange font-semibold">{step.hint}</p>
                  </motion.div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Passo {currentStep + 1} de {steps.length}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-vector-blue to-vector-teal"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                <Button
                  onClick={handleNext}
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-vector-blue to-vector-teal hover:from-vector-blue/90 hover:to-vector-teal/90"
                >
                  {currentStep === steps.length - 1 ? "Concluir" : "Próximo"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <button
                onClick={handleSkip}
                className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Pular Tutorial
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
