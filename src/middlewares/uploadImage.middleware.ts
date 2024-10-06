import multer from "multer";
import path from "path";
import { Request } from "express";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});
// Cloudinary storage configuration for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    const isImage = file.mimetype.startsWith("image/");
    const folder = isImage ? 'images' : 'videos';
    return {
      folder: folder, // Cloudinary folder name
      format: isImage ? 'jpg' : undefined, // You can specify format for images, e.g., jpg, png
      public_id: `${file.fieldname}-${Date.now()}`, // File name in Cloudinary
      resource_type: isImage ? 'image' : 'auto', // Auto-detect file type for non-images
    };
  },
});

// File type check function remains the same
function checkFileType(
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void
) {
  const imageFiletypes = /jpg|jpeg|png/;
  const videoFiletypes = /mp4|mov|avi|mkv/;
  const extname = imageFiletypes.test(path.extname(file.originalname).toLowerCase()) ||
    videoFiletypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = imageFiletypes.test(file.mimetype) || videoFiletypes.test(file.mimetype);

  if (extname && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error("Images and videos only!"), false);
  }
}

// Multer configuration using Cloudinary storage
const upload = multer({
  storage,
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void
  ) {
    checkFileType(file, cb);
  },
});

export default upload;
