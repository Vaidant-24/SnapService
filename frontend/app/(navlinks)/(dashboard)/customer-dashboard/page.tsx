"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import FeaturedServices from "@/components/customer-dashboard/FeaturedServices";
import CustomerUpcomingBooking from "@/components/customer-dashboard/UpcomingBookings";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const { user: userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userData && userData.role !== "customer") {
      router.push("/unauthorized");
    }
  }, [userData, router]);

  if (!userData || userData.role !== "customer") {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="h-8 w-8 text-orange-500 animate-spin mb-4" />
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto my-12 px-8 py-16 text-white min-h-screen">
        <h2 className="text-xl mb-4 ml-4">
          Welcome,{" "}
          <span className="text-2xl text-green-400 font-semibold">
            {userData.firstName + " " + userData.lastName}
          </span>
        </h2>

        {/* Customer's Bookings Component */}
        <CustomerUpcomingBooking userId={userData.userId} />

        {/* Featured Services Component */}
        <FeaturedServices />
      </div>
    </AuthGuard>
  );
}
