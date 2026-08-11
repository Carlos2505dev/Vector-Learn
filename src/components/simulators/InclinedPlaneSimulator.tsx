import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Info, Box, ChevronRight, Zap } from "lucide-react";
import { MathFormula } from "../math/MathFormula";

export function InclinedPlaneSimulator() {
  const [angle, setAngle] = useState(30);
  const [mass, setMass] = useState(10);
  const g = 9.81;

  const angleRad = (angle * Math.PI) / 180;
  const weight = mass * g;
  const px = weight * Math.sin(angleRad);
  const py = weight * Math.cos(angleRad);
  const normal = py;

  return (
    <Card className="border-2 border-vector-orange/20 overflow-hidden">
      <CardHeader className="bg-vector-orange/5 border-b border-vector-orange/10">
        <CardTitle className="flex items-center gap-2 text-vector-orange">
          <Box className="h-5 w-5" />
          Cenário: Plano Inclinado
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative h-[300px] bg-orange-50 dark:bg-orange-950/10 rounded-xl overflow-hidden border-2 border-orange-100 dark:border-orange-900">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              <defs>
                <marker id="arrow-orange" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                  <path d="M0,0 L10,5 L0,10 Z" fill="hsl(var(--vector-orange))" />
                </marker>
                <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                  <path d="M0,0 L10,5 L0,10 Z" fill="hsl(var(--vector-blue))" />
                </marker>
              </defs>

              <path
                d={`M 50 250 L 350 250 L 350 ${250 - 300 * Math.tan(angleRad)} Z`}
                fill="#ddd"
                stroke="#999"
                strokeWidth="2"
              />

              <path
                d={`M 100 250 A 50 50 0 0 0 ${100 - 50 * Math.cos(angleRad)} ${250 - 50 * Math.sin(angleRad)}`}
                fill="none"
                stroke="hsl(var(--vector-orange))"
                strokeWidth="2"
              />
              <text x="110" y="240" fill="hsl(var(--vector-orange))" className="text-sm font-bold">{angle}°</text>

              <g transform={`translate(200, ${250 - 150 * Math.tan(angleRad)}) rotate(${-angle})`}>
                <rect x="-20" y="-40" width="40" height="40" fill="#666" rx="4" />
                
                <line x1="0" y1="-20" x2={-px / 2} y2={py / 2 - 20} stroke="hsl(var(--vector-red))" strokeWidth="3" markerEnd="url(#arrow-orange)" />
                <text x={-px / 2 - 10} y={py / 2} fill="hsl(var(--vector-red))" className="text-[10px] font-bold">P</text>

                <line x1="0" y1="-20" x2="0" y2="-70" stroke="hsl(var(--vector-blue))" strokeWidth="3" markerEnd="url(#arrow-blue)" />
                <text x="5" y="-75" fill="hsl(var(--vector-blue))" className="text-[10px] font-bold">N</text>

                <line x1="0" y1="-20" x2={-px / 2} y2="-20" stroke="hsl(var(--vector-orange))" strokeWidth="2" strokeDasharray="2,2" markerEnd="url(#arrow-orange)" />
                <text x={-px / 2 - 20} y="-25" fill="hsl(var(--vector-orange))" className="text-[10px] font-bold">Px</text>

                <line x1="0" y1="-20" x2="0" y2={py / 2 - 20} stroke="hsl(var(--vector-teal))" strokeWidth="2" strokeDasharray="2,2" />
                <text x="-25" y={py / 2 - 10} fill="hsl(var(--vector-teal))" className="text-[10px] font-bold">Py</text>
              </g>
            </svg>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-vector-orange" />
                    Inclinação do Plano (°)
                  </Label>
                  <span className="font-bold text-vector-orange">{angle}°</span>
                </div>
                <Slider value={[angle]} min={0} max={60} step={1} onValueChange={([v]) => setAngle(v)} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-vector-yellow" />
                    Massa do Objeto (kg)
                  </Label>
                  <span className="font-bold text-vector-yellow">{mass} kg</span>
                </div>
                <Slider value={[mass]} min={1} max={50} step={1} onValueChange={([v]) => setMass(v)} />
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-xl space-y-3">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Info className="h-4 w-4" />
                Decomposição de Forças
              </h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Peso (P):</span>
                  <Badge variant="outline" className="font-mono">{weight.toFixed(1)} N</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Componente Px (Tangencial):</span>
                  <Badge variant="outline" className="font-mono text-vector-orange">{px.toFixed(1)} N</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Componente Py (Normal):</span>
                  <Badge variant="outline" className="font-mono text-vector-teal">{py.toFixed(1)} N</Badge>
                </div>
                <div className="pt-4 border-t mt-2 space-y-4">
                  <MathFormula formula={String.raw`\vec{P} = \vec{P}_x + \vec{P}_y`} block />
                  <div className="grid grid-cols-2 gap-4">
                    <MathFormula formula={String.raw`|P_x| = P \sin(\theta)`} />
                    <MathFormula formula={String.raw`|P_y| = P \cos(\theta)`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
