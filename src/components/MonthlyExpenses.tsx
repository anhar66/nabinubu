import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

/**
 * Saran untuk Pengembangan Pengeluaran Bulanan:
 *
 * 1. Kategori Pengeluaran: Tambahkan kemampuan untuk membuat, mengedit, dan mengelola kategori
 *    pengeluaran kustom dengan ikon dan warna yang dapat disesuaikan.
 *
 * 2. Anggaran Bulanan: Tambahkan fitur untuk menetapkan anggaran bulanan per kategori dan
 *    melacak progres pengeluaran dengan visualisasi seperti progress bar atau gauge chart.
 *
 * 3. Notifikasi: Implementasikan peringatan melalui email, push notification, atau in-app
 *    alert ketika pengeluaran mendekati (80%) atau melebihi anggaran yang ditetapkan.
 *
 * 4. Riwayat Pengeluaran: Tambahkan tampilan riwayat pengeluaran bulanan dengan grafik tren,
 *    kemampuan untuk melihat, mengedit, atau menduplikasi pengeluaran sebelumnya.
 *
 * 5. Bukti Pengeluaran: Tambahkan kemampuan untuk melampirkan dan mengelola beberapa foto
 *    bukti pengeluaran seperti struk atau invoice dengan preview dan galeri terintegrasi.
 *
 * 6. Pembayaran Berulang: Tambahkan dukungan untuk pengeluaran berulang (bulanan, triwulanan,
 *    tahunan) dengan pengingat dan pencatatan otomatis.
 *
 * 7. Analisis Pengeluaran: Sediakan analisis tren pengeluaran bulanan dengan perbandingan
 *    historis dan rekomendasi untuk pengurangan biaya.
 */

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import ExpenseInputField from "./expenses/ExpenseInputField";
import { useToast } from "@/components/ui/use-toast";
import { getTransactions } from "@/services/transactionService";
import {
  upsertMonthlyExpense,
  getMonthlyExpenseByMonth,
} from "@/services/monthlyExpenseService";
import { logout } from "@/services/auth";
import { useNavigate } from "react-router-dom";

interface MonthlyExpense {
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

const MonthlyExpenses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [staffSalary, setStaffSalary] = useState("");
  const [nightGuardSalary, setNightGuardSalary] = useState("");
  const [electricityBill, setElectricityBill] = useState("");
  const [waterBill, setWaterBill] = useState("");
  const [internetBill, setInternetBill] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");
  const [availableCash, setAvailableCash] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [existingExpenseId, setExistingExpenseId] = useState<
    string | undefined
  >();

  // Calculate total available cash from all transactions
  useEffect(() => {
    const calculateAvailableCash = async () => {
      setIsLoading(true);
      try {
        // Get all transactions
        const transactions = await getTransactions();

        // Calculate total cash from transactions
        const totalCash = transactions.reduce(
          (sum, t) => sum + (t.dailyCash || 0),
          0,
        );

        // Get all monthly expenses
        const expenses = await getMonthlyExpenseByMonth(
          format(date || new Date(), "yyyy"),
          format(date || new Date(), "MM"),
        );

        // If there's an existing expense for this month, load its values
        if (expenses) {
          setExistingExpenseId(expenses.id);
          setStaffSalary(expenses.staffSalary.toString());
          setNightGuardSalary(expenses.nightGuardSalary.toString());
          setElectricityBill(expenses.electricityBill.toString());
          setWaterBill(expenses.waterBill.toString());
          setInternetBill(expenses.internetBill.toString());
          setOtherExpenses(expenses.otherExpenses.toString());
        } else {
          // Reset form if no existing expense
          resetForm();
        }

        // Calculate total expenses already spent
        const totalExpenses = expenses ? expenses.totalExpense : 0;

        // Available cash is total cash minus expenses already spent
        setAvailableCash(totalCash - totalExpenses);
      } catch (error) {
        console.error("Error calculating available cash:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data keuangan. Silakan coba lagi.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    calculateAvailableCash();
  }, [date]);

  const resetForm = () => {
    setStaffSalary("");
    setNightGuardSalary("");
    setElectricityBill("");
    setWaterBill("");
    setInternetBill("");
    setOtherExpenses("");
    setExistingExpenseId(undefined);
  };

  const calculateTotalExpense = () => {
    const staff = parseFloat(staffSalary) || 0;
    const nightGuard = parseFloat(nightGuardSalary) || 0;
    const electricity = parseFloat(electricityBill) || 0;
    const water = parseFloat(waterBill) || 0;
    const internet = parseFloat(internetBill) || 0;
    const other = parseFloat(otherExpenses) || 0;

    return staff + nightGuard + electricity + water + internet + other;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!date) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Tanggal harus diisi",
        });
        return;
      }

      const totalExpense = calculateTotalExpense();

