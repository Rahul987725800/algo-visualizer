export function calculateSlopeInDegrees({ sx, sy, ex, ey }) {
  return (Math.atan2(ey - sy, ex - sx) * 180) / Math.PI;
}
console.log(calculateSlopeInDegrees(0, 0, 5, 5));
export function calculateLength({ sx, sy, ex, ey }) {
  return Math.sqrt(Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2));
}
console.log(calculateLength(0, 0, 5, 5));
