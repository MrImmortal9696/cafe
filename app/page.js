"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "./components/landing/Header";
import HeroSection from "./components/landing/HeroSection";
import InviteSection from "./components/landing/InviteSection";
import FeaturesSection from "./components/landing/FeaturesSection";
import TeamSection from "./components/landing/TeamsSection";
import NumericalData from "./components/landing/NumbericalData";
import WorkingHoursSection from "./components/landing/WorkingHoursSection";
import MenuSection from "./components/landing/MenuSection";
import TestimonialsSection from "./components/landing/TestimonialsSection";
import ContactUs from "./components/landing/Contactus";
import Footer from "./components/landing/Footer";
import HeroSectionSlider from "./components/landing/HeroSectionSlider";
import AboutChefSection from "./components/landing/AboutChefSection";
import ResDiaryWidget from "./components/elements/Resdiary";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [chef, setChef] = useState("");
  // Track scroll position and update the state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // Adjust scroll threshold as needed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const herobannerdata = [
    {
      1: {
        top: "Welcome to Tropical Café",
        heading: "Authentic Caribbean Food",
        description: "Come and dine with us or order anything",
        button1Text: "TABLE ORDER",
        button1Link: "#",
        button2Text: "ONLINE SHOP",
        button2Link: "#",
        height: "big",
      },
      2: {
        top: "Welcome to Tropical Café",
        heading: "Authentic Caribbean Food",
        description: "Come and dine with us or order anything",
        button1Text: "TABLE ORDER",
        button1Link: "#",
        button2Text: "ONLINE SHOP",
        button2Link: "#",
        height: "big",
      },
    },
  ];

  return (
    <div className="relative bg-black overflow-x-hidden no-scrollbar">
      {/* Header with dynamic top positioning */}
      <div
        className={`fixed z-10 w-full ${
          isScrolled ? "top-0" : "top-4"
        } transition-all duration-300`}
      >
        <Header isScrolled={isScrolled} />
      </div>

      <div className="flex flex-col items-center">
        <HeroSectionSlider
          top="Welcome to Tropical Café"
          heading="Authentic Caribbean Food"
          description="Come and dine with us or order anything"
          button1Text="TABLE ORDER"
          button1Link="/reservation"
          height={"big"}
        />
        <InviteSection />

        <FeaturesSection />

        <TeamSection setChef={setChef} chef_name={chef} />

        <AboutChefSection chef={chef} />
        
        {/* <NumericalData /> */}
        <WorkingHoursSection />
        {/* <MenuSection /> */}
        <TestimonialsSection />
        {/* <ContactUs id="Contact" /> */}
        <Footer />
      </div>
    </div>
  );
}