/**
 * This file is kept as a placeholder to maintain compatibility with any imports.
 * The application now uses localStorage for data persistence instead of Firebase.
 *
 * For actual implementations, please refer to src/services/localStorageService.ts
 */

import {
  getTransactions as localGetTransactions,
  getTransactionsByMonth as localGetTransactionsByMonth,
  createTransaction as localCreateTransaction,
  updateTransaction as localUpdateTransaction,
  deleteTransaction as localDeleteTransaction,
  getMonthlyExpenses as localGetMonthlyExpenses,
  getMonthlyExpenseByMonth as localGetMonthlyExpenseByMonth,
  generateId as localGenerateId,
} from "./localStorageService";

// Re-export functions for backward compatibility
export const generateId = localGenerateId;

// Transaction functions
export const getTransactions = async () => localGetTransactions();
export const getTransactionsByMonth = async (year: number, month: number) =>
  localGetTransactionsByMonth(year, month);
export const createTransaction = async (transaction: any) =>
  localCreateTransaction(transaction);
export const updateTransaction = async (transaction: any) =>
  localUpdateTransaction(transaction);
export const deleteTransaction = async (id: string) =>
  localDeleteTransaction(id);

// Monthly expense functions
export const getMonthlyExpenses = async () => localGetMonthlyExpenses();
export const getMonthlyExpenseByMonth = async (year: string, month: string) =>
  localGetMonthlyExpenseByMonth(year, month);
