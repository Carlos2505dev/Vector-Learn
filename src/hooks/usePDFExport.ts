/**
 * @file usePDFExport.ts
 * @description Hook customizado para exportação de PDF e certificados
 * Fornece uma interface limpa para componentes gerarem PDFs
 */

import { useState, useCallback } from "react";
import {
  generatePDFFromHTML,
  generateCertificatePDF,
  generateProgressReportPDF,
  exportProgressAsJSON,
  saveCertificateRecord,
  verifyCertificate,
} from "../lib/pdf-generator";
import {
  CertificateData,
  ProgressReportData,
  PDFExportOptions,
  PDFGenerationResult,
} from "../lib/pdf-types";

interface UsePDFExportState {
  isLoading: boolean;
  error: string | null;
  lastResult: PDFGenerationResult | null;
  isSuccess: boolean;
}

/**
 * Hook para gerenciar exportação de PDFs
 * @returns Objeto com funções de exportação e estado
 */
export function usePDFExport() {
  const [state, setState] = useState<UsePDFExportState>({
    isLoading: false,
    error: null,
    lastResult: null,
    isSuccess: false,
  });

  /**
   * Exporta um elemento HTML como PDF
   */
  const exportHTML = useCallback(
    async (element: HTMLElement, options: PDFExportOptions) => {
      setState({ isLoading: true, error: null, lastResult: null, isSuccess: false });
      try {
        const result = await generatePDFFromHTML(element, options);
        setState({
          isLoading: false,
          error: result.error || null,
          lastResult: result,
          isSuccess: result.success,
        });
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro desconhecido";
        setState({
          isLoading: false,
          error: message,
          lastResult: null,
          isSuccess: false,
        });
        return { success: false, fileName: "", error: message, timestamp: new Date() };
      }
    },
    []
  );

  /**
   * Exporta um certificado como PDF
   */
  const exportCertificate = useCallback(
    async (certificate: CertificateData, options?: Partial<PDFExportOptions>) => {
      setState({ isLoading: true, error: null, lastResult: null, isSuccess: false });
      try {
        // Salva o registro do certificado
        saveCertificateRecord(certificate);

        const result = await generateCertificatePDF(certificate, options);
        setState({
          isLoading: false,
          error: result.error || null,
          lastResult: result,
          isSuccess: result.success,
        });
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro desconhecido";
        setState({
          isLoading: false,
          error: message,
          lastResult: null,
          isSuccess: false,
        });
        return { success: false, fileName: "", error: message, timestamp: new Date() };
      }
    },
    []
  );

  /**
   * Exporta relatório de progresso como PDF
   */
  const exportProgressReport = useCallback(
    async (report: ProgressReportData, options?: Partial<PDFExportOptions>) => {
      setState({ isLoading: true, error: null, lastResult: null, isSuccess: false });
      try {
        const result = await generateProgressReportPDF(report, options);
        setState({
          isLoading: false,
          error: result.error || null,
          lastResult: result,
          isSuccess: result.success,
        });
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro desconhecido";
        setState({
          isLoading: false,
          error: message,
          lastResult: null,
          isSuccess: false,
        });
        return { success: false, fileName: "", error: message, timestamp: new Date() };
      }
    },
    []
  );

  /**
   * Exporta dados de progresso em JSON
   */
  const exportProgressJSON = useCallback(
    (report: ProgressReportData, fileName?: string) => {
      try {
        const result = exportProgressAsJSON(report, fileName);
        setState({
          isLoading: false,
          error: result.error || null,
          lastResult: result,
          isSuccess: result.success,
        });
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro desconhecido";
        setState({
          isLoading: false,
          error: message,
          lastResult: null,
          isSuccess: false,
        });
        return { success: false, fileName: "", error: message, timestamp: new Date() };
      }
    },
    []
  );

  /**
   * Verifica a validade de um certificado
   */
  const checkCertificate = useCallback((certificateId: string) => {
    return verifyCertificate(certificateId);
  }, []);

  /**
   * Limpa o estado de erro
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // Estado
    isLoading: state.isLoading,
    error: state.error,
    isSuccess: state.isSuccess,
    lastResult: state.lastResult,

    // Funções
    exportHTML,
    exportCertificate,
    exportProgressReport,
    exportProgressJSON,
    checkCertificate,
    clearError,
  };
}
