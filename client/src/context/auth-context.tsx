import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User as SelectUser, InsertUser } from "@shared/schema";
import { toast } from "sonner";

type User = SelectUser & {
  // Add any extra fields if needed
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: InsertUser) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  const login = async (data: any) => {
    try {
      const res = await apiRequest("POST", "/api/login", data);
      const userData = await res.json();
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);

      // Redirect based on role
      if (userData.role === "admin") setLocation("/admin/review");
      else if (userData.role === "police") setLocation("/police");
      else setLocation("/home");

      queryClient.invalidateQueries();
    } catch (err: any) {
      toast.error("Login failed", { description: err.message });
      throw err;
    }
  };

  const register = async (data: InsertUser) => {
    try {
      const res = await apiRequest("POST", "/api/register", data);
      const userData = await res.json();
      setUser(userData);
      toast.success(`Account created, welcome ${userData.name}!`);

      // Redirect based on role
      if (userData.role === "admin") setLocation("/admin/review");
      else if (userData.role === "police") setLocation("/police");
      else setLocation("/home");

      queryClient.invalidateQueries();
    } catch (err: any) {
      toast.error("Registration failed", { description: err.message });
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/logout");
      setUser(null);
      queryClient.clear();
      toast.info("Logged out successfully");
      setLocation("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}