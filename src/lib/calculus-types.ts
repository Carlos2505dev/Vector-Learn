
export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface ParametricCurve {
  id?: string;
  x: (t: number) => number;
  y: (t: number) => number;
  z?: (t: number) => number;
  description: string;
  tMin: number;
  tMax: number;
}

export interface VectorField2D {
  fx: (x: number, y: number) => number;
  fy: (x: number, y: number) => number;
  description: string;
  isConservative?: boolean;
  formula?: string;
}

export interface VectorField3D {
  fx: (x: number, y: number, z: number) => number;
  fy: (x: number, y: number, z: number) => number;
  fz: (x: number, y: number, z: number) => number;
  description: string;
  isConservative?: boolean;
  formula?: string;
}

export interface LineIntegralCalculation {
  fieldDescription: string;
  curveDescription: string;
  result: number;
  work: string[];
  method: "parametric" | "theoremOfGreen";
}

export interface CurveVisualizationData {
  points: Vector2D[] | Vector3D[];
  derivatives: Vector2D[] | Vector3D[];
  fieldVectors: { position: Vector2D | Vector3D; vector: Vector2D | Vector3D }[];
}

export interface IntegralChallenge {
  id: string;
  title: string;
  description: string;
  field: VectorField2D | VectorField3D;
  curve: ParametricCurve;
  expectedResult: number;
  tolerance: number;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
}
