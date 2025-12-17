// src/TestEnv.jsx
import React, { useEffect } from "react";

export default function TestEnv() {
  useEffect(() => {
    console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("VITE_SUPABASE_ANON_KEY:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  }, []);
  return <div>Check console for env variables</div>;
}
