"use client";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import CustomerBookings from "@/components/customer-dashboard/CustomerBookings";

export default function CustomerAllBookings() {
  const { user: userData } = useAuth();

  return (
    <AuthGuard>
      <div className="container mx-8 px-8 py-16 bg-black text-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-orange-500 font-bold">Bookings</h1>
        </div>

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
