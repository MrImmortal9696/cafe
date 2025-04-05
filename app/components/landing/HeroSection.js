import Image from "next/image";
import BannerText from "./BannerText";
import BannerTextHorizontal from "./BannerTextHorizontal";
export default function HeroSection({
  imagelink = "https://i.pinimg.com/736x/0b/6e/ee/0b6eeee058aef8b6269c9010b9814d35.jpg",
  top,
  heading,
  description,
  button1Text,
  button1Link,
  button2Text,
  button2Link,
  nav,
  blur = 0,
}) {
  return (
    <div
      className={`w-full h-[75vh]
      } flex items-center  justify-center relative bg-[#0A0A0A] font-semibold `}
    >
      {/* Background Image with Blur */}
      <div
        style={{
          backgroundImage: `url(${imagelink})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          width: "100%",
          height: "75vh",

          filter: `blur(${blur}px)`, // Corrected filter syntax
        }}
        className="absolute top-0 left-0"
      ></div>

      <div className="relative w-full h-full flex-center bg-gradient-to-b from-transparent to-black">
        {/* Foreground Content */}
        {top && (
          <div className=" absolute bg-opacity-30 w-full lg:w-[70%] lg:h-auto h-full flex-center lg:items-start lg:justify-start  lg:backdrop-blur-[0px] backdrop-blur-[6px] text-white">
            <div className=" w-full ">
              <BannerTextHorizontal
                top={top}
                heading={heading}
                description={description}
                button1Text={button1Text}
                button1Link={button1Link}
                button2Text={button2Text}
                button2Link={button2Link}
                nav={nav}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
