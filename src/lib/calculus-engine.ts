
import { 
  ParametricCurve, 
  VectorField2D, 
  VectorField3D, 
  CurveVisualizationData,
  LineIntegralCalculation,
  Vector2D,
  Vector3D
} from "./calculus-types";

const EPSILON = 1e-5;
const INTEGRATION_STEPS = 1000;

export function numericalDerivative(
  f: (t: number) => number,
  t: number,
  h = EPSILON
): number {
  return (f(t + h) - f(t - h)) / (2 * h);
}

export function arcLength(curve: ParametricCurve, resolution = INTEGRATION_STEPS): number {
  const dt = (curve.tMax - curve.tMin) / resolution;
  let length = 0;

  for (let i = 0; i < resolution; i++) {
    const t = curve.tMin + i * dt;
    const dxdt = numericalDerivative(curve.x, t);
    const dydt = numericalDerivative(curve.y, t);
    const dzdt = curve.z ? numericalDerivative(curve.z, t) : 0;

    const speed = Math.sqrt(dxdt * dxdt + dydt * dydt + dzdt * dzdt);
    length += speed * dt;
  }

  return length;
}

export function lineIntegral(
  field: VectorField2D | VectorField3D,
  curve: ParametricCurve,
  resolution = INTEGRATION_STEPS
): LineIntegralCalculation {
  const dt = (curve.tMax - curve.tMin) / resolution;
  let integral = 0;
  const steps: string[] = [];

  steps.push(`Distribuindo a integral em ${resolution} passos de t = ${curve.tMin} até ${curve.tMax}`);
  steps.push(`Δt = ${dt.toFixed(6)}`);

  for (let i = 0; i < resolution; i++) {
    const t = curve.tMin + i * dt;
    
    const x = curve.x(t);
    const y = curve.y(t);
    const z = curve.z ? curve.z(t) : 0;

    const dxdt = numericalDerivative(curve.x, t);
    const dydt = numericalDerivative(curve.y, t);
    const dzdt = curve.z ? numericalDerivative(curve.z, t) : 0;

    const is3D = 'fz' in field;
    let fx: number, fy: number, fz: number;
    
    if (is3D) {
      const field3D = field as VectorField3D;
      fx = field3D.fx(x, y, z);
      fy = field3D.fy(x, y, z);
      fz = field3D.fz(x, y, z);
    } else {
      const field2D = field as VectorField2D;
      fx = field2D.fx(x, y);
      fy = field2D.fy(x, y);
      fz = 0;
    }

    const dotProduct = fx * dxdt + fy * dydt + fz * dzdt;
    integral += dotProduct * dt;
  }

  steps.push(`Resultado da integral de linha: ${integral.toFixed(4)}`);

  return {
    fieldDescription: "description" in field ? field.description : "Campo vetorial",
    curveDescription: curve.description,
    result: integral,
    work: steps,
    method: "parametric"
  };
}

export function generateCurveVisualization(
  curve: ParametricCurve,
  field: VectorField2D | VectorField3D,
  resolution = 30
): CurveVisualizationData {
  const points: (Vector2D | Vector3D)[] = [];
  const derivatives: (Vector2D | Vector3D)[] = [];
  const fieldVectors: { position: Vector2D | Vector3D; vector: Vector2D | Vector3D }[] = [];

  const dt = (curve.tMax - curve.tMin) / resolution;

  for (let i = 0; i <= resolution; i++) {
    const t = curve.tMin + i * dt;

    const x = curve.x(t);
    const y = curve.y(t);
    const z = curve.z ? curve.z(t) : 0;

    const point = curve.z 
      ? { x, y, z }
      : { x, y };

    points.push(point);

    const dxdt = numericalDerivative(curve.x, t);
    const dydt = numericalDerivative(curve.y, t);
    const dzdt = curve.z ? numericalDerivative(curve.z, t) : 0;

    const derivative = curve.z
      ? { x: dxdt, y: dydt, z: dzdt }
      : { x: dxdt, y: dydt };

    derivatives.push(derivative);

    const is3D = 'fz' in field;
    let fx: number, fy: number, fz: number;

    if (is3D) {
      const field3D = field as VectorField3D;
      fx = field3D.fx(x, y, z);
      fy = field3D.fy(x, y, z);
      fz = field3D.fz(x, y, z);
    } else {
      const field2D = field as VectorField2D;
      fx = field2D.fx(x, y);
      fy = field2D.fy(x, y);
      fz = 0;
    }

    const magnitude = Math.sqrt(fx * fx + fy * fy + fz * fz);
    const scale = magnitude > 0 ? 0.3 / magnitude : 0;

    const fieldVector = curve.z
      ? { x: fx * scale, y: fy * scale, z: fz * scale }
      : { x: fx * scale, y: fy * scale };

    fieldVectors.push({
      position: point,
      vector: fieldVector
    });
  }

  return { points, derivatives, fieldVectors };
}

