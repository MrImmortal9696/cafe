"use client";
import { useState } from "react";

export default function MenuFilters({
            currentListOption,
            listTypeOptions,
            functionButtons,
            SortOptions,
            setSelectedSortOption,
            selectedSortOption,
            setSearchItem,
            
        }) {
  const [selectedSortButton, setSelectedSortButton] = useState(""); // Track which button is active

  return (
    <div className="w-[95%] flex flex-col justify-between  h-[120px] px-4 items-center">
      <div className="w-full flex gap-4 text-lg">
        {listTypeOptions.map((option, index) => (
          <button
            key={index}
            onClick={()=>{option.function();
                setSearchItem("")}} 
            className={`${
              currentListOption === option.code
                ? "text-orange-400 underline-offset-1 border-b-2 border-orange-400"
                : "text-zinc-700"
            } font-semibold px-3 py-1`}
          >
            {option.title}
          </button>
        ))}
      </div>
      {/* <span>{JSON.stringify(currentListOption,null,2)}</span> */}
      <div className={`w-full flex  ${currentListOption === "menu_items" ? "justify-between":"justify-end"}`}>
        {/* Sort Options Dropdown */}
        <div className={`flex items-center gap-2 ${currentListOption === "menu_items" ? "":"hidden"}`}>
          {SortOptions.map((option, index) => (
            <div key={index} className="relative">
              <button
                onClick={() =>
                  setSelectedSortButton((prev) =>
                    prev === option.name ? "" : option.name
                  )
                }
                className="border-2 flex items-center gap-2 bg-white rounded-lg pr-6 p-2"
              >
                <span>{option.name} </span>
                <span>{selectedSortButton === option.name ? "▲" : "▼"}</span>

              </button>
              {selectedSortButton === option.name && option.options && (
                <div
                  className={`mt-2 absolute z-10 flex ${
                    option.options?.length > 0 ? "h-[300px]" : "h-0"
                  } overflow-y-scroll no-scrollbar w-[300px] flex-col rounded-lg py-2 bg-white bg-opacity-70 backdrop-blur-sm font-semibold gap-2 shadow-md`}
                >
                  {option.options?.map((item, idx) => (
                    <span
                      key={idx}
                      onClick={() => {
                        setSelectedSortOption({
                          name: option.name,
                          option: item.CategoryName || item.MenuTypeName,
                        });
                        setSelectedSortButton(""); // Close dropdown after selection
                      }}
                      className="bg-slate-100 hover:bg-slate-200 p-3 mx-2 rounded-lg cursor-pointer"
                    >
                      {item.CategoryName || item.MenuTypeName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Function Buttons */}
        <div className="flex items-center gap-2">
          {functionButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.function}
              className="flex items-center py-3 px-4 hover:bg-orange-600 bg-orange-400 text-white gap-2 rounded-lg"
            >
              <span>{button.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
