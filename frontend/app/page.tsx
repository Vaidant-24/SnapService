import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItworks";
import ServiceCategories from "@/components/home/ServiceCategories";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceCategories />
      <HowItWorks />
      <Testimonials />
    </>
  );
}
