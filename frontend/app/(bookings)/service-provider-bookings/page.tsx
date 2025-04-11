"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";

import ProviderBookings from "@/components/service-provider-dashboard/ProviderBookings";

// Interface definitions

export default function ServiceProviderBookings() {
  const [loading, setLoading] = useState<boolean>(false);
  const { user: userData } = useAuth();
  return (
    <AuthGuard>
      <div className="container mx-auto px-6 py-12 bg-black text-white min-h-screen">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-orange-500 font-bold">
            Service Provider Bookings
          </h1>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>{userData && <ProviderBookings providerId={userData?.userId} />}</>
        )}
      </div>
    </AuthGuard>
  );
}
