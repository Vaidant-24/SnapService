import SearchBar from "../ui/SearchBar";

const Hero = () => {
  return (
    <section className="py-16 px-6 md:py-24 flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-4xl">
        <span className="text-orange-500">SnapService</span>
      </h1>
      <h2 className="text-4xl md:text-6xl font-bold mb-4 max-w-4xl">
        Find Your Perfect <span className="text-orange-500">Home</span> Service
      </h2>
      <p className="text-gray-600 text-lg mb-8 max-w-2xl">
        Connecting you with trusted professionals for all your home needs
      </p>
      <SearchBar />
    </section>
  );
};

export default Hero;
