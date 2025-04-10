import React from "react";
import { Service } from "../type/Service";

type ServiceInfoProps = {
  service: Service;
};

const ServiceInfo = ({ service }: ServiceInfoProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-orange-400 mb-2 border-b border-gray-700 pb-1">
        Service Information
      </h2>
      <p>
        <span className="font-semibold">Name:</span> {service.name}
      </p>
      <p>
        <span className="font-semibold">Description:</span>{" "}
        {service.description}
      </p>
      <p>
        <span className="font-semibold">Category:</span> {service.category}
      </p>
      <p>
        <span className="font-semibold text-orange-400">Price:</span> ₹
        {service.price}
      </p>
    </div>
  );
};

export default ServiceInfo;
