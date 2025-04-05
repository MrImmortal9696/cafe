import { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";

export default function CartItems({ item, decrementQuantity, incrementQuantity, removeFromCart }) {
  const [showOptions, setShowOptions] = useState(false);

  const calculateTotalPrice = (item) => {
    return (Number(item.basePrice) || 0) +
      item.selections.reduce((sum, option) => sum + (Number(option.price) || 0), 0);
  };

  return (
    <div
    key={`${item.id}-${item.selections.map(option => option.name).join('-')}`} 
    className="flex hover:bg-orange-50 rounded-xl justify-between items-end relative p-4 border-b ">
      <div>
        
        <p className="font-semibold lg:text-[20px] text-[14px]">{item.name}</p>
        <p className="text-gray-600 font-medium text-[14px]">£ {item.totalPrice}</p>

        {/* Display selected options below item name */}
        <div className="mt-2 text-gray-600 w-full">
          {item.selections.length > 0 ? (
            <ul className="text-sm flex w-full  flex-col gap-2">
              {item.selections.map((option, index) => (
                <li
                  key={index}
                  className="flex items-center bg-gray-200 w-full  rounded-md px-2 py-1 border border-gray-200 shadow-sm"
                >
                  <span className="font-bold text-orange-500 mr-2">•</span>
                  <div className="flex w-full gap-4 justify-between items-center">
                    <span>{option.name}</span>
                    <span className="font-semibold flex items-center justify-center gap-2">
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
      <div className="flex items-center gap-2 h-full  ">
        <button 
          onClick={() => decrementQuantity(item)} // Pass the full item
          className="px-2 text-[20px] bg-gray-100 rounded-lg"
        >
          -
        </button>
        <span className="text-[20px] font-medium">{item.quantity}</span>
        <button 
          onClick={() => incrementQuantity(item)} // Pass the full item
          className="px-1 text-[20px] bg-gray-100 rounded-lg"
        >
          +
        </button>
        <button 
          onClick={() => removeFromCart(item)} // Pass the full item
          className="px-2 py-1 -top-1 -right-3 absolute text-[20px] text-red-400 rounded-lg"
        >
          <IoIosCloseCircle/>
        </button>
      </div>
    </div>
  );
}
