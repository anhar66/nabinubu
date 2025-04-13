# Prompt Pengembangan Aplikasi Berkah Jaya Transport

## Deskripsi Umum
Buat aplikasi manajemen keuangan mobile-friendly untuk Berkah Jaya Transport dengan nama "BJT Finance". Aplikasi ini digunakan untuk mengelola data keuangan dari penyewaan mobil, speedboat, dan pendapatan restoran, serta menampilkan laporan keuangan bulanan yang komprehensif.

## Skema Warna & Desain
- **Warna Utama**: Biru tua (#111184) dengan gradien ke biru yang lebih terang (#1E1E9E)
- **Warna Aksen**: Emas (#D4AF37) untuk elemen penting dan highlight
- **Warna Pendukung**:
  - Hijau (#10B981) untuk indikator pendapatan/sukses
  - Merah muda (#F4A1A1) untuk indikator pengeluaran/error
  - Putih untuk latar belakang (#F5F7FA)
  - Biru gelap (#1E1E9E) untuk kartu dan elemen UI
- **Font**: Inter dan Montserrat dengan ukuran yang responsif
- **Sudut Elemen**: Rounded (12px) untuk semua kartu, tombol, dan input
- **Bayangan**: Premium shadow effect pada kartu dan tombol

## Struktur Aplikasi

### 1. Autentikasi
- Halaman login dengan logo BJT di tengah dalam lingkaran
- Background gradient biru dengan logo watermark transparan
- Form input username dan password dengan ikon
- Tombol login biru dengan efek hover emas
- Penyimpanan status login di localStorage

### 2. Navigasi
- Top navigation bar untuk desktop dengan tab Input Data, Beban, dan Laporan Keuangan
- Bottom navigation bar untuk mobile dengan ikon dan label
- Indikator tab aktif dengan garis emas di bawah label
- Tombol logout di pojok kanan atas/bawah dengan warna merah

### 3. Halaman Input Data
- Tab selector untuk jenis aset (Mobil, Speedboat, Resto)
- Form input dengan field yang dinamis berdasarkan jenis aset:
  - **Mobil**: Selector jenis rental (Drop/Harian), tanggal, pilihan mobil, harga sewa, lokasi awal/tujuan (untuk Drop), biaya bensin, ongkos sopir, jumlah perjalanan/hari
  - **Speedboat**: Tanggal, pilihan speedboat, harga sewa, jumlah perjalanan
  - **Resto**: Tanggal, jumlah penjualan
- Kalender pop-up untuk pemilihan tanggal
- Perhitungan otomatis kas harian (Rp10.000/perjalanan untuk mobil, Rp10.000/perjalanan untuk speedboat, Rp10.000/hari untuk resto)
- Tombol simpan data dengan efek loading
- Notifikasi sukses/error setelah penyimpanan

### 4. Halaman Beban (Pengeluaran Bulanan)
- Selector bulan dan tahun dengan kalender pop-up
- Form input untuk berbagai jenis pengeluaran:
  - Gaji Karyawan
  - Gaji Penjaga Malam
  - Beban Listrik
  - Beban PDAM
  - Beban Internet
  - Beban Lain-lain
- Tampilan total kas tersedia dan total pengeluaran
- Validasi agar total pengeluaran tidak melebihi kas tersedia
- Tombol simpan pengeluaran dengan efek loading

### 5. Halaman Laporan Keuangan
- Selector bulan dengan dropdown
- Tab untuk beralih antara Pendapatan, Pengeluaran, dan Ringkasan
- **Tab Pendapatan**:
  - Kartu untuk setiap aset (mobil, speedboat, resto) dengan detail pendapatan
  - Kartu kas harian dengan total
  - Kartu total pendapatan dengan highlight
- **Tab Pengeluaran**:
  - Kartu untuk setiap jenis pengeluaran operasional
  - Kartu untuk pengeluaran bulanan (gaji, listrik, dll)
  - Kartu total pengeluaran dengan highlight
- **Tab Ringkasan**:
  - Visualisasi sphere chart untuk perbandingan pendapatan, pengeluaran, dan saldo
  - Kartu ringkasan dengan total pendapatan, pengeluaran, dan saldo bersih
  - Detail rincian pendapatan dan pengeluaran

## Fitur Teknis

### 1. Penyimpanan Data
- Gunakan localStorage untuk menyimpan data transaksi dan pengeluaran
- Struktur data JSON untuk transaksi dengan properti: id, tanggal, jenis aset, nama aset, jenis rental, rute, harga, biaya operasional, jumlah perjalanan, jumlah hari, kas harian
- Struktur data JSON untuk pengeluaran bulanan dengan properti: id, tanggal, bulan, tahun, gaji karyawan, gaji penjaga malam, beban listrik, beban PDAM, beban internet, beban lain-lain, total pengeluaran

### 2. Autentikasi
- Sistem login sederhana dengan username/password yang disimpan di localStorage
- Pengguna default: admin/admin123 dan operator/operator123
- Perlindungan rute dengan redirect ke halaman login jika tidak terautentikasi

### 3. Perhitungan & Laporan
- Perhitungan otomatis kas harian berdasarkan jenis aset dan jumlah perjalanan/hari
- Perhitungan total pendapatan, pengeluaran, dan saldo per bulan
- Filter data berdasarkan bulan dan tahun
- Visualisasi data dengan sphere chart untuk perbandingan nilai

### 4. Responsivitas
- Desain mobile-first dengan breakpoint untuk tablet dan desktop
- Bottom navigation untuk mobile, top navigation untuk desktop
- Kartu dan form yang menyesuaikan dengan ukuran layar
- Font size yang responsif untuk berbagai ukuran layar

### 5. Animasi & Interaksi
- Animasi hover dan tap pada tombol dan kartu
- Animasi transisi saat beralih antar tab
- Animasi loading saat menyimpan data
- Efek bayangan yang berubah saat hover pada kartu

## Teknologi yang Digunakan
- React dengan TypeScript
- Vite sebagai build tool
- Tailwind CSS untuk styling dengan konfigurasi kustom
- Framer Motion untuk animasi
- React Router untuk navigasi
- Lucide React untuk ikon
- React Hook Form untuk manajemen form
- Date-fns untuk manipulasi tanggal

## Struktur Folder
- `/src/components`: Komponen UI utama
- `/src/components/ui`: Komponen UI dasar (button, card, dll)
- `/src/components/reports`: Komponen khusus untuk laporan
- `/src/components/expenses`: Komponen khusus untuk pengeluaran
- `/src/services`: Layanan untuk autentikasi dan manajemen data
- `/src/hooks`: Custom hooks untuk logika bisnis
- `/src/lib`: Utilitas dan konfigurasi
- `/src/types`: Type definitions

## Catatan Implementasi
- Pastikan semua komponen memiliki nilai default untuk props
- Gunakan sistem shadow dan border radius yang konsisten
- Implementasikan validasi form untuk mencegah input yang tidak valid
- Buat sistem notifikasi untuk feedback pengguna
- Pastikan aplikasi berfungsi offline dengan penyimpanan lokal
- Optimasi performa dengan meminimalkan re-render
- Tambahkan animasi yang halus untuk meningkatkan UX

## Pengembangan Masa Depan
- Integrasi dengan backend (Supabase) untuk penyimpanan cloud
- Fitur ekspor laporan ke PDF atau Excel
- Dashboard analitik dengan visualisasi data lebih lanjut
- Fitur pencarian dan filter transaksi
- Manajemen pengguna dengan peran berbeda
- Notifikasi untuk pengeluaran yang mendekati batas anggaran
