import React from "react";
import { Service } from "../type/Service";

type ProviderInfoProps = {
  service: Service;
};

const ProviderInfo = ({ service }: ProviderInfoProps) => {
  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold text-orange-400 mb-2 border-b border-gray-700 pb-1">
          Provider Details
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <p>
            <span className="text-gray-300">Name:</span>{" "}
            {service.providerId?.firstName + " " + service.providerId?.lastName}
          </p>
          <p>
            <span className="text-gray-300">Phone:</span>{" "}
            {service.providerId?.phone}
          </p>
          <p>
            <span className="text-gray-300">Email:</span>{" "}
            {service.providerId?.email}
          </p>
          <p>
            <span className="text-gray-300">Experience:</span>{" "}
            {service.providerId?.experience ?? "N/A"} yr
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderInfo;
