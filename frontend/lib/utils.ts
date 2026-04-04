// Format numbers for display
export function fmt(n: number, decimals = 0): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals || 1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(decimals || 0)}K`;
  return n.toFixed(decimals);
}

// Format currency
export function currency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

// Format percent
export function pct(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

// Clamp a number between min and max
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

// Class name helper
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
