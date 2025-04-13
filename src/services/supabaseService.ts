import { supabase } from "@/lib/supabase";
import type { Transaction, MonthlyExpense } from "./localStorageService";

// Fungsi untuk menghasilkan ID unik
export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Fungsi untuk mendapatkan semua transaksi
export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }

  // Konversi data dari format Supabase ke format aplikasi
  return (data || []).map((item) => ({
    id: item.id,
    date: item.date,
    assetType: item.asset_type as "car" | "speedboat" | "restaurant",
    assetName: item.asset_name || "",
    rentalType: item.rental_type as "drop" | "harian" | undefined,
    route: item.route || "",
    price: item.price,
    operationalCosts: {
      fuel: item.fuel_cost || 0,
      driver: item.driver_cost || 0,
    },
    trips: item.trips || 1,
    days: item.days || 1,
    dailyCash: item.daily_cash,
  }));
};

// Fungsi untuk mendapatkan transaksi berdasarkan bulan
export const getTransactionsByMonth = async (
  year: number,
  month: number,
): Promise<Transaction[]> => {
  const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
  const endDate = `${year}-${month.toString().padStart(2, "0")}-31`;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching transactions by month:", error);
    throw error;
  }

  // Konversi data dari format Supabase ke format aplikasi
  return (data || []).map((item) => ({
    id: item.id,
    date: item.date,
    assetType: item.asset_type as "car" | "speedboat" | "restaurant",
    assetName: item.asset_name || "",
    rentalType: item.rental_type as "drop" | "harian" | undefined,
    route: item.route || "",
    price: item.price,
    operationalCosts: {
      fuel: item.fuel_cost || 0,
      driver: item.driver_cost || 0,
    },
    trips: item.trips || 1,
    days: item.days || 1,
    dailyCash: item.daily_cash,
  }));
};

// Fungsi untuk membuat transaksi baru
export const createTransaction = async (
  transaction: Omit<Transaction, "id">,
): Promise<Transaction> => {
  const newId = generateId();

  const { error } = await supabase.from("transactions").insert({
    id: newId,
    date: transaction.date,
    asset_type: transaction.assetType,
    asset_name: transaction.assetName,
    rental_type: transaction.rentalType,
    route: transaction.route,
    price: transaction.price,
    fuel_cost: transaction.operationalCosts?.fuel || null,
    driver_cost: transaction.operationalCosts?.driver || null,
    trips: transaction.trips || null,
    days: transaction.days || null,
    daily_cash: transaction.dailyCash,
  });

  if (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }

  return { ...transaction, id: newId };
};

// Fungsi untuk memperbarui transaksi
export const updateTransaction = async (
  transaction: Transaction,
): Promise<Transaction> => {
  const { error } = await supabase
    .from("transactions")
    .update({
      date: transaction.date,
      asset_type: transaction.assetType,
      asset_name: transaction.assetName,
      rental_type: transaction.rentalType,
      route: transaction.route,
      price: transaction.price,
      fuel_cost: transaction.operationalCosts?.fuel || 0,
      driver_cost: transaction.operationalCosts?.driver || 0,
      trips: transaction.trips,
      days: transaction.days,
      daily_cash: transaction.dailyCash,
    })
    .eq("id", transaction.id);

  if (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }

  return transaction;
};

// Fungsi untuk menghapus transaksi
export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// Fungsi untuk mendapatkan semua pengeluaran bulanan
export const getMonthlyExpenses = async (): Promise<MonthlyExpense[]> => {
  const { data, error } = await supabase
    .from("monthly_expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching monthly expenses:", error);
    throw error;
  }

  // Konversi data dari format Supabase ke format aplikasi
  return (data || []).map((item) => ({
    id: item.id,
    date: item.created_at,
    month: item.month.toString().padStart(2, "0"),
    year: item.year.toString(),
    staffSalary: item.staff_salary || 0,
    nightGuardSalary: item.night_guard_salary || 0,
    electricityBill: item.electricity_bill || 0,
    waterBill: item.water_bill || 0,
    internetBill: item.internet_bill || 0,
    otherExpenses: item.other_expenses || 0,
    totalExpense: item.total_expense || 0,
  }));
};

