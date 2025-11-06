export function safeMul(
  a: number | string,
  b: number | string,
): number | string {
  // 转换成数字
  const numA = Number(a);
  const numB = Number(b);

  if (isNaN(numA) || isNaN(numB)) {
    throw new Error(
      `safeMul: 参数必须是数字或可转成数字的字符串，收到 a=${a}, b=${b}`,
    );
  }

  const aDigits = (numA.toString().split(".")[1] || "").length;
  const bDigits = (numB.toString().split(".")[1] || "").length;
  const factor = Math.pow(10, aDigits + bDigits);
  const intA = Number(numA.toString().replace(".", ""));
  const intB = Number(numB.toString().replace(".", ""));

  return ((intA * intB) / factor).toFixed(2);
}