      if (totalExpense <= 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Minimal satu pengeluaran harus diisi",
        });
        return;
      }

      // Allow negative cash values, but show a warning if expenses exceed available cash
      if (totalExpense > availableCash) {
        toast({
          variant: "default",
          title: "Peringatan",
          description: `Total pengeluaran (${totalExpense.toLocaleString()}) melebihi kas yang tersedia (${availableCash.toLocaleString()}). Kas akan menjadi negatif.`,
          className: "bg-yellow-100 border border-yellow-400 text-yellow-800",
        });
      }

      const formattedDate = format(date, "yyyy-MM-dd");
      const month = format(date, "MM");
      const year = format(date, "yyyy");

      const newExpense = {
        date: formattedDate,
        month,
        year,
        staffSalary: parseFloat(staffSalary) || 0,
        nightGuardSalary: parseFloat(nightGuardSalary) || 0,
        electricityBill: parseFloat(electricityBill) || 0,
        waterBill: parseFloat(waterBill) || 0,
        internetBill: parseFloat(internetBill) || 0,
        otherExpenses: parseFloat(otherExpenses) || 0,
        totalExpense,
      };

      // Save to Supabase (create or update)
      await upsertMonthlyExpense(newExpense, existingExpenseId);

      // Update available cash immediately after saving expenses
      setAvailableCash((prevCash) => prevCash - totalExpense);

      // Reset form
      resetForm();

      toast({
        title: "Sukses",
        description:
          "Data pengeluaran bulanan berhasil disimpan! Anda akan dialihkan ke halaman laporan.",
        variant: "default",
        className: "bg-green-100 border border-green-400 text-green-800",
      });

      // Redirect ke halaman laporan setelah menyimpan data
      setTimeout(() => {
        navigate("/reports");
      }, 1500);
    } catch (error) {
      console.error("Error saving monthly expense:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menyimpan data pengeluaran. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 bg-[#111184] shadow-md">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#111184] border-2 border-[#D4AF37] flex items-center justify-center mr-3">
            <span className="text-[#D4AF37] font-bold">BJT</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Input Pengeluaran
          </h1>
        </div>
        <button
          className="text-[#6B7280] hover:text-[#D4AF37] transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      <div className="w-full max-w-[90%] mx-auto py-4">
        <Card className="bg-[#1E1E9E] shadow-lg border-none rounded-xl overflow-hidden">
          <CardHeader className="px-4 py-4 border-b border-[#111184]/20 bg-[#111184]">
            <CardTitle className="text-center text-white text-xl font-medium">
              Input Pengeluaran Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-5 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4 w-full max-w-[90%] mx-auto">
                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="text-sm font-medium text-white"
                  >
                    Bulan dan Tahun
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-[#1E1E9E] text-white border border-[#111184]/20 hover:bg-[#111184]/90 hover:text-[#D4AF37] h-12 rounded-xl shadow-md"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-[#D4AF37]" />
                        {date ? (
                          <span className="text-white">
                            {format(date, "MMMM yyyy")}
                          </span>
                        ) : (
                          <span className="text-[#6B7280]">Pilih bulan</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-[#1E1E9E] border border-[#111184]/20 shadow-lg rounded-xl p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="rounded-xl bg-[#1E1E9E] text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <ExpenseInputField
                  id="staff-salary"
                  label="Gaji Karyawan (Rp)"
                  value={staffSalary}
                  onChange={(e) => setStaffSalary(e.target.value)}
                  placeholder="Masukkan jumlah gaji karyawan"
                />

                <ExpenseInputField
                  id="night-guard-salary"
                  label="Gaji Penjaga Malam (Rp)"
                  value={nightGuardSalary}
                  onChange={(e) => setNightGuardSalary(e.target.value)}
                  placeholder="Masukkan jumlah gaji penjaga malam"
                />

                <ExpenseInputField
                  id="electricity-bill"
                  label="Beban Listrik (Rp)"
                  value={electricityBill}
                  onChange={(e) => setElectricityBill(e.target.value)}
                  placeholder="Masukkan jumlah beban listrik"
                />

                <ExpenseInputField
                  id="water-bill"
                  label="Beban PDAM (Rp)"
                  value={waterBill}
                  onChange={(e) => setWaterBill(e.target.value)}
                  placeholder="Masukkan jumlah beban PDAM"
                />

                <ExpenseInputField
                  id="internet-bill"
                  label="Beban Internet (Rp)"
                  value={internetBill}
                  onChange={(e) => setInternetBill(e.target.value)}
                  placeholder="Masukkan jumlah beban internet"
                />

                <ExpenseInputField
                  id="other-expenses"
                  label="Beban Lain - Lain (Rp)"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(e.target.value)}
                  placeholder="Masukkan jumlah beban lain-lain"
                />

                <div className="p-3 bg-gradient-to-r from-[#111184]/20 to-[#111184]/30 rounded-xl border border-[#111184]/30 space-y-1 shadow-md w-full max-w-[90%] mx-auto">
                  <p className="text-sm font-medium text-white">
                    Total Kas Tersedia: Rp{availableCash.toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-white">
                    Total Pengeluaran: Rp
                    {calculateTotalExpense().toLocaleString()}
                  </p>
                  <p className="text-xs text-[#D4AF37]">
                    Pengeluaran bulanan akan diambil dari total kas yang
                    terkumpul
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full max-w-[90%] mx-auto block h-12 bg-[#111184] hover:bg-[#111184]/90 text-white hover:text-[#D4AF37] rounded-xl shadow-md transition-all duration-200 border border-[#D4AF37]/20"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan Pengeluaran"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlyExpenses;
