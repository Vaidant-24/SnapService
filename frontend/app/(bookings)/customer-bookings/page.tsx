"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import CustomerBookings from "@/components/customer-dashboard/CustomerBookings";
import { useRouter } from "next/navigation";

export default function CustomerAllBookings() {
  const { user: userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to unauthorized page if role is not "customer"
    if (userData && userData.role !== "customer") {
      router.push("/unauthorized");
    }
  }, [userData, router]);

  if (!userData || userData.role !== "customer") {
    return null; // Prevent rendering before redirect
  }

  return (
    <AuthGuard>
      <div className="container mx-auto my-12 px-6 py-12 text-white min-h-screen">
        <CustomerBookings userId={userData.userId} />
      </div>
    </AuthGuard>
  );
}
