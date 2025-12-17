// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ihdhfrledktnobbffamj.supabase.co" //import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZGhmcmxlZGt0bm9iYmZmYW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzk1ODIsImV4cCI6MjA3MzYxNTU4Mn0.Xi-RguQvW8TnFLsUr7gc-oVWtkELCaqDmscE7tB-684" //import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // Helpful error in dev if env isn’t set

    console.warn(
        "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in your .env"
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});
