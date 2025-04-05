import { useState } from "react";
import { TbShoppingBagPlus } from "react-icons/tb";
import { GiChiliPepper } from "react-icons/gi";
import { useCart } from "@/app/contexts/CartContext";
import { IoMdClose } from "react-icons/io";

export default function MenuItems({
  id,
  name,
  price,
  vegetarian,
  description,
  image,
  options = [],
  extras = [],
  SpiceLevel,
  ImageURL
}) {
  const { addToCart } = useCart(); // Get addToCart function from context
  const [selections, setSelections] = useState([]); // Tracks selected options
  const [showOptions, setShowOptions] = useState(true);
  const [isAdded, setIsAdded] = useState(false); // Track animation trigger
  const [updatedSpiceLevel, setUpdatedSpiceLevel] = useState(SpiceLevel);
  const [hoveredSpiceLevel, setHoveredSpiceLevel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate the total price based on selected options
 // Calculate the total price based on selected options
  const totalPrice = parseFloat(
      (Number(price) || 0) +
      selections.reduce((sum, option) => sum + (parseFloat(option.price) || 0), 0)
    );

  // Handle option selection
  const handleOptionClick = (option) => {
    setSelections((prev) => {
      const isSelected = prev.find((selected) => selected.name === option.name);
      if (isSelected) {
        return prev.filter((selected) => selected.name !== option.name);
      } else {
        return [...prev, option];
      }
    });
  };

  function ShowItem() {
    console.log({
      id,
      name,
      price,
      vegetarian,
      description,
      image,
      options,
      extras,
      SpiceLevel:updatedSpiceLevel,
    });
  }

  // Handle adding item to cart
  const handleAddToCart = () => {
    // console.log(totalPrice,typeof(totalPrice))
    const cartItem = {
      id,
      name,
      basePrice: parseFloat(price) || 0, // Ensure base price is a number
      totalPrice, // Already a number from calculation
      options,
      selections,
      quantity: 1, // Default quantity
      image,
      SpiceLevel: updatedSpiceLevel,
      ImageURL
    };
    // console.log({cartItem})
    addToCart(cartItem);
    
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };
  

  return (
    <div
      className="flex-center flex-col  min-h-[150px] lg:min-h-[200px] w-full items-start 
                    lg:items-center lg:gap-4 bg-white border lg:rounded-[20px] 
                    shadow-lg  p-4 rounded-[20px] max-w-[500px]"
      // onClick={() => ShowItem()}
    >

          <div className={` lg:hidden  w-full h-[100px] rounded-t-xl overflow-clip cursor-pointer
                          ${ImageURL ? "visible":"hidden" }`}
                        onClick={() => setIsModalOpen(true)}
                        >
                        {ImageURL && (
                            <img src={ ImageURL} alt="Menu Item" className="w-full object-cover h-full" />
                        )}
            </div>

      <div className="flex  justify-between w-full  items-center gap-4">

          <div className={`hidden  w-full h-[100px] rounded-xl overflow-clip cursor-pointer
                          ${ImageURL ? "lg:flex":"hidden" }`}
                        onClick={() => setIsModalOpen(true)}
                        >
                        {ImageURL && (
                            <img src={ ImageURL} alt="Menu Item" className="w-full object-cover h-full" />
                        )}
            </div>

        <div className="flex flex-col items-start w-full lg:mt-4 ">
          <div className="flex items-center gap-2 lg:mb-2">
            <p className="text-[14px] lg:text-[16px] xl:text-[24px] font-semibold font-serif">{name}</p>
          </div>
          <p className="text-gray-600 text-start text-[8px] lg:text-sm mt-2">{description}</p>

          {SpiceLevel > 0 && (
            <div className="flex gap-2 mt-2 w-full">
            {Array(5)
          .fill(null)
          .map((_, index) => (
            <GiChiliPepper
              key={index}
              className={`text-2xl cursor-pointer transition-colors duration-300 ${
                index < (hoveredSpiceLevel ?? updatedSpiceLevel)
                  ? "text-red-500 hover:scale-125 transition-all duration-100"
                  : "opacity-50 text-red-300"
              }`}
              onClick={() => setUpdatedSpiceLevel(index + 1)}
              onMouseEnter={() => setHoveredSpiceLevel(index + 1)}
              onMouseLeave={() => setHoveredSpiceLevel(null)}
            />
          ))}
            </div>
          )}
        </div>



        {/* Price & Action Section */}
        <div className="flex flex-col items-center justify-center gap-2 h-[100px]  lg:w-[90px]">
          {totalPrice > 0 && (
            <span className="text-[14px] lg:text-[20px] font-bold text-gray-800">
              £{totalPrice}
            </span>
          )}
          <div className="relative flex-center">
            {isAdded && (
              <span className="absolute text-nowrap text-[12px] font-bold text-orange-500 animated-text">
                Added to Cart
              </span>
            )}
            <button
              disabled={totalPrice === 0 || null ? true : false}
              onClick={handleAddToCart}
              className="text-orange-500 text-[28px] hover:text-orange-600"
            >
              <TbShoppingBagPlus />
            </button>
          </div>
        </div>
      </div>
      {options.length > 0 && (
            <div
              className="font-semibold text-[12px]  w-full lg:text-[16px] flex items-center cursor-pointer hover:text-orange-500"
              onClick={() => setShowOptions((prev) => !prev)}
            >
              <span>{showOptions ? "Hide options" : "Show more options"}</span>
              <span className="p-2   transition-transform duration-200">
                {showOptions ? "▲" : "▼"}
              </span>
            </div>
          )}

      {options.length > 0 && showOptions && (
          <div className=" flex flex-col w-full ">
            <ul className="text-gray-600 text-[10px] lg:text-sm flex flex-col gap-2">
              {options.map((option, index) => (
                <li
                  key={index}
                  className={`flex items-center bg-gray-100 rounded-md px-2 py-1 border ${
                    selections.find((selected) => selected.name === option.name)
                      ? "bg-orange-200 shadow-lg"
                      : "border-gray-200 shadow-sm"
                  } cursor-pointer`}
                  onClick={() => handleOptionClick(option)}
                >
                  <span className="font-bold text-orange-500 mr-2">•</span>
                  <div className="flex w-full justify-between items-center">
                    <span>{option.name}</span>
                    <span className="font-semibold flex items-center justify-center gap-2">
                    £{parseFloat(option.price) } 
                      <span className="bg-orange-200 text-black flex items-center justify-center text-[18px] w-[25px] h-[25px] text-center rounded-lg">
                        {selections.find((selected) => selected.name === option.name)
                          ? "-"
                          : "+"}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                            onClick={() => setIsModalOpen(false)}>
                            <div className="relative p-4 bg-white rounded-lg shadow-lg w-[70%] lg:w-[30%] max-w-[500px] "
                                onClick={(e) => e.stopPropagation()}>
                                <button 
                                    className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-3xl"
                                    onClick={() => setIsModalOpen(false)}>
                                    <IoMdClose />
                                </button>
                                <img src={ImageURL} alt="Menu Item" className="w-full h-full object-cover rounded-lg" />
                            </div>
                        </div>
            )}
    </div>
  );
}
