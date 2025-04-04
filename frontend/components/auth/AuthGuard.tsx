"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication status by verifying the cookie
    const verifyAuth = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/verify", {
          method: "GET",
          credentials: "include", // Important for cookies
        });

        if (!response.ok) {
          // Not authenticated, redirect to login
          router.push("/sign-in");
          return;
        }

        // User is authenticated
        setAuthorized(true);
      } catch (error) {
        if (error instanceof Error) {
        }
        // Error verifying authentication, redirect to login
        router.push("/sign-in");
      }
    };

    verifyAuth();
  }, [router]);

  return authorized ? <>{children}</> : null;
}
