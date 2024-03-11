import type { User } from "@prisma/client";

// Function to fetch all users
export async function getAllUsers(): Promise<User[] | null> {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const { users } = await response.json();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}

// Function to fetch a single user by ID
export async function getUserById(id: number): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user with ID ${id}`);
    }
    const { user } = await response.json();
    return user;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return null;
  }
}

// Function to create a new user
export async function createUser(
  userData: Partial<User>,
): Promise<User | null> {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    const { newUser } = await response.json();
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

// Function to update an existing user
export async function updateUser(
  id: number,
  updatedData: Partial<User>,
): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update user with ID ${id}`);
    }
    const { updatedUser } = await response.json();
    return updatedUser;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    return null;
  }
}

// Function to delete an existing user
export async function deleteUser(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete user with ID ${id}`);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    return false;
  }
}
