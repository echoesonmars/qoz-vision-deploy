export function sharePercent(part: number, total: number): number {
  if (total <= 0) return 0;
  return (part / total) * 100;
}

export function formatSharePercent(
  part: number,
  total: number,
  maximumFractionDigits = 1,
): string {
  const value = sharePercent(part, total);
  return `${value.toLocaleString("ru-RU", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  })}%`;
}

export function formatCountWithShare(
  count: number,
  total: number,
  maximumFractionDigits = 1,
): string {
  return `${count.toLocaleString("ru-RU")} (${formatSharePercent(count, total, maximumFractionDigits)})`;
}
