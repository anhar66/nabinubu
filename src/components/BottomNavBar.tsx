import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PlusCircle, Receipt, BarChart3, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { logout } from "../services/auth";

/**
 * Saran untuk Pengembangan Navigasi Mobile:
 *
 * 1. Menu Lebih Banyak: Tambahkan opsi "Lebih Banyak" dengan menu drawer yang dapat
 *    digeser ke atas untuk mengakses fitur tambahan tanpa memenuhi navbar.
 *
 * 2. Gestur Swipe: Implementasikan navigasi berbasis gestur untuk beralih antar tab
 *    dengan menggeser layar ke kiri atau kanan dengan animasi yang responsif.
 *
 * 3. Animasi Transisi: Tingkatkan animasi transisi antar halaman dengan efek fade,
 *    slide, atau scale yang halus untuk pengalaman pengguna yang lebih mulus.
 *
 * 4. Badge Notifikasi: Tambahkan badge notifikasi pada ikon menu dengan counter dan
 *    warna yang berbeda berdasarkan prioritas untuk menunjukkan item yang memerlukan perhatian.
 *
 * 5. Navbar Kontekstual: Sesuaikan navbar berdasarkan konteks halaman dan riwayat
 *    navigasi pengguna untuk menampilkan tindakan yang paling relevan.
 *
 * 6. Haptic Feedback: Tambahkan umpan balik haptic saat pengguna berinteraksi dengan
 *    elemen navigasi untuk meningkatkan pengalaman sentuh.
 */

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navItems = [
    {
      name: "Input",
      icon: <PlusCircle className="h-5 w-5" />,
      path: "/",
      isActive: path === "/",
    },
    {
      name: "Beban",
      icon: <Receipt className="h-5 w-5" />,
      path: "/expenses",
      isActive: path === "/expenses",
    },
    {
      name: "Laporan",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/reports",
      isActive: path === "/reports",
    },
    {
      name: "Keluar",
      icon: <LogOut className="h-5 w-5" />,
      path: "/logout",
      isActive: false,
      onClick: handleLogout,
    },
  ];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 w-full bg-gradient-to-t from-bjt-primary to-bjt-primaryLight shadow-nav-premium z-50 px-2 py-1 sm:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <motion.button
            key={item.name}
            className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-bjt ${
              item.isActive
                ? "bg-bjt-primary text-white shadow-premium"
                : item.name === "Keluar"
                  ? "bg-bjt-error/80 text-white shadow-md"
                  : "bg-transparent text-bjt-textSecondary hover:text-bjt-secondary"
            }`}
            onClick={() =>
              item.onClick ? item.onClick() : navigate(item.path)
            }
            whileTap={{ scale: 0.95 }}
            whileHover={!item.isActive ? { y: -2 } : {}}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              {item.icon}
              {item.isActive && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 w-5 h-1 bg-bjt-secondary rounded-full"
                  layoutId="activeTabMobile"
                  style={{ x: "-50%" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            <span
              className={`mt-1 text-xs font-medium ${item.isActive ? "text-white" : ""}`}
            >
              {item.name}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNavBar;
