"use client";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import FeaturedServices from "@/components/customer-dashboard/FeaturedServices";
import CustomerUpcomingBooking from "@/components/customer-dashboard/UpcomingBookings";

export default function CustomerDashboard() {
  const { user: userData } = useAuth();

  return (
    <AuthGuard>
      <div className="container mx-auto my-12 px-8 py-16 text-white min-h-screen">
        {!userData ? (
          <p>Unable to load user data.</p>
        ) : (
          <>
            <h2 className="text-xl  mb-4 ml-4">
              Welcome,{" "}
              <span className="text-2xl text-green-400 font-semibold">
                {userData.firstName + " " + userData.lastName}
              </span>
            </h2>

            {/* Featured Services Component */}
            <FeaturedServices />

            {/* Customer's Bookings Component */}
            <CustomerUpcomingBooking userId={userData.userId} />
          </>
        )}
      </div>
    </AuthGuard>
  );
}
