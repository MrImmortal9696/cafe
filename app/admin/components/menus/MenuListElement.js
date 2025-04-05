"use client"
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { GiChiliPepper } from "react-icons/gi";
import { FaCameraRetro } from "react-icons/fa6";
import { LuCameraOff } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

import MenuItemImageUploader from "../images/MenuItemImageUploader";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";


export default function MenuListElement({ row, handleEdit, handleDelete }) {
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [uploadedImageURL, setUploadedImageURL] = useState("");
    const [deleteMode,setDeleteMode] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDeleteBody = (row) => {
        const delete_body = {
            mode: "delete",
            item_type: "menu_items",
            data: {
                ItemID: row.ItemID,
                name: row.ItemName,
                type: "Menu Item",
                dependent_name: "",
                number: "",
                table_name: "MenuItems",
                row
            }
        };
        handleDelete(delete_body);
    };

    async function deleteImage(public_id, ItemID) {
        const isConfirmed = window.confirm("Are you sure you want to delete this image?");
        
        if (!isConfirmed) {
          console.log("Image deletion canceled.");
          return { error: "Deletion canceled by user" };
        }
      
        try {
          const response = await fetch("/api/cloudinary", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_id, resource_type: "image" }), // Default to "image"
          });
      
          if (!response.ok) {
            throw new Error("Failed to delete media");
          }
      
          const result = await response.json();
      
          // Call HandleUsers function
        //   console.log({row})
          await HandleUsers({ mode: "delete", item_name: "MenuItemImage", data: { ItemID: ItemID } });
      
          // Reload the page after successful deletion
          window.location.reload();
      
          return result;
        } catch (error) {
          console.error("Error deleting image:", error);
          return { error: error.message };
        }
      }
      

    return (
        <div
        
         className="transition-all duration-800 ease-in-out grid grid-cols-9 gap-4 p-2 py-4 items-start text-center hover:bg-orange-50 border-b border-gray-300">
            
            <div className="relative w-full h-[100px] col-span-1 rounded-lg overflow-clip">
            <div className=" w-full h-full cursor-pointer rounded-xl overflow-clip "
                    onClick={() => setIsModalOpen(true)}>
                    {row.ImageURL && (
                        <img src={uploadedImageURL || row.ImageURL} alt="Menu Item" className="rounded-lg w-full object-cover h-full" />
                    )}
                </div>
               
                {row.ImageURL && <img src={uploadedImageURL || row.ImageURL} alt="Menu Item" className="w-full object-cover h-full" />}

                
                 { row.ImageURL && showImageUpload && (
                    <div className="">
                            <div className="w-full h-full absolute hover:bg-black hover:bg-opacity-35 transition-all duration-200 top-0"></div>
                            <button
                                onClick={() => deleteImage(row.ImagePublicID,row.ItemID)}
                                className="absolute text-[18px] bg-red-500 rounded-full text-white p-1 top-2 right-2">
                                <IoMdClose />
                            </button>
                    </div> 
                    )}
                <div>

                </div>
            </div>

            <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">{row.ItemName}</span>
                {row.SpiceLevel > 0 && (
                    <span className="flex">
                        {Array(row.SpiceLevel).fill(null).map((_, index) => (
                            <GiChiliPepper 
                                key={index} 
                                className={`${index <= row.SpiceLevel - 1 ? "text-red-500" : "opacity-70 text-red-300"} text-2xl`} 
                            />
                        ))}
                    </span>
                )}
            </div>

            <div className="">{row.MenuTypeName}</div>
            <div className="">{row.CategoryName}</div>
            <div className="">{row.Description}</div>
            <div className="font-semibold text-lg">
                {row.Price > 0 ? `£${row.Price}` : "-"}
            </div>

            <div className="flex flex-col items-center text-start">
                {row.Options?.length > 0 ? (
                    <ul className="list-disc flex flex-col gap-2 w-full ml-4">
                        {row.Options.map((option, idx) => (
                            <li key={idx} className="flex bg-slate-100 w-full rounded-lg items-center py-1 px-2 justify-between gap-2">
                                <span>{option.name}</span>
                                <span className="font-semibold">£{option.price}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    "No options"
                )}
            </div>

            <div className="">{row.IsAvailable == 1 ? "Yes" : "No"}</div>

            <div className="text-2xl justify-center flex gap-1">
                <button className="hover:bg-orange-400 hover:text-white p-2 rounded-lg transition-all duration-200" 
                    onClick={() => handleEdit(row)}>
                    <FiEdit />
                </button>
                <button className="hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-lg transition-all duration-200" 
                    onClick={() => handleDeleteBody(row)}>
                    <MdDelete />
                </button>
                <button className="hover:bg-zinc-900 text-zinc-700 hover:text-white p-2 rounded-lg transition-all duration-200" 
                    onClick={() => {
                        setShowImageUpload((prev) => !prev)}}>
                     <FaCameraRetro /> 
                </button>
            </div>

            <div className={`${showImageUpload ? "max-h-[500px]" : "max-h-0"} col-span-8 flex-center overflow-hidden transition-all duration-[1.2s] ease-in-out`}>
                <MenuItemImageUploader setUploadedImageURL={setUploadedImageURL} ItemID={row.ItemID} />
            </div>


            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}>
                    <div className="relative p-4 bg-white rounded-lg shadow-lg w-[30%] max-w-[500px] "
                        onClick={(e) => e.stopPropagation()}>
                            
                        <button 
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl font-bold bg-white rounded-full"
                            onClick={() => setIsModalOpen(false)}>
                            <IoMdClose />
                        </button>
                        <img src={uploadedImageURL || row.ImageURL} alt="Menu Item" className="w-full h-full object-cover rounded-lg" />
                    </div>
                </div>
            )}
        </div>
    );
}
