import { useState } from "react";
import Link from "next/link";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { FaChevronDown } from "react-icons/fa";
import { useCart } from "@/app/contexts/CartContext"; // Assuming CartContext is set up to manage cart state
import CartSection from "../landing/CartBox";
import { useSession } from "next-auth/react";
import { FaRegUser } from "react-icons/fa";
import UserBox from "../landing/UserBox";
import CartBox from "../landing/CartBox";
export default function HeaderMenu({MenutypeList}) {
  const [menuDropdown, setMenuDropdown] = useState(false); // State for dropdown visibility
  const [cartVisible, setCartVisible] = useState(false); // State for cart visibility
  const { cart } = useCart(); // Get cart from context
  const [profileVisible,setProfileVisible] = useState(false)

  const data = [
    { name: "Home", path: "/" },
    { name: "Tables", path: "/tables" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Gallery", path: "/gallery" },
  ];

  function toggleMenuDropdown() {
    setMenuDropdown((prev) => !prev);
  }

  function toggleCartVisibility() {
    setCartVisible((prev) => !prev); // Toggle cart visibility
  }
  // console.log({MenutypeList})
  return (
    <div className="flex relative  flex-col px-4 items-start backdrop-blur-md bg-opacity-70 text-white bg-black w-full rounded-lg gap-4 py-2">
      {/* Regular Links */}
      {data.map((item, index) => (
        <a
          key={index}
          href={item.path} // Fixed `item.link` to `item.path`
          className="hover:text-orange-500 transition duration-200"
        >
          {item.name}
        </a>
      ))}

      {/* Menu with Dropdown */}
      <div className="flex flex-col gap-2 overflow-hidden">
        {/* Parent Menu Item */}
        <div
          onClick={toggleMenuDropdown}
          className="flex items-center cursor-pointer hover:text-orange-500 transition duration-200 gap-2"
        >
          <span>Menu</span>
          <FaChevronDown
            className={`transition-transform duration-300 ${
              menuDropdown ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown Links with Smooth Height Transition */}
        <div
          className={`flex flex-col transition-[max-height] duration-500 ease-in-out ${
            menuDropdown ? "max-h-[300px]" : "max-h-0"
          }`}
        >
          {MenutypeList.map((item , index) => (
          <Link key={index} href={`/menu/${item.slug}`} className="block px-4 py-1 flex-between items-center text-white text-md">
            <span>{item.MenuTypeName}</span>
           
          </Link>
        ))} 
        </div>
        {/* <pre>{JSON.stringify(MenutypeList,null,2)}</pre> */}
      </div>

      {/* Reservation and Shopping Bag */}
      <div className=" relative flex items-center w-[90%]  justify-between  ">
        <a href="/reservation" className="orange-button">
          Reservation
        </a>



        {/* Cart Section - Toggle visibility */}
       
      </div>
      
    </div>
  );
}
