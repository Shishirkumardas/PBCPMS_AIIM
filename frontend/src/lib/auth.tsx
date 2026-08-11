"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthResponse, Role, User } from "./types";
import { api } from "./api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toUser(auth: AuthResponse): User {
  return {
    id: auth.id,
    name: auth.name,
    email: auth.email,
    phone: auth.phone,
    role: auth.role as Role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("pbcpms_token");
    const savedUser = localStorage.getItem("pbcpms_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("pbcpms_token");
        localStorage.removeItem("pbcpms_user");
      }
    }
    setLoading(false);
  }, []);

  const persist = useCallback((auth: AuthResponse) => {
    const u = toUser(auth);
    localStorage.setItem("pbcpms_token", auth.token);
    localStorage.setItem("pbcpms_user", JSON.stringify(u));
    setToken(auth.token);
    setUser(u);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const auth = await api.login(email, password);
      persist(auth);
      router.push(auth.role === "ADMIN" ? "/admin" : "/owner");
    },
    [persist, router]
  );

  const register = useCallback(
    async (payload: {
      name: string;
      email: string;
      phone?: string;
      password: string;
    }) => {
      const auth = await api.signup(payload);
      persist(auth);
      router.push("/owner");
    },
    [persist, router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("pbcpms_token");
    localStorage.removeItem("pbcpms_user");
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAdmin: user?.role === "ADMIN",
      isOwner: user?.role === "OWNER",
    }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
