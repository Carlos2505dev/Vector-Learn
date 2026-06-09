import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: "auto" | "sm" | "md" | "lg" | "fullscreen";
  isDismissible?: boolean;
  showHandle?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = "md",
  isDismissible = true,
  showHandle = true,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  const heightMap = {
    auto: "h-auto max-h-[80vh]",
    sm: "h-1/3",
    md: "h-1/2",
    lg: "h-2/3",
    fullscreen: "h-full",
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      startYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentYRef.current = e.touches[0].clientY - startYRef.current;
    };

    const handleTouchEnd = () => {
      if (currentYRef.current > 50 && isDismissible) {
        onClose();
      }
      currentYRef.current = 0;
    };

    const sheet = sheetRef.current;
    if (sheet && isOpen) {
      sheet.addEventListener("touchstart", handleTouchStart);
      sheet.addEventListener("touchmove", handleTouchMove);
      sheet.addEventListener("touchend", handleTouchEnd);

      return () => {
        sheet.removeEventListener("touchstart", handleTouchStart);
        sheet.removeEventListener("touchmove", handleTouchMove);
        sheet.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isOpen, isDismissible, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isDismissible ? onClose : undefined}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            ref={sheetRef}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className={`fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl ${heightMap[height]} overflow-y-auto`}
          >
            {showHandle && (
              <div className="sticky top-0 flex justify-center pt-2 pb-3">
                <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
              </div>
            )}

            {title && (
              <div className="sticky top-8 bg-background px-4 py-3 border-b flex items-center justify-between">
                <h2 className="font-bold text-lg">{title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}

            <div className="px-4 py-4 pb-8">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface QuestionBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  children: React.ReactNode;
}

export function QuestionBottomSheet({
  isOpen,
  onClose,
  question,
  children,
}: QuestionBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Responder Questão"
      height="lg"
    >
      <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 max-h-[30vh] overflow-y-auto">
        <p className="text-sm text-foreground">{question}</p>
      </div>

      <div className="space-y-3">{children}</div>
    </BottomSheet>
  );
}

export function useBottomSheet(initialOpen = false) {
  const [isOpen, setIsOpen] = React.useState(initialOpen);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}

import * as React from "react";
