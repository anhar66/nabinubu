import { supabase } from "@/lib/supabase";
import type { User } from "./localStorageService";

/**
 * Saran untuk Pengembangan Autentikasi:
 *
 * 1. Autentikasi JWT: Implementasikan autentikasi berbasis token JWT dengan refresh token
 *    untuk keamanan yang lebih baik dan pengalaman pengguna yang mulus.
 *
 * 2. Integrasi OAuth: Tambahkan opsi login dengan penyedia OAuth seperti Google, Microsoft,
 *    atau Apple dengan proses onboarding yang sederhana untuk pengguna baru.
 *
 * 3. Manajemen Peran: Implementasikan sistem peran dan izin yang komprehensif dengan
 *    antarmuka admin untuk mengelola akses ke fitur aplikasi berdasarkan peran pengguna.
 *
 * 4. Audit Login: Catat semua aktivitas login, logout, dan perubahan akun dengan detail
 *    seperti IP, perangkat, dan lokasi untuk keperluan keamanan dan audit.
 *
 * 5. Kebijakan Password: Tambahkan validasi kekuatan password, deteksi password yang
 *    terekspos, dan kebijakan pembaruan password berkala dengan pengingat.
 *
 * 6. Deteksi Aktivitas Mencurigakan: Implementasikan sistem untuk mendeteksi dan
 *    memblokir upaya login yang mencurigakan berdasarkan pola dan lokasi.
 */

// Login dengan Supabase
export const login = async (
  username: string,
  password: string,
): Promise<User> => {
  try {
    // Cari user berdasarkan username
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (fetchError || !users) {
      throw new Error("Username atau password salah");
    }

    // Login dengan email dan password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: users.email,
      password: password,
    });

    if (error) {
      throw new Error("Username atau password salah");
    }

    // Simpan user di session
    const currentUser = {
      id: users.id,
      username: users.username,
      isAuthenticated: true,
    };

    return currentUser;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Login gagal");
  }
};

// Logout dengan Supabase
export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
};

// Mendapatkan user saat ini
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      return null;
    }

    // Ambil data user dari tabel users
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", data.session.user.id)
      .single();

    if (error || !userData) {
      return null;
    }

    return {
      id: userData.id,
      username: userData.username,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Memeriksa apakah user terautentikasi
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Membuat user baru
export const createUser = async (userData: {
  email: string;
  password: string;
  username: string;
}): Promise<User> => {
  try {
    // Buat user di auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Gagal membuat user");
    }

    // Buat user di tabel users
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        id: data.user.id,
        email: userData.email,
        is_admin: true,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return {
      id: newUser.id,
      username: userData.username,
      isAuthenticated: true,
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error("Gagal membuat user");
  }
};

// Inisialisasi admin user jika belum ada
export const initializeAdminUser = async (): Promise<void> => {
  try {
    // Cek apakah admin sudah ada
    const { data: existingAdmin, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("username", "admin")
      .maybeSingle();

    if (checkError) {
      console.error("Error checking admin user:", checkError);
      return;
    }

    // Jika admin belum ada, buat admin baru
    if (!existingAdmin) {
      await createUser({
        email: "admin@berkahjayadev.com",
        password: "admin123",
        username: "admin",
      });
      console.log("Admin user created successfully");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};

// Ekspor tipe User
export type { User };
