"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { redirect } from "next/navigation";
import { MdAdd, MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { SessionChecker } from "@/libs/sessionChecker";
import AdminSideBar from "../components/AdminSideBar";
import AdminHeader from "../components/AdminHeader";
import MediaUploader from "../components/images/MediaUploader";
import MenuItemImageUploader from "../components/images/MenuItemImageUploader";

export default function AdminGalleryPage() {
    const { data: session, status } = useSession();
    const modalRef = useRef(null);
    const router = useRouter();
    const [permission, setPermission] = useState(null);
    const [galleryList, setGalleryList] = useState([]);
    const [updatedMediaList,setUpdatedMediaList] = useState([])
    const [deleteMode, setDeleteMode] = useState(false);
    const [addMode, setAddMode] = useState(false);
    const [mediaToDelete, setMediaToDelete] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading state


    // Check session permissions
    useEffect(() => {
        if (status === "loading") return;

        if (!session || session?.user?.role === "Customer") {
            redirect("/");
            return;
        }

        async function GetSessionCheck() {
            const hasPermission = await SessionChecker(session, "/admin/gallery");
            setPermission(hasPermission);
            if (!hasPermission) redirect("/");
        }

        GetSessionCheck();
    }, [session, status]);

    // Fetch gallery media (images & videos)
    async function GetGalleryMedia() {
        try {
            const res = await fetch("/api/cloudinary/list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });

            if (!res.ok) throw new Error("Failed to fetch gallery media");

            const gallery_res = await res.json();
            // console.log(gallery_res)
            setGalleryList(gallery_res);
            setUpdatedMediaList(gallery_res)
        } catch (error) {
            console.error("Error fetching gallery media:", error);
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
            setAddMode(false);
          }
        }
      
        if (addMode) {
          document.addEventListener("mousedown", handleClickOutside);
        } else {
          document.removeEventListener("mousedown", handleClickOutside);
        }
      
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [addMode]);

    useEffect(() => {
        if (session && permission) {
            GetGalleryMedia();
        }
    }, [session, permission]);

    useEffect(()=>{
        setUpdatedMediaList(galleryList)
    },[galleryList])


    // Open delete confirmation modal
    function confirmDelete(media) {
        setMediaToDelete(media);
    }

    // Delete media (image/video) from Cloudinary
    async function deleteMedia() {
        if (!mediaToDelete) return;
    
        // console.log("Deleting media:", mediaToDelete); // Debugging
    
        // Optimistically update UI
        setUpdatedMediaList(prevList => prevList.filter(media => media.public_id !== mediaToDelete.public_id));
    
        try {
            const response = await fetch("/api/cloudinary", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ public_id: mediaToDelete.public_id, resource_type: mediaToDelete.resource_type }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to delete media");
            }
    
            // Refresh gallery after successful deletion
            await GetGalleryMedia();
        } catch (error) {
            console.error("Error deleting media:", error.message);
            // Rollback UI if deletion fails
            setUpdatedMediaList(prevList => [...prevList, mediaToDelete]);
        } finally {
            setMediaToDelete(null);
        }
    }
    

    async function handleUpload() {
        setAddMode(false);
        await GetGalleryMedia(); // Ensure UI updates with the latest media
    }

    function isVideo(url) {
        return /\.(mp4|mov|avi|wmv|flv|webm)$/i.test(url);
    }

    if (status === "loading" || permission === null) {
        return (
            <div className="flex justify-center items-center h-screen text-2xl">
                Loading...
            </div>
        );
    }

    if (!session || !permission) {
        return null;
    }

    return (
        <div>
            <div className="relative w-[100vw] h-[100vh] flex ">
                <div className="w-[15%] h-full flex justify-center">
                    <AdminSideBar AdminOption={"gallery"} />
                </div>
                <div className="w-[85%] h-full flex flex-col gap-2 ">
                    <AdminHeader showSearch={false} headlingLabel={"Gallery"} />

                    <div className="w-full h-[calc(100vh-100px)] overflow-y-scroll no-scrollbar bg-zinc-100 flex flex-col justify-start gap-8 p-8">
                        {/* Buttons for delete mode & add */}
                        <div className="text-xl flex gap-4 w-full justify-end text-white">
                            <button
                                onClick={() => setDeleteMode(prev => !prev)}
                                className={`p-2 rounded-full ${deleteMode ? "bg-red-500" : "bg-orange-400"}`}>
                                <MdDelete />
                            </button>
                            <button onClick={() => setAddMode(true)} className="p-2 bg-orange-400 rounded-full">
                                <MdAdd />
                            </button>
                        </div>

                    {/* {console.log({updatedMediaList,galleryList})} */}

                        {/* Gallery Grid Layout (Supports Images & Videos) */}
                        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                            {updatedMediaList.map((item, index) => (
                                <div 
                                    key={index}
                                    // onClick={()=>console.log({item})} 
                                    className="relative overflow-hidden rounded-lg">
                                    {isVideo(item.secure_url) ? (
                                        <video
                                            className="w-full  shadow-md rounded-lg"
                                            controls
                                            muted
                                            playsInline
                                            loop
                                            onMouseEnter={(e) => e.target.play().catch(() => {})}
                                            onMouseLeave={(e) => e.target.pause()}
                                        >
                                            <source src={item?.secure_url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <img 
                                            src={item?.secure_url} alt={`Media ${index}`} 
                                            className="w-full  shadow-md rounded-lg  hover:scale-105 transition-all duration-200" />
                                    )}
                                    {deleteMode && (
                                        <>
                                            <div className="w-full h-full absolute hover:bg-black hover:bg-opacity-35 transition-all duration-200 top-0"></div>
                                            <button
                                                onClick={() => confirmDelete(item)}
                                                className="absolute text-[18px] bg-red-500 rounded-full text-white p-1 top-2 right-2">
                                                <IoMdClose />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* <pre>{JSON.stringify(galleryList,null,2)}</pre> */}
            </div>

            {/* Modal for Adding Media */}
            {addMode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div ref={modalRef}>
                    <MediaUploader onUpload={handleUpload} />
                    </div>
                </div>
                )}
            {/* Modal for Delete Confirmation */}

            {mediaToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
                        <button onClick={() => setMediaToDelete(null)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
                            <IoMdClose size={24} />
                        </button>
                        <p className="text-xl font-bold mb-4">Are you sure you want to delete this?</p>
                        {mediaToDelete.resource_type === "video" ? (
                            <video controls className="w-full rounded-md mb-4">
                                <source src={mediaToDelete.secure_url} type="video/mp4" />
                            </video>
                        ) : (
                            <img src={mediaToDelete.secure_url} alt="To be deleted" className="w-full rounded-md mb-4" />
                        )}
                        <div className="flex gap-4">
                            <button onClick={deleteMedia} className="bg-red-500 text-white py-2 px-4 rounded-md w-full">Yes, Delete</button>
                            <button onClick={() => setMediaToDelete(null)} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md w-full">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
