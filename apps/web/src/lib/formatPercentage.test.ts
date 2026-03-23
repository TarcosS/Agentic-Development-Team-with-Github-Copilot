import { describe, it, expect } from "vitest";
import { formatPercentage } from "./formatPercentage";

describe("formatPercentage", () => {
  // direct mode (default)
  it("formats an integer in direct mode", () => {
    expect(formatPercentage(42)).toBe("42%");
  });

  it("formats a decimal in direct mode with precision", () => {
    expect(formatPercentage(42.567, { precision: 1 })).toBe("42.6%");
  });

  it("formats zero in direct mode", () => {
    expect(formatPercentage(0)).toBe("0%");
  });

  it("formats a negative value in direct mode", () => {
    expect(formatPercentage(-15)).toBe("-15%");
  });

  it("formats 100 in direct mode", () => {
    expect(formatPercentage(100)).toBe("100%");
  });

  // ratio mode
  it("formats a ratio (0.42 → 42%)", () => {
    expect(formatPercentage(0.42, { mode: "ratio" })).toBe("42%");
  });

  it("formats 1 as 100% in ratio mode", () => {
    expect(formatPercentage(1, { mode: "ratio" })).toBe("100%");
  });

  it("formats 0 as 0% in ratio mode", () => {
    expect(formatPercentage(0, { mode: "ratio" })).toBe("0%");
  });

  it("formats a decimal ratio with precision", () => {
    expect(formatPercentage(0.1234, { mode: "ratio", precision: 1 })).toBe("12.3%");
  });

  it("formats a negative ratio", () => {
    expect(formatPercentage(-0.5, { mode: "ratio" })).toBe("-50%");
  });

  // edge cases
  it("returns default fallback for null", () => {
    expect(formatPercentage(null)).toBe("—");
  });

  it("returns default fallback for undefined", () => {
    expect(formatPercentage(undefined)).toBe("—");
  });

  it("returns default fallback for NaN", () => {
    expect(formatPercentage(NaN)).toBe("—");
  });

  it("returns default fallback for Infinity", () => {
    expect(formatPercentage(Infinity)).toBe("—");
  });

  it("returns default fallback for -Infinity", () => {
    expect(formatPercentage(-Infinity)).toBe("—");
  });

  it("returns custom fallback for invalid input", () => {
    expect(formatPercentage(NaN, { fallback: "N/A" })).toBe("N/A");
  });

  // precision
  it("formats with precision 2", () => {
    expect(formatPercentage(33.333, { precision: 2 })).toBe("33.33%");
  });

  it("rounds correctly", () => {
    expect(formatPercentage(33.335, { precision: 2 })).toBe("33.34%");
  });
});
