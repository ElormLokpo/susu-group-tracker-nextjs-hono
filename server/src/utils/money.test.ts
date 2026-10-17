import { describe, expect, test } from "bun:test";
import { formatGHS, toPesewas } from "./money";

describe("toPesewas", () => {
  test("parses exact decimals", () => {
    expect(toPesewas("50.00")).toBe(5000);
    expect(toPesewas("50")).toBe(5000);
    expect(toPesewas("0.1")).toBe(10);
    expect(toPesewas("0.05")).toBe(5);
    expect(toPesewas(19.99)).toBe(1999);
  });

  test("rejects bad input", () => {
    for (const bad of ["-1", "abc", "1.234", "", "1e3", "1,000", 0.1 + 0.2, -5]) {
      expect(() => toPesewas(bad)).toThrow();
    }
  });

  test("no float drift when summing", () => {
    expect(toPesewas("0.1") + toPesewas("0.2")).toBe(toPesewas("0.3"));
  });
});

describe("formatGHS", () => {
  test("formats pesewas", () => {
    expect(formatGHS(5)).toBe("0.05");
    expect(formatGHS(15000)).toBe("150.00");
    expect(formatGHS(2050)).toBe("20.50");
  });
});
