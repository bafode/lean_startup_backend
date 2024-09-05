import multer from "multer";
import path from "path";
import { Request } from "express";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination(
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) {
    const isImage = file.mimetype.startsWith("image/");
    const destinationFolder = isImage ? "uploads/images" : "uploads/files";

    cb(null, destinationFolder);
  },

  filename(req: Request, file: Express.Multer.File, cb: FileNameCallback) {
    console.log(
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void
) {
  const imageFiletypes = /jpg|jpeg|png/;
  const videoFiletypes = /mp4|mov|avi|mkv/;
  const extname = path.extname(file.originalname).toLowerCase();
  const isImage = imageFiletypes.test(extname);
  const isVideo = videoFiletypes.test(extname);
  const isImageMime = imageFiletypes.test(file.mimetype);
  const isVideoMime = videoFiletypes.test(file.mimetype);

  if ((isImage && isImageMime) || (isVideo && isVideoMime)) {
    return cb(null, true);
  } else {
    cb(new Error("Images and videos only!"), false);
  }
}

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
