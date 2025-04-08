"use client";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: string | { _id: string };
}

interface ProviderServicesProps {
  services: Service[];
}

export default function ProviderServices({ services }: ProviderServicesProps) {
  return (
    <section>
      <div className="container mx-auto p-4">
        <h3 className="text-2xl text-orange-500 font-semibold mt-6 mb-4">
          Your Services
        </h3>
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service._id} className="bg-gray-900 p-6 rounded-lg">
                <h4 className="text-white text-lg font-bold">{service.name}</h4>
                <p className="text-gray-400">{service.description}</p>
                <p className="text-orange-400 font-semibold mt-2">
                  ₹{service.price}
                </p>
                <p className="text-gray-500 text-sm">
                  Category: {service.category}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">You haven't added any services yet.</p>
        )}
      </div>
    </section>
  );
}
