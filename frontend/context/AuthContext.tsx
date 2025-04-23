"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type User = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "customer" | "service_provider";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  logout: () => void;
  notificationsCount: number;
  setNotificationsCount: Dispatch<SetStateAction<number>>;
  unreadNotifications: any[];
  setUnreadNotifications: Dispatch<SetStateAction<any[]>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [unreadNotifications, setUnreadNotifications] = useState<any[]>([]);

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

  useEffect(() => {
    const CountNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/notifications/user/${user?.userId}/unread/count`
        );
        const data = await res.json();

        setNotificationsCount(data?.length || 0);
      } catch (err) {
        console.error("Error fetching notifications count:", err);
      }
    };

    const fetchUnreadNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/notifications/user/${user?.userId}/unread`
        );
        const data = await res.json();

        setUnreadNotifications(data);
      } catch (err) {
        console.error("Error fetching unread notifications:", err);
      }
    };
    CountNotifications();
    fetchUnreadNotifications();
  }, [setNotificationsCount, setUnreadNotifications, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
        notificationsCount,
        setNotificationsCount,
        unreadNotifications,
        setUnreadNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
