import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ElementRef,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpRight,
  Compass,
  Gauge,
  Info,
  LayoutGrid,
  MousePointer2,
  Orbit,
  RotateCcw,
  Sparkles,
  Waves,
  Wind,
} from "lucide-react";
import { VectorField3D, type CurveVisualizationData, type Vector3D } from "@/lib/calculus-types";
import {
  computeCurl3D,
  computeDivergence3D,
  generateVectorFieldGrid,
} from "@/lib/calculus-engine";
import { cn } from "@/lib/utils";

interface VectorFieldVisualizerProps {
  fields: VectorField3D[];
  xRange?: [number, number];
  yRange?: [number, number];
  zRange?: [number, number];
}

/* ------------------------------------------------------------------ */
/* Constantes visuais                                                  */
/* ------------------------------------------------------------------ */

// Intervalos padrão como constantes de módulo: garante identidade estável entre renders
// (evita que o uso de literais como default re-crie os arrays a cada renderização)
const DEFAULT_X_RANGE: [number, number] = [-3, 3];
const DEFAULT_Y_RANGE: [number, number] = [-3, 3];
const DEFAULT_Z_RANGE: [number, number] = [-2, 2];

const SHAFT_RADIUS = 0.022;
const HEAD_RADIUS = 0.075;
const HEAD_LENGTH = 0.2;
const MIN_ARROW_LENGTH = 0.16;
const MAX_ARROW_LENGTH = 0.72;

// Gradiente ciano → violeta → rosa usado nas setas, partículas e legenda
const RAMP_STOPS: [number, number, number][] = [
  [0x22, 0xd3, 0xee], // ciano
  [0xa7, 0x8b, 0xfa], // violeta
  [0xfb, 0x71, 0x85], // rosa
];

// Cor scratch reutilizada em todas as chamadas: setColorAt copia os valores na hora,
// então não há necessidade de alocar um THREE.Color por seta/partícula.
const _colorScratch = new THREE.Color();

function magnitudeColor(normalized: number): THREE.Color {
  const t = Math.min(Math.max(normalized, 0), 1);
  const position = t * (RAMP_STOPS.length - 1);
  const i = Math.min(Math.floor(position), RAMP_STOPS.length - 2);
  const frac = position - i;
  const a = RAMP_STOPS[i];
  const b = RAMP_STOPS[i + 1];
  return _colorScratch.setRGB(
    (a[0] + (b[0] - a[0]) * frac) / 255,
    (a[1] + (b[1] - a[1]) * frac) / 255,
    (a[2] + (b[2] - a[2]) * frac) / 255
  );
}

// Coordenadas matemáticas (x, y, z) → coordenadas three.js (x, z, -y),
// para que o plano xy do campo fique horizontal e o eixo z fique para cima.
function toThree(x: number, y: number, z: number): [number, number, number] {
  return [x, z, -y];
}

const FIELD_ICONS = [Orbit, Compass, Wind, Gauge];

// Campo de segurança usado apenas quando `fields` está vazio (nunca renderizado)
const EMPTY_FIELD: VectorField3D = {
  fx: () => 0,
  fy: () => 0,
  fz: () => 0,
  description: "",
};

/* ------------------------------------------------------------------ */
/* Setas instanciadas (malha 3D do campo)                              */
/* ------------------------------------------------------------------ */

interface ArrowFieldProps {
  fieldVectors: CurveVisualizationData["fieldVectors"];
  maxMag: number;
}

