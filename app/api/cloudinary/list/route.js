import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(req) {
  try {
    const { prefix = "uploads/" } = await req.json(); // Ensure fetching only from 'uploads' folder

    // Fetch images
    const images = await cloudinary.v2.api.resources({
      type: "upload",
      prefix,
      resource_type: "image", // Fetch images
    });

    // Fetch videos
    const videos = await cloudinary.v2.api.resources({
      type: "upload",
      prefix,
      resource_type: "video", // Fetch videos
    });

    // Merge images & videos and extract only secure_url and public_id
    const media = [...images.resources, ...videos.resources].map(item => ({
      secure_url: item.secure_url,
      public_id: item.public_id,
      resource_type:item.resource_type
    }));

    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch media", details: error.message },
      { status: 500 }
    );
  }
}
