export async function GetGalleryMedia(setGalleryList,setUpdatedMediaList) {
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