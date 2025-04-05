"use client";
import { useEffect, useState } from "react";
import Header from "../components/landing/Header";
import HeroSection from "../components/landing/HeroSection";
import HeroSlider from "../components/sliders/heroSlider";
import WineGlass from "../components/elements/wineglass";
import SocialsIcons from "../components/elements/socialsIcons";
import ContactUs from "../components/landing/Contactus";
import Footer from "../components/landing/Footer";
import ResDiaryWidget from "../components/elements/Resdiary";
import MediaGallery from "../components/landing/MediaGallery";

export default function GalleryPage() {
  // State to manage the visibility of the last paragraph
  const [galleryList,setGalleryList] = useState([])

  async function GetGalleryMedia() {
    try {
        const res = await fetch("/api/cloudinary/list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });

        if (!res.ok) throw new Error("Failed to fetch gallery media");

        const gallery_res = await res.json();
        // console.log(gallery_res)
        setGalleryList(gallery_res);
    } catch (error) {
        console.error("Error fetching gallery media:", error);
    }
}

  useEffect(()=>{
    GetGalleryMedia()
  },[])

  return (
    <div className="relative overflow-x-hidden bg-black ">
      {/* Fixed Header */}
      <div className="fixed z-10 w-full top-0">
        <Header currentSection="Gallery" />
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
          top="Our Restaurant Gallery"
          heading="We are ready to serve you"
          description=""
          nav={[
            { name: "HOME", link: "/" },
            { name: "Reservation", link: "/reservation" },
          ]}
        />
        {/* About Section */}
        <div className="w-[95%] h-auto relative rounded-[20px] container-shadow-top pb-[10vh] bg-white">
          {/* WineGlass */}
          <div className="absolute w-full flex-center top-[-40px]">
            <WineGlass />
          </div>
          <div className="w-full mx-auto px-6 flex-col-center  gap-4 mt-12">
                <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                  {galleryList?.map((item, index) => (
                      <div 
                          key={index}
                          // onClick={()=>console.log({item})} 
                          className="relative overflow-hidden rounded-lg">
                          {item.resource_type==="video" ? (
                              <video
                                  className="w-full  shadow-md rounded-lg"
                                  controls
                                  muted
                                  playsInline
                                  loop
                                  onMouseEnter={(e) => e.target.play().catch(() => {})}
                                  onMouseLeave={(e) => e.target.pause()}
                              >
                                  <source src={item?.secure_url} type="video/mp4" />
                                  Your browser does not support the video tag.
                              </video>
                          ) : (
                              <img 
                                  src={item?.secure_url} alt={`Media ${index}`} 
                                  className="w-full  shadow-md rounded-lg  hover:scale-105 transition-all duration-200" />
                          )}
                          
                      </div>
                  ))}
              </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
