"use client"
import { useState } from "react";
import { IoRemoveOutline } from "react-icons/io5";
import { FaArrowRotateRight } from "react-icons/fa6";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";

export default function AllSideChair({
  id,
  directions = "all",
  name = "A",
  state = "available",
  number=6,
  Editmode,
  chairsSize,
  setChairSize,
  chairOrientation,
  setChairOrientation,
  handleChairEdit,
  floor,
  X_Coordinate,
  Y_Coordinate,
  handleChairIncrement,
  handleChairDecrement,
  handleRotate,
  deleteMode,
  handleDeleteTable
}) {
  // const [chairsSize,setChairSize] = useState(ChairSize)
  // const [chairsSize,setChairSize] = useState()
  // const [chairOrientation,setChairOrientation] = useState({chair:0,name:0})
  // Define possible directions and their corresponding positions
 
  // If directions is a string (like "all"), convert it to an array
  const directionArray =
    typeof directions === "string" ? [directions] : directions;

  function statusColor(state) {
    switch (state) {
      case "available":
        return "bg-blue-200";
      case "reserved":
        return "bg-red-200";
      case "occupied":
        return "bg-yellow-200";
    }
  }

  

  return (
    <div className={`relative flex-center gap-4  w-full h-full `}>
    
        
          <div className=" mb-4 flex-col-center gap-1 h-full w-full " style={{transform:`rotate(${chairOrientation}deg)`}}>
            {/* Top chair */}
            <div className="flex gap-[10px]">
            {Array.from({ length: chairsSize}).map((_, index) => (
                    <span key={index}  className="w-[20px] h-[8px] rounded-full border border-black"
                    ></span>
              ))}
               </div>
            {/* Table with side chairs */}
            <div className="flex-center relative gap-1">
            
                <span className="w-[8px] h-[25px] rounded-lg border border-black"></span>
              

              {/* Table */}
              <div className={`relative h-[50px] rounded-lg border-black border
                text-[14px] font-semibold flex-center flex-col
               shadow-[0px_0px_40px_rgba(0,0,0,0.0)] ${statusColor(state)} bg-opacity-30 backdrop-blur-sm`}
               style={{
                width: `${chairsSize* 26 + 55}px`, // Dynamically calculated width
                height: "80px", // Fixed height
              }}
              >
                {/* style={{transform:`rotate(-${chairOrientation}deg)`}}  */}
                <div 
                  style={{transform:`rotate(${chairOrientation=== 90  ? -90 : 0}deg)`}}
                className={`relative font-bold text-md  w-[40px] h-[40px] flex-center  rounded-full ${statusColor(state)}`} >
                  <span>{name}</span>
                  {deleteMode &&
                    <button 
                    onClick={()=>handleDeleteTable(id)}
                    className="absolute -top-4 -right-4 text-red-500 text-[30px] w-[30px] h-[30px]">
                    <IoIosCloseCircle/>
                  </button>}
                </div>
              </div>

            
                <span className="w-[8px] h-[25px] rounded-lg border border-black"></span>
              
            </div>

            {/* Bottom chair */}            
            <div className="flex gap-[10px]">
            {Array.from({ length: chairsSize}).map((_, index) => (
                    <span key={index}  className="w-[20px] h-[8px] rounded-full border border-black"
                    ></span>
              ))}
               </div>
               {Editmode && 
                <div
               style={{transform:`rotate(${chairOrientation=== 90  ? 0 : 0}deg)`}}
                className="top-[80px] bg-white bg-opacity-90 px-2 w-[140px] rounded-xl justify-center backdrop-blur-[1px] absolute flex gap-4 text-2xl">
                  <button onClick={()=>handleChairIncrement()}>+</button>
                  <button onClick={()=>handleChairDecrement()}>-</button>
                  <button onClick={()=>handleRotate()} ><FaArrowRotateRight/></button>
                  <button onClick={()=>handleChairEdit({
                    id,name,chairsSize,floor,X_Coordinate,Y_Coordinate,
                    chairOrientation:chairOrientation.chair})} ><MdEdit/></button>
                  {/* <button onClick={()=>handleRotate("left")} ><FaArrowRotateLeft/></button> */}
                </div>
                }
          </div>
        
    
    </div>
  );
}
