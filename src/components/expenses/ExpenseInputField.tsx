import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Saran untuk Pengembangan Komponen Input Pengeluaran:
 *
 * 1. Validasi Real-time: Tambahkan validasi real-time dengan umpan balik visual
 *    saat pengguna mengetik, termasuk pesan error yang jelas.
 *
 * 2. Format Otomatis: Implementasikan pemformatan otomatis untuk nilai mata uang
 *    saat pengguna mengetik (misalnya: menambahkan titik sebagai pemisah ribuan).
 *
 * 3. Riwayat Input: Tambahkan dropdown dengan saran berdasarkan input sebelumnya
 *    untuk mempercepat pengisian dan meningkatkan konsistensi data.
 *
 * 4. Tooltip Bantuan: Tambahkan tooltip informatif untuk menjelaskan tujuan
 *    setiap field input dan format yang diharapkan.
 *
 * 5. Aksesibilitas: Tingkatkan aksesibilitas dengan dukungan keyboard yang lebih baik,
 *    atribut ARIA, dan kontras warna yang memadai.
 *
 * 6. Input Alternatif: Tambahkan opsi input alternatif seperti slider untuk
 *    nilai dalam rentang tertentu atau pemilih nilai yang sering digunakan.
 */

interface ExpenseInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  icon?: "money" | "electricity" | "water" | "internet" | "other";
}

const ExpenseInputField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "number",
  icon = "money",
}: ExpenseInputFieldProps) => {
  return (
    <div className="space-y-2 w-full max-w-[90%] mx-auto">
      <Label htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </Label>
      <div className="relative w-full">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full",
            "h-12 rounded-xl bg-[#1E1E9E] text-white px-4 py-2",
            "border border-transparent focus:border-[#D4AF37]",
            "focus:outline-none focus:ring-1 focus:ring-[#D4AF37]",
            "shadow-md transition-all duration-200",
          )}
        />
      </div>
    </div>
  );
};

export default ExpenseInputField;