function ArrowField({ fieldVectors, maxMag }: ArrowFieldProps) {
  const shaftRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);

  const shaftGeometry = useMemo(
    () => new THREE.CylinderGeometry(SHAFT_RADIUS, SHAFT_RADIUS, 1, 6, 1, true),
    []
  );
  const headGeometry = useMemo(() => new THREE.ConeGeometry(HEAD_RADIUS, HEAD_LENGTH, 10), []);
  const shaftMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.2, toneMapped: false }),
    []
  );
  const headMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.35, toneMapped: false }),
    []
  );

  useLayoutEffect(() => {
    const shaft = shaftRef.current;
    const head = headRef.current;
    if (!shaft || !head) return;

    fieldVectors.forEach((fv, i) => {
      const p = fv.position as Vector3D;
      const v = fv.vector as Vector3D;
      const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

      if (mag < 1e-7) {
        // Vetor nulo: esconde os dois segmentos
        dummy.position.set(p.x, p.z, -p.y);
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        shaft.setMatrixAt(i, dummy.matrix);
        head.setMatrixAt(i, dummy.matrix);
        return;
      }

      const length =
        MIN_ARROW_LENGTH + (MAX_ARROW_LENGTH - MIN_ARROW_LENGTH) * Math.min(mag / maxMag, 1);
      const [tx, ty, tz] = toThree(v.x, v.y, v.z);
      dir.set(tx, ty, tz).normalize();
      quaternion.setFromUnitVectors(up, dir);

      // haste: cilindro esticado entre origem e ponta
      dummy.position.set(p.x + (dir.x * length) / 2, p.z + (dir.y * length) / 2, -p.y + (dir.z * length) / 2);
      dummy.quaternion.copy(quaternion);
      dummy.scale.set(1, length, 1);
      dummy.updateMatrix();
      shaft.setMatrixAt(i, dummy.matrix);

      // ponta: cone no fim do vetor, orientado na direção do campo
      dummy.position.set(p.x + dir.x * length, p.z + dir.y * length, -p.y + dir.z * length);
      dummy.quaternion.copy(quaternion);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      head.setMatrixAt(i, dummy.matrix);

      const color = magnitudeColor(mag / maxMag);
      shaft.setColorAt(i, color);
      head.setColorAt(i, color);
    });

    shaft.instanceMatrix.needsUpdate = true;
    head.instanceMatrix.needsUpdate = true;
    if (shaft.instanceColor) shaft.instanceColor.needsUpdate = true;
    if (head.instanceColor) head.instanceColor.needsUpdate = true;
  }, [fieldVectors, maxMag, dummy, dir, quaternion, up]);

  useEffect(
    () => () => {
      shaftGeometry.dispose();
      headGeometry.dispose();
      shaftMaterial.dispose();
      headMaterial.dispose();
    },
    [shaftGeometry, headGeometry, shaftMaterial, headMaterial]
  );

  const count = fieldVectors.length;

  return (
    <>
      <instancedMesh ref={shaftRef} args={[shaftGeometry, shaftMaterial, count]} frustumCulled={false} />
      <instancedMesh ref={headRef} args={[headGeometry, headMaterial, count]} frustumCulled={false} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Partículas de fluxo animadas (linhas de campo em movimento)         */
/* ------------------------------------------------------------------ */

interface FlowParticlesProps {
  field: VectorField3D;
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number];
  maxMag: number;
  count?: number;
  speed?: number;
}

