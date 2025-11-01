// utils/number.ts
export function safeMul(a: number, b: number): number {
  const aDigits = (a.toString().split(".")[1] || "").length;
  const bDigits = (b.toString().split(".")[1] || "").length;
  const factor = Math.pow(10, aDigits + bDigits);
  const intA = Number(a.toString().replace(".", ""));
  const intB = Number(b.toString().replace(".", ""));

  return (intA * intB) / factor;
}
