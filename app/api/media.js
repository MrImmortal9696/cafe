import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const mediaFolder = path.join(process.cwd(), "public"); // Path to public folder

  // Read files in the public folder
  fs.readdir(mediaFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load media files" });
    }

    // Filter only images & videos
    const mediaFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|mp4|mov|webm)$/i.test(file)
    );

    res.status(200).json(mediaFiles);
  });
}
