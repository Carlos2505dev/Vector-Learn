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
    const html = katex.renderToString(cleanFormula, {
      displayMode: block,
      strict: false,
      throwOnError: false
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