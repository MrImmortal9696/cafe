"use client";

import { useState } from "react";
import ImageUploader from "../components/images/MediaUploader";
export default function UploadPage() {
  const [uploadedImages, setUploadedImages] = useState([]);

  function handleUpload(url) {
    setUploadedImages((prev) => [...prev, url]);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Images</h1>
      
      {/* Image Uploader */}
      <ImageUploader onUpload={handleUpload} />

      {/* Uploaded Images Gallery */}
      {uploadedImages.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
          <h2 className="text-lg font-semibold mb-3">Uploaded Images:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="w-full h-32 object-cover rounded-md shadow-md"
                />
                <p className="text-xs text-center mt-1 break-all">{url}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
