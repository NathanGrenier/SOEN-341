import { describe, it, expect } from "vitest";
import { formatDbReservationDate } from "$lib/utils";

describe("formatDbReservationDate", () => {
  it("formats dates correctly", () => {
    const date = new Date(2023, 0, 1); // Note: January is 0
    expect(formatDbReservationDate(date)).toBe("2023-01-01");
  });
});
