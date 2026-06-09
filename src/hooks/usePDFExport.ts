
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

export function usePDFExport() {
  const [state, setState] = useState<UsePDFExportState>({
    isLoading: false,
    error: null,
    lastResult: null,
    isSuccess: false,
  });

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

  const exportCertificate = useCallback(
    async (certificate: CertificateData, options?: Partial<PDFExportOptions>) => {
      setState({ isLoading: true, error: null, lastResult: null, isSuccess: false });
      try {
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

  const checkCertificate = useCallback((certificateId: string) => {
    return verifyCertificate(certificateId);
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    isLoading: state.isLoading,
    error: state.error,
    isSuccess: state.isSuccess,
    lastResult: state.lastResult,

    exportHTML,
    exportCertificate,
    exportProgressReport,
    exportProgressJSON,
    checkCertificate,
    clearError,
  };
}
