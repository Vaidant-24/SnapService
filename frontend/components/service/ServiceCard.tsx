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
import {
  BriefcaseBusiness,
  IndianRupee,
  CircleHelp,
  LetterText,
  User2Icon,
  Star,
  SquarePen,
  PhoneIcon,
} from "lucide-react";

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
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-800 transition-all duration-300 ">
      <div className="mb-6">
        <h4 className="text-lg text-white font-semibold flex items-center gap-2">
          {service.name}
        </h4>
      </div>

      <div className="space-y-3 text-gray-300">
        <div className="flex items-start gap-2">
          <LetterText className="text-orange-500 w-5 h-5 " />
          <span className="text-sm text-gray-400">
            Description: {service.description}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <User2Icon className="text-orange-500 w-5 h-5" />
          <span className="text-gray-400 text-sm">
            Provider: {providerName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <PhoneIcon className="text-orange-500 w-5 h-5" />
          <span className="text-gray-400 text-sm">
            Contact: {service.providerId.phone}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee className="text-orange-500 w-5 h-5" />
          <span className="text-gray-400 text-sm">Price: ₹{service.price}</span>
        </div>

        <div className="flex items-center gap-2">
          <CircleHelp className="text-orange-500 w-5 h-5" />
          <span className="text-gray-400 text-sm">
            Category: {service.category}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => onBook(service._id)}
        >
          Book Now
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gray-700 hover:bg-gray-600 text-white">
              View Details
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
              <div className="flex items-start gap-2">
                <LetterText className="text-orange-500 w-5 h-5" />
                <span className="text-gray-400 text-sm">
                  Description: {service.description}
                </span>
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
                <span className="text-gray-400 text-sm">
                  Provider: {providerName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <PhoneIcon className="text-orange-500 w-5 h-5" />
                <span className="text-gray-400 text-sm">
                  Contact: {service.providerId.phone}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Star className="text-orange-500 w-5 h-5" />
                <span className="text-gray-400 text-sm">
                  Rating: {service.averageRating}/5
                </span>
              </div>

              <div className="flex items-center gap-2">
                <SquarePen className="text-orange-500 w-5 h-5" />
                <span className="text-gray-400 text-sm">
                  Total Ratings: {service.reviewCount}
                </span>
              </div>

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
