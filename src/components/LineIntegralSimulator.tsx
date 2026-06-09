
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Info } from "lucide-react";
import { 
  ParametricCurve, 
  VectorField2D,
  IntegralChallenge
} from "@/lib/calculus-types";
import { 
  lineIntegral, 
  generateCurveVisualization,
  arcLength,
  isConservativeField2D
} from "@/lib/calculus-engine";
import { MathFormula } from "./MathFormula";

interface LineIntegralSimulatorProps {
  curves: ParametricCurve[];
  fields: VectorField2D[];
  challenges?: IntegralChallenge[];
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;
const SCALE = 80;

export function LineIntegralSimulator({
  curves,
  fields,
  challenges
}: LineIntegralSimulatorProps) {
  const [selectedCurveIdx, setSelectedCurveIdx] = useState(0);
  const [selectedFieldIdx, setSelectedFieldIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showFieldVectors, setShowFieldVectors] = useState(true);

  const selectedCurve = curves[selectedCurveIdx];
  const selectedField = fields[selectedFieldIdx];

  const curveData = useMemo(() => {
    return generateCurveVisualization(selectedCurve, selectedField, 50);
  }, [selectedCurve, selectedField]);

  const integralResult = useMemo(() => {
    return lineIntegral(selectedField, selectedCurve);
  }, [selectedField, selectedCurve]);

  const arcLen = useMemo(
    () => arcLength(selectedCurve),
    [selectedCurve]
  );

  const isConservative = useMemo(
    () => isConservativeField2D(selectedField),
    [selectedField]
  );

  const animatedPoint = useMemo(() => {
    const t = selectedCurve.tMin + 
      (selectedCurve.tMax - selectedCurve.tMin) * animationProgress;
    return {
      x: selectedCurve.x(t),
      y: selectedCurve.y(t)
    };
  }, [animationProgress, selectedCurve]);

  const renderCanvas = () => {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    const points = curveData.points.map(p => ({
      x: centerX + p.x * SCALE,
      y: centerY - p.y * SCALE
    }));

    const pathData = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    return (
      <svg 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT}
        className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950"
      >
        {showGrid && (
          <>
            {Array.from({ length: 11 }).map((_, i) => (
              <g key={`grid-${i}`}>
                <line
                  x1={0}
                  y1={(CANVAS_HEIGHT / 10) * i}
                  x2={CANVAS_WIDTH}
                  y2={(CANVAS_HEIGHT / 10) * i}
                  stroke="#e2e8f0"
                  strokeWidth={0.5}
                  opacity={0.5}
                />
                <line
                  x1={(CANVAS_WIDTH / 10) * i}
                  y1={0}
                  x2={(CANVAS_WIDTH / 10) * i}
                  y2={CANVAS_HEIGHT}
                  stroke="#e2e8f0"
                  strokeWidth={0.5}
                  opacity={0.5}
                />
              </g>
            ))}
          </>
        )}

        <line
          x1={0}
          y1={centerY}
          x2={CANVAS_WIDTH}
          y2={centerY}
          stroke="#64748b"
          strokeWidth={1.5}
          opacity={0.5}
        />
        <line
          x1={centerX}
          y1={0}
          x2={centerX}
          y2={CANVAS_HEIGHT}
          stroke="#64748b"
          strokeWidth={1.5}
          opacity={0.5}
        />

        {showFieldVectors && curveData.fieldVectors.map((fv, i) => (
          <g key={`field-${i}`}>
            <circle
              cx={centerX + fv.position.x * SCALE}
              cy={centerY - fv.position.y * SCALE}
              r={2}
              fill="#cbd5e1"
              opacity={0.3}
            />
            <line
              x1={centerX + fv.position.x * SCALE}
              y1={centerY - fv.position.y * SCALE}
              x2={centerX + fv.position.x * SCALE + fv.vector.x * SCALE}
              y2={centerY - fv.position.y * SCALE - fv.vector.y * SCALE}
              stroke="#3b82f6"
              strokeWidth={1.5}
              opacity={0.4}
              markerEnd="url(#arrowhead-field)"
            />
          </g>
        ))}

        <path
          d={pathData}
          fill="none"
          stroke="#ef4444"
          strokeWidth={3}
          opacity={0.8}
        />

        {isAnimating && (
          <motion.circle
            cx={centerX + animatedPoint.x * SCALE}
            cy={centerY - animatedPoint.y * SCALE}
            r={6}
            fill="#10b981"
            animate={{
              r: [6, 8, 6]
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}

        <defs>
          <marker
            id="arrowhead-field"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🌀 Integral de Linha - Visualizador 2D</span>
            <Badge variant={isConservative ? "secondary" : "outline"}>
              {isConservative ? "Campo Conservativo" : "Campo Não-Conservativo"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {renderCanvas()}
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Curva Paramétrica</Label>
            <div className="grid grid-cols-2 gap-2">
              {curves.map((curve, idx) => (
                <Button
                  key={idx}
                  variant={selectedCurveIdx === idx ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCurveIdx(idx);
                    setAnimationProgress(0);
                  }}
                  className="text-sm"
                >
                  {curve.description}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Campo Vetorial</Label>
            <div className="grid grid-cols-2 gap-2">
              {fields.map((field, idx) => (
                <Button
                  key={idx}
                  variant={selectedFieldIdx === idx ? "default" : "outline"}
                  onClick={() => setSelectedFieldIdx(idx)}
                  className="text-sm"
                >
                  {field.description}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={showGrid ? "default" : "outline"}
              onClick={() => setShowGrid(!showGrid)}
            >
              {showGrid ? "Grade ✓" : "Grade"}
            </Button>
            <Button
              size="sm"
              variant={showFieldVectors ? "default" : "outline"}
              onClick={() => setShowFieldVectors(!showFieldVectors)}
            >
              {showFieldVectors ? "Vetores ✓" : "Vetores"}
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setIsAnimating(!isAnimating)}
                className="flex-1"
              >
                {isAnimating ? <Pause size={16} /> : <Play size={16} />}
                {isAnimating ? "Pausar" : "Animar"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAnimationProgress(0)}
              >
                <RotateCcw size={16} />
                Reiniciar
              </Button>
            </div>
            <Slider
              value={[animationProgress]}
              onValueChange={([val]) => setAnimationProgress(val)}
              max={1}
              step={0.01}
              className="w-full"
            />
            <div className="text-xs text-slate-500">
              Progresso: {(animationProgress * 100).toFixed(1)}%
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Comprimento de Arco
              </div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {arcLen.toFixed(3)}
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                Integral de Linha
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {integralResult.result.toFixed(3)}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2">
            <div className="font-semibold text-sm mb-3">Solução Passo-a-Passo:</div>
            {integralResult.work.map((step, idx) => (
              <div key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">{idx + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
