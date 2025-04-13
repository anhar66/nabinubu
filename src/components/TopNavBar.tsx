import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PlusCircle, Receipt, BarChart3, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { logout } from "../services/auth";

/**
 * Saran untuk Pengembangan Navigasi:
 *
 * 1. Menu Dropdown: Tambahkan menu dropdown untuk akses ke fitur tambahan seperti
 *    pengaturan profil, preferensi aplikasi, dan bantuan dengan ikon yang intuitif.
 *
 * 2. Breadcrumbs: Implementasikan breadcrumbs untuk navigasi yang lebih jelas pada
 *    halaman dengan hierarki dalam dan riwayat navigasi yang mudah diakses.
 *
 * 3. Pencarian Global: Tambahkan bilah pencarian di navbar dengan fitur autocomplete
 *    dan filter untuk mencari transaksi atau data lainnya dari mana saja di aplikasi.
 *
 * 4. Mode Gelap: Tambahkan toggle untuk beralih antara mode terang dan gelap dengan
 *    penyimpanan preferensi pengguna di localStorage.
 *
 * 5. Notifikasi: Tambahkan ikon notifikasi dengan badge untuk menampilkan pemberitahuan
 *    penting kepada pengguna dan panel notifikasi yang dapat diperluas.
 *
 * 6. Navigasi Kontekstual: Tampilkan menu dan opsi yang relevan berdasarkan halaman
 *    saat ini dan peran pengguna untuk meningkatkan efisiensi.
 */

const TopNavBar = () => {
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
      name: "Input Data",
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
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-bjt-primary via-bjt-primary to-bjt-primaryLight shadow-nav-premium z-50 px-4 sm:px-6 py-2"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-bjt-secondary/30 flex items-center justify-center mr-2">
            <img
              src="/bjt_logo_new.png"
              alt="BJT"
              className="w-6 h-6 object-contain"
            />
          </div>
          <span className="text-white font-medium text-sm hidden sm:block">
            BJT
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 hide-scrollbar">
          {navItems.map((item) => (
            <motion.button
              key={item.name}
              className={`relative flex flex-col items-center justify-center py-2 px-2 sm:px-4 rounded-bjt whitespace-nowrap ${
                item.isActive
                  ? "bg-bjt-secondary/20 text-bjt-secondary shadow-premium border border-bjt-secondary/30"
                  : "bg-white/5 text-white/70 hover:text-bjt-secondary hover:bg-white/10 border border-transparent"
              }`}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div
                  className={`${item.isActive ? "text-bjt-secondary" : "text-white/70"}`}
                >
                  {item.icon}
                </div>
                <span className="text-bjt-small font-medium">{item.name}</span>
              </div>
              {item.isActive && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 w-12 h-0.5 bg-bjt-secondary rounded-full"
                  layoutId="activeTab"
                  style={{ x: "-50%" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
          <motion.button
            className="bg-bjt-error/80 text-white hover:bg-bjt-error border border-white/20 relative flex flex-col items-center justify-center py-2 px-3 sm:px-5 rounded-bjt whitespace-nowrap shadow-md ml-1"
            onClick={handleLogout}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="text-white">
                <LogOut className="h-5 w-5" />
              </div>
              <span className="text-bjt-small font-medium">Keluar</span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default TopNavBar;
