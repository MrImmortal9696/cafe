"use client";
import { useState } from "react";
import Header from "../components/landing/Header";
import HeroSection from "../components/landing/HeroSection";
import HeroSlider from "../components/sliders/heroSlider";
import WineGlass from "../components/elements/wineglass";
import SocialsIcons from "../components/elements/socialsIcons";
import ContactUs from "../components/landing/Contactus";
import Footer from "../components/landing/Footer";
import MenuSection from "../components/landing/MenuSection";

export default function MenuPage() {
  // State to manage the visibility of the last paragraph
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="relative overflow-x-hidden bg-black  ">
      {/* Fixed Header */}
      <div className="fixed z-10 w-full top-0">
        <Header currentSection="Menu" />
      </div>

      <div className="flex flex-shrink-0  h-full flex-col items-center ">
        {" "}
        {/* Added padding for fixed header */}
        {/* Hero Section */}
        <HeroSection
          imagelink="https://i.pinimg.com/736x/f4/37/8b/f4378b53ce36da19e06d0f59941a3c63.jpg"
          blur={0}
          height={50}
          top="Our Menu"
          heading="Serving our best"
          description="Explore our authentic Caribbean flavors, crafted with bold spices and vibrant traditions."
          nav={[
            { name: "HOME", link: "/" },
            { name: "MENU", link: "/menu" },
          ]}
        />
        {/* About Section */}
        <div className="w-[95%] h-auto relative rounded-[20px] container-shadow-top pb-[10vh] bg-white">
          {/* WineGlass */}
          <div className="absolute w-full flex-center top-[-40px]">
            <WineGlass />
          </div>
          <div className="w-full mx-auto px-6 flex-col-center  gap-8 mt-12">
            {/* Title */}

            <div className="bg-[#F59D12] bg-opacity-30 px-4 py-2 rounded-xl">
              <SocialsIcons />
            </div>

            <div className="w-full flex-center">
              <MenuSection />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
