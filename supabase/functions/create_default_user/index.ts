import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Check if admin user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("username", "admin")
      .maybeSingle();

    if (checkError) {
      throw new Error(
        `Error checking for existing user: ${checkError.message}`,
      );
    }

    // If admin user doesn't exist, create one
    if (!existingUser) {
      // Create user in auth
      const { data: authUser, error: signUpError } =
        await supabaseAdmin.auth.admin.createUser({
          email: "admin@berkahjayadev.com",
          password: "admin123",
          email_confirm: true,
        });

      if (signUpError) {
        throw new Error(`Error creating auth user: ${signUpError.message}`);
      }

      if (!authUser.user) {
        throw new Error("Failed to create auth user");
      }

      // Create user in users table
      const { error: insertError } = await supabaseAdmin.from("users").insert({
        id: authUser.user.id,
        email: "admin@berkahjayadev.com",
        is_admin: true,
      });

      if (insertError) {
        throw new Error(`Error creating user record: ${insertError.message}`);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Admin user created successfully",
          credentials: {
            username: "admin",
            email: "admin@berkahjayadev.com",
            password: "admin123",
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    } else {
      // Admin user already exists
      return new Response(
        JSON.stringify({
          success: true,
          message: "Admin user already exists",
          credentials: {
            username: "admin",
            email: "admin@berkahjayadev.com",
            password: "admin123",
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
