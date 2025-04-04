"use client";
import React, { useState, useEffect } from "react";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  location?: string;
  rating: number;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    quote:
      "The cleaning service was exceptional! My home has never looked better. Very professional and thorough.",
    author: "Shreyas Roy",
    location: "Mumbai",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "Needed urgent plumbing help, and they arrived within the hour. Fixed the leak quickly and efficiently. Highly recommend!",
    author: "Rohan Patel",
    location: "Delhi",
    rating: 4,
  },
  {
    id: 3,
    quote:
      "The painters did a fantastic job transforming our living room. They were punctual, tidy, and the finish is perfect.",
    author: "Priyank Singh",
    location: "Bangalore",
    rating: 4,
  },
  {
    id: 4,
    quote:
      "Outstanding electrical work! They rewired my entire home safely and efficiently. The team was knowledgeable and professional.",
    author: "Anjali Sharma",
    location: "Chennai",
    rating: 5,
  },
  {
    id: 5,
    quote:
      "Hired them for landscaping and the results exceeded my expectations. My garden looks beautiful and the pricing was reasonable.",
    author: "Vikram Mehta",
    location: "Hyderabad",
    rating: 5,
  },
  {
    id: 6,
    quote:
      "The HVAC installation team was prompt and courteous. They explained everything clearly and left no mess behind.",
    author: "Pooja Malhotra",
    location: "Pune",
    rating: 4,
  },
  {
    id: 7,
    quote:
      "Had my roof repaired after the monsoon. Great attention to detail and quality materials used. No more leaks!",
    author: "Karan Verma",
    location: "Kolkata",
    rating: 5,
  },
  {
    id: 8,
    quote:
      "Their handyman services are reliable and affordable. Fixed multiple issues around my home in just one visit.",
    author: "Neha Gupta",
    location: "Ahmedabad",
    rating: 4,
  },
];

// Individual Testimonial Card Component
const TestimonialCard: React.FC<Testimonial> = ({
  quote,
  author,
  location,
  rating,
}) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={index < rating ? "text-yellow-400" : "text-gray-300"}
    >
      ★
    </span>
  ));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col h-full transition-all duration-300 hover:shadow-lg">
      {/* Quotation Mark Icon */}
      <div className="mb-4">
        <svg
          className="w-8 h-8 text-orange-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      {/* Testimonial Quote */}
      <p className="text-gray-600 italic mb-4 flex-grow">&quot;{quote}&quot;</p>
      {/* Rating Stars */}
      <div className="mb-4 text-lg">{stars}</div>
      {/* Author Info */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="font-semibold text-gray-800">{author}</p>
        {location && <p className="text-sm text-gray-500">{location}</p>}
      </div>
    </div>
  );
};

// Main Testimonials Section Component
const Testimonials: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesPerView = { mobile: 1, tablet: 2, desktop: 3 };
  const [viewportWidth, setViewportWidth] = useState(0);
  const totalSlides = testimonialsData.length;

  // Determine how many testimonials to show based on screen size
  const getVisibleCount = () => {
    if (viewportWidth < 640) return slidesPerView.mobile;
    if (viewportWidth < 1024) return slidesPerView.tablet;
    return slidesPerView.desktop;
  };

  // Calculate max number of slides
  const maxSlideIndex = totalSlides - getVisibleCount();

  // Update viewport width on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [maxSlideIndex, viewportWidth]);

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlideIndex : prev - 1));
  };

  // Navigate to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
  };

  // Go to specific slide
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Get visible testimonials based on current slide and visible count
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const visibleTestimonials = testimonialsData.slice(
    currentSlide,
    currentSlide + getVisibleCount()
  );

  return (
    <section className="py-16 px-6 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-gray-600 text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="text-orange-500">Customers</span> Say
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Real stories from satisfied clients who trust our services.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white p-2 rounded-full shadow-md text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Testimonials Slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentSlide * (100 / getVisibleCount())
                }%)`,
              }}
            >
              {testimonialsData.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="px-4 flex-shrink-0"
                  style={{ width: `${100 / getVisibleCount()}%` }}
                >
                  <TestimonialCard
                    id={testimonial.id}
                    quote={testimonial.quote}
                    author={testimonial.author}
                    location={testimonial.location}
                    rating={testimonial.rating}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white p-2 rounded-full shadow-md text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Next testimonial"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: maxSlideIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? "bg-orange-500" : "bg-gray-300"
              } transition-colors duration-300`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
