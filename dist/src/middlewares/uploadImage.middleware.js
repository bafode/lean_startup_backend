"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        const isImage = file.mimetype.startsWith("image/");
        const destinationFolder = isImage ? "uploads/images" : "uploads/files";
        cb(null, destinationFolder);
    },
    filename(req, file, cb) {
        console.log(`${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    },
});
function checkFileType(file, cb) {
    const imageFiletypes = /jpg|jpeg|png/;
    const videoFiletypes = /mp4|mov|avi|mkv/;
    const extname = path_1.default.extname(file.originalname).toLowerCase();
    const isImage = imageFiletypes.test(extname);
    const isVideo = videoFiletypes.test(extname);
    const isImageMime = imageFiletypes.test(file.mimetype);
    const isVideoMime = videoFiletypes.test(file.mimetype);
    if ((isImage && isImageMime) || (isVideo && isVideoMime)) {
        return cb(null, true);
    }
    else {
        cb(new Error("Images and videos only!"), false);
    }
}
const upload = (0, multer_1.default)({
    storage,
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
});
exports.default = upload;
//# sourceMappingURL=uploadImage.middleware.js.map