function FlowParticles({
  field,
  xRange,
  yRange,
  zRange,
  maxMag,
  count = 90,
  speed = 1,
}: FlowParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const step = useMemo(() => new THREE.Vector3(), []);

  const geometry = useMemo(() => new THREE.SphereGeometry(0.06, 8, 8), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  );

  const particles = useMemo(() => {
    const list: { pos: THREE.Vector3; scale: number }[] = [];
    for (let i = 0; i < count; i++) {
      list.push({
        pos: new THREE.Vector3(
          xRange[0] + Math.random() * (xRange[1] - xRange[0]),
          yRange[0] + Math.random() * (yRange[1] - yRange[0]),
          zRange[0] + Math.random() * (zRange[1] - zRange[0])
        ),
        scale: 0.7 + Math.random() * 1.1,
      });
    }
    return list;
  }, [count, xRange, yRange, zRange]);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Posições e cores iniciais (também cobre usuários com reduced-motion)
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    particles.forEach((p, i) => {
      dummy.position.set(p.pos.x, p.pos.z, -p.pos.y);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      const fx = field.fx(p.pos.x, p.pos.y, p.pos.z);
      const fy = field.fy(p.pos.x, p.pos.y, p.pos.z);
      const fz = field.fz(p.pos.x, p.pos.y, p.pos.z);
      const mag = Math.sqrt(fx * fx + fy * fy + fz * fz);
      mesh.setColorAt(i, magnitudeColor(Math.min(mag / Math.max(maxMag, 1e-9), 1)));
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [particles, field, maxMag, dummy]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh || reducedMotion) return;

    const dt = Math.min(delta, 0.05) * speed;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i].pos;
      const fx = field.fx(p.x, p.y, p.z);
      const fy = field.fy(p.x, p.y, p.z);
      const fz = field.fz(p.x, p.y, p.z);
      const mag = Math.sqrt(fx * fx + fy * fy + fz * fz);

      if (mag > 1e-8) {
        step.set(fx, fy, fz).normalize().multiplyScalar(Math.min(mag, 2.5) * dt * 1.6);
        p.add(step);
      }

      if (
        p.x < xRange[0] ||
        p.x > xRange[1] ||
        p.y < yRange[0] ||
        p.y > yRange[1] ||
        p.z < zRange[0] ||
        p.z > zRange[1]
      ) {
        p.set(
          xRange[0] + Math.random() * (xRange[1] - xRange[0]),
          yRange[0] + Math.random() * (yRange[1] - yRange[0]),
          zRange[0] + Math.random() * (zRange[1] - zRange[0])
        );
      }

      dummy.position.set(p.x, p.z, -p.y);
      dummy.scale.setScalar(particles[i].scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, magnitudeColor(Math.min(mag / Math.max(maxMag, 1e-9), 1)));
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, particles.length]}
      frustumCulled={false}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Estatísticas numéricas do campo (divergência / rotacional)          */
/* ------------------------------------------------------------------ */

function useFieldStats(
  field: VectorField3D,
  xRange: [number, number],
  yRange: [number, number],
  zRange: [number, number],
  resolution: number
) {
  return useMemo(() => {
    const grid = generateVectorFieldGrid(field, xRange, yRange, zRange, resolution);
    let maxMag = 0;
    for (const fv of grid.fieldVectors) {
      const v = fv.vector as Vector3D;
      maxMag = Math.max(maxMag, Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z));
    }
    return {
      fieldVectors: grid.fieldVectors,
      maxMag: Math.max(maxMag, 1e-9),
      divergence: computeDivergence3D(field, 0, 0, 0),
      curl: computeCurl3D(field, 0, 0, 0),
    };
  }, [field, xRange, yRange, zRange, resolution]);
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

