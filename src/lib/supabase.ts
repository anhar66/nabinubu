import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

// Buat client Supabase dengan opsi persistSession untuk menyimpan sesi di localStorage
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Inisialisasi tabel users jika belum ada
export const initializeSupabaseTables = async () => {
  try {
    // Cek apakah tabel users sudah ada
    const { error: checkError } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    // Jika tabel belum ada, buat tabel users
    if (checkError && checkError.code === "42P01") {
      // 42P01 adalah kode error untuk "relation does not exist"
      console.log("Creating users table...");
      // Tabel akan dibuat melalui migrasi SQL
    }
  } catch (error) {
    console.error("Error initializing Supabase tables:", error);
  }
};
