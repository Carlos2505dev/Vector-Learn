import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MathFormulaProps {
  formula: string;
  block?: boolean;
  className?: string;
}

export function MathFormula({ formula, block = false, className = "" }: MathFormulaProps) {
  try {
    if (block) {
      return (
        <div className={`math-display ${className}`}>
          <BlockMath math={formula} />
        </div>
      );
    }
    
    return (
      <span className={`math-inline ${className}`}>
        <InlineMath math={formula} />
      </span>
    );
  } catch (error) {
    // Fallback for invalid LaTeX
    return (
      <span className={`font-mono text-destructive ${className}`}>
        [Fórmula inválida: {formula}]
      </span>
    );
  }
}