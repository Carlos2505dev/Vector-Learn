
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import {
  CertificateData,
  ProgressReportData,
  PDFExportOptions,
  PDFGenerationResult,
  QRCodeOptions,
} from "./pdf-types";

export async function generatePDFFromHTML(
  element: HTMLElement,
  options: PDFExportOptions
): Promise<PDFGenerationResult> {
  try {
    const { fileName, paperSize = "a4", orientation = "portrait", margins = 10, quality = 2 } = options;

    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = paperSize === "a4" ? 210 : 216;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: paperSize,
    });

    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let position = margins;

    pdf.addImage(imgData, "PNG", margins, position, imgWidth - 2 * margins, imgHeight - 2 * margins);

    while (imgHeight > position) {
      position += pageHeight - margins;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margins, -position + margins, imgWidth - 2 * margins, imgHeight);
    }

    pdf.save(fileName);

    return {
      success: true,
      fileName,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return {
      success: false,
      fileName: options.fileName,
      error: error instanceof Error ? error.message : "Erro desconhecido ao gerar PDF",
      timestamp: new Date(),
    };
  }
}

export async function generateCertificatePDF(
  certificate: CertificateData,
  options?: Partial<PDFExportOptions>
): Promise<PDFGenerationResult> {
  try {
    const fileName = options?.fileName || `Certificate_${certificate.certificateId}.pdf`;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFillColor(111, 66, 193);
    pdf.rect(0, 0, pageWidth, pageHeight / 2, "F");

    pdf.setFillColor(63, 81, 181);
    pdf.rect(0, pageHeight / 2, pageWidth, pageHeight / 2, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(32);
    pdf.text("CERTIFICADO DE CONCLUSÃO", pageWidth / 2, 30, { align: "center" });

    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(2);
    pdf.line(30, 40, pageWidth - 30, 40);

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text(`${certificate.studentName}`, pageWidth / 2, 60, { align: "center" });

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    const text = `Concluiu com êxito o curso\n"${certificate.courseName}"\nno nível ${certificate.level.toUpperCase()}`;
    pdf.text(text, pageWidth / 2, 85, { align: "center" });

    pdf.setFontSize(10);
    pdf.setTextColor(200, 200, 200);
    pdf.text(`Data de Conclusão: ${certificate.completionDate.toLocaleDateString("pt-BR")}`, 20, 130);
    pdf.text(`Tempo de Estudo: ${certificate.hoursSpent} horas`, 20, 140);
    pdf.text(`Pontuação Final: ${certificate.finalScore}%`, 20, 150);
    pdf.text(`XP Total: ${certificate.totalXP}`, 20, 160);

    if (certificate.verificationUrl) {
      try {
        const qrImage = await QRCode.toDataURL(certificate.verificationUrl, {
          errorCorrectionLevel: "H",
          type: "image/png",
          quality: 0.95,
          margin: 1,
          width: 200,
        });
        pdf.addImage(qrImage, "PNG", pageWidth - 60, 120, 40, 40);
      } catch (qrError) {
        console.warn("Não foi possível gerar QR code:", qrError);
      }
    }

    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`ID: ${certificate.certificateId}`, pageWidth / 2, pageHeight - 10, { align: "center" });

    pdf.save(fileName);

    return {
      success: true,
      fileName,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Erro ao gerar certificado PDF:", error);
    return {
      success: false,
      fileName: options?.fileName || "certificate.pdf",
      error: error instanceof Error ? error.message : "Erro ao gerar certificado PDF",
      timestamp: new Date(),
    };
  }
}

export async function generateProgressReportPDF(
  report: ProgressReportData,
  options?: Partial<PDFExportOptions>
): Promise<PDFGenerationResult> {
  try {
    const fileName = options?.fileName || `ProgressReport_${report.reportDate.toISOString().split("T")[0]}.pdf`;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = margin;

    pdf.setFillColor(111, 66, 193);
    pdf.rect(0, 0, pageWidth, 30, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.text("RELATÓRIO DE PROGRESSO", margin, 20);

    yPosition = 45;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont(undefined, "bold");
    pdf.text("Informações Gerais", margin, yPosition);
    yPosition += 8;

    pdf.setFont(undefined, "normal");
    pdf.setFontSize(10);
    const generalInfo = [
      `Aluno: ${report.studentName}`,
      `Data do Relatório: ${report.reportDate.toLocaleDateString("pt-BR")}`,
      `Semana de: ${report.weekStartDate.toLocaleDateString("pt-BR")}`,
      `Nível Atual: ${report.currentLevel}`,
      `XP Total: ${report.totalXP}`,
      `Horas de Estudo: ${report.studyHours}h`,
    ];

    for (const info of generalInfo) {
      pdf.text(info, margin + 5, yPosition);
      yPosition += 6;
    }

    yPosition += 5;

    pdf.setFont(undefined, "bold");
    pdf.setFontSize(11);
    pdf.text("Estatísticas de Desempenho", margin, yPosition);
    yPosition += 8;

    pdf.setFont(undefined, "normal");
    pdf.setFontSize(10);
    pdf.setFillColor(243, 244, 246);
    pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 35, "F");

    const stats = [
      `Total de Questões: ${report.totalAnswers}`,
      `Acertos: ${report.totalCorrectAnswers} (${report.averageAccuracy.toFixed(1)}%)`,
      `Sequência Atual: ${report.currentStreak} dias | Melhor: ${report.maxStreak} dias`,
      `Testes Completados: ${report.testsCompleted}`,
      `Badges Desbloqueados: ${report.badgesUnlocked}`,
    ];

    for (const stat of stats) {
      pdf.text(stat, margin + 5, yPosition);
      yPosition += 7;
    }

    yPosition += 10;

    if (Object.keys(report.topicAccuracy).length > 0) {
      pdf.setFont(undefined, "bold");
      pdf.setFontSize(11);
      pdf.text("Desempenho por Tópico", margin, yPosition);
      yPosition += 8;

      pdf.setFont(undefined, "normal");
      pdf.setFontSize(9);

      pdf.setFillColor(243, 244, 246);
      for (const [topic, data] of Object.entries(report.topicAccuracy)) {
        const barWidth = ((pageWidth - 2 * margin - 50) * data.accuracy) / 100;
        pdf.rect(margin + 50, yPosition - 3, pageWidth - 2 * margin - 50, 5, "F");
        pdf.setFillColor(111, 66, 193);
        pdf.rect(margin + 50, yPosition - 3, barWidth, 5, "F");

        pdf.setTextColor(0, 0, 0);
        pdf.text(`${topic.substring(0, 20)}:`, margin, yPosition);
        pdf.text(`${data.accuracy.toFixed(0)}%`, pageWidth - margin - 15, yPosition);

        yPosition += 7;

        if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          yPosition = margin;
        }
      }
    }

    yPosition += 5;

    if (report.recentBadges.length > 0) {
      pdf.setFont(undefined, "bold");
      pdf.setFontSize(11);
      pdf.text("Badges Recentes", margin, yPosition);
      yPosition += 8;

      pdf.setFont(undefined, "normal");
      pdf.setFontSize(9);

      for (const badge of report.recentBadges.slice(0, 5)) {
        pdf.text(`★ ${badge.name}`, margin + 5, yPosition);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${badge.unlockedAt.toLocaleDateString("pt-BR")}`, margin + 80, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 6;

        if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          yPosition = margin;
        }
      }
    }

    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Gerado em ${new Date().toLocaleString("pt-BR")} | Vector Learn ©2024`,
      pageWidth / 2,
      pdf.internal.pageSize.getHeight() - 5,
      { align: "center" }
    );

    pdf.save(fileName);

    return {
      success: true,
      fileName,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Erro ao gerar relatório PDF:", error);
    return {
      success: false,
      fileName: options?.fileName || "progress-report.pdf",
      error: error instanceof Error ? error.message : "Erro ao gerar relatório PDF",
      timestamp: new Date(),
    };
  }
}

export function exportProgressAsJSON(
  report: ProgressReportData,
  fileName?: string
): PDFGenerationResult {
  try {
    const finalFileName = fileName || `ProgressBackup_${new Date().toISOString().split("T")[0]}.json`;

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = finalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      fileName: finalFileName,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Erro ao exportar JSON:", error);
    return {
      success: false,
      fileName: fileName || "progress-backup.json",
      error: error instanceof Error ? error.message : "Erro ao exportar JSON",
      timestamp: new Date(),
    };
  }
}

export function saveCertificateRecord(certificate: CertificateData): void {
  try {
    const existing = localStorage.getItem("issued-certificates");
    const records: CertificateData[] = existing ? JSON.parse(existing) : [];

    records.push(certificate);
    localStorage.setItem("issued-certificates", JSON.stringify(records));
  } catch (error) {
    console.error("Erro ao salvar registro de certificado:", error);
  }
}

export function getCertificateHistory(): CertificateData[] {
  try {
    const data = localStorage.getItem("issued-certificates");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao recuperar histórico de certificados:", error);
    return [];
  }
}

export function verifyCertificate(certificateId: string): CertificateData | null {
  const history = getCertificateHistory();
  return history.find((cert) => cert.certificateId === certificateId) || null;
}
