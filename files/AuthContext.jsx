"use client";
/**
 * Auth Context
 * Provides: user, token, login(), signup(), logout(), loading
 * Persists token in localStorage + cookie (for SSR middleware)
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { authAPI } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On mount — restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("bl_token");
    const storedUser  = localStorage.getItem("bl_user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        clearSession();
      }
    }
    setLoading(false);
  }, []);

  const persistSession = useCallback((tokenVal, userData) => {
    localStorage.setItem("bl_token", tokenVal);
    localStorage.setItem("bl_user",  JSON.stringify(userData));
    // Cookie for Next.js edge middleware
    Cookies.set("bl_token", tokenVal, { expires: 7, sameSite: "lax" });
    setToken(tokenVal);
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem("bl_token");
    localStorage.removeItem("bl_user");
    Cookies.remove("bl_token");
    setToken(null);
    setUser(null);
  }, []);

  /* ── signup ─────────────────────────────────── */
  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.signup({ name, email, password });
      persistSession(data.token, data.user);
      toast.success("Welcome to BrightLearn!");
      router.push("/dashboard");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Please try again.";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  /* ── login ──────────────────────────────────── */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      persistSession(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
      router.push("/dashboard");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Check your credentials.";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  /* ── logout ─────────────────────────────────── */
  const logout = useCallback(() => {
    clearSession();
    toast.success("Signed out successfully");
    router.push("/");
  }, [clearSession, router]);

  const value = { user, token, loading, signup, login, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
