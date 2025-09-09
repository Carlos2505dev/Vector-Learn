import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Eye, EyeOff, Plus, Minus, Dot, RotateCcw } from "lucide-react";
import { 
  Vector2D, 
  add2D, 
  subtract2D, 
  dot2D, 
  magnitude2D, 
  angleBetween2D, 
  project2D,
  radiansToDegrees 
} from "@/lib/vector-math";
import { MathFormula } from "./MathFormula";

interface SimulatorState {
  vectorA: Vector2D;
  vectorB: Vector2D;
  showComponents: boolean;
  showGrid: boolean;
  operation: "none" | "add" | "subtract" | "dot" | "project";
}

export function Vector2DSimulator() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [state, setState] = useState<SimulatorState>({
    vectorA: { x: 3, y: 2 },
    vectorB: { x: -1, y: 3 },
    showComponents: true,
    showGrid: true,
    operation: "none"
  });

  // Calculate derived values
  const magA = magnitude2D(state.vectorA);
  const magB = magnitude2D(state.vectorB);
  const dotProduct = dot2D(state.vectorA, state.vectorB);
  const angle = radiansToDegrees(angleBetween2D(state.vectorA, state.vectorB));
  const vectorSum = add2D(state.vectorA, state.vectorB);
  const vectorDiff = subtract2D(state.vectorA, state.vectorB);
  const projectionAB = project2D(state.vectorA, state.vectorB);

  const updateVectorA = (component: 'x' | 'y', value: number) => {
    setState(prev => ({
      ...prev,
      vectorA: { ...prev.vectorA, [component]: value }
    }));
  };

  const updateVectorB = (component: 'x' | 'y', value: number) => {
    setState(prev => ({
      ...prev,
      vectorB: { ...prev.vectorB, [component]: value }
    }));
  };

  const setOperation = (operation: SimulatorState["operation"]) => {
    setState(prev => ({ ...prev, operation }));
  };

  const resetVectors = () => {
    setState(prev => ({
      ...prev,
      vectorA: { x: 3, y: 2 },
      vectorB: { x: -1, y: 3 },
      operation: "none"
    }));
  };

  // Convert mathematical coordinates to SVG coordinates
  const toSVG = (vec: Vector2D, scale = 20) => ({
    x: 200 + vec.x * scale,
    y: 200 - vec.y * scale // Flip Y for SVG
  });

  const VectorArrow = ({ vector, color, label, startPoint = { x: 0, y: 0 } }: {
    vector: Vector2D;
    color: string;
    label: string;
    startPoint?: Vector2D;
  }) => {
    const start = toSVG(startPoint);
    const end = toSVG({ x: startPoint.x + vector.x, y: startPoint.y + vector.y });
    
    const length = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
    if (length < 5) return null; // Don't draw very small vectors

    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const arrowSize = 8;

    return (
      <g className="vector-group">
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
        />
        
        {/* Arrow head */}
        <polygon
          points={`
            ${end.x},${end.y} 
            ${end.x - arrowSize * Math.cos(angle - Math.PI / 6)},${end.y - arrowSize * Math.sin(angle - Math.PI / 6)}
            ${end.x - arrowSize * Math.cos(angle + Math.PI / 6)},${end.y - arrowSize * Math.sin(angle + Math.PI / 6)}
          `}
          fill={color}
        />

        {/* Label */}
        <text
          x={end.x + 10}
          y={end.y - 10}
          className="text-sm font-semibold"
          fill={color}
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Visualização 2D</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={state.showGrid ? "default" : "outline"}
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
                >
                  {state.showGrid ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  Grid
                </Button>
                <Button
                  variant={state.showComponents ? "default" : "outline"}
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, showComponents: !prev.showComponents }))}
                >
                  {state.showComponents ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  Componentes
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <svg
              ref={svgRef}
              viewBox="0 0 400 400"
              className="w-full h-[400px] border border-border rounded-lg bg-card"
            >
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
                
                {state.showGrid && (
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                  </pattern>
                )}
              </defs>

              {/* Grid */}
              {state.showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

              {/* Axes */}
              <line x1="0" y1="200" x2="400" y2="200" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="400" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
              
              {/* Origin */}
              <circle cx="200" cy="200" r="3" fill="hsl(var(--primary))" />

              {/* Component vectors */}
              {state.showComponents && (
                <g opacity="0.6">
                  {/* Vector A components */}
                  <line
                    x1="200"
                    y1="200"
                    x2={200 + state.vectorA.x * 20}
                    y2="200"
                    stroke="hsl(var(--vector-orange))"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <line
                    x1={200 + state.vectorA.x * 20}
                    y1="200"
                    x2={200 + state.vectorA.x * 20}
                    y2={200 - state.vectorA.y * 20}
                    stroke="hsl(var(--vector-orange))"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  
                  {/* Vector B components */}
                  <line
                    x1="200"
                    y1="200"
                    x2={200 + state.vectorB.x * 20}
                    y2="200"
                    stroke="hsl(var(--vector-teal))"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                  <line
                    x1={200 + state.vectorB.x * 20}
                    y1="200"
                    x2={200 + state.vectorB.x * 20}
                    y2={200 - state.vectorB.y * 20}
                    stroke="hsl(var(--vector-teal))"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                </g>
              )}

              {/* Main vectors */}
              <VectorArrow 
                vector={state.vectorA} 
                color="hsl(var(--vector-blue))" 
                label="a⃗" 
              />
              <VectorArrow 
                vector={state.vectorB} 
                color="hsl(var(--vector-teal))" 
                label="b⃗" 
              />

              {/* Operation results */}
              <AnimatePresence>
                {state.operation === "add" && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <VectorArrow 
                      vector={vectorSum} 
                      color="hsl(var(--vector-purple))" 
                      label="a⃗ + b⃗" 
                    />
                    {/* Parallelogram construction */}
                    <VectorArrow 
                      vector={state.vectorB} 
                      color="hsl(var(--vector-teal))" 
                      label="" 
                      startPoint={state.vectorA}
                    />
                  </motion.g>
                )}
                
                {state.operation === "subtract" && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <VectorArrow 
                      vector={vectorDiff} 
                      color="hsl(var(--vector-red))" 
                      label="a⃗ - b⃗" 
                    />
                  </motion.g>
                )}
                
                {state.operation === "project" && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <VectorArrow 
                      vector={projectionAB} 
                      color="hsl(var(--vector-yellow))" 
                      label="proj_b⃗(a⃗)" 
                    />
                    {/* Projection line */}
                    <line
                      x1={toSVG(state.vectorA).x}
                      y1={toSVG(state.vectorA).y}
                      x2={toSVG(projectionAB).x}
                      y2={toSVG(projectionAB).y}
                      stroke="hsl(var(--vector-yellow))"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                      opacity="0.7"
                    />
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Controles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vector A Controls */}
            <div>
              <Label className="text-vector-blue font-semibold">Vetor a⃗</Label>
              <div className="space-y-3 mt-2">
                <div>
                  <Label className="text-xs">Componente X: {state.vectorA.x}</Label>
                  <Slider
                    value={[state.vectorA.x]}
                    onValueChange={([value]) => updateVectorA('x', value)}
                    min={-5}
                    max={5}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Componente Y: {state.vectorA.y}</Label>
                  <Slider
                    value={[state.vectorA.y]}
                    onValueChange={([value]) => updateVectorA('y', value)}
                    min={-5}
                    max={5}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Vector B Controls */}
            <div>
              <Label className="text-vector-teal font-semibold">Vetor b⃗</Label>
              <div className="space-y-3 mt-2">
                <div>
                  <Label className="text-xs">Componente X: {state.vectorB.x}</Label>
                  <Slider
                    value={[state.vectorB.x]}
                    onValueChange={([value]) => updateVectorB('x', value)}
                    min={-5}
                    max={5}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Componente Y: {state.vectorB.y}</Label>
                  <Slider
                    value={[state.vectorB.y]}
                    onValueChange={([value]) => updateVectorB('y', value)}
                    min={-5}
                    max={5}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Operations */}
            <div>
              <Label className="font-semibold">Operações</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={state.operation === "add" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOperation(state.operation === "add" ? "none" : "add")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Soma
                </Button>
                <Button
                  variant={state.operation === "subtract" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOperation(state.operation === "subtract" ? "none" : "subtract")}
                >
                  <Minus className="h-4 w-4 mr-1" />
                  Subtração
                </Button>
                <Button
                  variant={state.operation === "dot" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOperation(state.operation === "dot" ? "none" : "dot")}
                >
                  <Dot className="h-4 w-4 mr-1" />
                  Escalar
                </Button>
                <Button
                  variant={state.operation === "project" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOperation(state.operation === "project" ? "none" : "project")}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Projeção
                </Button>
              </div>
            </div>

            <Button variant="outline" onClick={resetVectors} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados e Medidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label className="text-vector-blue font-semibold">Vetor a⃗</Label>
              <div className="mt-2 space-y-1">
                <Badge variant="outline">|a⃗| = {magA.toFixed(2)}</Badge>
                <p className="text-sm">
                  <MathFormula formula={`\\vec{a} = (${state.vectorA.x.toFixed(1)}, ${state.vectorA.y.toFixed(1)})`} />
                </p>
              </div>
            </div>
            
            <div>
              <Label className="text-vector-teal font-semibold">Vetor b⃗</Label>
              <div className="mt-2 space-y-1">
                <Badge variant="outline">|b⃗| = {magB.toFixed(2)}</Badge>
                <p className="text-sm">
                  <MathFormula formula={`\\vec{b} = (${state.vectorB.x.toFixed(1)}, ${state.vectorB.y.toFixed(1)})`} />
                </p>
              </div>
            </div>
            
            <div>
              <Label className="font-semibold">Produto Escalar</Label>
              <div className="mt-2 space-y-1">
                <Badge variant="outline" className={state.operation === "dot" ? "bg-primary text-primary-foreground" : ""}>
                  a⃗ · b⃗ = {dotProduct.toFixed(2)}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Ângulo: {angle.toFixed(1)}°
                </p>
              </div>
            </div>
            
            <div>
              <Label className="font-semibold">Operações</Label>
              <div className="mt-2 space-y-1">
                {state.operation === "add" && (
                  <Badge className="bg-vector-purple text-white">
                    |a⃗ + b⃗| = {magnitude2D(vectorSum).toFixed(2)}
                  </Badge>
                )}
                {state.operation === "subtract" && (
                  <Badge className="bg-vector-red text-white">
                    |a⃗ - b⃗| = {magnitude2D(vectorDiff).toFixed(2)}
                  </Badge>
                )}
                {state.operation === "project" && (
                  <Badge className="bg-vector-yellow text-black">
                    |proj| = {magnitude2D(projectionAB).toFixed(2)}
                  </Badge>
                )}
                {state.operation === "none" && (
                  <p className="text-sm text-muted-foreground">Selecione uma operação</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}