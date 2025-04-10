// components/services/ServiceCard.tsx
"use client";

import { Service } from "@/components/type/Service";

interface ServiceCardProps {
  service: Service;
  onBook: (serviceId: string) => void;
}

export default function ServiceCard({ service, onBook }: ServiceCardProps) {
  const providerName =
    service.providerId?.firstName && service.providerId?.lastName
      ? `${service.providerId.firstName} ${service.providerId.lastName}`
      : "N/A";

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-orange-500/20 transition-all duration-300">
      <h2 className="text-xl font-semibold text-white mb-2">{service.name}</h2>
      <p className="text-gray-400 mb-2">{service.description}</p>
      <p className="text-gray-300 text-sm mb-1">Category: {service.category}</p>
      <p className="text-orange-400 font-bold text-lg mb-3">₹{service.price}</p>
      <p className="text-sm text-gray-400 mb-4">
        Provider: <span className="text-white">{providerName}</span>
      </p>
      <button
        onClick={() => onBook(service._id)}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium transition-all duration-300"
      >
        Book Now
      </button>
    </div>
  );
}
