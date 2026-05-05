import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Waves, Ship, ArrowRight, Info } from "lucide-react";
import { MathFormula } from "./MathFormula";

export function BoatSimulator() {
  const [vBoat, setVBoat] = useState(4);
  const [vRiver, setVRiver] = useState(2);
  const [angle, setAngle] = useState(90); // Angle relative to river bank

  // Resultant calculation
  const angleRad = (angle * Math.PI) / 180;
  const vResultantX = vBoat * Math.cos(angleRad) + vRiver;
  const vResultantY = vBoat * Math.sin(angleRad);
  const vResultant = Math.sqrt(vResultantX ** 2 + vResultantY ** 2);
  const resultantAngle = (Math.atan2(vResultantY, vResultantX) * 180) / Math.PI;

  return (
    <Card className="border-2 border-vector-blue/20 overflow-hidden">
      <CardHeader className="bg-vector-blue/5 border-b border-vector-blue/10">
        <CardTitle className="flex items-center gap-2 text-vector-blue">
          <Ship className="h-5 w-5" />
          Cenário: Travessia do Rio
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visual Canvas */}
          <div className="relative h-[300px] bg-sky-100 dark:bg-sky-950/20 rounded-xl overflow-hidden border-2 border-sky-200 dark:border-sky-900">
            {/* Water Flow Animation */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 animate-pulse bg-[url('https://www.transparenttextures.com/patterns/waves.png')] opacity-50" />
            </div>

            <svg viewBox="0 0 400 300" className="w-full h-full">
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                  <path d="M0,0 L10,5 L0,10 Z" fill="currentColor" />
                </marker>
              </defs>

              {/* River Banks */}
              <rect x="0" y="0" width="400" height="40" fill="#d4a373" />
              <rect x="0" y="260" width="400" height="40" fill="#d4a373" />

              {/* Grid/Lines */}
              <line x1="0" y1="150" x2="400" y2="150" stroke="#8ecae6" strokeDasharray="5,5" />

              {/* Boat Vector (V_b) */}
              <line
                x1="200" y1="260"
                x2={200 + vBoat * 20 * Math.cos(angleRad)}
                y2={260 - vBoat * 20 * Math.sin(angleRad)}
                stroke="#5b8cff"
                strokeWidth="4"
                markerEnd="url(#arrow)"
              />
              <text x={200 + vBoat * 10 * Math.cos(angleRad) - 20} y={260 - vBoat * 10 * Math.sin(angleRad) - 10} fill="#5b8cff" className="text-xs font-bold italic">V_barco</text>

              {/* River Vector (V_r) */}
              <line
                x1="200" y1="260"
                x2={200 + vRiver * 20}
                y2="260"
                stroke="#00d1b2"
                strokeWidth="4"
                markerEnd="url(#arrow)"
              />
              <text x={200 + vRiver * 10} y={285} fill="#00d1b2" className="text-xs font-bold italic">V_rio</text>

              {/* Resultant Vector (V_res) */}
              <line
                x1="200" y1="260"
                x2={200 + vResultantX * 20}
                y2={260 - vResultantY * 20}
                stroke="#ef4444"
                strokeWidth="5"
                markerEnd="url(#arrow)"
              />
              <text x={200 + vResultantX * 20 + 5} y={260 - vResultantY * 20 - 5} fill="#ef4444" className="text-xs font-bold italic">V_resultante</text>
              
              {/* Boat Icon (Simplified) */}
              <circle cx="200" cy="260" r="6" fill="#333" />
            </svg>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <Ship className="h-4 w-4 text-vector-blue" />
                    Velocidade do Barco (m/s)
                  </Label>
                  <span className="font-bold text-vector-blue">{vBoat}</span>
                </div>
                <Slider value={[vBoat]} min={1} max={10} step={0.5} onValueChange={([v]) => setVBoat(v)} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-vector-teal" />
                    Velocidade do Rio (m/s)
                  </Label>
                  <span className="font-bold text-vector-teal">{vRiver}</span>
                </div>
                <Slider value={[vRiver]} min={0} max={8} step={0.5} onValueChange={([v]) => setVRiver(v)} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-vector-orange" />
                    Ângulo de Partida (°)
                  </Label>
                  <span className="font-bold text-vector-orange">{angle}°</span>
                </div>
                <Slider value={[angle]} min={0} max={180} step={5} onValueChange={([v]) => setAngle(v)} />
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-xl space-y-3">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Info className="h-4 w-4" />
                Cálculo Vetorial
              </h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Resultante:</span>
                  <Badge variant="outline" className="font-mono">{vResultant.toFixed(2)} m/s</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ângulo de deriva:</span>
                  <Badge variant="outline" className="font-mono">{resultantAngle.toFixed(1)}°</Badge>
                </div>
                <div className="pt-4 border-t mt-2 space-y-4">
                  <MathFormula formula={String.raw`\vec{V}_{res} = \vec{V}_{barco} + \vec{V}_{rio}`} block />
                  <div className="flex flex-wrap gap-4 justify-center">
                    <MathFormula formula={String.raw`V_{res,x} = V_{b,x} + V_{rio}`} />
                    <MathFormula formula={String.raw`V_{res,y} = V_{b,y}`} />
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
