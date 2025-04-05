"use client";
import { useState, useEffect } from "react";
import BannerTextHorizontal from "./BannerTextHorizontal";
import MenuItems from "../elements/menuItems";
import { IoIosSearch } from "react-icons/io";

export default function MenuSection({ menuData }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (menuData?.Categories?.length > 0 && !selectedCategory) {
      setSelectedCategory(menuData.Categories[0]?.CategoryName || ""); 
    }
  }, [menuData, selectedCategory]);

  // Flatten all menu items from all categories for searching across all categories
  const allMenuItems = menuData?.Categories?.flatMap((category) =>
    category.MenuItems.map((item) => ({
      ...item,
      categoryName: category.CategoryName, // Attach category info
    }))
  ) || [];

  // Filter menu items based on the search term
  const filteredMenuItems = searchTerm
    ? allMenuItems.filter((dish) =>
        dish.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : menuData?.Categories?.find((c) => c.CategoryName === selectedCategory)
        ?.MenuItems || [];

  // Find only the relevant categories based on the search term
  const filteredCategories = searchTerm
    ? menuData?.Categories?.filter((category) =>
        category.MenuItems.some((item) =>
          item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : menuData?.Categories;

  return (
    <div className="w-[95%] bg-white min-h-[100vh] flex flex-col items-center gap-8 py-8">
      {/* Banner Section */}
      <BannerTextHorizontal
        top="Menu"
        heading={menuData?.menu_type || "Our Menu"}
        description="All our food is 100% halal."
        button1Text="TABLE ORDER"
        button1Link="/table-order"
        button2Text="ONLINE SHOP"
        button2Link="/online-shop"
      />

      {/* Search Input */}
      <div className="w-full flex justify-center py-4">
        <div className="flex items-center rounded-xl gap-2 bg-gray-50 px-4 border overflow-hidden">
          <input
            className="py-3 w-[300px] text-lg font-semibold focus:outline-none bg-gray-50"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="flex items-center justify-center text-[24px]">
            <IoIosSearch />
          </button>
        </div>
      </div>

      {/* Category Buttons (Dynamically Filtered) */}
      <div className="flex flex-wrap justify-center gap-4">
        {filteredCategories?.sort(
          (a, b) => a.CategoryName.length - b.CategoryName.length
        ).map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedCategory(item.CategoryName);
              setSearchTerm(""); // Reset search when changing categories
            }}
            className={`lg:px-6 px-2 text-[12px] lg:text-[14px] py-2 rounded-lg transition duration-200 ${
              selectedCategory === item.CategoryName
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-orange-400 hover:text-white"
            }`}
          >
            {item.CategoryName}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="border-t-4 bg-zinc-50 rounded-lg border-dotted border-orange-400 w-full flex flex-col items-center">
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 grid-cols-1 lg:gap-4 gap-2 pt-4 lg:p-4">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.sort((a, b) => {
              const optionsLengthA = a.Options?.length || 0;
              const optionsLengthB = b.Options?.length || 0;
              return optionsLengthA - optionsLengthB;
            }).map((dish, index) => (
              <div key={index} className="lg:p-2 rounded-md">
                <MenuItems
                  name={dish.ItemName}
                  price={dish.Price}
                  description={dish.Description}
                  image={dish.ImageURL}
                  options={dish.Options || []}
                  extras={[]} 
                  SpiceLevel={dish.SpiceLevel}
                  id={dish.ItemID}
                  ImageURL={dish?.ImageURL}
                />
                <p className="text-sm text-gray-500 italic">{dish.categoryName}</p> 
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full">
              No matching dishes found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
