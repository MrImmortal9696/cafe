"use client";
import { useState } from "react";
import BannerTextHorizontal from "./BannerTextHorizontal";
import { barMenu } from "@/app/data/menu";
import MenuItems from "../elements/menuItems";

export default function BarMenuSection() {
  // State to track the selected category
  const [selectedCategory, setSelectedCategory] = useState(barMenu[0].name);

  return (
    <div className="w-[95%] bg-white min-h-[100vh] flex flex-col items-center gap-8 py-8">
      {/* Banner Section */}
      <BannerTextHorizontal
        top="Menu"
        heading="Our Drink Menu"
        description=""
        button1Text="TABLE ORDER"
        button1Link="/table-order"
        button2Text="ONLINE SHOP"
        button2Link="/online-shop"
      />

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {barMenu.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(item.name)}
            className={`px-6 py-2 rounded-lg  transition duration-200 ${
              selectedCategory === item.name
                ? "orange-button"
                : "not-orange-button"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Dishes Display */}
      <div className=" grid lg:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-4 border-t-8 p-4 border-dotted">
        {barMenu
          .find((category) => category.name === selectedCategory)
          .dishes.map((dish, index) => (
            <div key={index} className="p-4  rounded-md ">
              <MenuItems
                name={dish.name}
                price={dish.price}
                description={dish.description}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
