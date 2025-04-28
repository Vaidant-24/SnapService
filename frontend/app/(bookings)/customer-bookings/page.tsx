"use client";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import CustomerBookings from "@/components/customer-dashboard/CustomerBookings";

export default function CustomerAllBookings() {
  const { user: userData } = useAuth();

  return (
    <AuthGuard>
      <div className="container mx-auto mt-4 px-8 py-16  text-white min-h-screen">
        {!userData ? (
          <p>Unable to load user data.</p>
        ) : (
          <>
            <CustomerBookings userId={userData.userId} />
          </>
        )}
      </div>
    </AuthGuard>
  );
}
