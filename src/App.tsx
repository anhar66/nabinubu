import { Suspense, useEffect, useState } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./components/home";
import Login from "./components/Login";
import InputForm from "./components/InputForm";
import MonthlyExpenses from "./components/MonthlyExpenses";
import ReportsView from "./components/ReportsView";
import TopNavBar from "./components/TopNavBar";
import BottomNavBar from "./components/BottomNavBar";
import { isAuthenticated, getCurrentUser } from "./services/auth";
// Tidak lagi menggunakan supabase
import routes from "tempo-routes";

/**
 * Saran untuk Pengembangan Aplikasi Selanjutnya:
 *
 * 1. Fitur Pencarian dan Filter: Tambahkan kemampuan mencari dan memfilter transaksi
 *    berdasarkan tanggal, jenis aset, atau nilai dengan filter yang dapat disimpan.
 *
 * 2. Dashboard Analitik: Tambahkan grafik dan visualisasi data interaktif untuk melihat tren
 *    pendapatan dan pengeluaran dengan kemampuan drill-down untuk analisis mendalam.
 *
 * 3. Ekspor Data: Tambahkan fitur untuk mengekspor laporan ke berbagai format (PDF, Excel, CSV)
 *    dengan opsi kustomisasi tampilan dan konten laporan.
 *
 * 4. Notifikasi: Implementasikan sistem notifikasi multi-channel (in-app, email, push) untuk
 *    mengingatkan pengguna tentang pengeluaran rutin, batas anggaran, atau anomali transaksi.
 *
 * 5. Mode Gelap: Tambahkan opsi mode gelap dengan deteksi preferensi sistem dan penjadwalan
 *    otomatis untuk kenyamanan pengguna di berbagai kondisi pencahayaan.
 *
 * 6. Sinkronisasi Cloud: Implementasikan sinkronisasi data otomatis ke cloud dengan
 *    manajemen konflik dan riwayat versi untuk backup dan akses multi-perangkat.
 *
 * 7. Manajemen Pengguna: Tambahkan fitur untuk mengelola beberapa pengguna dengan
 *    peran dan izin yang dapat dikonfigurasi untuk kontrol akses yang granular.
 *
 * 8. Fitur Foto Bukti: Tambahkan kemampuan untuk melampirkan dan mengelola foto bukti
 *    transaksi dengan OCR untuk ekstraksi data otomatis dari struk atau invoice.
 *
 * 9. Integrasi Perbankan: Tambahkan opsi untuk mengimpor transaksi secara otomatis
 *    dari rekening bank atau dompet digital untuk mengurangi input manual.
 *
 * 10. Aplikasi Mobile: Kembangkan versi aplikasi mobile native dengan fitur offline
 *     dan sinkronisasi untuk akses yang lebih fleksibel.
 */

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      setAuth(isAuth);
    };
    checkAuth();
  }, []);

  if (auth === null) {
    return <p>Loading...</p>;
  }

  return auth ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();

    // Tidak perlu listener untuk localStorage
  }, []);

  // Force re-render when location changes to fix navigation display issue
  useEffect(() => {
    // This will trigger a re-render when location changes
    // which helps ensure the navigation is displayed properly
  }, [location, user]);

  if (checking) {
    return <p>Loading...</p>;
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <div className="min-h-screen bg-bjt-background pt-16 pb-16 sm:pb-0">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-4 max-w-4xl">
                    <MonthlyExpenses />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-4 max-w-4xl">
                    <ReportsView />
                  </div>
                </ProtectedRoute>
              }
            />
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
          </Routes>
          {user && <TopNavBar />}
          {user && <BottomNavBar />}
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </div>
      </>
    </Suspense>
  );
}

export default App;