export function VectorFieldVisualizer({
  fields,
  xRange = DEFAULT_X_RANGE,
  yRange = DEFAULT_Y_RANGE,
  zRange = DEFAULT_Z_RANGE,
}: VectorFieldVisualizerProps) {
  const [selectedFieldIdx, setSelectedFieldIdx] = useState(0);
  const [showArrows, setShowArrows] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [density, setDensity] = useState(5);
  const [particleSpeed, setParticleSpeed] = useState(1);
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);

  const selectedField = fields[selectedFieldIdx] ?? fields[0];

  const stats = useFieldStats(
    selectedField ?? EMPTY_FIELD,
    xRange,
    yRange,
    zRange,
    density
  );

  const resetCamera = useCallback(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.object.position.set(9, 7, 9);
    controls.target.set(0, 0, 0);
    controls.update();
  }, []);

  if (!selectedField) return null;

  const arrowCount = (density + 1) ** 3;
  const curlMag = Math.sqrt(
    stats.curl.x * stats.curl.x + stats.curl.y * stats.curl.y + stats.curl.z * stats.curl.z
  );
  const hasCurl = curlMag > 0.05;
  const hasDivergence = Math.abs(stats.divergence) > 0.05;

  const interpretation =
    hasCurl && !hasDivergence
      ? "O rotacional domina: as setas circulam em torno da origem (vórtice) sem se expandir. O trabalho ao longo de uma curva fechada é diferente de zero."
      : !hasCurl && hasDivergence
        ? "A divergência domina: o campo flui radialmente para dentro ou para fora da origem, como o gradiente de um potencial (campo conservativo)."
        : hasCurl && hasDivergence
          ? "Campo misto: combina circulação (∇×F ≠ 0) com expansão ou contração (∇·F ≠ 0)."
          : "Na origem o campo é praticamente uniforme.";

  const toolbarButton = (active: boolean) =>
    cn(
      "flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all duration-200",
      active
        ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-600/30"
        : "border border-white/15 bg-slate-900/60 text-slate-300 backdrop-blur hover:bg-slate-800/80 hover:text-white"
    );

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-violet-500 to-rose-500" />

        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-3 text-xl">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-600/30">
                <Waves size={20} />
              </span>
              <span>
                Campos Vetoriais 3D
                <span className="block text-xs font-normal text-muted-foreground">
                  Visualização interativa com fluxo animado
                </span>
              </span>
            </CardTitle>
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1",
                selectedField.isConservative
                  ? "border-emerald-600/40 bg-emerald-600/10 text-emerald-600 dark:border-emerald-500/40 dark:text-emerald-400"
                  : "border-rose-600/40 bg-rose-600/10 text-rose-600 dark:border-rose-500/40 dark:text-rose-400"
              )}
            >
              {selectedField.isConservative ? "✓ Conservativo" : "✗ Não-Conservativo"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          {/* Seletor de campo */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-muted-foreground">
              Selecione o campo vetorial
            </Label>
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {fields.map((field, idx) => {
                const Icon = FIELD_ICONS[idx % FIELD_ICONS.length];
                const active = idx === selectedFieldIdx;
                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.35, ease: "easeOut" }}
                    onClick={() => setSelectedFieldIdx(idx)}
                    aria-pressed={active}
                    className={cn(
                      "group min-w-[172px] shrink-0 rounded-xl border p-3 text-left transition-all duration-200",
                      active
                        ? "border-transparent bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-600/25"
                        : "border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon
                        size={16}
                        className={active ? "text-white" : "text-primary"}
                        strokeWidth={2.2}
                      />
                      <span className="text-sm font-medium leading-tight">{field.description}</span>
                    </span>
                    <span
                      className={cn(
                        "mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        active
                          ? "bg-white/20 text-white"
                          : field.isConservative
                            ? "bg-emerald-600/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-600/10 text-rose-600 dark:text-rose-400"
                      )}
                    >
                      {field.isConservative ? "Conservativo" : "Não-conservativo"}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Canvas 3D */}
          <div
            role="img"
            aria-label={`Visualização 3D do campo vetorial ${selectedField.description}`}
            className="relative h-[380px] overflow-hidden rounded-xl border border-slate-700/60 bg-[#0a0f1e] shadow-2xl sm:h-[460px] lg:h-[520px]"
          >
            <Canvas
              camera={{ position: [9, 7, 9], fov: 50 }}
              dpr={[1, 2]}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <color attach="background" args={["#0a0f1e"]} />
              <fog attach="fog" args={["#0a0f1e", 24, 46]} />
              <ambientLight intensity={0.55} />
              <directionalLight position={[6, 10, 6]} intensity={1.4} color="#dbeafe" />
              <directionalLight position={[-7, -5, -6]} intensity={0.8} color="#a5b4fc" />
              <OrbitControls
                ref={controlsRef}
                makeDefault
                enableDamping
                dampingFactor={0.08}
                enablePan={false}
                minDistance={4}
                maxDistance={26}
              />

              {showArrows && (
                <ArrowField fieldVectors={stats.fieldVectors} maxMag={stats.maxMag} />
              )}
              {showParticles && (
                <FlowParticles
                  field={selectedField}
                  xRange={xRange}
                  yRange={yRange}
                  zRange={zRange}
                  maxMag={stats.maxMag}
                  count={90}
                  speed={particleSpeed}
                />
              )}

              <Grid
                args={[12, 12]}
                position={[0, 0, 0]}
                cellSize={0.6}
                cellThickness={0.6}
                cellColor="#18273f"
                sectionSize={3}
                sectionThickness={1}
                sectionColor="#2b4270"
                fadeDistance={30}
                fadeStrength={1.5}
              />
            </Canvas>

            {/* Fórmula do campo selecionado */}
            <div className="pointer-events-none absolute left-3 top-3 z-10 max-w-[60%]">
              <div className="truncate rounded-lg border border-white/10 bg-slate-950/70 px-3 py-1.5 font-mono text-xs text-cyan-200 backdrop-blur">
                {selectedField.formula ?? selectedField.description}
              </div>
            </div>

            {/* Barra de ferramentas */}
            <div className="absolute right-3 top-3 z-10 flex max-w-[40%] flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowArrows((v) => !v)}
                aria-pressed={showArrows}
                aria-label={showArrows ? "Ocultar setas" : "Mostrar setas"}
                className={toolbarButton(showArrows)}
              >
                <ArrowUpRight size={15} />
                <span className="hidden sm:inline">Vetores</span>
              </button>
              <button
                type="button"
                onClick={() => setShowParticles((v) => !v)}
                aria-pressed={showParticles}
                aria-label={showParticles ? "Ocultar partículas" : "Mostrar partículas"}
                className={toolbarButton(showParticles)}
              >
                <Sparkles size={15} />
                <span className="hidden sm:inline">Fluxo</span>
              </button>
              <button
                type="button"
                onClick={resetCamera}
                aria-label="Redefinir câmera"
                title="Redefinir câmera"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-slate-900/60 text-slate-300 backdrop-blur transition-all duration-200 hover:bg-slate-800/80 hover:text-white"
              >
                <RotateCcw size={15} />
              </button>
            </div>

            {/* Dica de interação */}
            <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden items-center gap-1.5 text-[11px] text-slate-400 sm:flex">
              <MousePointer2 size={12} />
              Arraste para girar · Role para aproximar
            </div>
          </div>

          {/* Controles */}
          <div className="grid gap-4 rounded-xl border bg-muted/40 p-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <LayoutGrid size={14} className="text-primary" />
                  Densidade da malha
                </Label>
                <span className="font-mono text-xs text-muted-foreground">
                  {arrowCount} vetores
                </span>
              </div>
              <Slider
                value={[density]}
                min={3}
                max={7}
                step={1}
                onValueChange={([v]) => setDensity(v)}
                aria-label="Densidade da malha"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <Gauge size={14} className="text-primary" />
                  Velocidade do fluxo
                </Label>
                <span className="font-mono text-xs text-muted-foreground">
                  {particleSpeed.toFixed(1)}×
                </span>
              </div>
              <Slider
                value={[particleSpeed]}
                min={0.2}
                max={3}
                step={0.1}
                onValueChange={([v]) => setParticleSpeed(v)}
                aria-label="Velocidade do fluxo"
              />
            </div>
          </div>

          <Separator />

          {/* Análise do campo */}
          <motion.div
            key={selectedFieldIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-3 rounded-xl border bg-muted/40 p-4">
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <Info size={14} className="text-primary" />
                Análise do campo
              </div>
              <code className="block w-fit max-w-full overflow-x-auto rounded-md border bg-card px-3 py-1.5 font-mono text-xs text-slate-700 dark:text-slate-300">
                {selectedField.formula ?? "F(x, y, z) = (fx, fy, fz)"}
              </code>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-mono">
                  ∇·F(0,0,0) = {stats.divergence.toFixed(2)}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  |∇×F(0,0,0)| = {curlMag.toFixed(2)}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{interpretation}</p>
            </div>

            <div className="space-y-3 rounded-xl border bg-muted/40 p-4">
              <div className="text-sm font-semibold">Intensidade dos vetores</div>
              <div
                className="h-2.5 w-full rounded-full"
                style={{ background: "linear-gradient(90deg, #22d3ee, #a78bfa, #fb7185)" }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Fraco</span>
                <span>Médio</span>
                <span>Forte</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                O comprimento e a cor de cada seta refletem a magnitude do campo naquele ponto.
                Campos conservativos têm rotacional nulo: a integral de linha depende apenas dos
                pontos inicial e final, não do caminho percorrido.
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
