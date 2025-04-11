import Link from "next/link"; // Assuming Next.js routing
import ServiceCard from "../ui/ServiceCard";

const services = [
  { id: 1, name: "Cleaning", iconType: "cleaning" },
  { id: 2, name: "Appliance Repair", iconType: "repair" },
  { id: 3, name: "Painting", iconType: "painting" },
  { id: 4, name: "Shifting", iconType: "shifting" },
  { id: 5, name: "Plumbing", iconType: "plumbing" },
  // { id: 6, name: "Electric", iconType: "electric" },
  { id: 7, name: "Carpentry", iconType: "carpentry" },
];

const ServiceCategories = () => {
  return (
    <section className="py-12 px-6 mb-6">
      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
        Our <span className="text-orange-500">Services</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            name={service.name}
            iconType={service.iconType}
          />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/services">
          <button className="px-6 py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition duration-300">
            View All Services
          </button>
        </Link>
      </div>
    </section>
  );
};

export default ServiceCategories;
