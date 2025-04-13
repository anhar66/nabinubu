/**
 * Saran untuk Pengembangan Penyimpanan Data:
 *
 * 1. Sinkronisasi Cloud: Implementasikan opsi untuk menyinkronkan data dengan layanan
 *    cloud seperti Firebase atau Supabase sebagai cadangan dengan sinkronisasi otomatis
 *    dan resolusi konflik.
 *
 * 2. Enkripsi Data: Tambahkan enkripsi end-to-end untuk data sensitif yang disimpan
 *    di localStorage dengan manajemen kunci yang aman untuk meningkatkan keamanan.
 *
 * 3. Kompresi Data: Implementasikan kompresi data adaptif berdasarkan ukuran dan tipe
 *    data untuk mengoptimalkan penggunaan penyimpanan lokal.
 *
 * 4. Manajemen Versi: Tambahkan sistem versioning untuk skema data dengan migrasi
 *    otomatis dan rollback untuk memudahkan pembaruan aplikasi tanpa kehilangan data.
 *
 * 5. Pembersihan Data: Tambahkan mekanisme untuk membersihkan data lama atau tidak
 *    terpakai secara otomatis dengan kebijakan retensi yang dapat dikonfigurasi.
 *
 * 6. Ekspor/Impor Data: Berikan opsi untuk mengekspor dan mengimpor data dalam
 *    berbagai format (JSON, CSV, Excel) dengan validasi dan pemetaan field.
 *
 * 7. Caching Pintar: Implementasikan strategi caching untuk data yang sering diakses
 *    untuk meningkatkan performa aplikasi dan mengurangi beban penyimpanan.
 */

// Tipe data untuk pengguna
export type User = {
  id: string;
  username: string;
  password?: string;
  isAuthenticated: boolean;
};

// Tipe data untuk transaksi
export interface Transaction {
  id: string;
  date: string;
  assetType: "car" | "speedboat" | "restaurant";
  assetName: string;
  rentalType?: "drop" | "harian";
  route?: string;
  price: number;
  operationalCosts?: {
    fuel?: number;
    driver?: number;
  };
  trips: number;
  days?: number;
  dailyCash: number;
}

// Tipe data untuk pengeluaran bulanan
export interface MonthlyExpense {
  id: string;
  date: string;
  month: string;
  year: string;
  staffSalary: number;
  nightGuardSalary: number;
  electricityBill: number;
  waterBill: number;
  internetBill: number;
  otherExpenses: number;
  totalExpense: number;
}

// Kunci untuk localStorage
const USERS_KEY = "bjt_users";
const TRANSACTIONS_KEY = "bjt_transactions";
const MONTHLY_EXPENSES_KEY = "bjt_monthly_expenses";
const CURRENT_USER_KEY = "bjt_current_user";

// Fungsi helper untuk menghasilkan ID unik
export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Fungsi untuk menyimpan data ke localStorage
const saveToStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Fungsi untuk mengambil data dari localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

// Inisialisasi pengguna default jika belum ada
export const initializeDefaultUsers = (): void => {
  const users = getFromStorage<User[]>(USERS_KEY, []);

  if (users.length === 0) {
    // Tambahkan pengguna admin default
    users.push({
      id: generateId(),
      username: "admin",
      password: "admin123",
      isAuthenticated: false,
    });

    // Tambahkan pengguna operator default
    users.push({
      id: generateId(),
      username: "operator",
      password: "operator123",
      isAuthenticated: false,
    });

    saveToStorage(USERS_KEY, users);
  }
};

// Fungsi autentikasi
export const login = (username: string, password: string): User => {
  const users = getFromStorage<User[]>(USERS_KEY, []);
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    throw new Error("Username atau password salah");
  }

  // Update status autentikasi
  const updatedUsers = users.map((u) => {
    if (u.id === user.id) {
      return { ...u, isAuthenticated: true };
    }
    return u;
  });

  saveToStorage(USERS_KEY, updatedUsers);

  // Simpan pengguna saat ini
  const currentUser = { ...user, isAuthenticated: true };
  saveToStorage(CURRENT_USER_KEY, currentUser);

  return currentUser;
};

// Fungsi logout
export const logout = (): void => {
  const currentUser = getFromStorage<User | null>(CURRENT_USER_KEY, null);

  if (currentUser) {
    const users = getFromStorage<User[]>(USERS_KEY, []);
    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        return { ...u, isAuthenticated: false };
      }
      return u;
    });

    saveToStorage(USERS_KEY, updatedUsers);
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Fungsi untuk mendapatkan pengguna saat ini
export const getCurrentUser = (): User | null => {
  return getFromStorage<User | null>(CURRENT_USER_KEY, null);
};

