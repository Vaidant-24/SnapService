"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";

import ProviderBookings from "@/components/service-provider-dashboard/ProviderBookings";
import { useRouter } from "next/navigation";

export default function ServiceProviderBookings() {
  const [loading, setLoading] = useState<boolean>(false);
  const { user: userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to unauthorized page if role is not "customer"
    if (userData && userData.role !== "service_provider") {
      router.push("/unauthorized");
    }
  }, [userData, router]);

  if (!userData || userData.role !== "service_provider") {
    return null; // Prevent rendering before redirect
  }

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
