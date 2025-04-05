"use client";
import { useState } from "react";
import WineGlass from "../elements/wineglass";
import BannerText from "./BannerText";
import { FaPlay } from "react-icons/fa";
// import {InviteImage} from "../../../public/inviteImage.jpg"
export default function InviteSection() {
  return (
    <div className="w-[95%] h-auto relative rounded-t-[20px] container-shadow-top">
      {/* WineGlass */}
      <div className="absolute w-full  flex-center top-[-40px] xl:top-[-50px] p-2">
        <WineGlass />
      </div>

      {/* Main Content */}
      <div className="flex-center  flex-col lg:flex-row  w-full h-auto lg:h-[80vh] gap-4 bg-white rounded-t-[20px] py-[40px] ">
        <div
          className="xl:w-1/3 lg:w-1/3 w-[95%] h-[500px] rounded-[20px] overflow-hidden flex-center"
          style={{
            backgroundImage: 'url(/inviteImage.jpg)', // Correct usage without the 'public' folder
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-[100%] h-[100%] backdrop-blur-[0px] flex-center cursor-pointer">
            {/* <div className="bg-white bg-opacity-30 play-pulse-animation flex-center rounded-full">
              <div className="w-[50px] h-[50px] flex-center rounded-full bg-white">
                <FaPlay />
              </div>
            </div> */}
          </div>
        </div>

        <div className="lg:w-1/2 xl:w-1/2 w-full">
          <BannerText
            top="About Us"
            heading="We invite you to visit our restaurant"
            description="Welcome to Tropical Café, Glasgow’s newest destination for an
                unforgettable Caribbean dining experience. Step into our vibrant
                space and let the rich aromas of authentic island spices
                transport you straight to the heart of the Caribbean. At
                Tropical Café, we pride ourselves on serving traditional dishes,
                from fiery jerk chicken to mouthwatering curried goat, all
                prepared with time-honoured recipes passed down through
                generations."
            button1Text="Read More"
            button1Link="/about"
          />
        </div>
      </div>
      <div className="flex-center  bg-white text-[40px] pb-8 ">
        <span className="w-[60%] border-t-8 border-dotted"></span>
      </div>
    </div>
  );
}
