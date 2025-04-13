/**
 * This file is kept as a placeholder to maintain compatibility with any imports.
 * The application now uses localStorage for data persistence instead of Firebase.
 *
 * For actual type definitions, please refer to src/services/localStorageService.ts
 */

import type {
  User,
  Transaction,
  MonthlyExpense,
} from "../services/localStorageService";

// Re-export types for backward compatibility
export type FirebaseUser = User;
export type FirebaseTransaction = Transaction;
export type FirebaseMonthlyExpense = MonthlyExpense;
