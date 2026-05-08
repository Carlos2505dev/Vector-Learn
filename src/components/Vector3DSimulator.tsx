import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Text, Line } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Eye, EyeOff, Plus, Minus, Dot, RotateCcw, X, Combine } from "lucide-react";
import { 
  Vector3D, 
  add3D, 
  subtract3D, 
  dot3D, 
  cross3D,
  mixed3D,
  magnitude3D, 
  angleBetween3D, 
  project3D,
  radiansToDegrees 
} from "@/lib/vector-math";
import { MathFormula } from "./MathFormula";
import { Vector3 } from "three";

interface SimulatorState {
  vectorA: Vector3D;
  vectorB: Vector3D;
  vectorC: Vector3D;
  showComponents: boolean;
  showGrid: boolean;
  operation: "none" | "add" | "subtract" | "dot" | "cross" | "project" | "mixed";
}

// 3D Vector Arrow Component
function VectorArrow({ vector, color, startPoint = { x: 0, y: 0, z: 0 }, scale = 1 }: {
  vector: Vector3D;
  color: string;
  startPoint?: Vector3D;
  scale?: number;
}) {
  const endPoint = {
    x: startPoint.x + vector.x * scale,
    y: startPoint.y + vector.y * scale,
    z: startPoint.z + vector.z * scale
  };
  
  const direction = new Vector3(vector.x, vector.y, vector.z).normalize();
  const length = magnitude3D(vector) * scale;
  
  if (length < 0.1) return null;

  return (
    <group>
      {/* Vector shaft */}
      <Line
        points={[
          [startPoint.x, startPoint.y, startPoint.z],
          [endPoint.x, endPoint.y, endPoint.z]
        ]}
        color={color}
        lineWidth={3}
      />
      
      {/* Arrow head */}
      <group position={[endPoint.x, endPoint.y, endPoint.z]}>
        <mesh rotation={[0, Math.atan2(direction.x, direction.z), -Math.atan2(direction.y, Math.sqrt(direction.x * direction.x + direction.z * direction.z))]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

// Component lines for visualization
function ComponentLines({ vector, color, startPoint = { x: 0, y: 0, z: 0 }, scale = 1 }: {
  vector: Vector3D;
  color: string;
  startPoint?: Vector3D;
  scale?: number;
}) {
  const endPoint = {
    x: startPoint.x + vector.x * scale,
    y: startPoint.y + vector.y * scale,
    z: startPoint.z + vector.z * scale
  };

  return (
    <group>
      {/* X component */}
      <Line
        points={[
          [startPoint.x, startPoint.y, startPoint.z],
          [startPoint.x + vector.x * scale, startPoint.y, startPoint.z]
        ]}
        color={color}
        lineWidth={1}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
      
      {/* Y component */}
      <Line
        points={[
          [startPoint.x + vector.x * scale, startPoint.y, startPoint.z],
          [startPoint.x + vector.x * scale, startPoint.y + vector.y * scale, startPoint.z]
        ]}
        color={color}
        lineWidth={1}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
      
      {/* Z component */}
      <Line
        points={[
          [startPoint.x + vector.x * scale, startPoint.y + vector.y * scale, startPoint.z],
          [endPoint.x, endPoint.y, endPoint.z]
        ]}
        color={color}
        lineWidth={1}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
    </group>
  );
}

// 3D Scene Component
function Scene3D({ state }: { state: SimulatorState }) {
  const vectorSum = add3D(state.vectorA, state.vectorB);
  const vectorDiff = subtract3D(state.vectorA, state.vectorB);
  const vectorCross = cross3D(state.vectorA, state.vectorB);
  const projectionAB = project3D(state.vectorA, state.vectorB);

  return (
    <>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Grid */}
      {state.showGrid && (
        <Grid 
          args={[10, 10]} 
          position={[0, -0.01, 0]}
          cellColor="#666666"
          sectionColor="#999999"
        />
      )}
      
      {/* Coordinate axes */}
      <Line points={[[-5, 0, 0], [5, 0, 0]]} color="#ff4444" lineWidth={2} />
      <Line points={[[0, -5, 0], [0, 5, 0]]} color="#44ff44" lineWidth={2} />
      <Line points={[[0, 0, -5], [0, 0, 5]]} color="#4444ff" lineWidth={2} />
      
      {/* Axis labels */}
      <Text position={[5.2, 0, 0]} color="#ff4444" fontSize={0.3}>X</Text>
      <Text position={[0, 5.2, 0]} color="#44ff44" fontSize={0.3}>Y</Text>
      <Text position={[0, 0, 5.2]} color="#4444ff" fontSize={0.3}>Z</Text>
      
      {/* Origin point */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Component lines */}
      {state.showComponents && (
        <>
          <ComponentLines vector={state.vectorA} color="#ff6b35" />
          <ComponentLines vector={state.vectorB} color="#00d4aa" />
          {state.operation === "mixed" && <ComponentLines vector={state.vectorC} color="#ff6b9d" />}
        </>
      )}
      
      {/* Main vectors */}
      <VectorArrow vector={state.vectorA} color="#5b8cff" />
      <VectorArrow vector={state.vectorB} color="#00d1b2" />
      {state.operation === "mixed" && <VectorArrow vector={state.vectorC} color="#ec4899" />}
      
      {/* Operation results */}
      {state.operation === "add" && (
        <>
          <VectorArrow vector={vectorSum} color="#9333ea" />
          <VectorArrow vector={state.vectorB} color="#00d1b2" startPoint={state.vectorA} />
        </>
      )}
      
      {state.operation === "subtract" && (
        <VectorArrow vector={vectorDiff} color="#ef4444" />
      )}
      
      {state.operation === "cross" && (
        <VectorArrow vector={vectorCross} color="#f59e0b" />
      )}
      
      {state.operation === "project" && (
        <>
          <VectorArrow vector={projectionAB} color="#eab308" />
          <Line
            points={[
              [state.vectorA.x, state.vectorA.y, state.vectorA.z],
              [projectionAB.x, projectionAB.y, projectionAB.z]
            ]}
            color="#eab308"
            lineWidth={1}
            dashed
            dashSize={0.1}
            gapSize={0.05}
          />
        </>
      )}
      
      {/* Vector labels */}
      <Text 
        position={[state.vectorA.x + 0.2, state.vectorA.y + 0.2, state.vectorA.z + 0.2]} 
        color="#5b8cff" 
        fontSize={0.3}
      >
        a⃗
      </Text>
      <Text 
        position={[state.vectorB.x + 0.2, state.vectorB.y + 0.2, state.vectorB.z + 0.2]} 
        color="#00d1b2" 
        fontSize={0.3}
      >
        b⃗
      </Text>
      {state.operation === "mixed" && (
        <Text 
          position={[state.vectorC.x + 0.2, state.vectorC.y + 0.2, state.vectorC.z + 0.2]} 
          color="#ec4899" 
          fontSize={0.3}
        >
          c⃗
        </Text>
      )}
    </>
  );
}

export function Vector3DSimulator({ data }: { data?: Partial<SimulatorState> }) {
  const [state, setState] = useState<SimulatorState>({
    vectorA: { x: 2, y: 1.5, z: 1 },
    vectorB: { x: -1, y: 2, z: 1.5 },
    vectorC: { x: 1, y: 1, z: 2 },
    showComponents: true,
    showGrid: true,
    operation: "none"
  });

  // Sync with external data if provided
  useEffect(() => {
    if (data) {
      setState(prev => ({
        ...prev,
        ...data,
        vectorA: data.vectorA ? { ...prev.vectorA, ...data.vectorA } : prev.vectorA,
        vectorB: data.vectorB ? { ...prev.vectorB, ...data.vectorB } : prev.vectorB,
        vectorC: data.vectorC ? { ...prev.vectorC, ...data.vectorC } : prev.vectorC,
      }));
    }
  }, [data]);

  // Calculate derived values
  const magA = magnitude3D(state.vectorA);
  const magB = magnitude3D(state.vectorB);
  const magC = magnitude3D(state.vectorC);
  const dotProduct = dot3D(state.vectorA, state.vectorB);
  const crossProduct = cross3D(state.vectorA, state.vectorB);
  const mixedProduct = mixed3D(state.vectorA, state.vectorB, state.vectorC);
  const angle = radiansToDegrees(angleBetween3D(state.vectorA, state.vectorB));
  const vectorSum = add3D(state.vectorA, state.vectorB);
  const vectorDiff = subtract3D(state.vectorA, state.vectorB);
  const projectionAB = project3D(state.vectorA, state.vectorB);

  const updateVectorA = (component: 'x' | 'y' | 'z', value: number) => {
    setState(prev => ({
      ...prev,
      vectorA: { ...prev.vectorA, [component]: value }
    }));
  };

  const updateVectorB = (component: 'x' | 'y' | 'z', value: number) => {
    setState(prev => ({
      ...prev,
      vectorB: { ...prev.vectorB, [component]: value }
    }));
  };

  const updateVectorC = (component: 'x' | 'y' | 'z', value: number) => {
    setState(prev => ({
      ...prev,
      vectorC: { ...prev.vectorC, [component]: value }
    }));
  };

  const setOperation = (operation: SimulatorState["operation"]) => {
    setState(prev => ({ ...prev, operation }));
  };

  const resetVectors = () => {
    setState(prev => ({
      ...prev,
      vectorA: { x: 2, y: 1.5, z: 1 },
      vectorB: { x: -1, y: 2, z: 1.5 },
      vectorC: { x: 1, y: 1, z: 2 },
      operation: "none"
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Visualização 3D</CardTitle>
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
            <div className="w-full h-[500px] border border-border rounded-lg bg-card overflow-hidden">
              <Canvas
                camera={{ position: [8, 6, 8], fov: 50 }}
                style={{ background: 'hsl(var(--background))' }}
              >
                <Scene3D state={state} />
              </Canvas>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              🖱️ Arraste para rotacionar • 🖱️ Scroll para zoom • ⌨️ Clique direito para mover
            </p>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Controles 3D</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vector A Controls */}
            <div>
              <Label className="text-vector-blue font-semibold flex items-center gap-1">Vetor <MathFormula formula="\\vec{a}" /></Label>
              <div className="space-y-3 mt-2">
                <div>
                  <Label className="text-xs">Componente X: {state.vectorA.x.toFixed(1)}</Label>
                  <Slider
                    value={[state.vectorA.x]}
                    onValueChange={([value]) => updateVectorA('x', value)}
                    min={-4}
                    max={4}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Componente Y: {state.vectorA.y.toFixed(1)}</Label>
                  <Slider
                    value={[state.vectorA.y]}
                    onValueChange={([value]) => updateVectorA('y', value)}
                    min={-4}
                    max={4}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Componente Z: {state.vectorA.z.toFixed(1)}</Label>
                  <Slider
                    value={[state.vectorA.z]}
                    onValueChange={([value]) => updateVectorA('z', value)}
                    min={-4}
                    max={4}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Vector B Controls */}
            <div>
              <Label className="text-vector-teal font-semibold flex items-center gap-1">Vetor <MathFormula formula="\\vec{b}" /></Label>
              <div className="space-y-3 mt-2">
                <div>
                  <Label className="text-xs">Componente X: {state.vectorB.x.toFixed(1)}</Label>
                  <Slider
                    value={[state.vectorB.x]}
                    onValueChange={([value]) => updateVectorB('x', value)}
                    min={-4}
                    max={4}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Componente Y: {state.vectorB.y.toFixed(1)}</Label>
                  <Slider
                    value={[state.vectorB.y]}
                    onValueChange={([value]) => updateVectorB('y', value)}
                    min={-4}
                    max={4}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Componente Z: {state.vectorB.z.toFixed(1)}</Label>
                  <Slider
                    value={[state.vectorB.z]}
                    onValueChange={([value]) => updateVectorB('z', value)}
                    min={-4}
                    max={4}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Vector C Controls - Only shown when mixed operation is active */}
            <AnimatePresence>
              {state.operation === "mixed" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Label className="text-pink-500 font-semibold flex items-center gap-1">Vetor <MathFormula formula="\\vec{c}" /></Label>
                  <div className="space-y-3 mt-2">
                    <div>
                      <Label className="text-xs">Componente X: {state.vectorC.x.toFixed(1)}</Label>
                      <Slider
                        value={[state.vectorC.x]}
                        onValueChange={([value]) => updateVectorC('x', value)}
                        min={-4}
                        max={4}
                        step={0.1}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Componente Y: {state.vectorC.y.toFixed(1)}</Label>
                      <Slider
                        value={[state.vectorC.y]}
                        onValueChange={([value]) => updateVectorC('y', value)}
                        min={-4}
                        max={4}
                        step={0.1}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Componente Z: {state.vectorC.z.toFixed(1)}</Label>
                      <Slider
                        value={[state.vectorC.z]}
                        onValueChange={([value]) => updateVectorC('z', value)}
                        min={-4}
                        max={4}
                        step={0.1}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Operations */}
            <div>
              <Label className="font-semibold">Operações 3D</Label>
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
                  variant={state.operation === "cross" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOperation(state.operation === "cross" ? "none" : "cross")}
                >
                  <X className="h-4 w-4 mr-1" />
                  Vetorial
                </Button>
                <Button
                  variant={state.operation === "project" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOperation(state.operation === "project" ? "none" : "project")}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Projeção
                </Button>
                <Button
                  variant={state.operation === "mixed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOperation(state.operation === "mixed" ? "none" : "mixed")}
                >
                  <Combine className="h-4 w-4 mr-1" />
                  Misto
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
          <CardTitle>Resultados 3D</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label className="text-vector-blue font-semibold flex items-center gap-1">Vetor <MathFormula formula="\\vec{a}" /></Label>
              <div className="mt-2 space-y-1">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MathFormula formula={`|\\vec{a}| = ${magA.toFixed(2)}`} />
                </Badge>
                <p className="text-sm">
                  <MathFormula formula={`\\vec{a} = (${state.vectorA.x.toFixed(1)}, ${state.vectorA.y.toFixed(1)}, ${state.vectorA.z.toFixed(1)})`} />
                </p>
              </div>
            </div>
            
            <div>
              <Label className="text-vector-teal font-semibold flex items-center gap-1">Vetor <MathFormula formula="\\vec{b}" /></Label>
              <div className="mt-2 space-y-1">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MathFormula formula={`|\\vec{b}| = ${magB.toFixed(2)}`} />
                </Badge>
                <p className="text-sm">
                  <MathFormula formula={`\\vec{b} = (${state.vectorB.x.toFixed(1)}, ${state.vectorB.y.toFixed(1)}, ${state.vectorB.z.toFixed(1)})`} />
                </p>
              </div>
            </div>

            {state.operation === "mixed" && (
              <div>
                <Label className="text-pink-500 font-semibold flex items-center gap-1">Vetor <MathFormula formula="\\vec{c}" /></Label>
                <div className="mt-2 space-y-1">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MathFormula formula={`|\\vec{c}| = ${magC.toFixed(2)}`} />
                  </Badge>
                  <p className="text-sm">
                    <MathFormula formula={`\\vec{c} = (${state.vectorC.x.toFixed(1)}, ${state.vectorC.y.toFixed(1)}, ${state.vectorC.z.toFixed(1)})`} />
                  </p>
                </div>
              </div>
            )}
            
            <div>
              <Label className="font-semibold">Produtos</Label>
              <div className="mt-2 space-y-1">
                <Badge variant="outline" className={`flex items-center gap-1 ${state.operation === "dot" ? "bg-primary text-primary-foreground" : ""}`}>
                  <MathFormula formula={`\\vec{a} \\cdot \\vec{b} = ${dotProduct.toFixed(2)}`} />
                </Badge>
                {state.operation === "cross" && (
                  <div className="space-y-1">
                    <Badge className="bg-vector-yellow text-black flex items-center gap-1">
                      <MathFormula formula={`|\\vec{a} \\times \\vec{b}| = ${magnitude3D(crossProduct).toFixed(2)}`} />
                    </Badge>
                    <p className="text-xs">
                      <MathFormula formula={`\\vec{a} \\times \\vec{b} = (${crossProduct.x.toFixed(1)}, ${crossProduct.y.toFixed(1)}, ${crossProduct.z.toFixed(1)})`} />
                    </p>
                  </div>
                )}
                {state.operation === "mixed" && (
                  <div className="space-y-1">
                    <Badge className="bg-pink-500 text-white flex items-center gap-1">
                      <MathFormula formula={`\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = ${mixedProduct.toFixed(2)}`} />
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Volume do paralelepípedo
                    </p>
                  </div>
                )}
                {state.operation !== "mixed" && (
                  <p className="text-xs text-muted-foreground">
                    Ângulo: {angle.toFixed(1)}°
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <Label className="font-semibold">Operações</Label>
              <div className="mt-2 space-y-1">
                {state.operation === "add" && (
                  <Badge className="bg-vector-purple text-white flex items-center gap-1">
                    <MathFormula formula={`|\\vec{a} + \\vec{b}| = ${magnitude3D(vectorSum).toFixed(2)}`} />
                  </Badge>
                )}
                {state.operation === "subtract" && (
                  <Badge className="bg-vector-red text-white flex items-center gap-1">
                    <MathFormula formula={`|\\vec{a} - \\vec{b}| = ${magnitude3D(vectorDiff).toFixed(2)}`} />
                  </Badge>
                )}
                {state.operation === "project" && (
                  <Badge className="bg-vector-yellow text-black flex items-center gap-1">
                    <MathFormula formula={`|\\text{proj}_{\\vec{b}}(\\vec{a})| = ${magnitude3D(projectionAB).toFixed(2)}`} />
                  </Badge>
                )}
                {state.operation === "none" && (
                  <p className="text-xs text-muted-foreground">
                    Selecione uma operação para ver os resultados
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}