"use client";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import FeaturedServices from "@/components/customer-dashboard/FeaturedServices";
import CustomerBookings from "@/components/customer-dashboard/CustomerBookings";

export default function CustomerDashboard() {
  const { user: userData } = useAuth();

  return (
    <AuthGuard>
      <div className="container mx-8 px-8 py-16 bg-black text-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-orange-500 font-bold">
            Customer Dashboard
          </h1>
        </div>

        {!userData ? (
          <p>Unable to load user data.</p>
        ) : (
          <>
            <h2 className="text-xl mb-4">
              Welcome,{" "}
              <span className="text-2xl text-orange-500">
                {userData.username}
              </span>
            </h2>

            {/* Featured Services Component */}
            <FeaturedServices />

            {/* Customer's Bookings Component */}
            <CustomerBookings userId={userData.userId} />
          </>
        )}
      </div>
    </AuthGuard>
  );
}
