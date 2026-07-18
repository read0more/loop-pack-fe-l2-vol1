export function formatPrice(won: number): string {
  return `${won.toLocaleString("ko-KR")}원`;
}

export function perUnitPrice(totalPrice: number, quantity: number): number {
  return Math.round(totalPrice / quantity);
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function toggleInSet<T>(source: Set<T>, value: T): Set<T> {
  const next = new Set(source);

  if (next.has(value)) next.delete(value);
  else next.add(value);

  return next;
}
