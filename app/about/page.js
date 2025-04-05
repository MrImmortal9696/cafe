"use client";
import { useState } from "react";
import Header from "../components/landing/Header";
import HeroSection from "../components/landing/HeroSection";
import HeroSlider from "../components/sliders/heroSlider";
import WineGlass from "../components/elements/wineglass";
import SocialsIcons from "../components/elements/socialsIcons";
import Footer from "../components/landing/Footer";
import FeaturesSection from "../components/landing/FeaturesSection";

export default function AboutPage() {
  // State to manage the visibility of the last paragraph
  const [showMore, setShowMore] = useState(false);
  const visionCss = {
    heading: "lg:text-[32px] text-[24px] text-[#F59D12] font-semibold ",
    content: "lg:text-[18px] text-[14px] opacity-60 font-semibold",
  };
  return (
    <div className="relative overflow-x-hidden bg-black  ">
      {/* Fixed Header */}
      <div className="fixed z-10 w-full top-0">
        <Header currentSection="About" />
      </div>

      {/* Main Content */}

      <div className="flex flex-shrink-0  h-full flex-col items-center ">
        {" "}
        {/* Added padding for fixed header */}
        {/* Hero Section */}
        <HeroSection
          imagelink="https://i.pinimg.com/736x/f4/37/8b/f4378b53ce36da19e06d0f59941a3c63.jpg"
          blur={0}
          height={50}
          top="About us"
          heading="Story of our restaurant"
          description=""
          nav={[
            { name: "HOME", link: "/" },
            { name: "ABOUT US", link: "/about" },
          ]}
        />
        {/* About Section */}
        <div className="w-[95%]  relative rounded-t-[20px] container-shadow-top pb-[10vh] bg-white h-full">
          {/* WineGlass */}
          <div className="absolute w-full flex-center top-[-40px]">
            <WineGlass />
          </div>
          <div className="w-full mx-auto max-w-[900px] px-6 flex-col-center  gap-8 mt-12 h-full">
            {/* Title */}
            {/* <div className="flex-col-center gap-4">
              <div className="flex-col-center">
                <div className="w-[40px] h-[4px] rounded-full bg-orange-500"></div>
                <h1 className="text-[36px] font-bold">About Us</h1>
              </div>
              <h2 className="text-[24px] opacity-70 font-semibold">
                Our Story
              </h2>
              <div className="bg-[#F59D12] bg-opacity-30 px-4 py-2 rounded-xl">
                <SocialsIcons />
              </div>
            </div> */}

            {/* Description */}
            <div className="flex-col-center gap-8">
              <p className="lg:text-[20px] text-[16px] text-center font-semibold opacity-70">
                Welcome to Tropical Café, Glasgow’s newest destination for an
                unforgettable Caribbean dining experience. Step into our vibrant
                space and let the rich aromas of authentic island spices
                transport you straight to the heart of the Caribbean. At
                Tropical Café, we pride ourselves on serving traditional dishes,
                from fiery jerk chicken to mouthwatering curried goat, all
                prepared with time-honoured recipes passed down through
                generations.
              </p>

              {/* Button to reveal more content */}
              {!showMore && (
                <button
                  onClick={() => setShowMore(true)} // Update state on click
                  className="orange-button "
                >
                  Read More...
                </button>
              )}

              {/* Additional Paragraph (hidden initially) */}
              {showMore && (
                <p className="lg:text-[20px] text-[16px] text-center font-semibold opacity-70">
                   We go the extra mile to ensure every dish is as
                  authentic as it gets. That’s why we source our spices directly
                  from the Caribbean, bringing the vibrant, rich flavours
                  straight from the islands to your plate. From the heat of
                  scotch bonnet peppers to the fragrant notes of pimento and
                  allspice, each ingredient is carefully selected to guarantee
                  that every bite delivers the true, bold taste of the
                  Caribbean. Whether you’re a fan of bold, spicy flavours or
                  simply looking to explore something new, Tropical Café offers
                  a true taste of the islands, right here in Glasgow. Come for
                  the food, stay for the warmth and hospitality of the Caribbean
                  spirit!
                </p>
              )}

              <div className="flex flex-col gap-4 text-center xl:min-h-[30vh] justify-around">
                <div>
                  <h2 className={visionCss.heading}>Vision</h2>
                  <p className={visionCss.content}>
                    To bring the vibrant flavors and culture of the Caribbean to
                    life through our food and service.
                  </p>
                </div>
                <div>
                  <h2 className={visionCss.heading}>Mission</h2>
                  <p className={visionCss.content}>
                    To offer authentic Caribbean cuisine, provide exceptional
                    customer service, and contribute to the local community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[95%] flex-center min-h-[50px] bg-white  rounded-b-[20px] overflow-hidden">
          <FeaturesSection />
        </div>
        <div className=" flex-center">
          <Footer />
        </div>
      </div>
    </div>
  );
}
