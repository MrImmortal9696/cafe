import IconText from "../elements/iconText";
import BannerTextHorizontal from "./BannerTextHorizontal";
import MenuIcon from "../../../public/icons/1.svg";
import IngredientsIcon from "../../../public/icons/2.svg";
import CookIcon from "../../../public/icons/3.svg";

export default function FeaturesSection() {
  return (
    <div className="w-[95%] bg-white relative  min-h-[50vh] container-shadow-top flex-col-center gap-[100px] py-8 ">
      <BannerTextHorizontal
        top="Features"
        heading="Why people choose us?"
        description="At Tropical Café, we bring the heart of the Caribbean to Glasgow with unmatched quality and vibrant flavors!"
        button1Text="TABLE ORDER"
        button1Link
        button2Text="ONLINE SHOP"
        button2Link=""
      />
      <div className="w-full flex lg:flex-row flex-col gap-4 justify-between px-4">
        <IconText
          icon={MenuIcon}
          title={"Menu for every taste"}
          description={
            "From fiery jerk chicken to sweet plantains, our diverse menu offers something for everyone, whether you’re a seasoned Caribbean food lover or a first-time explorer."
          }
        />
        <IconText
          icon={IngredientsIcon}
          title={"Always fresh ingredients"}
          description={
            "We source the finest, freshest ingredients, including authentic spices directly from the Caribbean, to ensure every dish bursts with bold, irresistible flavors."
          }
        />
        <IconText
          icon={CookIcon}
          title={"Experienced chefs"}
          description={
            "Our chefs bring years of expertise and a deep passion for traditional Caribbean cuisine, crafting every dish with care and authenticity."
          }
        />
      </div>
      <div className="flex-center w-full bg-white text-[40px] pb-8 ">
        <span className="w-[60%] border-t-8 border-dotted"></span>
      </div>
    </div>
  );
}
