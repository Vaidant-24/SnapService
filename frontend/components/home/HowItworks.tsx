const steps = [
  {
    id: 1,
    title: "Search for Services",
    description: "Find the service you need with our easy-to-use search tool.",
  },
  {
    id: 2,
    title: "Select a Professional",
    description: "Choose from a list of verified professionals.",
  },
  {
    id: 3,
    title: "Book & Confirm",
    description:
      "Easily schedule the service and receive instant confirmation.",
  },
  {
    id: 4,
    title: "Get the Job Done",
    description: "Sit back and relax while the professional completes the job.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 px-6 md:py-24 text-center bg-transparent mb-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12">
          How It <span className="text-orange-500">Works</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
          {steps.map((step) => (
            <div
              key={step.id}
              className="p-10 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-md hover:bg-white hover:scale-105 hover:border-orange-200 border border-gray-200"
            >
              <div className="text-orange-500 text-5xl font-extrabold mb-2">
                {step.id}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
