import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wind, Droplets, ArrowRight, Info, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MathFormula } from "../math/MathFormula";
import { getEasterEggDetector } from "@/hooks/useEasterEggs";


interface FluidParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
}

interface DragObject {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
}

export function FluidDynamicsSimulator() {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    getEasterEggDetector().recordSimulatorUsage("fluidos");
  }, []);

  const [fluidVelocity, setFluidVelocity] = useState(3);
  const [viscosity, setViscosity] = useState(0.5);
  const [objectRadius, setObjectRadius] = useState(1.5);
  const [isAnimating, setIsAnimating] = useState(true);

  const [particles, setParticles] = useState<FluidParticle[]>([]);
  const [dragObject, setDragObject] = useState<DragObject>({
    x: 150,
    y: 150,
    radius: objectRadius * 8,
    vx: 0,
    vy: 0,
  });

  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 300;

  const calculateDragForce = useCallback((velocity: number, radius: number, eta: number) => {
    return 6 * Math.PI * eta * radius * velocity;
  }, []);

  const reynoldsNumber = useMemo(() => {
    return (fluidVelocity * dragObject.radius) / (viscosity * 10 + 0.1);
  }, [fluidVelocity, dragObject.radius, viscosity]);

  const simulationStep = useCallback(() => {
    setParticles((prevParticles) => {
      let newParticles = [...prevParticles];

      newParticles = newParticles
        .map((p) => ({
          ...p,
          x: p.x + p.vx * 0.5,
          y: p.y + p.vy * 0.5,
          age: p.age + 1,
        }))
        .filter((p) => p.x > -20 && p.x < CANVAS_WIDTH + 20 && p.age < 120);

      if (Math.random() > 0.7) {
        newParticles.push({
          x: -5,
          y: Math.random() * CANVAS_HEIGHT,
          vx: fluidVelocity,
          vy: (Math.random() - 0.5) * 0.5,
          age: 0,
        });
      }

      return newParticles;
    });

    setDragObject((prev) => {
      const drag = calculateDragForce(fluidVelocity, prev.radius, viscosity);
      const accelerationDrag = Math.min(drag * 0.02, fluidVelocity * 0.5);

      const newVx = Math.max(0, prev.vx + accelerationDrag * 0.02);
      const decelerationFactor = 1 - viscosity * 0.1;
      const velocityX = newVx * decelerationFactor;

      return {
        ...prev,
        vx: velocityX,
        x: Math.min(prev.x + velocityX, CANVAS_WIDTH - prev.radius),
      };
    });
  }, [fluidVelocity, viscosity, calculateDragForce]);

  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      simulationStep();
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isAnimating, simulationStep]);

  const handleReset = useCallback(() => {
    setParticles([]);
    setDragObject((prev) => ({
      ...prev,
      x: 150,
      y: 150,
      vx: 0,
    }));
  }, []);

  const streamlines = useMemo(() => {
    const lines = [];
    const step = 40;

    for (let y = 0; y < CANVAS_HEIGHT; y += step) {
      let pathData = `M 0 ${y}`;
      let deflection = 0;

      for (let x = 0; x < CANVAS_WIDTH; x += 20) {
        const dx = x - dragObject.x;
        const dy = y - dragObject.y;
        const distToObject = Math.sqrt(dx * dx + dy * dy);

        if (distToObject < dragObject.radius * 3) {
          const angle = Math.atan2(dy, dx);
          deflection = Math.sin(angle) * (dragObject.radius * 2 - distToObject) * 2;
        } else {
          deflection *= 0.95;
        }

        pathData += ` L ${x} ${y + deflection}`;
      }

      lines.push(pathData);
    }

    return lines;
  }, [dragObject]);

  const getParticleOpacity = (age: number): number => {
    return Math.max(0, 1 - age / 120);
  };

  return (
    <Card className="border-2 border-cyan-300/20 overflow-hidden">
      <CardHeader className="bg-cyan-300/5 border-b border-cyan-300/10">
        <CardTitle className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
          <Wind className="h-5 w-5" />
          Dinâmica de Fluidos
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className="relative h-[300px] bg-gradient-to-b from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-xl overflow-hidden border-2 border-cyan-200 dark:border-cyan-800"
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
              className="w-full h-full"
            >
              <defs>
                <marker
                  id="arrowStreamline"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="#0891b2" opacity="0.5" />
                </marker>
              </defs>

              {streamlines.map((pathData, idx) => (
                <path
                  key={`streamline-${idx}`}
                  d={pathData}
                  stroke="#0891b2"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                  markerEnd="url(#arrowStreamline)"
                />
              ))}

              {particles.map((particle, idx) => (
                <circle
                  key={`particle-${idx}`}
                  cx={particle.x}
                  cy={particle.y}
                  r="2"
                  fill="#06b6d4"
                  opacity={getParticleOpacity(particle.age) * 0.7}
                />
              ))}

              <motion.circle
                cx={dragObject.x}
                cy={dragObject.y}
                r={dragObject.radius}
                fill="#0f766e"
                stroke="#14b8a6"
                strokeWidth="2"
                opacity="0.8"
              />

              {dragObject.vx > 0.1 && (
                <>
                  <defs>
                    <marker
                      id="dragArrow"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="5"
                      orient="auto"
                    >
                      <path d="M0,0 L10,5 L0,10 Z" fill="#f59e0b" />
                    </marker>
                  </defs>

                  <line
                    x1={dragObject.x}
                    y1={dragObject.y}
                    x2={dragObject.x + dragObject.vx * 30}
                    y2={dragObject.y}
                    stroke="#f59e0b"
                    strokeWidth="3"
                    markerEnd="url(#dragArrow)"
                    opacity="0.7"
                  />

                  <text
                    x={dragObject.x + dragObject.vx * 15}
                    y={dragObject.y - 15}
                    fill="#f59e0b"
                    className="text-xs font-bold"
                    textAnchor="middle"
                  >
                    V_obj
                  </text>
                </>
              )}

              <defs>
                <marker
                  id="fluidArrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="5"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 Z" fill="#0891b2" />
                </marker>
              </defs>

              <line
                x1="10"
                y1="20"
                x2="50"
                y2="20"
                stroke="#0891b2"
                strokeWidth="2"
                markerEnd="url(#fluidArrow)"
              />

              <text x="30" y="40" fill="#0891b2" className="text-xs font-bold" textAnchor="middle">
                Fluxo
              </text>
            </svg>
          </div>

          <div className="space-y-6">
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAnimating(!isAnimating)}
                variant={isAnimating ? "default" : "outline"}
                size="sm"
              >
                {isAnimating ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Reproduzir
                  </>
                )}
              </Button>

              <Button onClick={handleReset} variant="outline" size="sm">
                Resetar
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-cyan-600" />
                    Velocidade do Fluxo (m/s)
                  </Label>
                  <span className="font-bold text-cyan-600">{fluidVelocity.toFixed(1)}</span>
                </div>
                <Slider
                  value={[fluidVelocity]}
                  min={1}
                  max={8}
                  step={0.5}
                  onValueChange={([v]) => setFluidVelocity(v)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    Viscosidade do Fluido
                  </Label>
                  <span className="font-bold text-blue-600">{viscosity.toFixed(2)}</span>
                </div>
                <Slider
                  value={[viscosity]}
                  min={0.1}
                  max={1}
                  step={0.1}
                  onValueChange={([v]) => setViscosity(v)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {viscosity < 0.4
                    ? "Fluido baixa viscosidade (ex: água)"
                    : viscosity < 0.7
                      ? "Fluido viscosidade média"
                      : "Fluido alta viscosidade (ex: mel)"}
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Tamanho do Objeto</Label>
                  <span className="font-bold">{objectRadius.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[objectRadius]}
                  min={0.5}
                  max={3}
                  step={0.5}
                  onValueChange={([v]) => {
                    setObjectRadius(v);
                    setDragObject((prev) => ({
                      ...prev,
                      radius: v * 8,
                    }));
                  }}
                />
              </div>
            </div>

            <Separator />

            <div className="bg-muted/50 p-4 rounded-xl space-y-3">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Info className="h-4 w-4" />
                Parâmetros Físicos
              </h4>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>Número de Reynolds:</span>
                  <Badge variant="outline" className="font-mono">
                    {reynoldsNumber.toFixed(1)}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span>Vel. do Objeto:</span>
                  <Badge variant="outline" className="font-mono">
                    {dragObject.vx.toFixed(2)} m/s
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span>Força de Arrasto:</span>
                  <Badge variant="outline" className="font-mono">
                    {calculateDragForce(fluidVelocity, dragObject.radius, viscosity).toFixed(1)}N
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span>Tipo de Fluxo:</span>
                  <Badge
                    variant={reynoldsNumber < 1 ? "secondary" : "default"}
                    className="font-mono text-xs"
                  >
                    {reynoldsNumber < 1 ? "Stokes" : "Turbulento"}
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <MathFormula
                  formula={String.raw`F_{arrasto} = 6\pi\eta rv`}
                  block
                />
                <div className="text-xs text-muted-foreground">
                  <p>
                    <strong>η</strong> = viscosidade dinâmica, <strong>r</strong> = raio,{" "}
                    <strong>v</strong> = velocidade relativa
                  </p>
                  <p className="mt-2">
                    <strong>Re = ρvL/η</strong> (Número de Reynolds controla o regime de fluxo)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-900 text-sm space-y-1">
              <p className="font-semibold text-blue-900 dark:text-blue-100">💡 Conceitos Visualizados:</p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>Campo de velocidade do fluido (streamlines)</li>
                <li>Força de arrasto (Stokes drag)</li>
                <li>Número de Reynolds e regimes de fluxo</li>
                <li>Interação entre viscosidade e movimento</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
