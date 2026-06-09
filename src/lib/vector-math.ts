
export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export function magnitude2D(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function magnitude3D(v: Vector3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function normalize2D(v: Vector2D): Vector2D {
  const mag = magnitude2D(v);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

export function normalize3D(v: Vector3D): Vector3D {
  const mag = magnitude3D(v);
  if (mag === 0) return { x: 0, y: 0, z: 0 };
  return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
}

export function add2D(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function add3D(a: Vector3D, b: Vector3D): Vector3D {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function subtract2D(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function subtract3D(a: Vector3D, b: Vector3D): Vector3D {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function scale2D(v: Vector2D, scalar: number): Vector2D {
  return { x: v.x * scalar, y: v.y * scalar };
}

export function scale3D(v: Vector3D, scalar: number): Vector3D {
  return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
}

export function dot2D(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y;
}

export function dot3D(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function cross3D(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

export function angleBetween2D(a: Vector2D, b: Vector2D): number {
  const magA = magnitude2D(a);
  const magB = magnitude2D(b);
  if (magA === 0 || magB === 0) return 0;
  
  const cosTheta = dot2D(a, b) / (magA * magB);
  return Math.acos(Math.max(-1, Math.min(1, cosTheta)));
}

export function angleBetween3D(a: Vector3D, b: Vector3D): number {
  const magA = magnitude3D(a);
  const magB = magnitude3D(b);
  if (magA === 0 || magB === 0) return 0;
  
  const cosTheta = dot3D(a, b) / (magA * magB);
  return Math.acos(Math.max(-1, Math.min(1, cosTheta)));
}

export function project2D(a: Vector2D, b: Vector2D): Vector2D {
  const magBSquared = b.x * b.x + b.y * b.y;
  if (magBSquared === 0) return { x: 0, y: 0 };
  
  const scalar = dot2D(a, b) / magBSquared;
  return scale2D(b, scalar);
}

export function project3D(a: Vector3D, b: Vector3D): Vector3D {
  const magBSquared = b.x * b.x + b.y * b.y + b.z * b.z;
  if (magBSquared === 0) return { x: 0, y: 0, z: 0 };
  
  const scalar = dot3D(a, b) / magBSquared;
  return scale3D(b, scalar);
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function arePerpendicularVectors2D(a: Vector2D, b: Vector2D, tolerance: number = 1e-10): boolean {
  return Math.abs(dot2D(a, b)) < tolerance;
}

export function areParallelVectors2D(a: Vector2D, b: Vector2D, tolerance: number = 1e-10): boolean {
  const crossProduct = a.x * b.y - a.y * b.x;
  return Math.abs(crossProduct) < tolerance;
}

export function zero2D(): Vector2D {
  return { x: 0, y: 0 };
}

export function zero3D(): Vector3D {
  return { x: 0, y: 0, z: 0 };
}

export const BASIS_VECTORS_2D = {
  i: { x: 1, y: 0 } as Vector2D,
  j: { x: 0, y: 1 } as Vector2D,
};

export const BASIS_VECTORS_3D = {
  i: { x: 1, y: 0, z: 0 } as Vector3D,
  j: { x: 0, y: 1, z: 0 } as Vector3D,
  k: { x: 0, y: 0, z: 1 } as Vector3D,
};

export function mixed3D(a: Vector3D, b: Vector3D, c: Vector3D): number {
  const crossBC = cross3D(b, c);
  return dot3D(a, crossBC);
}