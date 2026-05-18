import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Loader2, FileJson } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { usePDFExport } from "@/hooks/usePDFExport";
import { ProgressReportData } from "@/lib/pdf-types";

interface UserProgressReport {
  userName: string;
  reportDate: Date;
  weekStartDate: Date;
  totalAnswers: number;
  correctAnswers: number;
  averageAccuracy: number;
  currentStreak: number;
  maxStreak: number;
  badgesUnlocked: number;
  testsCompleted: number;
  totalXP?: number;
  currentLevel?: number;
  studyHours?: number;
  topicAccuracy: {
    [topic: string]: number;
  };
  recentBadges?: Array<{
    name: string;
    unlockedAt: Date;
    rarity: "common" | "rare" | "epic" | "legendary";
  }>;
  weeklyProgress?: Array<{
    date: string;
    xpGained: number;
    questionsAnswered: number;
  }>;
}

/**
 * Gera um relatório em HTML formatado
 */
function generateHTMLReport(data: UserProgressReport): string {
  const accuracyPercentage = Math.round(data.averageAccuracy);
  const weekEnd = new Date(data.weekStartDate);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Progresso - Vector Learn</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          min-height: 100vh;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          text-align: center;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }
        .header p {
          opacity: 0.9;
          font-size: 14px;
        }
        .content {
          padding: 40px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #333;
          font-size: 20px;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f0f0f0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        .stat-card {
          background: #f8f9ff;
          border: 1px solid #e0e7ff;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        .stat-card .number {
          font-size: 28px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 5px;
        }
        .stat-card .label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .progress-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin: 10px 0;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
        }
        .topic-list {
          list-style: none;
        }
        .topic-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .topic-item:last-child {
          border-bottom: none;
        }
        .topic-name {
          font-weight: 500;
          color: #333;
        }
        .topic-accuracy {
          font-weight: bold;
          color: #667eea;
        }
        .badges-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 10px;
        }
        .badge-item {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          font-size: 12px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          color: #999;
          font-size: 11px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }
        .highlight {
          background: #fff3cd;
          padding: 2px 4px;
          border-radius: 2px;
        }
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .container {
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Relatório de Progresso</h1>
          <p>Vector Learn - Aprendizado de Vetores</p>
        </div>
        
        <div class="content">
          <!-- Header Info -->
          <div class="section">
            <p><strong>Aluno:</strong> ${data.userName}</p>
            <p><strong>Período:</strong> ${data.weekStartDate.toLocaleDateString("pt-BR")} a ${weekEnd.toLocaleDateString("pt-BR")}</p>
            <p><strong>Gerado em:</strong> ${data.reportDate.toLocaleDateString("pt-BR")} às ${data.reportDate.toLocaleTimeString("pt-BR")}</p>
          </div>

          <!-- Main Stats -->
          <div class="section">
            <h2>📊 Estatísticas Principais</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="number">${data.averageAccuracy}%</div>
                <div class="label">Acurácia Média</div>
              </div>
              <div class="stat-card">
                <div class="number">${data.correctAnswers}/${data.totalAnswers}</div>
                <div class="label">Questões Corretas</div>
              </div>
              <div class="stat-card">
                <div class="number">${data.currentStreak}</div>
                <div class="label">Streak Atual</div>
              </div>
              <div class="stat-card">
                <div class="number">${data.maxStreak}</div>
                <div class="label">Melhor Streak</div>
              </div>
              <div class="stat-card">
                <div class="number">${data.badgesUnlocked}</div>
                <div class="label">Badges</div>
              </div>
              <div class="stat-card">
                <div class="number">${data.testsCompleted}</div>
                <div class="label">Provas</div>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="section">
            <h2>📈 Seu Progresso</h2>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${accuracyPercentage}%"></div>
            </div>
            <p style="text-align: center; color: #666; margin-top: 10px;">
              Você acertou <span class="highlight">${accuracyPercentage}%</span> das questões respondidas
            </p>
          </div>

          <!-- Topics Performance -->
          <div class="section">
            <h2>🎯 Desempenho por Tópico</h2>
            <ul class="topic-list">
              ${Object.entries(data.topicAccuracy)
                .map(
                  ([topic, accuracy]) => `
                <li class="topic-item">
                  <span class="topic-name">${topic}</span>
                  <span class="topic-accuracy">${Math.round(accuracy)}%</span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>

          <!-- Recommendations -->
          <div class="section">
            <h2>💡 Recomendações</h2>
            <ul style="margin-left: 20px; line-height: 1.8;">
              ${
                data.averageAccuracy < 60
                  ? `<li>Sua acurácia está abaixo de 60%. Recomendamos revisar os conceitos fundamentais.</li>`
                  : ""
              }
              ${
                data.currentStreak < 5
                  ? `<li>Mantenha uma rotina consistente de estudo. Tente manter um streak de 7+ acertos.</li>`
                  : ""
              }
              ${
                data.testsCompleted === 0
                  ? `<li>Você ainda não completou nenhuma prova! Teste seus conhecimentos no modo certificado.</li>`
                  : ""
              }
              <li>Continue praticando regularmente para consolidar seu aprendizado.</li>
            </ul>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>Este relatório foi gerado automaticamente por Vector Learn</p>
            <p>© 2026 - Todos os direitos reservados</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Converte HTML para PDF e faz download usando jsPDF + html2canvas
 */
async function downloadPDF(htmlContent: string, fileName: string) {
  try {
    const element = document.createElement("div");
    element.innerHTML = htmlContent;
    element.style.position = "absolute";
    element.style.left = "-9999px";
    document.body.appendChild(element);

    // Dinâmico: espera 100ms para garantir que o DOM está renderizado
    setTimeout(async () => {
      try {
        const { generatePDFFromHTML } = await import("@/lib/pdf-generator");
        await generatePDFFromHTML(element, { 
          fileName: `${fileName}.pdf`,
          quality: 2,
        });
      } finally {
        document.body.removeChild(element);
      }
    }, 100);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    // Fallback: abrir em nova aba e deixar usuário salvar como PDF
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(() => iframe.contentWindow?.print(), 100);
  }
}

interface ProgressReportExporterProps {
  data: UserProgressReport;
  onExported?: () => void;
}

/**
 * Componente para exportar relatório em múltiplos formatos (PDF e JSON)
 */
export function ProgressReportExporter({ data, onExported }: ProgressReportExporterProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { exportProgressReport, exportProgressJSON, isLoading, error, clearError } = usePDFExport();

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const reportData: ProgressReportData = {
        studentName: data.userName,
        reportDate: data.reportDate,
        weekStartDate: data.weekStartDate,
        totalAnswers: data.totalAnswers,
        totalCorrectAnswers: data.correctAnswers,
        averageAccuracy: data.averageAccuracy,
        currentStreak: data.currentStreak,
        maxStreak: data.maxStreak,
        badgesUnlocked: data.badgesUnlocked,
        testsCompleted: data.testsCompleted,
        totalXP: data.totalXP ?? 0,
        currentLevel: data.currentLevel ?? 1,
        studyHours: data.studyHours ?? 0,
        topicAccuracy: Object.entries(data.topicAccuracy).reduce(
          (acc, [topic, accuracy]) => ({
            ...acc,
            [topic]: {
              accuracy: accuracy as number,
              questionsAttempted: Math.round(data.totalAnswers * (accuracy as number / 100)),
            },
          }),
          {}
        ),
        recentBadges: data.recentBadges ?? [],
        weeklyProgress: data.weeklyProgress ?? [],
      };

      const result = await exportProgressReport(reportData, {
        fileName: `Relatorio_${data.userName}_${data.reportDate.toISOString().split("T")[0]}.pdf`,
      });

      if (result.success) {
        onExported?.();
      } else {
        alert(`Erro ao gerar PDF: ${result.error}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadJSON = () => {
    const reportData: ProgressReportData = {
      studentName: data.userName,
      reportDate: data.reportDate,
      weekStartDate: data.weekStartDate,
      totalAnswers: data.totalAnswers,
      totalCorrectAnswers: data.correctAnswers,
      averageAccuracy: data.averageAccuracy,
      currentStreak: data.currentStreak,
      maxStreak: data.maxStreak,
      badgesUnlocked: data.badgesUnlocked,
      testsCompleted: data.testsCompleted,
      totalXP: data.totalXP ?? 0,
      currentLevel: data.currentLevel ?? 1,
      studyHours: data.studyHours ?? 0,
      topicAccuracy: Object.entries(data.topicAccuracy).reduce(
        (acc, [topic, accuracy]) => ({
          ...acc,
          [topic]: {
            accuracy: accuracy as number,
            questionsAttempted: Math.round(data.totalAnswers * (accuracy as number / 100)),
          },
        }),
        {}
      ),
      recentBadges: data.recentBadges ?? [],
      weeklyProgress: data.weeklyProgress ?? [],
    };

    exportProgressJSON(reportData, `ProgressBackup_${data.reportDate.toISOString().split("T")[0]}.json`);
    onExported?.();
  };

  const handleShareLinkedIn = () => {
    const text = `🎓 Acabei de completar minha semana de aprendizado em @MindVectores! 
    
    📊 Meu Progresso:
    • Acurácia: ${data.averageAccuracy}%
    • Questões respondidas: ${data.totalAnswers}
    • Badges desbloqueados: ${data.badgesUnlocked}
    
    Quer aprender vetores também? Visite Vector Learn!
    
    #Educação #Matemática #Vetores #Aprendizado`;

    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://vector-learn.com")}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-vector-purple/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-vector-teal" />
            Exportar Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview */}
          <div className="p-4 rounded-lg bg-background/50 border border-muted">
            <h4 className="font-semibold text-sm mb-2">📋 Resumo do Relatório:</h4>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• <strong>Período:</strong> {data.weekStartDate.toLocaleDateString("pt-BR")}</p>
              <p>• <strong>Acurácia:</strong> {data.averageAccuracy}%</p>
              <p>• <strong>Questões:</strong> {data.correctAnswers}/{data.totalAnswers}</p>
              <p>• <strong>Badges:</strong> {data.badgesUnlocked} desbloqueados</p>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <Button
              onClick={handleDownloadPDF}
              disabled={isGenerating || isLoading}
              className="w-full gap-2 bg-vector-teal hover:bg-vector-teal/90"
            >
              {isGenerating || isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Baixar PDF Profissional
                </>
              )}
            </Button>

            <Button
              onClick={handleDownloadJSON}
              variant="outline"
              className="w-full gap-2"
            >
              <FileJson className="w-4 h-4" />
              Exportar como JSON (Backup)
            </Button>

            <Button
              onClick={handleShareLinkedIn}
              variant="outline"
              className="w-full gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar no LinkedIn
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-700 dark:text-red-300">
                ⚠️ {error}
              </p>
              <Button
                onClick={clearError}
                variant="ghost"
                className="mt-2 h-auto p-0 text-xs"
              >
                Descartar
              </Button>
            </div>
          )}

          {/* Info */}
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 Baixe seu relatório profissional em PDF ou faça backup em JSON. Compartilhe no LinkedIn para motivar outros alunos!
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Card simples mostrando estatísticas do relatório
 */
export function ProgressReportPreview({ data }: { data: UserProgressReport }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Seu Progresso Esta Semana</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-vector-teal">{data.averageAccuracy}%</p>
            <p className="text-xs text-muted-foreground">Acurácia</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-vector-purple">
              {data.correctAnswers}/{data.totalAnswers}
            </p>
            <p className="text-xs text-muted-foreground">Corretas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-500">{data.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-500">{data.badgesUnlocked}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
