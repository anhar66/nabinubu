import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Cek apakah admin sudah ada
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("username", "admin")
      .maybeSingle();

    if (checkError) {
      throw new Error(`Error checking for admin user: ${checkError.message}`);
    }

    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: "Admin user already exists",
          user: existingUser,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Buat pengguna admin baru
    const { data, error } = await supabase.auth.admin.createUser({
      email: "admin@bjt.com",
      password: "admin123",
      email_confirm: true,
    });

    if (error) {
      throw new Error(`Error creating admin user: ${error.message}`);
    }

    if (!data.user) {
      throw new Error("Failed to create admin user");
    }

    // Tambahkan ke tabel users
    const { error: userError } = await supabase.from("users").insert({
      id: data.user.id,
      username: "admin",
    });

    if (userError) {
      throw new Error(`Error creating user record: ${userError.message}`);
    }

    return new Response(
      JSON.stringify({
        message: "Admin user created successfully",
        user: data.user,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