// Fungsi untuk memeriksa apakah pengguna terautentikasi
export const isAuthenticated = (): boolean => {
  const currentUser = getCurrentUser();
  return !!currentUser?.isAuthenticated;
};

// Fungsi untuk mendapatkan semua transaksi
export const getTransactions = (): Transaction[] => {
  return getFromStorage<Transaction[]>(TRANSACTIONS_KEY, []);
};

// Fungsi untuk mendapatkan transaksi berdasarkan bulan
export const getTransactionsByMonth = (
  year: number,
  month: number,
): Transaction[] => {
  const transactions = getTransactions();
  const monthStr = month.toString().padStart(2, "0");

  return transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getFullYear() === year &&
      (transactionDate.getMonth() + 1).toString().padStart(2, "0") === monthStr
    );
  });
};

// Fungsi untuk membuat transaksi baru
export const createTransaction = (
  transaction: Omit<Transaction, "id">,
): Transaction => {
  const transactions = getTransactions();
  const newTransaction = { ...transaction, id: generateId() } as Transaction;

  transactions.push(newTransaction);
  saveToStorage(TRANSACTIONS_KEY, transactions);

  return newTransaction;
};

// Fungsi untuk memperbarui transaksi
export const updateTransaction = (transaction: Transaction): Transaction => {
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === transaction.id);

  if (index === -1) {
    throw new Error("Transaksi tidak ditemukan");
  }

  transactions[index] = transaction;
  saveToStorage(TRANSACTIONS_KEY, transactions);

  return transaction;
};

// Fungsi untuk menghapus transaksi
export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.filter((t) => t.id !== id);

  saveToStorage(TRANSACTIONS_KEY, updatedTransactions);
};

// Fungsi untuk mendapatkan semua pengeluaran bulanan
export const getMonthlyExpenses = (): MonthlyExpense[] => {
  return getFromStorage<MonthlyExpense[]>(MONTHLY_EXPENSES_KEY, []);
};

// Fungsi untuk mendapatkan pengeluaran bulanan berdasarkan bulan
export const getMonthlyExpenseByMonth = (
  year: string,
  month: string,
): MonthlyExpense | null => {
  const expenses = getMonthlyExpenses();
  const expense = expenses.find((e) => e.year === year && e.month === month);

  return expense || null;
};

// Fungsi untuk membuat pengeluaran bulanan baru
export const createMonthlyExpense = (
  expense: Omit<MonthlyExpense, "id">,
): MonthlyExpense => {
  const expenses = getMonthlyExpenses();
  const newExpense = { ...expense, id: generateId() } as MonthlyExpense;

  expenses.push(newExpense);
  saveToStorage(MONTHLY_EXPENSES_KEY, expenses);

  return newExpense;
};

// Fungsi untuk memperbarui pengeluaran bulanan
export const updateMonthlyExpense = (
  expense: MonthlyExpense,
): MonthlyExpense => {
  const expenses = getMonthlyExpenses();
  const index = expenses.findIndex((e) => e.id === expense.id);

  if (index === -1) {
    throw new Error("Pengeluaran bulanan tidak ditemukan");
  }

  expenses[index] = expense;
  saveToStorage(MONTHLY_EXPENSES_KEY, expenses);

  return expense;
};

// Fungsi untuk menghapus pengeluaran bulanan
export const deleteMonthlyExpense = (id: string): void => {
  const expenses = getMonthlyExpenses();
  const updatedExpenses = expenses.filter((e) => e.id !== id);

  saveToStorage(MONTHLY_EXPENSES_KEY, updatedExpenses);
};

// Fungsi untuk upsert pengeluaran bulanan (buat jika tidak ada, perbarui jika ada)
export const upsertMonthlyExpense = (
  expense: Omit<MonthlyExpense, "id">,
  existingId?: string,
): MonthlyExpense => {
  const expenses = getMonthlyExpenses();

  // Cek apakah pengeluaran untuk bulan ini sudah ada
  const existingExpense = expenses.find(
    (e) => e.year === expense.year && e.month === expense.month,
  );

  if (existingExpense || existingId) {
    const expenseId = existingId || existingExpense!.id;
    const updatedExpense = { ...expense, id: expenseId } as MonthlyExpense;

    return updateMonthlyExpense(updatedExpense);
  } else {
    return createMonthlyExpense(expense);
  }
};

// Create a new user
export const createUser = (user: Omit<User, "id">): User => {
  const users = getFromStorage<User[]>(USERS_KEY, []);
  const newUser = { ...user, id: generateId() } as User;

  users.push(newUser);
  saveToStorage(USERS_KEY, users);

  return newUser;
};

// Initialize default users when the module is loaded
initializeDefaultUsers();
