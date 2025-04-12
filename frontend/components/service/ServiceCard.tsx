"use client";

import { Service } from "@/components/type/Service";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
      <h2 className="text-xl font-semibold text-white mb-4">{service.name}</h2>
      <p className="text-gray-400 mb-3">Description: {service.description}</p>
      <p className="text-gray-400  mb-3">Category: {service.category}</p>
      <p className=" text-gray-400 mb-3">
        Price: <span className="text-orange-400 mb-3">₹{service.price}</span>
      </p>
      <p className=" text-gray-400 mb-3">Provider: {providerName}</p>

      <div className="grid grid-cols-2 gap-2">
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => onBook(service._id)}
        >
          Book Now
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gray-700 hover:bg-gray-600 text-white">
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                {service.name}
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-sm">
                Full service details
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-5">
              <p className="text-gray-400 mb-3">
                <span className="text-gray-400 mb-3">Description:</span>{" "}
                {service.description}
              </p>
              <p className="text-gray-400 mb-3">
                Price:{" "}
                <span className="text-orange-500 mb-3">₹{service.price}</span>
              </p>
              <p className="text-gray-400 mb-3">
                Category:{" "}
                <span className="text-gray-400 mb-3">{service.category}</span>
              </p>
              <p className="text-gray-400 mb-4">
                Provider: <span>{providerName}</span>
              </p>
              <p className="text-gray-400 mb-4">
                Rating: 4.5/5
                <span className="text-orange-500 mb-3 sm">⭐</span>
              </p>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => onBook(service._id)}
              >
                Book Now
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
