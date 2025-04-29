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
import { Loader } from "lucide-react";

export default function ServiceProviderDashboard() {
  const { user: userData } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchServices = async () => {
    try {
      setRefreshing(true);
      const servicesRes = await fetch(
        `http://localhost:3001/services/provider/${userData?.userId}?limit=6`
      );
      if (!servicesRes.ok) throw new Error("Failed to fetch services");

      const servicesData = await servicesRes.json();

      setMyServices(servicesData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!userData) return;

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
          <div className="flex flex-col items-center justify-center h-64 text-orange-500">
            <p className="mb-2 text-lg font-medium">Loading...</p>
            <Loader className="w-9 h-9 animate-spin" />
          </div>
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
                    Add Service
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-white">
                      Add Service
                    </DialogTitle>
                  </DialogHeader>
                  <AddServiceForm
                    onServiceAdded={handleServiceAdded}
                    onCancel={handleCancel}
                  />
                </DialogContent>
              </Dialog>
            </section>

            <ProviderServices
              services={myServices}
              handleFetchService={() => fetchServices()}
              refreshing={refreshing}
            />

            {userData && (
              <ProviderUpcomingBookings providerId={userData?.userId} />
            )}
          </>
        )}
      </div>
    </AuthGuard>
  );
}
