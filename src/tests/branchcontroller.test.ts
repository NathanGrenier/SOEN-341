import { describe, it, expect } from "vitest";
import { branchSchema } from "$lib/controllers/branchController";

describe("Branch Schema Validation", () => {
  it("should validate valid branch data", () => {
    const validData = {
      name: "Test Branch",
      description: "A test branch",
      streetAddress: "123 Test St",
      city: "Test City",
      region: "Test Region",
      country: "Test Country",
      postalCode: "12345",
      iataAirportCode: "TEST",
      latitude: 123.456,
      longitude: -78.9,
      timezone: "UTC",
      disabled: false,
    };

    const validationResult = branchSchema.safeParse(validData);

    expect(validationResult.success).toBe(true);
    expect(validationResult.data).toEqual(validData);
  });

  it("should fail to validate invalid branch data", () => {
    const invalidData = {
      // Missing required fields
      city: "Test City",
      region: "Test Region",
      country: "Test Country",
      postalCode: "12345",
      latitude: 123.456,
      longitude: -78.9,
      timezone: "UTC",
      disabled: false,
    };

    const validationResult = branchSchema.safeParse(invalidData);

    expect(validationResult.success).toBe(false);
  });
});