// Fungsi untuk mendapatkan pengeluaran bulanan berdasarkan bulan
export const getMonthlyExpenseByMonth = async (
  year: string,
  month: string,
): Promise<MonthlyExpense | null> => {
  const { data, error } = await supabase
    .from("monthly_expenses")
    .select("*")
    .eq("year", parseInt(year))
    .eq("month", parseInt(month))
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No data found
      return null;
    }
    console.error("Error fetching monthly expense:", error);
    throw error;
  }

  if (!data) return null;

  // Konversi data dari format Supabase ke format aplikasi
  return {
    id: data.id,
    date: data.created_at,
    month: data.month.toString().padStart(2, "0"),
    year: data.year.toString(),
    staffSalary: data.staff_salary || 0,
    nightGuardSalary: data.night_guard_salary || 0,
    electricityBill: data.electricity_bill || 0,
    waterBill: data.water_bill || 0,
    internetBill: data.internet_bill || 0,
    otherExpenses: data.other_expenses || 0,
    totalExpense: data.total_expense || 0,
  };
};

// Fungsi untuk membuat pengeluaran bulanan baru
export const createMonthlyExpense = async (
  expense: Omit<MonthlyExpense, "id">,
): Promise<MonthlyExpense> => {
  const newId = generateId();

  const { error } = await supabase.from("monthly_expenses").insert({
    id: newId,
    month: parseInt(expense.month),
    year: parseInt(expense.year),
    staff_salary: expense.staffSalary || null,
    night_guard_salary: expense.nightGuardSalary || null,
    electricity_bill: expense.electricityBill || null,
    water_bill: expense.waterBill || null,
    internet_bill: expense.internetBill || null,
    other_expenses: expense.otherExpenses || null,
    total_expense: expense.totalExpense,
  });

  if (error) {
    console.error("Error creating monthly expense:", error);
    throw error;
  }

  return { ...expense, id: newId };
};

// Fungsi untuk memperbarui pengeluaran bulanan
export const updateMonthlyExpense = async (
  expense: MonthlyExpense,
): Promise<MonthlyExpense> => {
  const { error } = await supabase
    .from("monthly_expenses")
    .update({
      date: expense.date,
      month: parseInt(expense.month),
      year: parseInt(expense.year),
      staff_salary: expense.staffSalary,
      night_guard_salary: expense.nightGuardSalary,
      electricity_bill: expense.electricityBill,
      water_bill: expense.waterBill,
      internet_bill: expense.internetBill,
      other_expenses: expense.otherExpenses,
      total_expense: expense.totalExpense,
    })
    .eq("id", expense.id);

  if (error) {
    console.error("Error updating monthly expense:", error);
    throw error;
  }

  return expense;
};

// Fungsi untuk menghapus pengeluaran bulanan
export const deleteMonthlyExpense = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("monthly_expenses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting monthly expense:", error);
    throw error;
  }
};

// Fungsi untuk upsert pengeluaran bulanan (buat jika tidak ada, perbarui jika ada)
export const upsertMonthlyExpense = async (
  expense: Omit<MonthlyExpense, "id">,
  existingId?: string,
): Promise<MonthlyExpense> => {
  if (existingId) {
    const updatedExpense = { ...expense, id: existingId } as MonthlyExpense;
    return await updateMonthlyExpense(updatedExpense);
  } else {
    // Cek apakah pengeluaran untuk bulan ini sudah ada
    const existingExpense = await getMonthlyExpenseByMonth(
      expense.year,
      expense.month,
    );

    if (existingExpense) {
      const updatedExpense = {
        ...expense,
        id: existingExpense.id,
      } as MonthlyExpense;
      return await updateMonthlyExpense(updatedExpense);
    } else {
      return await createMonthlyExpense(expense);
    }
  }
};
