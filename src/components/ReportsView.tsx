import React, { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import { Car, Ship, Utensils, Banknote, Filter } from "lucide-react";

/**
 * Saran untuk Pengembangan Laporan:
 *
 * 1. Dashboard Analitik: Tambahkan grafik dan visualisasi data yang lebih komprehensif seperti:
 *    - Grafik garis untuk tren pendapatan dan pengeluaran per bulan dengan zoom dan pan
 *    - Grafik pie untuk distribusi pendapatan berdasarkan jenis aset dengan drill-down
 *    - Grafik bar untuk perbandingan pendapatan dan pengeluaran dengan animasi perubahan
 *    - Heat map untuk menunjukkan hari-hari dengan aktivitas tertinggi
 *
 * 2. Ekspor Data: Tambahkan tombol untuk mengekspor laporan ke format PDF, Excel, atau CSV
 *    dengan opsi untuk menyesuaikan konten dan format laporan yang diekspor.
 *
 * 3. Filter Lanjutan: Tambahkan filter berdasarkan rentang tanggal, jenis aset spesifik,
 *    nilai transaksi, atau kategori kustom dengan kemampuan untuk menyimpan filter favorit.
 *
 * 4. Laporan Kustom: Berikan opsi untuk membuat laporan kustom dengan parameter yang
 *    dapat disesuaikan oleh pengguna dan kemampuan untuk menjadwalkan laporan otomatis.
 *
 * 5. Perbandingan Periode: Tambahkan fitur untuk membandingkan data keuangan antara
 *    periode yang berbeda (hari ke hari, minggu ke minggu, bulan ke bulan, tahun ke tahun)
 *    dengan visualisasi perbedaan persentase.
 *
 * 6. Prediksi dan Tren: Implementasikan analisis prediktif sederhana untuk memperkirakan
 *    pendapatan dan pengeluaran masa depan berdasarkan data historis.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReportData } from "@/hooks/useReportData";
import { SphereChart } from "@/components/ui/sphere-chart";
import { AssetCard } from "@/components/reports/AssetCard";
import { ExpenseCard } from "@/components/reports/ExpenseCard";
import { SummaryCard } from "@/components/reports/SummaryCard";

const ReportsView = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM"),
  );

  const {
    transactions,
    monthlyExpenses,
    daysInMonth,
    carNames,
    speedboatNames,
    totalIncome,
    totalExpenses,
    totalMonthlyExpenses,
    totalBalance,
    calculateDailyIncome,
    calculateDailyExpenses,
    calculateDailyCash,
    calculateTotalIncome,
    calculateTotalExpenses,
    calculateTotalCash,
    formatCurrency,
    generateMonthOptions,
  } = useReportData(selectedMonth);

  // Sphere chart data for summary tab
  const sphereChartData = [
    {
      label: "Pendapatan",
      value: totalIncome + calculateTotalCash(),
      color: "#10B981",
      gradientStart: "#34D399",
      gradientEnd: "#059669",
    },
    {
      label: "Pengeluaran",
      value: totalExpenses + totalMonthlyExpenses,
      color: "#F4A1A1",
      gradientStart: "#FCA5A5",
      gradientEnd: "#EF4444",
    },
    {
      label: "Saldo",
      value: totalBalance + calculateTotalCash(),
      color: "#1A2A44",
      gradientStart: "#2D3748",
      gradientEnd: "#1A202C",
    },
  ];

  return (
    <div className="bg-bjt-background p-3 sm:p-4 rounded-bjt shadow-premium max-w-4xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-bjt-title font-bold text-bjt-textPrimary">
            Laporan Keuangan
          </h2>
          <motion.button
            className="p-2 rounded-full bg-bjt-background hover:bg-bjt-secondary/10 text-bjt-textSecondary hover:text-bjt-secondary transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="h-5 w-5" />
          </motion.button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
          <div className="w-full sm:w-64">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full text-sm bg-bjt-cardBg text-white border-none shadow-premium">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent className="bg-bjt-cardBg text-white border-bjt-inactive">
                {generateMonthOptions().map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-sm text-white hover:bg-bjt-primary/30 focus:bg-bjt-primary/30"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="income" className="w-full">
        <TabsList className="mb-4 w-full bg-bjt-background border-b border-bjt-inactive/30 p-0 h-auto">
          <TabsTrigger
            value="income"
            className="flex-1 sm:flex-none text-xs sm:text-sm py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-bjt-primary data-[state=active]:border-b-2 data-[state=active]:border-bjt-primary data-[state=active]:shadow-none"
          >
            Pendapatan
          </TabsTrigger>
          <TabsTrigger
            value="expenses"
            className="flex-1 sm:flex-none text-xs sm:text-sm py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-bjt-primary data-[state=active]:border-b-2 data-[state=active]:border-bjt-primary data-[state=active]:shadow-none"
          >
            Pengeluaran
          </TabsTrigger>
          <TabsTrigger
            value="summary"
            className="flex-1 sm:flex-none text-xs sm:text-sm py-3 px-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-bjt-primary data-[state=active]:border-b-2 data-[state=active]:border-bjt-primary data-[state=active]:shadow-none"
          >
            Ringkasan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Car income cards */}
            {carNames.map((carName) => {
              const dropIncome = transactions
                .filter(
                  (t) =>
                    t.assetType === "car" &&
                    t.assetName === carName &&
                    (!t.rentalType || t.rentalType === "drop"),
                )
                .reduce((sum, t) => sum + t.price, 0);

              const harianIncome = transactions
                .filter(
                  (t) =>
                    t.assetType === "car" &&
                    t.assetName === carName &&
                    t.rentalType === "harian",
                )
                .reduce((sum, t) => sum + t.price, 0);

              return (
                <AssetCard
                  key={`car-${carName}`}
                  assetType="car"
                  assetName={carName}
                  dropValue={formatCurrency(dropIncome)}
                  harianValue={formatCurrency(harianIncome)}
                />
              );
            })}

            {/* Speedboat income cards */}
            {speedboatNames.map((speedboatName) => (
              <AssetCard
                key={`speedboat-${speedboatName}`}
                assetType="speedboat"
                assetName={speedboatName}
                totalValue={formatCurrency(
                  calculateTotalIncome("speedboat", speedboatName),
                )}
              />
            ))}

            {/* Restaurant income card */}
            <AssetCard
              assetType="restaurant"
              assetName="Resto"
              totalValue={formatCurrency(calculateTotalIncome("restaurant"))}
            />

            {/* Daily cash card */}
            <AssetCard
              assetType="cash"
              assetName="Kas Harian"
              totalValue={formatCurrency(calculateTotalCash())}
            />

            {/* Total income card */}
            <SummaryCard
              title="Total Pendapatan"
              value={formatCurrency(totalIncome + calculateTotalCash())}
              type="income"
            />
          </div>

          <div className="mt-4">
            <button
              className="text-sm text-bjt-textSecondary hover:text-bjt-primary flex items-center gap-2"
              onClick={() => {}}
            >
              <span>Lihat Tabel Detail</span>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Car operational expenses */}
            <div className="bg-bjt-cardBg rounded-bjt shadow-premium p-4">
              <h3 className="text-base font-semibold mb-3 text-white flex items-center gap-2">
                <Car className="h-5 w-5" /> Pengeluaran Operasional Mobil
              </h3>
              <div className="space-y-3">
                {carNames.map((carName) => {
                  const carTransactions = transactions.filter(
                    (t) => t.assetType === "car" && t.assetName === carName,
                  );

                  const fuelCost = carTransactions.reduce(
                    (sum, t) => sum + (t.operationalCosts?.fuel || 0),
                    0,
                  );

                  const driverCost = carTransactions.reduce(
                    (sum, t) => sum + (t.operationalCosts?.driver || 0),
                    0,
                  );

                  const totalCost = fuelCost + driverCost;

                  return (
                    <div
                      key={`car-expense-${carName}`}
                      className="bg-bjt-primary/20 rounded-bjt p-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">
                          {carName}
                        </span>
                        <span className="text-white font-bold">
                          {formatCurrency(totalCost)}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Biaya Bensin:</span>
                          <span className="text-white">
                            {formatCurrency(fuelCost)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Ongkos Sopir:</span>
                          <span className="text-white">
                            {formatCurrency(driverCost)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Speedboat operational expenses */}
            {speedboatNames.length > 0 && (
              <div className="bg-bjt-cardBg rounded-bjt shadow-premium p-4">
                <h3 className="text-base font-semibold mb-3 text-white flex items-center gap-2">
                  <Ship className="h-5 w-5" /> Pengeluaran Operasional Speedboat
                </h3>
                <div className="space-y-3">
                  {speedboatNames.map((speedboatName) => {
                    const speedboatTransactions = transactions.filter(
                      (t) =>
                        t.assetType === "speedboat" &&
                        t.assetName === speedboatName,
                    );

                    const fuelCost = speedboatTransactions.reduce(
                      (sum, t) => sum + (t.operationalCosts?.fuel || 0),
                      0,
                    );

                    const driverCost = speedboatTransactions.reduce(
                      (sum, t) => sum + (t.operationalCosts?.driver || 0),
                      0,
                    );

                    const totalCost = fuelCost + driverCost;

                    return (
                      <div
                        key={`speedboat-expense-${speedboatName}`}
                        className="bg-bjt-primary/20 rounded-bjt p-3"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">
                            {speedboatName}
                          </span>
                          <span className="text-white font-bold">
                            {formatCurrency(totalCost)}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/70">Biaya Bensin:</span>
                            <span className="text-white">
                              {formatCurrency(fuelCost)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">
                              Ongkos Operator:
                            </span>
                            <span className="text-white">
                              {formatCurrency(driverCost)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Monthly expenses */}
            {monthlyExpenses.length > 0 && (
              <div className="bg-bjt-cardBg rounded-bjt shadow-premium p-4">
                <h3 className="text-base font-semibold mb-3 text-white flex items-center gap-2">
                  <Banknote className="h-5 w-5" /> Beban Bulanan
                </h3>
                <div className="space-y-3">
                  <ExpenseCard
                    expenseType="salary"
                    expenseName="Gaji Karyawan"
                    value={formatCurrency(monthlyExpenses[0]?.staffSalary || 0)}
                  />

                  <ExpenseCard
                    expenseType="nightGuard"
                    expenseName="Gaji Penjaga Malam"
                    value={formatCurrency(
                      monthlyExpenses[0]?.nightGuardSalary || 0,
                    )}
                  />

                  <ExpenseCard
                    expenseType="electricity"
                    expenseName="Beban Listrik"
                    value={formatCurrency(
                      monthlyExpenses[0]?.electricityBill || 0,
                    )}
                  />

                  <ExpenseCard
                    expenseType="water"
                    expenseName="Beban PDAM"
                    value={formatCurrency(monthlyExpenses[0]?.waterBill || 0)}
                  />

                  <ExpenseCard
                    expenseType="internet"
                    expenseName="Beban Internet"
                    value={formatCurrency(
                      monthlyExpenses[0]?.internetBill || 0,
                    )}
                  />
                </div>
              </div>
            )}

            {/* Total expenses card */}
            <SummaryCard
              title="Total Pengeluaran"
              value={formatCurrency(totalExpenses + totalMonthlyExpenses)}
              type="expense"
            />
          </div>

          <div className="mt-4">
            <button
              className="text-sm text-bjt-textSecondary hover:text-bjt-primary flex items-center gap-2"
              onClick={() => {}}
            >
              <span>Lihat Tabel Detail</span>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card className="bg-bjt-cardBg shadow-premium">
            <CardHeader className="px-4 py-3 border-b border-bjt-primary/20">
              <CardTitle className="text-base sm:text-lg text-white">
                Ringkasan Keuangan
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-white/70">
                {format(new Date(selectedMonth + "-01"), "MMMM yyyy", {
                  locale: id,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-4">
              {/* Sphere Chart */}
              <SphereChart data={sphereChartData} />

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <SummaryCard
                  title="Total Pendapatan"
                  value={formatCurrency(totalIncome + calculateTotalCash())}
                  type="income"
                />

                <SummaryCard
                  title="Total Pengeluaran"
                  value={formatCurrency(totalExpenses + totalMonthlyExpenses)}
                  type="expense"
                />

                <SummaryCard
                  title="Saldo Bersih"
                  value={formatCurrency(totalBalance + calculateTotalCash())}
                  type="balance"
                />
              </div>

              {/* Income Details */}
              <div className="mt-6">
                <h3 className="text-base font-semibold mb-3 text-white">
                  Rincian Pendapatan
                </h3>
                <Card className="bg-bjt-primary/30 shadow-none border-none">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Pendapatan Mobil:</span>
                      <span className="text-white font-medium">
                        {formatCurrency(calculateTotalIncome("car"))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">
                        Pendapatan Speedboat:
                      </span>
                      <span className="text-white font-medium">
                        {formatCurrency(calculateTotalIncome("speedboat"))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Pendapatan Resto:</span>
                      <span className="text-white font-medium">
                        {formatCurrency(calculateTotalIncome("restaurant"))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Kas Harian:</span>
                      <span className="text-white font-medium">
                        {formatCurrency(calculateTotalCash())}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/20 text-sm">
                      <span className="text-white font-bold">
                        Total Pendapatan:
                      </span>
                      <span className="text-white font-bold">
                        {formatCurrency(totalIncome + calculateTotalCash())}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Expense Details */}
              <div className="mt-6">
                <h3 className="text-base font-semibold mb-3 text-white">
                  Rincian Pengeluaran
                </h3>
                <Card className="bg-bjt-primary/30 shadow-none border-none">
                  <CardContent className="p-4 space-y-2">
                    {/* Car expenses */}
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Operasional Mobil:</span>
                      <span className="text-white font-medium">
                        {formatCurrency(
                          transactions
                            .filter((t) => t.assetType === "car")
                            .reduce((sum, t) => {
                              const fuelCost = t.operationalCosts?.fuel || 0;
                              const driverCost =
                                t.operationalCosts?.driver || 0;
                              return sum + fuelCost + driverCost;
                            }, 0),
                        )}
                      </span>
                    </div>

                    {/* Car details */}
                    {carNames.map((carName) => {
                      const carExpenses = transactions
                        .filter(
                          (t) =>
                            t.assetType === "car" && t.assetName === carName,
                        )
                        .reduce((sum, t) => {
                          const fuelCost = t.operationalCosts?.fuel || 0;
                          const driverCost = t.operationalCosts?.driver || 0;
                          return sum + fuelCost + driverCost;
                        }, 0);

                      return carExpenses > 0 ? (
                        <div
                          key={`summary-car-${carName}`}
                          className="flex justify-between text-sm pl-4"
                        >
                          <span className="text-white/70">- {carName}:</span>
                          <span className="text-white font-medium">
                            {formatCurrency(carExpenses)}
                          </span>
                        </div>
                      ) : null;
                    })}

                    {/* Speedboat expenses */}
                    {speedboatNames.length > 0 && (
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-white/80">
                          Operasional Speedboat:
                        </span>
                        <span className="text-white font-medium">
                          {formatCurrency(
                            transactions
                              .filter((t) => t.assetType === "speedboat")
                              .reduce((sum, t) => {
                                const fuelCost = t.operationalCosts?.fuel || 0;
                                const driverCost =
                                  t.operationalCosts?.driver || 0;
                                return sum + fuelCost + driverCost;
                              }, 0),
                          )}
                        </span>
                      </div>
                    )}

                    {/* Speedboat details */}
                    {speedboatNames.map((speedboatName) => {
                      const speedboatExpenses = transactions
                        .filter(
                          (t) =>
                            t.assetType === "speedboat" &&
                            t.assetName === speedboatName,
                        )
                        .reduce((sum, t) => {
                          const fuelCost = t.operationalCosts?.fuel || 0;
                          const driverCost = t.operationalCosts?.driver || 0;
                          return sum + fuelCost + driverCost;
                        }, 0);

                      return speedboatExpenses > 0 ? (
                        <div
                          key={`summary-speedboat-${speedboatName}`}
                          className="flex justify-between text-sm pl-4"
                        >
                          <span className="text-white/70">
                            - {speedboatName}:
                          </span>
                          <span className="text-white font-medium">
                            {formatCurrency(speedboatExpenses)}
                          </span>
                        </div>
                      ) : null;
                    })}

                    {/* Monthly expenses */}
                    {monthlyExpenses.length > 0 && (
                      <>
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-white/80">Beban Bulanan:</span>
                          <span className="text-white font-medium">
                            {formatCurrency(totalMonthlyExpenses)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pl-4">
                          <span className="text-white/70">
                            - Gaji Karyawan:
                          </span>
                          <span className="text-white font-medium">
                            {formatCurrency(
                              monthlyExpenses[0]?.staffSalary || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pl-4">
                          <span className="text-white/70">
                            - Gaji Penjaga Malam:
                          </span>
                          <span className="text-white font-medium">
                            {formatCurrency(
                              monthlyExpenses[0]?.nightGuardSalary || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pl-4">
                          <span className="text-white/70">
                            - Beban Listrik:
                          </span>
                          <span className="text-white font-medium">
                            {formatCurrency(
                              monthlyExpenses[0]?.electricityBill || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pl-4">
                          <span className="text-white/70">- Beban PDAM:</span>
                          <span className="text-white font-medium">
                            {formatCurrency(monthlyExpenses[0]?.waterBill || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pl-4">
                          <span className="text-white/70">
                            - Beban Internet:
                          </span>
                          <span className="text-white font-medium">
                            {formatCurrency(
                              monthlyExpenses[0]?.internetBill || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pl-4">
                          <span className="text-white/70">
                            - Beban Lain-lain:
                          </span>
                          <span className="text-white font-medium">
                            {formatCurrency(
                              monthlyExpenses[0]?.otherExpenses || 0,
                            )}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Total expenses summary */}
                    <div className="flex justify-between pt-2 border-t border-white/20 text-sm">
                      <span className="text-white font-bold">
                        Total Pengeluaran:
                      </span>
                      <span className="text-white font-bold">
                        {formatCurrency(totalExpenses + totalMonthlyExpenses)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Monthly Expenses Breakdown */}
              <div className="mt-6">
                <h3 className="text-base font-semibold mb-3 text-white">
                  Rincian Beban Bulanan
                </h3>
                <Card className="bg-bjt-primary/30 shadow-none border-none">
                  <CardContent className="p-4 space-y-2">
                    {monthlyExpenses.length > 0 ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/80">Gaji Karyawan:</span>
                          <span className="text-white font-medium">
                            {formatCurrency(
                              monthlyExpenses[0]?.staffSalary || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/80">
                            Gaji Penjaga Malam:
                          </span>
                          <span className="text-white font-medium">
                            {formatCurrency(
                              monthlyExpenses[0]?.nightGuardSalary || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/80">Beban Listrik:</span>
                          <span className="text-white font-medium">
                            {formatCurrency(
                              monthlyExpenses[0]?.electricityBill || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/80">Beban PDAM:</span>
                          <span className="text-white font-medium">
                            {formatCurrency(monthlyExpenses[0]?.waterBill || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/80">Beban Internet:</span>
                          <span className="text-white font-medium">
                            {formatCurrency(
                              monthlyExpenses[0]?.internetBill || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/80">
                            Beban Lain-lain:
                          </span>
                          <span className="text-white font-medium">
                            {formatCurrency(
                              monthlyExpenses[0]?.otherExpenses || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-white/20 text-sm">
                          <span className="text-white font-bold">
                            Total Beban Bulanan:
                          </span>
                          <span className="text-white font-bold">
                            {formatCurrency(totalMonthlyExpenses)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-2 text-white/70">
                        Belum ada data beban bulanan untuk periode ini
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsView;
