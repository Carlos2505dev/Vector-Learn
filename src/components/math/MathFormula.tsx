import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathFormulaProps {
  formula: string;
  block?: boolean;
  className?: string;
}

export function MathFormula({ formula, block = false, className = "" }: MathFormulaProps) {
  const cleanFormula = formula?.trim() || "";
  
  if (!cleanFormula) return null;

  try {
    // trust: false (padrão do KaTeX) garante que a entrada é tratada como dados e
    // nunca como HTML executável — importante pois a fórmula pode vir de input do usuário.
    // Não alterar para trust: true, pois habilitaria HTML arbitrário (risco de XSS).
    const html = katex.renderToString(cleanFormula, {
      displayMode: block,
      strict: false,
      throwOnError: false,
      trust: false,
    });

    return (
      <span 
        className={`${block ? 'math-display' : 'math-inline'} ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (error) {
    return (
      <span className={`font-mono text-destructive ${className}`}>
        [Fórmula inválida: {formula}]
      </span>
    );
  }
}