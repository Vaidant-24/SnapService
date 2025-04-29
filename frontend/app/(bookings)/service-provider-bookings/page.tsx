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
      <div className="container mx-auto my-12 px-6 py-12 text-white min-h-screen">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>{userData && <ProviderBookings providerId={userData?.userId} />}</>
        )}
      </div>
    </AuthGuard>
  );
}
