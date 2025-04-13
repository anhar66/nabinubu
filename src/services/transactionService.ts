import type { Transaction } from "./localStorageService";
import {
  getTransactions as localGetTransactions,
  getTransactionsByMonth as localGetTransactionsByMonth,
  createTransaction as localCreateTransaction,
  updateTransaction as localUpdateTransaction,
  deleteTransaction as localDeleteTransaction,
} from "./localStorageService";

/**
 * Saran untuk Pengembangan Layanan Transaksi:
 *
 * 1. Pencarian dan Filter: Tambahkan fungsi untuk mencari dan memfilter transaksi
 *    berdasarkan berbagai kriteria (tanggal, jenis aset, nilai, dll) dengan indeksasi
 *    untuk performa yang lebih baik.
 *
 * 2. Validasi Transaksi: Implementasikan validasi yang lebih ketat untuk data transaksi
 *    sebelum penyimpanan dengan skema validasi yang dapat dikonfigurasi.
 *
 * 3. Transaksi Batch: Tambahkan dukungan untuk operasi batch untuk mengelola banyak
 *    transaksi sekaligus dengan validasi dan rollback jika terjadi kesalahan.
 *
 * 4. Riwayat Perubahan: Catat riwayat perubahan pada transaksi dengan detail seperti
 *    waktu, pengguna, dan nilai sebelum/sesudah untuk keperluan audit.
 *
 * 5. Kategori Transaksi: Tambahkan sistem kategorisasi hierarkis untuk transaksi dengan
 *    tag dan label kustom untuk analisis yang lebih mendalam.
 *
 * 6. Lampiran: Tambahkan dukungan untuk melampirkan beberapa file (seperti foto bukti)
 *    ke transaksi dengan preview dan manajemen file terintegrasi.
 *
 * 7. Transaksi Berulang: Implementasikan dukungan untuk transaksi berulang dengan
 *    jadwal yang dapat dikonfigurasi dan notifikasi.
 */

// Ekspor fungsi-fungsi transaksi dari localStorage
export const getTransactions = localGetTransactions;
export const getTransactionsByMonth = localGetTransactionsByMonth;
export const createTransaction = localCreateTransaction;
export const updateTransaction = localUpdateTransaction;
export const deleteTransaction = localDeleteTransaction;

// Ekspor tipe Transaction
export type { Transaction };
