import { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { GiChiliPepper } from "react-icons/gi";

export default function CartElement({ item, decrementQuantity, incrementQuantity, removeFromCart }) {
  const [showOptions, setShowOptions] = useState(false);

  const calculateTotalPrice = (item) => {
    return (Number(item.basePrice) || 0) +
      item.selections.reduce((sum, option) => sum + (Number(option.price) || 0), 0);
  };

  return (
    <div
    
    key={`${item.id}-${item.selections.map(option => option.name).join('-')}`} 
    className="flex relative justify-between items-center p-4 border-b shadow-lg bg-zinc-50 min-h-[100px] rounded-xl">
      <div className="w-[70%] ">
        <div>
        {/* Display item name and total price */}
        <p className="font-semibold lg:text-[20px] text-[14px]">{item.name}</p>
        <p className="text-gray-600 font-medium text-[14px]">£ {item.totalPrice}</p>
        {item.SpiceLevel > 0 && (
          <div className="flex gap-2 mt-2 w-full">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <GiChiliPepper
                  key={index}
                  className={`lg:text-2xl text-xl ${
                    index < item.SpiceLevel ? "text-red-500" : "opacity-50 text-red-300"
                  }`}
                />
              ))}
          </div>
        )}
        </div>
        {/* Display selected options below item name */}
        <div className="mt-2 text-gray-600 w-full">
          {item.selections.length > 0 ? (
            <ul className="text-sm flex w-full  flex-col gap-2">
              {item.selections.map((option, index) => (
                <li
                  key={index}
                  className="flex items-center bg-gray-100 w-[90%] rounded-md px-2 py-1 border border-gray-200 shadow-sm"
                >
                  <span className="font-bold text-orange-500 mr-2">•</span>
                  <div className="flex w-full gap-4 justify-between items-center">
                    <span className=" lg:text-[16px] text-[12px] w-[50%]">{option.name}</span>
                    <span className="font-semibold lg:text-[14px] text-[12px] flex items-center justify-center gap-2">
                      £ {option.price}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* Quantity and remove buttons */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => decrementQuantity(item)} // Pass the full item
          className="w-[24px] h-[24px] flex-center text-[20px] bg-gray-200 rounded-lg"
        >
          -
        </button>
        <span className="text-[20px] font-medium">{item.quantity}</span>
        <button 
          onClick={() => incrementQuantity(item)} // Pass the full item
          className="w-[24px] h-[24px] flex-center text-[20px] bg-gray-200 rounded-lg"
        >
          +
        </button>
        
      </div>
      <button 
          onClick={() => removeFromCart(item)} // Pass the full item
          className="absolute top-0  right-0  text-[24px] text-red-400 rounded-lg"
        >
          <IoIosCloseCircle/>
        </button>
    </div>
  );
}
