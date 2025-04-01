import ServiceCard from "../ui/ServiceCard";

const services = [
  { id: 1, name: "Cleaning", iconType: "cleaning" },
  { id: 2, name: "Repair", iconType: "repair" },
  { id: 3, name: "Painting", iconType: "painting" },
  { id: 4, name: "Shifting", iconType: "shifting" },
  { id: 5, name: "Plumbing", iconType: "plumbing" },
  { id: 6, name: "Electric", iconType: "electric" },
];

const ServiceCategories = () => {
  return (
    <section className="py-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            name={service.name}
            iconType={service.iconType}
          />
        ))}
      </div>
    </section>
  );
};

export default ServiceCategories;
