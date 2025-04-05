"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { SlOptionsVertical } from "react-icons/sl";
import { FaChevronDown } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import Logo from "../../../public/NewLogo.svg";
import HeaderMenu from "../elements/headerMenu";
import { useCart } from "@/app/contexts/CartContext";
import CartBox from "./CartBox";
import UserBox from "./UserBox";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import MenuTypesList from "@/app/admin/components/menus/MenuTypesList";

export default function Header({ currentSection = "Home", isScrolled }) {
  const headerLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Tables", path: "/tables" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Gallery", path: "/gallery" },

  ];

  const { cart } = useCart();
  const [menu, setMenu] = useState(false);
  const [dropdowns, setDropdowns] = useState({ menu: false, takeaway: false });
  const [cartVisible, setCartVisible] = useState(false);
  const [mobileCartVisible, setMobileCartVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [mobileProfileVisible, setMobileProfileVisible] = useState(false);
  const cartRef = useRef(null);
  const profileRef = useRef(null);
  const dropdownRef = useRef(null);
  const [MenutypeList,setMenuTypeList] = useState([])

  useEffect(()=>{
    async function GetMenuTypesList(){
      const res = await HandleUsers({mode:"get",item_type:"menuTypes",data:{}})
      setMenuTypeList(res)
      // console.log({res})
    }
    GetMenuTypesList()

  },[menu])

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartVisible(false);
        setMobileCartVisible(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileVisible(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdowns({ menu: false, takeaway: false }); // Close dropdowns
      }
    }
  
    if (cartVisible || profileVisible || dropdowns.menu || dropdowns.takeaway) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartVisible, profileVisible, mobileCartVisible, dropdowns]);


  const renderDropdown = (type, MenutypeList) =>
    dropdowns[type] && (
      <div ref={dropdownRef} className="absolute top-full lg:text-[14px] xl:text-[18px] w-[250px] left-0 bg-white rounded-lg overflow-hidden shadow-lg border mt-2 z-50">
        {MenutypeList.map((item, index) => (
          <Link key={index} href={`/menu/${item.slug}`} className="block px-4 py-2 flex-between items-center hover:bg-orange-100 text-gray-700">
            <span>{item.MenuTypeName}</span>
          </Link>
        ))}
      </div>
    );


  return (
    <header
      className={`relative bg-white px-8 mx-4 ${!isScrolled ? "rounded-lg" : "rounded-b-lg rounded-t-0"} flex xl:h-[80px] h-[60px] justify-between items-center xl:text-[14px] lg:text-[10px] font-semibold text-gray-700 relative`}
      style={{ boxShadow: "0px 10px 0px rgba(0, 0, 0, 0.2)" }}
    >
      <Link href={"/"} className="flex-center overflow-hidden">
        <Image src={Logo} alt="Logo" width={100} height={100} className="xl:w-[180px] lg:w-[150px] w-[100px]" />
      </Link>
      <div className="flex items-center gap-4 lg:hidden ">
          <div className="relative  flex-center  " ref={profileRef}>
            <button onClick={() => setMobileProfileVisible(prev => !prev)} className="xl:text-[24px] text-[20px] cursor-pointer"><FaRegUser /></button>
          </div>

          <div className="relative flex " ref={cartRef}>
            <button onClick={() => setMobileCartVisible(prev => !prev)} 
                    className="xl:text-[30px] text-[24px] cursor-pointer">
                      <LiaShoppingBagSolid />
            </button>
            {cart.length > 0 && <div className="absolute top-[-8px] right-[-10px] text-[12px] bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center">{cart.reduce((total, item) => total + item.quantity, 0)}</div>}
          </div>
          <div onClick={() => setMenu((prev) => !prev)} className=" cursor-pointer">
        <SlOptionsVertical />
      </div>
      </div>



        <div className="mt-2 absolute top-full w-full left-0">
          {menu && 
            <HeaderMenu 
              MenutypeList={MenutypeList}
              className="rounded-xl absolute mt-2 top-[60px]  left-0 w-full shadow-xl shadow-[#00000087] z-50" />}
        </div>

      <nav className="lg:flex hidden h-full items-center space-x-6 transition-colors duration-200 ease-in">
        {headerLinks.map(({ name, path }, index) => (
          name === "Menu" ? (
            <div key={index} className="relative h-full flex items-center px-4 cursor-pointer select-none" onClick={() => setDropdowns(prev => ({ ...prev, menu: !prev.menu }))}>
              <span className={`flex items-center gap-1 hover:text-orange-500 transition-all duration-200 ease-in 
                ${currentSection === name ? "border-b-orange-500 text-orange-500 border-b-4" : "border-b-transparent"}`}>
                {name.toUpperCase()}<FaChevronDown className={`transition-transform duration-300
                  ${dropdowns.menu ? "rotate-180" : ""}`} />
                  </span>
              {renderDropdown("menu",MenutypeList)}
            </div>
          ) : (
            <Link key={index} href={path} className={`h-full flex items-center px-4 hover:text-orange-500 transition-all duration-200 ease-in ${currentSection === name ? "border-b-orange-500 text-orange-500 border-b-4" : "border-b-transparent"}`}>{name.toUpperCase()}</Link>
          )
        ))}
      </nav>

      <div className="lg:flex hidden items-center gap-4">
        <div className="relative h-full flex items-center px-4 cursor-pointer select-none" onClick={() => setDropdowns(prev => ({ ...prev, takeaway: !prev.takeaway }))}>
          <div className="orange-button">TAKEAWAY</div>
          <div className="top-16 absolute">
          {renderDropdown("takeaway",MenutypeList)}
          </div>
          
        </div>

        <a className="orange-button" href="/reservation">RESERVATION</a>
        
        <div className="flex gap-4 px-2 items-center">
          <div className="relative  flex-center  " ref={profileRef}>
            <button onClick={() => setProfileVisible(prev => !prev)} className="xl:text-[24px] text-[20px] cursor-pointer"><FaRegUser /></button>
            {profileVisible && <UserBox className="absolute  right-0" />}
          </div>

          <div className="relative flex h-full " ref={cartRef}>
            <button onClick={() => setCartVisible(prev => !prev)} className="xl:text-[30px] text-[24px] cursor-pointer"><LiaShoppingBagSolid /></button>
            {cart.length > 0 && <div className="absolute top-[-8px] right-[-10px] text-[12px] bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center">{cart.reduce((total, item) => total + item.quantity, 0)}</div>}
            {
              cartVisible &&
                <div className=" mt-2 top-full relative bg-red-100 w-full left-0 h-full" >
                  <CartBox />
                  </div>
          }
          
          </div>

        </div>
       
      </div>

      {
            mobileCartVisible &&
              <div className="mt-2 top-full absolute w-full left-0 h-full"  ref={cartRef}>
                  <CartBox />
              </div>
      }
      {
            mobileProfileVisible &&
              <div className="mt-2 top-full absolute w-full left-0 h-full"  ref={cartRef}>
                  <UserBox />
              </div>
      }  

    </header>
  );
}
