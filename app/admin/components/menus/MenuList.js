"use client";
import React, { useEffect, useState } from "react";
import { FaFileDownload } from "react-icons/fa";
import { convertJsonToCsv } from "@/libs/jsonTocsv"; // Assuming you have this function

import MenuListElement from "./MenuListElement";

export default function MenuList({
  menu_types,
  menu_categories,
  menuItems,
  handleEdit,
  handleDelete,
  selectedSortOption,
  searchItem
}) {
  const [menuTable, setMenuTable] = useState([]);

  const tableHeaders = [
    "Dish Image",
    "Dish Name",
    "Menu Type",
    "Category",
    "Description",
    "Price",
    "Options",
    "Available",
    "Actions",
  ];

  // Convert the menu data to a flat table format and filter by search term
  const mapMenuDataToTable = (menu_types, menu_categories, menuItems, searchTerm) => {
    const rows = [];

    // Iterate through each menu type
    menu_types.forEach((type) => {
      // Filter based on selectedSortOption
      if (selectedSortOption.name === "Menu Types" && selectedSortOption.option !== type.MenuTypeName) {
        return; // Skip if it doesn't match the selected Menu Type
      }

      menu_categories
        .filter((category) => category.MenuTypeID === type.MenuTypeID)
        .forEach((category) => {
          // Filter based on selectedSortOption
          if (selectedSortOption.name === "Menu Categories" && selectedSortOption.option !== category.CategoryName) {
            return; // Skip if it doesn't match the selected Category
          }

          menuItems
            .filter((item) => item.CategoryID === category.CategoryID)
            .forEach((item) => {
              // Check if the search term matches any field
              if (searchItem !=="" &&
                (item.ItemName && item.ItemName.toLowerCase().includes(searchItem?.toLowerCase())) ||
                (category.CategoryName && category.CategoryName.toLowerCase().includes(searchItem?.toLowerCase())) ||
                (type.MenuTypeName && type.MenuTypeName.toLowerCase().includes(searchItem?.toLowerCase())) ||
                (item.Description && item.Description.toLowerCase().includes(searchItem?.toLowerCase()))
              ) {
                rows.push({
                  ItemID:item.ItemID,
                  MenuTypeName: type.MenuTypeName, // Menu type
                  ImageURL:item.ImageURL,
                  CategoryName: category.CategoryName, // Category name
                  CategoryID:item.CategoryID,
                  ItemName: item.ItemName, // Dish name
                  Description: item.Description, // Dish description
                  Price: item.Price || "-", // Dish price or fallback to '-'
                  ImagePublicID:item.ImagePublicID,
                  Options: item.Options, // Parsed options
                  IsAvailable: item.IsAvailable, // Availability status
                  SpiceLevel: item.SpiceLevel, // Spice level
                });
              }
            });
        });
    });

    return rows;
  };

  useEffect(() => {
    // Filter data based on searchItem and set it to the menuTable
    const tableData = mapMenuDataToTable(menu_types, menu_categories, menuItems, searchItem);
    setMenuTable(tableData);
  }, [menu_types, menu_categories, menuItems, selectedSortOption, searchItem]);

  // Export the table data as CSV (using your convertJsonToCsv function)
  const handleExport = () => {
    convertJsonToCsv(menuTable, "menu.csv");
  };

  return (
    <div className="p-4 relative bg-white w-[95%] mx-auto h-[calc(100vh-300px)] overflow-y-scroll no-scrollbar rounded-lg">
      <div className="text-[20px] my-2 w-full flex justify-end">
        <button onClick={handleExport} className="flex items-center flex-col">
          <span className="text-[12px]">Export </span>
          <FaFileDownload />
        </button>
      </div>

      <div className="grid grid-cols-9 gap-4 font-bold text-lg mb-4 text-center">
        {tableHeaders.map((header, index) => (
          <div key={index} className="text-gray-800">
            {header}
          </div>
        ))}
      </div>

      <div className="">
        {menuTable.map((row, index) => (
          <MenuListElement row={row} key={index} handleEdit={handleEdit} handleDelete={handleDelete}/>
        ))}
      </div>
    </div>
  );
}
