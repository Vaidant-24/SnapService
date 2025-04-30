const HowItWorks = () => {
  const steps = [
    { title: "1. Browse Services", desc: "Explore trusted home professionals" },
    {
      title: "2. Book Instantly",
      desc: "Schedule services at your convenience",
    },
    { title: "3. Rate & Review", desc: "Share your experience to help others" },
  ];

  return (
    <div className="mt-8 max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-white text-center">
      {steps.map((step, i) => (
        <div key={i} className="bg-white/5 p-4 rounded-xl shadow-md">
          <h4 className="font-bold text-lg text-orange-400 mb-2">
            {step.title}
          </h4>
          <p className="text-sm">{step.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default HowItWorks;
