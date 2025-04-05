"use client";
import { useState, useEffect } from "react";
import BannerText from "../landing/BannerText";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0); // Current slide
  const duration = 6000; // 6 seconds for automatic slide transition

  const slides = [
    {
      top: "Welcome to Tropical Café",
      heading: "Authentic Caribbean Food",
      description:
        "Step into our vibrant space and let the rich aromas of authentic island spices transport you straight to the heart of the Caribbean.",
      button1Text: "TABLE ORDER",
      button1Link: "/reservation",
    },
    {
      top: "Welcome to Tropical café",
      heading: "Reserve your table today",
      description:
        "Experience the flavors of the Caribbean with every bite—book your spot for an unforgettable dining journey!",
      button1Text: "Reservation",
      button1Link: "/reservation",
      button2Text: "Explore our Menu",
      button2Link: "/menu",
    },
  ];

  // Automatically cycle through slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, duration);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [activeIndex]);

  // Go to the next slide
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  // Go to the previous slide
  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative h-[500px] ">
      {/* Slider container */}
      <div className="carousel relative h-full flex items-center justify-center">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute transition-all duration-1000 ease-in-out ${
              index === activeIndex
                ? "opacity-100 visible translate-x-0"
                : "opacity-0 invisible translate-x-full"
            }`}
          >
            <BannerText
              top={slide.top}
              heading={slide.heading}
              description={slide.description}
              button1Text={slide.button1Text}
              button1Link={slide.button1Link}
              button2Text={slide.button2Text}
              button2Link={slide.button2Link}
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className=" bottom-4 flex gap-4">
        <button
          onClick={prevSlide}
          className="text-orange-400 transition-colors ease-in-out hover:bg-orange-200 hover:text-orange-500 active:bg-orange-300 active:text-orange-600 px-4 py-2 rounded-md transform hover:scale-110"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={nextSlide}
          className="text-orange-400 transition-colors ease-in-out hover:bg-orange-200 hover:text-orange-500 active:bg-orange-300 active:text-orange-600 px-4 py-2 rounded-md transform hover:scale-110"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
