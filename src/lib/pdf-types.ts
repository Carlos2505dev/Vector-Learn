
export interface PDFExportOptions {
  fileName: string;
  paperSize?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
  margins?: number;
  quality?: number;
}

export interface CertificateData {
  studentName: string;
  studentId?: string;
  completionDate: Date;
  certificateId: string;
  courseName: string;
  level: "iniciante" | "intermediario" | "avancado" | "mestre";
  hoursSpent: number;
  totalXP: number;
  finalScore: number;
  issuerName?: string;
  issuerTitle?: string;
  issuerSignature?: string;
  verificationUrl?: string;
}

export interface ProgressReportData {
  studentName: string;
  reportDate: Date;
  weekStartDate: Date;
  totalAnswers: number;
  totalCorrectAnswers: number;
  averageAccuracy: number;
  currentStreak: number;
  maxStreak: number;
  badgesUnlocked: number;
  testsCompleted: number;
  totalXP: number;
  currentLevel: number;
  studyHours: number;
  topicAccuracy: {
    [topic: string]: {
      accuracy: number;
      questionsAttempted: number;
    };
  };
  recentBadges: Array<{
    name: string;
    unlockedAt: Date;
    rarity: "common" | "rare" | "epic" | "legendary";
  }>;
  weeklyProgress: Array<{
    date: string;
    xpGained: number;
    questionsAnswered: number;
  }>;
}

export interface PDFGenerationResult {
  success: boolean;
  fileName: string;
  fileSize?: number;
  error?: string;
  timestamp: Date;
}

export interface QRCodeOptions {
  value: string;
  size?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  color?: {
    dark: string;
    light: string;
  };
}