export function generateVectorFieldGrid(
  field: VectorField2D | VectorField3D,
  xRange: [number, number],
  yRange: [number, number],
  zRange?: [number, number],
  gridResolution = 10
): CurveVisualizationData {
  const points: (Vector2D | Vector3D)[] = [];
  const fieldVectors: { position: Vector2D | Vector3D; vector: Vector2D | Vector3D }[] = [];

  const is3D = "fz" in field && zRange !== undefined;
  const xStep = (xRange[1] - xRange[0]) / gridResolution;
  const yStep = (yRange[1] - yRange[0]) / gridResolution;
  const zStep = is3D ? (zRange![1] - zRange![0]) / gridResolution : 0;

  const zValues = is3D
    ? Array.from({ length: gridResolution + 1 }, (_, k) => zRange![0] + k * zStep)
    : [0];

  for (let i = 0; i <= gridResolution; i++) {
    const x = xRange[0] + i * xStep;
    for (let j = 0; j <= gridResolution; j++) {
      const y = yRange[0] + j * yStep;
      for (const z of zValues) {
        const point = is3D ? { x, y, z } : { x, y };
        points.push(point);

        let fx: number;
        let fy: number;
        let fz: number;

        if (is3D) {
          const field3D = field as VectorField3D;
          fx = field3D.fx(x, y, z);
          fy = field3D.fy(x, y, z);
          fz = field3D.fz(x, y, z);
        } else {
          const field2D = field as VectorField2D;
          fx = field2D.fx(x, y);
          fy = field2D.fy(x, y);
          fz = 0;
        }

        // Vetores brutos (sem pré-escala): o visualizador decide comprimento e cor
        const vector = is3D
          ? { x: fx, y: fy, z: fz }
          : { x: fx, y: fy };

        fieldVectors.push({ position: point, vector });
      }
    }
  }

  return { points, derivatives: [], fieldVectors };
}

export function computeDivergence3D(
  field: VectorField3D,
  x: number,
  y: number,
  z: number,
  h = 1e-4
): number {
  const dfxdx = (field.fx(x + h, y, z) - field.fx(x - h, y, z)) / (2 * h);
  const dfydy = (field.fy(x, y + h, z) - field.fy(x, y - h, z)) / (2 * h);
  const dfzdz = (field.fz(x, y, z + h) - field.fz(x, y, z - h)) / (2 * h);
  return dfxdx + dfydy + dfzdz;
}

export function computeCurl3D(
  field: VectorField3D,
  x: number,
  y: number,
  z: number,
  h = 1e-4
): Vector3D {
  const dfzdy = (field.fz(x, y + h, z) - field.fz(x, y - h, z)) / (2 * h);
  const dfydz = (field.fy(x, y, z + h) - field.fy(x, y, z - h)) / (2 * h);
  const dfxdz = (field.fx(x, y, z + h) - field.fx(x, y, z - h)) / (2 * h);
  const dfzdx = (field.fz(x + h, y, z) - field.fz(x - h, y, z)) / (2 * h);
  const dfydx = (field.fy(x + h, y, z) - field.fy(x - h, y, z)) / (2 * h);
  const dfxdy = (field.fx(x, y + h, z) - field.fx(x, y - h, z)) / (2 * h);

  return {
    x: dfzdy - dfydz,
    y: dfxdz - dfzdx,
    z: dfydx - dfxdy,
  };
}

export function isConservativeField2D(field: VectorField2D): boolean {
  const h = 0.001;
  const testPoints = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 }
  ];

  for (const point of testPoints) {
    const dPdy = (field.fy(point.x, point.y + h) - field.fy(point.x, point.y - h)) / (2 * h);
    const dQdx = (field.fx(point.x + h, point.y) - field.fx(point.x - h, point.y)) / (2 * h);

    if (Math.abs(dPdy - dQdx) > 0.01) {
      return false;
    }
  }

  return true;
}
