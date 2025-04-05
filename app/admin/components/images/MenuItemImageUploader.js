"use client";

import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function MenuItemImageUploader({ ItemID, setUploadedImageURL }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fileSize, setFileSize] = useState(0);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0 && !mediaUrl) {
      const file = acceptedFiles[0];
      setFileSize(file.size);

      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setError("File is too large. Max size: 5MB for images.");
        return;
      }

      setError(null);
      setSelectedFile(file);
    }
  }, [mediaUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    multiple: false,
    onDrop,
    disabled: !!mediaUrl,
  });

  async function handleUpload() {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folder", "menuItems");

    try {
      const response = await fetch("/api/cloudinary", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");

      console.log("Secure URL:", data.url);
      setMediaUrl(data.url);

      await HandleUsers({
        mode: "update",
        item_name: "MenuItemImage",
        data: {
          ImageURL: data.url,
          ImagePublicID: data.public_id,
          ItemID: ItemID,
        },
      });

      setUploadedImageURL(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col bg-white items-center gap-4 p-4 border rounded-md w-full max-w-lg">
      {/* Drag & Drop Area */}
      {!mediaUrl && (
        <div
          {...getRootProps()}
          className={`w-full p-10 border-2 ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          } border-dashed rounded-md text-center cursor-pointer`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500 font-medium">Drop the file here...</p>
          ) : (
            <p className="text-gray-500">
              Drag & drop an image here, or {" "}
              <span className="text-blue-500">click to select</span>
            </p>
          )}
        </div>
      )}

      {/* Show Selected File Preview & Size */}
      {selectedFile && !mediaUrl && (
        <div className="flex flex-col items-center">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Selected preview"
            className="w-40 h-40 object-cover rounded-md"
          />
          <p className="text-gray-600 text-sm mt-2">
            File size: {(fileSize / 1024 / 1024).toFixed(2)} MB
          </p>
          <p>Image max size: 5MB</p>
        </div>
      )}

      {/* Uploaded Media */}
      {mediaUrl && (
        <div className="flex flex-col items-center">
          <p className="text-green-500 font-medium">Upload Successful!</p>
          <img src={mediaUrl} alt="Uploaded" className="w-40 h-40 rounded-md" />
        </div>
      )}

      {/* Upload Button */}
      {!mediaUrl && (
        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50 flex items-center"
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </button>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
