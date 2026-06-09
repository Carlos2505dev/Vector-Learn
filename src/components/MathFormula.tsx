import { InlineMath, BlockMath } from 'react-katex';
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
    if (block) {
      return (
        <div className={`math-display ${className}`}>
          <BlockMath math={cleanFormula} settings={{ strict: false }} />
        </div>
      );
    }
    
    return (
      <span className={`math-inline ${className}`}>
        <InlineMath math={cleanFormula} settings={{ strict: false }} />
      </span>
    );
  } catch (error) {
    return (
      <span className={`font-mono text-destructive ${className}`}>
        [Fórmula inválida: {formula}]
      </span>
    );
  }
}