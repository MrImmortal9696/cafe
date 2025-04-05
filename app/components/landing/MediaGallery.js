"use client";
import { useEffect, useState } from "react";

export default function MediaGallery() {
  const [mediaFiles, setMediaFiles] = useState([]);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch("/api/media");
        const files = await res.json();
        setMediaFiles(files);
      } catch (error) {
        console.error("Failed to fetch media:", error);
      }
    }

    fetchMedia();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {mediaFiles.length === 0 ? (
        <p>No media found</p>
      ) : (
        mediaFiles.map((file, index) => {
          const fileType = /\.(mp4|mov|webm)$/i.test(file) ? "video" : "image";
          const src = `/${file}`; // Public folder file path

          return (
            <div key={index} className="border p-2 rounded-lg shadow-lg">
              {fileType === "image" ? (
                <img src={src} alt={`Media ${index}`} className="w-full h-auto rounded-lg" />
              ) : (
                <video controls className="w-full h-auto rounded-lg">
                  <source src={src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
