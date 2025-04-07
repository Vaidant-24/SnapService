"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  userId: string;
  username: string;
  email: string;
  role: "customer" | "service_provider";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/auth/verify", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const logout = async () => {
    await fetch("http://localhost:3001/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
