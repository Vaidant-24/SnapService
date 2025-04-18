"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import AddServiceForm from "@/components/service-provider-dashboard/AddServiceForm";
import ProviderServices from "@/components/service-provider-dashboard/ProviderServices";
import { Service } from "@/components/type/Service";
import ProviderUpcomingBookings from "@/components/service-provider-dashboard/UpcomingBooking";

// Interface definitions

export default function ServiceProviderDashboard() {
  const { user: userData } = useAuth();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userData) return;

    const fetchServices = async () => {
      try {
        const servicesRes = await fetch("http://localhost:3001/services");

        if (!servicesRes.ok) throw new Error("Failed to fetch services");

        const servicesData = await servicesRes.json();

        const myServicesData = servicesData.filter((service: Service) => {
          const providerId = service.providerId?._id;
          return providerId === userData.userId;
        });

        setMyServices(myServicesData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [userData]);

  const handleServiceAdded = (newService: Service) => {
    setMyServices((prev) => [...prev, newService]);
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-6 py-12 bg-black text-white min-h-screen">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-orange-500 font-bold">
            Service Provider Dashboard
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold"
          >
            Add New Service
          </button>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <section className="mb-6">
              <h2 className="text-2xl  mb-2">
                Welcome,{" "}
                <span className="text-2xl text-green-500 font-bold">
                  {userData?.firstName + " " + userData?.lastName}
                </span>
              </h2>
            </section>
            {showAddForm && (
              <AddServiceForm
                onServiceAdded={handleServiceAdded}
                onCancel={() => setShowAddForm(false)}
              />
            )}
            {/* // Provider Services Component */}
            <ProviderServices services={myServices} />
            {/* // Provider Bookings Component */}
            {userData && (
              <ProviderUpcomingBookings providerId={userData?.userId} />
            )}
          </>
        )}
      </div>
    </AuthGuard>
  );
}
