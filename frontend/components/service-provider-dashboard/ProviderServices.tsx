"use client";

import {
  Package,
  IndianRupee,
  Tag,
  FileText,
  BriefcaseBusiness,
  CircleHelp,
  LetterText,
} from "lucide-react";
import { Service } from "../type/Service";

interface ProviderServicesProps {
  services: Service[];
}

export default function ProviderServices({ services }: ProviderServicesProps) {
  return (
    <section className="bg-gray-950  py-4">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl text-orange-500 font-semibold mb-6">
          Your Services
        </h3>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-gray-800 rounded-xl p-10 border border-gray-800  duration-300 shadow-lg"
              >
                <div className="mb-4">
                  <h4 className="text-lg text-white font-semibold flex items-center gap-2">
                    <BriefcaseBusiness className="text-orange-500 w-5 h-5" />
                    {service.name}
                  </h4>
                </div>

                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start gap-2">
                    <LetterText className="text-orange-500 w-5 h-5 mt-1" />
                    <p className="text-sm">
                      Description: {service.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee className="text-orange-500 w-5 h-5" />
                    <span className="text-orange-400 font-medium text-sm">
                      Price: {service.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CircleHelp className="text-orange-500 w-5 h-5" />
                    <span className="text-gray-400 text-sm">
                      Category: {service.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center shadow-md">
            <Package className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-lg">
              You haven't added any services yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
