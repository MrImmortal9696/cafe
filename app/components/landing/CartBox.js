import { useState, useEffect } from "react";
import { useCart } from "@/app/contexts/CartContext";
import CartItems from "../elements/cartitems";
import Link from "next/link";

export default function CartBox() {
  const { 
    cart, 
    incrementQuantity, 
    decrementQuantity, 
    removeFromCart, 
    getTotalCost, 
    getUniqueItemsCount, 
    clearCart 
  } = useCart();

  const [isLoading, setIsLoading] = useState(false);

  // Function to create a unique key for each item based on its options
  const createCartItemKey = (item, options) => {
    return `${item.id}-${options.map(option => option.name).join('-')}`;
  };

  // Ensure calculations are correct by converting values to numbers
  const subtotal = parseFloat(getTotalCost()) || 0;

  // Simulate a checkout process
  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/cart"; // Redirect to cart page after loading
    }, 2000);
  };

  return (
    <div className="lg:absolute lg:w-[400px] xl:w-[500px] w-full max-h-[70vh] lg:right-0 top-[60px] 
                    font-serif overflow-hidden rounded-xl flex flex-col  shadow-2xl border border-slate-200">
      
      <div className="w-full h-[100px] lg:h-[150px] p-2 flex-center flex-col gap-2 rounded-t-lg shadow-xl bg-zinc-100">
        <span className="w-[40px] h-[8px] rounded-lg bg-orange-400"></span>
        <span className="text-[14px] lg:text-[18px] xl:text-[22px]">Here's your cart!</span>
      </div>

      <div className="w-full px-4 max-h-[65%]  flex flex-col justify-start bg-white overflow-y-scroll no-scrollbar">
        {cart.length > 0 ? (
          cart.map((item) => (
            <CartItems 
              item={item} 
              key={createCartItemKey(item, item.selections)} 
              decrementQuantity={decrementQuantity} 
              incrementQuantity={incrementQuantity} 
              removeFromCart={removeFromCart}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">Your cart is empty</div>
        )}
      </div>

      <div className="w-full rounded-b-xl px-6 mx-auto max-h-[300px] bg-slate-50 flex flex-col p-6 
                      lg:text-[18px] font-sans font-normal text-[20px]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[14px] font-medium">Subtotal ({getUniqueItemsCount()} items)</span>
          <div className="flex flex-col text-gray-600">
            <span className="font-bold text-lg">£ {subtotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between text-[10px] lg:text-[12px] xl:text-[20px] font-medium">
          <button
            className="lg:p-3 p-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition-colors ease-in-out duration-300"
            onClick={clearCart} 
          >
            Clear Cart
          </button>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className={`p-3 flex items-center justify-center bg-orange-400 text-white rounded-lg hover:bg-orange-500 
                        transition-colors ease-in-out duration-300 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Checkout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
