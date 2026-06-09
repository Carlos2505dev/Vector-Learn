
import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Zap } from "lucide-react";
import { VectorField3D } from "@/lib/calculus-types";
import { generateVectorFieldGrid, isConservativeField2D } from "@/lib/calculus-engine";
import * as THREE from "three";

interface VectorFieldVisualizerProps {
  fields: VectorField3D[];
  xRange?: [number, number];
  yRange?: [number, number];
  zRange?: [number, number];
}

interface FieldArrowProps {
  position: [number, number, number];
  direction: [number, number, number];
  magnitude: number;
  color: string;
}

function FieldArrow({ position, direction, magnitude, color }: FieldArrowProps) {
  const length = Math.min(magnitude, 0.5);
  const headLength = length * 0.3;
  const headWidth = length * 0.15;

  const points = useMemo(() => {
    const dir = new THREE.Vector3(...direction).normalize();
    const start = new THREE.Vector3(...position);
    const end = start.clone().add(dir.multiplyScalar(length));

    return [
      start.toArray() as [number, number, number],
      end.toArray() as [number, number, number],
      headLength,
      headWidth
    ] as const;
  }, [position, direction, length, headLength, headWidth]);

  return (
    <group position={position as [number, number, number]}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              0, 0, 0,
              direction[0] * length, direction[1] * length, direction[2] * length
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} linewidth={2} />
      </line>

      <mesh position={[direction[0] * length, direction[1] * length, direction[2] * length]}>
        <coneGeometry args={[headWidth, headLength, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={color} wireframe />
      </mesh>
    </group>
  );
}

function FieldGridContent({
  field,
  xRange,
  yRange,
  zRange,
  showConservative
}: {
  field: VectorField3D;
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number];
  showConservative: boolean;
}) {
  const fieldData = useMemo(() => {
    return generateVectorFieldGrid(field, xRange, yRange, zRange, 6);
  }, [field, xRange, yRange, zRange]);

  const getFieldColor = (magnitude: number, maxMagnitude: number) => {
    const normalized = Math.min(magnitude / maxMagnitude, 1);
    if (normalized < 0.33) return "#3b82f6";
    if (normalized < 0.66) return "#8b5cf6";
    return "#ef4444";
  };

  const maxMag = useMemo(() => {
    return Math.max(...fieldData.fieldVectors.map(fv => {
      const mag = Math.sqrt(
        fv.vector.x ** 2 + fv.vector.y ** 2 + (fv.vector.z || 0) ** 2
      );
      return mag;
    }));
  }, [fieldData]);

  return (
    <>
      <Grid args={[20, 20]} fadeDistance={50} fadeStrength={0.5} />
      {fieldData.fieldVectors.map((fv, idx) => {
        const magnitude = Math.sqrt(
          fv.vector.x ** 2 + fv.vector.y ** 2 + (fv.vector.z || 0) ** 2
        );
        return (
          <FieldArrow
            key={idx}
            position={[
              (fv.position as any).x,
              (fv.position as any).y,
              (fv.position as any).z || 0
            ]}
            direction={[
              fv.vector.x || 0,
              fv.vector.y || 0,
              (fv.vector as any).z || 0
            ]}
            magnitude={magnitude}
            color={getFieldColor(magnitude, maxMag)}
          />
        );
      })}
    </>
  );
}

export function VectorFieldVisualizer({
  fields,
  xRange = [-3, 3],
  yRange = [-3, 3],
  zRange = [-2, 2]
}: VectorFieldVisualizerProps) {
  const [selectedFieldIdx, setSelectedFieldIdx] = useState(0);
  const [showConservative, setShowConservative] = useState(true);
  const [showArrows, setShowArrows] = useState(true);

  const selectedField = fields[selectedFieldIdx];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🌊 Campos Vetoriais 3D</span>
            <Badge variant="outline">
              {selectedField.isConservative ? "Conservativo" : "Não-Conservativo"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full h-96 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-900">
            <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <OrbitControls />
              {showArrows && (
                <FieldGridContent
                  field={selectedField}
                  xRange={xRange}
                  yRange={yRange}
                  zRange={zRange}
                  showConservative={showConservative}
                />
              )}
            </Canvas>
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
              variant={showArrows ? "default" : "outline"}
              onClick={() => setShowArrows(!showArrows)}
            >
              {showArrows ? <Eye size={16} /> : <EyeOff size={16} />}
              {showArrows ? "Vetores" : "Ocultar"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex gap-2"
            >
              <Zap size={16} />
              Rotação: (clique e arraste no canvas)
            </Button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-3">
            <div className="font-semibold text-sm mb-3">Propriedades do Campo</div>
            <div className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
              <div>
                <strong>Nome:</strong> {selectedField.description}
              </div>
              <div>
                <strong>Tipo:</strong>{" "}
                <Badge variant="secondary">
                  {selectedField.isConservative ? "Conservativo" : "Não-Conservativo"}
                </Badge>
              </div>
              <div className="text-xs mt-3 italic text-slate-600 dark:text-slate-400">
                 Campos conservativos têm rotacional nulo (∇ × F = 0). A integral de linha
                depende apenas dos pontos inicial e final, não do caminho.
              </div>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <div className="font-semibold text-sm mb-3">Magnitude dos Vetores</div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span className="text-sm">Fraco</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded" />
                <span className="text-sm">Médio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span className="text-sm">Forte</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
