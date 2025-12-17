// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Hydrate from localStorage first
  const hydrateFromLocal = () => {
    try {
      const cached = localStorage.getItem("user");
      if (cached) {
        const parsed = JSON.parse(cached);
        setUser(parsed);
        return parsed;
      }
    } catch (err) {
      console.error("[Auth] Failed to parse local user:", err);
    }
    return null;
  };

  // 🔹 Hydrate user from session + optional profile (for login/signup events)
  const hydrateUser = async (sess) => {
    if (!sess?.user) {
      setUser(null);
      localStorage.removeItem("user");
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from("users")
        .select("role, fullname, email")
        .eq("id", sess.user.id)
        .single();

      if (error) {
        console.warn(
          "[Supabase] Profile fetch failed, fallback to session:",
          error.message
        );
      }

      const nextUser = {
        id: sess.user.id,
        email: sess.user.email,
        role: profile?.role ?? "user",
        fullname: profile?.fullname ?? "",
      };

      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
    } catch (err) {
      console.error("[Supabase] hydrateUser exception:", err);
      setUser({
        id: sess.user.id,
        email: sess.user.email,
        role: "user",
        fullname: "",
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: sess.user.id,
          email: sess.user.email,
          role: "user",
          fullname: "",
        })
      );
    }
  };

  useEffect(() => {
    console.log("[Auth] Initializing...");
    // 1️⃣ Try localStorage first
    const local = hydrateFromLocal();
    if (local) {
      console.log("[Auth] Hydrated from localStorage:", local);
      setLoading(false);
      return;
    }

    // 2️⃣ Otherwise, fallback to Supabase session check
    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error("[Supabase] getSession error:", error.message);
        console.log("[Supabase] Session on load:", data?.session);

        await hydrateUser(data?.session);
      } catch (err) {
        console.error("[Supabase] init() exception:", err);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    init();

    // 🔹 Listen for Supabase auth events (optional safety)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, sess) => {
        console.log("[Supabase] Auth state change:", event, sess);
        await hydrateUser(sess);
      }
    );

    return () => {
      try {
        authListener?.subscription?.unsubscribe?.();
      } catch (err) {
        console.warn("[Supabase] unsubscribe failed:", err);
      }
    };
  }, []);

  const signup = async (email, password, role = "user", fullname = "") => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const authUser = data.user;
    const session = data.session;
    if (!authUser || !session)
      throw new Error("Signup failed. Please try again.");

    const { error: upsertErr } = await supabase.from("users").upsert(
      {
        id: authUser.id,
        email,
        role,
        fullname,
        created_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (upsertErr) console.warn("[Supabase] Upsert failed:", upsertErr.message);

    await hydrateUser(session);
    return authUser;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    await hydrateUser(data.session);
    return data.user;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("[Supabase] signOut failed:", err.message);
    }
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {loading ? <div className="loading-screen">Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
