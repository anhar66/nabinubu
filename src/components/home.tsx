import React from "react";
import { useNavigate } from "react-router-dom";
import InputForm from "./InputForm";
import { getCurrentUser } from "../services/auth";

/**
 * Saran untuk Pengembangan Halaman Utama:
 *
 * 1. Dashboard Ringkasan: Tambahkan ringkasan data keuangan terbaru seperti pendapatan
 *    hari ini, pengeluaran terbaru, dan saldo saat ini dengan visualisasi grafik yang menarik.
 *
 * 2. Pintasan Cepat: Tambahkan pintasan untuk tindakan yang sering dilakukan seperti
 *    menambahkan transaksi tertentu atau melihat laporan spesifik dengan ikon yang intuitif.
 *
 * 3. Aktivitas Terbaru: Tampilkan daftar transaksi terbaru dengan kemampuan filter dan
 *    pencarian untuk referensi cepat dan akses ke detail transaksi.
 *
 * 4. Pengingat dan Tugas: Tambahkan bagian untuk menampilkan pengingat pembayaran
 *    atau tugas keuangan yang akan datang dengan notifikasi dan kemampuan untuk menandai selesai.
 *
 * 5. Personalisasi: Berikan opsi untuk menyesuaikan tampilan halaman utama dengan
 *    widget yang dapat ditambah, dihapus, dan diatur ulang sesuai preferensi pengguna.
 *
 * 6. Statistik Performa: Tampilkan metrik kinerja keuangan seperti perbandingan dengan
 *    periode sebelumnya dan proyeksi untuk periode mendatang.
 */

export default function Home() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  return (
    <>
      <header className="bjt-header">
        <div className="flex items-center justify-center w-full">
          <div className="w-10 h-10 mr-2">
            <img
              src="/bjt_logo_new.png"
              alt="Berkah Jaya Transport Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-bjt-title font-bold text-bjt-primary text-[22px]">
              Berkah Jaya Transport
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 max-w-4xl">
        <InputForm />
      </main>
    </>
  );
}
