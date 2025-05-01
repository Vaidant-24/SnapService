"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Service } from "../type/Service";
import {
  Package,
  BriefcaseBusiness,
  LetterText,
  IndianRupee,
  CircleHelp,
  User,
  User2Icon,
  Loader,
  StarIcon,
  PencilIcon,
  PhoneIcon,
} from "lucide-react";

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/services/featured-services"
        );
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        setError("Unable to load services.");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookNow = (serviceId: string) => {
    router.push(`/book-service?serviceId=${serviceId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 py-12">
        <Loader className="h-10 w-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-300">Loading services...</p>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl text-orange-500 font-semibold mb-6">
          Featured Services
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service) => (
            <div
              key={service._id}
              className="bg-gray-800 rounded-xl p-8 border border-gray-800 duration-300 shadow-lg"
            >
              <div className="mb-4">
                <h4 className="text-lg text-white font-semibold flex items-center gap-2">
                  {service.name}
                </h4>
              </div>

              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-2">
                  <LetterText className="text-orange-500 w-5 h-5 mt-1" />
                  <p className="text-sm">Description: {service.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <IndianRupee className="text-orange-500 w-5 h-5" />
                  <span className="text-gray-400 text-sm">
                    Price: ₹{service.price}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CircleHelp className="text-orange-500 w-5 h-5" />
                  <span className="text-gray-400 text-sm">
                    Category: {service.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User2Icon className="text-orange-500 w-5 h-5" />
                  <p className="text-gray-400 text-sm">
                    Provider:{" "}
                    {service.providerId?.firstName +
                      " " +
                      service.providerId?.lastName || "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <PhoneIcon className="text-orange-500 w-5 h-5" />
                  <p className="text-gray-400 text-sm">
                    Contact: {service.providerId.phone || "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <StarIcon className="text-orange-500 w-5 h-5" />
                  <p className="text-gray-400 text-sm">
                    Rating: {service.averageRating || "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <PencilIcon className="text-orange-500 w-5 h-5" />
                  <p className="text-gray-400 text-sm">
                    Rating Count: {service.reviewCount || "N/A"}
                  </p>
                </div>

                <button
                  onClick={() => handleBookNow(service._id)}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-md w-full"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Button to navigate to full Services Page */}
        <div className="mt-6 text-center">
          <Link href="/services">
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-2 py-2 rounded">
              View All
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
