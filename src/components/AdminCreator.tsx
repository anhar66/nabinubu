import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";

const AdminCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const createAdminUser = async () => {
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      // Panggil edge function untuk membuat admin
      const { data, error } = await supabase.functions.invoke(
        "create-admin-user",
        {
          body: { email: "admin@bjt.com" },
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      setMessage(data.message || "Admin berhasil dibuat");
    } catch (err) {
      console.error("Error creating admin:", err);
      setError(err instanceof Error ? err.message : "Gagal membuat admin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-bjt-cardBg rounded-bjt shadow-premium">
      <h2 className="text-white font-bold mb-4">Buat Pengguna Admin</h2>

      {message && (
        <Alert className="mb-4 bg-green-100 border-green-500 text-green-800">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4 bg-red-100 border-red-500 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={createAdminUser}
        disabled={isLoading}
        className="bjt-btn-primary w-full"
      >
        {isLoading ? "Memproses..." : "Buat Admin"}
      </Button>

      <p className="text-white/70 text-sm mt-2">
        Username: admin
        <br />
        Password: admin123
      </p>
    </div>
  );
};

export default AdminCreator;
