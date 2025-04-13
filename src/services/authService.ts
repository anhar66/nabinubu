import {
  login as localLogin,
  logout as localLogout,
  getCurrentUser as localGetCurrentUser,
  isAuthenticated as localIsAuthenticated,
  createUser as localCreateUser,
} from "./localStorageService";

// Define the user type
export type User = {
  id: string;
  username: string;
  isAuthenticated: boolean;
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  return localIsAuthenticated();
};

// Login function
export const login = async (
  username: string,
  password: string,
): Promise<User> => {
  try {
    return localLogin(username, password);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Login gagal");
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  localLogout();
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  return localGetCurrentUser();
};

// Create a new user (for admin use)
export const createUser = async (
  username: string,
  password: string,
): Promise<User> => {
  try {
    return localCreateUser({
      username,
      isAuthenticated: false,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Gagal membuat pengguna");
  }
};
