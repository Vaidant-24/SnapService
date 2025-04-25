"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import AddServiceForm from "@/components/service-provider-dashboard/AddServiceForm";
import ProviderServices from "@/components/service-provider-dashboard/ProviderServices";
import { Service } from "@/components/type/Service";
import ProviderUpcomingBookings from "@/components/service-provider-dashboard/UpcomingBooking";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ServiceProviderDashboard() {
  const { user: userData } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
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
    // The form already calls onCancel which will close the modal
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <AuthGuard>
      <div className="container mx-auto my-12 px-6 py-12 text-white min-h-screen">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <section className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl mb-2 mx-4">
                Welcome,{" "}
                <span className="text-2xl text-green-500 font-semibold">
                  {userData?.firstName + " " + userData?.lastName}
                </span>
              </h2>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold">
                    Add New Service
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-white">
                      Add New Service
                    </DialogTitle>
                  </DialogHeader>
                  <AddServiceForm
                    onServiceAdded={handleServiceAdded}
                    onCancel={handleCancel}
                  />
                </DialogContent>
              </Dialog>
            </section>

            {/* Provider Services Component */}
            <ProviderServices services={myServices} />

            {/* Provider Bookings Component */}
            {userData && (
              <ProviderUpcomingBookings providerId={userData?.userId} />
            )}
          </>
        )}
      </div>
    </AuthGuard>
  );
}
