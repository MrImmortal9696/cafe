import ChefsImages from "../elements/chefsImages";
import BannerTextHorizontal from "./BannerTextHorizontal";
// import Image from "next/image";
import brian from "../../../public/landing/brian.jpg";
import hasan from "../../../public/landing/hasan.jpg";

const chefsData = [
  {
    image: brian,
    name: "Brian Thomas",
    post: "Master Chef",
    description:
      "Brian has over 20 years of experience in culinary arts, specializing in Caribbean cuisine.",
  },
  {
    image: hasan, // Imported module
    name: "Hasan Defour",
    post: "Renowned Caribbean Chef",
    description:
      "Hasan brings his expertise from the heart of the Caribbean, creating traditional and innovative dishes.",
  },
];

export default function TeamSection({ setChef, chef_name }) {
  // Function to handle "Know More" click
  const handleKnowMore = (chef) => {
    setChef((currentChef) => (currentChef === chef.name ? "" : chef.name));
  };

  return (
    <div className="w-[95%] bg-white relative min-h-[50vh] container-shadow-top flex flex-col items-center gap-[100px] py-8">
      {/* Banner Text */}
      <BannerTextHorizontal
        top="Team"
        heading="They are ready to treat you"
        description="At Tropical Café, our team is a family of passionate chefs, friendly servers, and talented baristas."
        button1Text="TABLE ORDER"
        button1Link="/reservation"
        button2Text=""
        button2Link="/online-shop"
      />

      {/* Chefs Section */}
      <div className="flex flex-wrap justify-center gap-4 px-2">
        {chefsData.map((chef, index) => (
          <div key={index} className="flex flex-col items-center">
            <ChefsImages
              image={chef.image} // Pass imported image
              name={chef.name}
              post={chef.post}
            />
            <button
              onClick={() => handleKnowMore(chef)}
              className={`mt-4 font-semibold px-4 py-2 rounded-md transition-all duration-200 ease-in-out ${
                chef_name === chef.name
                  ? "text-white bg-orange-400 translate-y-0"
                  : "text-orange-400 bg-orange-100 hover:text-white hover:-translate-y-2 hover:bg-orange-300"
              }
							`}
            >
              {chef_name === chef.name ? "Close" : "Know More"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
