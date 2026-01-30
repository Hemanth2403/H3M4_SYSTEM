import React, { createContext, useContext, useState, ReactNode } from "react";
import { useLocation } from "wouter";

type UserRole = "researcher" | "enterprise" | "admin" | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();

  const login = (role: UserRole) => {
    if (!role) return;

    // Mock user data based on role
    let mockUser: User;
    switch (role) {
      case "researcher":
        mockUser = { id: "r1", name: "Cipher_01", role: "researcher", avatar: "JS" };
        setLocation("/");
        break;
      case "enterprise":
        mockUser = { id: "e1", name: "Acme Corp Security", role: "enterprise", avatar: "AC" };
        setLocation("/intel");
        break;
      case "admin":
        mockUser = { id: "a1", name: "H3M4 Admin", role: "admin", avatar: "AD" };
        setLocation("/admin/review");
        break;
      default:
        return;
    }
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    setLocation("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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