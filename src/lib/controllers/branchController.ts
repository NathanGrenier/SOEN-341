import { z } from "zod";
import type { Branch } from "@prisma/client";

// Define Zod schema for Branch
export const branchSchema = z.object({
  name: z.string(),
  description: z.string(),
  streetAddress: z.string(),
  city: z.string(),
  region: z.string(),
  country: z.string(),
  postalCode: z.string(),
  iataAirportCode: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  disabled: z.boolean(),
});

// // Function to validate branch data
// function validateBranchData(data: unknown): Branch {
//   const result = branchSchema.safeParse(data);
//   if (!result.success) {
//     throw new Error(result.error.errors.map((err) => err.message).join(", "));
//   }
//   return result.data as Branch;
// }
// Function to fetch all branches
export async function getAllBranches(): Promise<Branch[] | null> {
  try {
    const response = await fetch("/api/branches");
    if (!response.ok) {
      throw new Error("Failed to fetch branches");
    }
    const { branches } = await response.json();
    return branches;
  } catch (error) {
    console.error("Error fetching branches:", error);
    return null;
  }
}

// Function to fetch a single branch by ID
export async function getBranchById(id: number): Promise<Branch | null> {
  try {
    const response = await fetch(`/api/branches/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch branch with ID ${id}`);
    }
    const { branch } = await response.json();
    return branch;
  } catch (error) {
    console.error(`Error fetching branch with ID ${id}:`, error);
    return null;
  }
}

// Function to create a new branch
export async function createBranch(
  branchData: Partial<Branch>,
): Promise<Branch | null> {
  try {
    const response = await fetch("/api/branches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(branchData),
    });
    if (!response.ok) {
      throw new Error("Failed to create branch");
    }
    const newBranch = await response.json();
    return newBranch;
  } catch (error) {
    console.error("Error creating branch:", error);
    return null;
  }
}

// Function to update an existing branch
export async function updateBranch(
  id: number,
  updatedData: Partial<Branch>,
): Promise<Branch | null> {
  try {
    const response = await fetch(`/api/branches/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update branch with ID ${id}`);
    }
    const updatedBranch = await response.json();

    return updatedBranch;
  } catch (error) {
    console.error(`Error updating branch with ID ${id}:`, error);
    return null;
  }
}
// Function to delete an existing branch
export async function deleteBranch(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/branches/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete branch with ID ${id}`);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting branch with ID ${id}:`, error);
    return false;
  }
}
