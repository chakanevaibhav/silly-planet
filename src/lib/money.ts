export function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function splitPrice(cents: number): { dollars: string; cents: string } {
  const v = (cents / 100).toFixed(2);
  const [d, c] = v.split(".");
  return { dollars: d, cents: c };
}

export function calcShipping(subtotalCents: number): number {
  if (subtotalCents === 0) return 0;
  if (subtotalCents >= 3500) return 0;
  return 599;
}

export function calcTax(subtotalCents: number): number {
  return Math.round(subtotalCents * 0.0875);
}
