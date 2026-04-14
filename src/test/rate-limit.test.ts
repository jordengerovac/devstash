import { describe, it, expect } from "vitest";
import { getClientIp, rateLimitErrorMessage } from "@/lib/rate-limit";

describe("getClientIp", () => {
  it("returns the first IP from x-forwarded-for header", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("returns 'unknown' when x-forwarded-for is missing", () => {
    const req = new Request("http://localhost");
    expect(getClientIp(req)).toBe("unknown");
  });
});

describe("rateLimitErrorMessage", () => {
  it("returns singular minute message when reset is under 60 seconds away", () => {
    const reset = Date.now() + 30_000;
    expect(rateLimitErrorMessage(reset)).toBe(
      "Too many attempts. Please try again in a minute."
    );
  });

  it("returns plural minutes message when reset is more than 1 minute away", () => {
    const reset = Date.now() + 5 * 60_000;
    expect(rateLimitErrorMessage(reset)).toMatch(/5 minutes/);
  });
});
