"use client";
import { useState, useEffect } from "react";
import HeroSlider from "../sliders/heroSlider";
import { heroImages } from "@/app/data/menu";

export default function HeroSectionSlider({ top, blur = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div
      className={`w-full h-[95vh] flex items-center justify-center relative bg-[#0A0A0A] font-semibold `}
    >
      {/* Background Image Slider */}
      <div
        className="flex justify-start absolute left-0 h-full w-[400vw] transition-transform duration-1000 ease-in-out "
        style={{
          transform: `translateX(-${currentIndex * 100}vw)`,
        }}
      >
        {heroImages.map((image, index) => (
          <div
            key={index}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              width: "100vw", // Full viewport width
              height: "95vh", // Full viewport height
              filter: `blur(${blur}px)`,
            }}
            className="shrink-0 "
          ></div>
        ))}
      </div>

      {/* Foreground Content */}
      <div className="relative w-full h-full flex-center bg-gradient-to-b from-transparent to-black">
        {top && (
          <div className="absolute bg-opacity-30 w-full md:w-[80%] xl:w-[70%] lg:h-auto h-full flex-center lg:items-start lg:justify-start lg:backdrop-blur-[0px] backdrop-blur-[6px] text-white">
            <div className="xl:w-2/5 lg:w-3/5 w-full">
              <HeroSlider />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
