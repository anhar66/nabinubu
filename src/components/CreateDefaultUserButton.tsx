import { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "./ui/alert";

export default function CreateDefaultUserButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    credentials?: {
      username: string;
      email: string;
      password: string;
    };
  } | null>(null);

  const createDefaultUser = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-default-user",
        {
          method: "POST",
        },
      );

      if (error) throw new Error(error.message);
      setResult(data);
    } catch (err) {
      setResult({
        success: false,
        message: err instanceof Error ? err.message : "Terjadi kesalahan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto mt-4">
      <Button
        onClick={createDefaultUser}
        disabled={isLoading}
        className="w-full bg-bjt-secondary hover:bg-bjt-secondary/80 text-white"
      >
        {isLoading ? "Memproses..." : "Buat Pengguna Default"}
      </Button>

      {result && (
        <Alert
          className={`${result.success ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"} text-bjt-textPrimary`}
        >
          <AlertDescription className="space-y-2">
            <p>{result.message}</p>
            {result.success && result.credentials && (
              <div className="bg-white p-3 rounded-md border border-bjt-secondary/20 mt-2">
                <p className="font-semibold mb-1">Kredensial Login:</p>
                <p>
                  <span className="font-medium">Username:</span>{" "}
                  {result.credentials.username}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {result.credentials.email}
                </p>
                <p>
                  <span className="font-medium">Password:</span>{" "}
                  {result.credentials.password}
                </p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
