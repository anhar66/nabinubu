import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import CreateDefaultUserButton from "./CreateDefaultUserButton";

/**
 * Saran untuk Pengembangan Autentikasi:
 *
 * 1. Manajemen Pengguna: Tambahkan fitur untuk mengelola beberapa pengguna dengan
 *    peran berbeda (admin, operator, manajer, dll) dengan antarmuka admin yang intuitif.
 *
 * 2. Reset Password: Tambahkan fitur untuk mereset password melalui email atau
 *    pertanyaan keamanan dengan proses verifikasi yang aman.
 *
 * 3. Autentikasi Dua Faktor: Implementasikan autentikasi dua faktor menggunakan
 *    aplikasi authenticator atau SMS untuk meningkatkan keamanan akun.
 *
 * 4. Sesi Login: Tambahkan manajemen sesi dengan opsi "ingat saya", timeout
 *    otomatis, dan kemampuan untuk melihat dan mengakhiri sesi aktif dari perangkat lain.
 *
 * 5. Riwayat Login: Catat dan tampilkan riwayat login dengan detail seperti waktu,
 *    lokasi, dan perangkat untuk membantu mendeteksi akses yang tidak sah.
 *
 * 6. Kebijakan Password: Terapkan kebijakan password yang kuat dengan persyaratan
 *    kompleksitas dan pembaruan berkala.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { User, Lock } from "lucide-react";
// Tidak lagi menggunakan CreateAdminButton

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        throw new Error("Username dan password harus diisi");
      }

      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bjt-primary via-bjt-primaryLight to-bjt-primary px-4 py-12 relative overflow-hidden max-w-full mx-auto">
      <div className="absolute inset-0 bg-[url('/bjt_logo_new.png')] bg-center bg-no-repeat opacity-5 bg-[length:400px_400px] blur-sm">
        <div className="w-[402px] h-[574px]"></div>
      </div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-bjt-primary to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-bjt-primary to-transparent"></div>
      <Card className="w-full max-w-md border-none shadow-premium hover:shadow-premium-hover transition-shadow duration-300 bg-white/95 backdrop-blur-md z-10">
        <CardHeader className="space-y-4 flex flex-col items-center pt-8">
          <div className="w-[140px] h-[140px] mb-3 rounded-full overflow-hidden bg-gradient-to-br from-bjt-primary to-bjt-primaryLight shadow-premium border-2 border-bjt-secondary/30 flex items-center justify-center p-2">
            <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center p-2">
              <img
                src="/bjt_logo_new.png"
                alt="Berkah Jaya Transport Logo"
                className="w-[110px] h-[110px] object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-bjt-title font-bold text-transparent bg-clip-text bg-gradient-to-r from-bjt-primary to-bjt-primaryLight text-center">
            Berkah Jaya Transport
          </CardTitle>
          <CardDescription className="text-bjt-small text-bjt-textSecondary text-center">
            Sistem Manajemen Keuangan
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pt-4">
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 bg-bjt-error/20 border-bjt-error text-bjt-textPrimary"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-bjt-textSecondary">
                Username
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-white/70" />
                </div>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                  className="h-[50px] rounded-bjt bg-bjt-cardBg/90 text-white px-4 py-2 focus:ring-2 focus:ring-bjt-secondary/70 focus:outline-none pl-10 w-full border border-bjt-secondary/20 shadow-inner"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-bjt-textSecondary">
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-white/70" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="h-[50px] rounded-bjt bg-bjt-cardBg/90 text-white px-4 py-2 focus:ring-2 focus:ring-bjt-secondary/70 focus:outline-none pl-10 w-full border border-bjt-secondary/20 shadow-inner"
                />
              </div>
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                className="min-h-bjt-touch rounded-bjt px-4 py-2 font-medium transition-all duration-200 active:animate-tap shadow-premium bg-gradient-to-r from-bjt-primary to-bjt-primaryLight text-white hover:from-bjt-primaryLight hover:to-bjt-primary hover:shadow-premium-hover active:bg-bjt-secondary w-[90%] mx-auto block h-[50px] mt-4 border border-bjt-secondary/20"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </div>
            <div className="text-center">
              <a
                href="#"
                className="text-bjt-textSecondary hover:text-bjt-secondary transition-colors"
              >
                Lupa Password?
              </a>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center pb-8 space-y-4">
          <p className="text-bjt-small text-center text-bjt-textSecondary">
            &copy; {new Date().getFullYear()} Berkah Jaya Transport. All rights
            reserved.
          </p>
          <CreateDefaultUserButton />
        </CardFooter>
      </Card>
    </div>
  );
}
