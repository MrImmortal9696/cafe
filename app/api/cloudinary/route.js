import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "uploads"; // Default folder is "uploads"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Determine resource type (image or video)
    const isVideo = file.type.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    const uploadResponse = await cloudinary.v2.uploader.upload(base64String, {
      folder, // Upload to the specified folder
      resource_type: resourceType,
    });

    // console.log(uploadResponse);

    return NextResponse.json(
      {
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id, // Return the public ID
        resourceType,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const { public_id, resource_type = "image" } = await req.json(); // Default to "image"

    if (!public_id) {
      return NextResponse.json({ error: "Public ID is required" }, { status: 400 });
    }

    const result = await cloudinary.v2.uploader.destroy(public_id, { resource_type });

    if (result.result !== "ok") {
      return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
    }

    return NextResponse.json({ message: "Media deleted successfully", result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
