
const MONEY_RE = /^(\d{1,12})(?:\.(\d{1,2}))?$/;

export const CURRENCY = "GHS";

export function toPesewas(input: string | number): number {
  const text = typeof input === "number" ? String(input) : input.trim();
  const match = MONEY_RE.exec(text);
  if (!match) {
    throw new Error('Amount must be a decimal with at most 2 decimal places, e.g. "50.00"');
  }
  const cedis = Number(match[1]);
  const pes = Number((match[2] ?? "").padEnd(2, "0"));
  return cedis * 100 + pes;
}

export function formatGHS(pesewas: number): string {
  const sign = pesewas < 0 ? "-" : "";
  const abs = Math.abs(pesewas);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}
