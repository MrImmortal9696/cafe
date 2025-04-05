"use client"
import { FaRegBell } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import { FaPowerOff } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
export default function AdminHeader({ setSearchItem,searchItem ,showSearch = true,headlingLabel}) {
  const {data:session} =  useSession()
  // This will update the search term when the user types
  const handleChange = (e) => {
    setSearchItem(e.target.value); // Pass the search term to the parent component
  };

  // const button_icons = [
  //   { icons: <FaRegBell />, path: "/" },
  //   { icons: <FaRegMessage />, path: "/" },
  //   { icons: <IoIosSettings />, path: "/" },
  // ];

  return (
    <div className="bg-white flex justify-between px-4 items-center h-[100px] w-full">
      {/* Search Input */}
      <div className=" flex items-center rounded-xl  ">
       {showSearch &&
        <div className="flex items-center rounded-xl gap-2 bg-gray-50 px-4 border overflow-hidden">
          <input
            className="py-3 w-[300px] text-lg font-semibold focus:outline-none bg-gray-50"
            placeholder="Search"
            value={searchItem}
            onChange={handleChange} // Call handleChange when input changes
          />
          <button className="flex items-center justify-center text-[24px]">
            <IoIosSearch />
          </button>
        </div>
        }
        {
          headlingLabel &&
          <div>
            <span className="text-4xl text-zinc-800 font-bold px-4">{headlingLabel}</span>
          </div>
        }
      </div>

      {/* Action Buttons (Bell, Message, Settings) */}
      <div className="flex gap-4 items-center">
        <div className="flex flex-col font-medium">
          <span className="font-semibold">
            Hi, {session.user?.name}
          </span>
          <span>
            {session.user?.email}
          </span>
        </div>
        <div className="w-[40px] h-[40px] flex-center rounded-full text-white bg-red-500">
          <button onClick={()=>signOut()}>
          <FaPowerOff />
          </button>
        </div>
      </div>
    </div>
  );
}
