"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const config_1 = require("../config");
cloudinary_1.v2.config({
    cloud_name: config_1.config.cloudinary.cloud_name,
    api_key: config_1.config.cloudinary.api_key,
    api_secret: config_1.config.cloudinary.api_secret,
});
// Cloudinary storage configuration for Multer
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        const isImage = file.mimetype.startsWith("image/");
        const folder = isImage ? 'images' : 'videos';
        return {
            folder: folder,
            format: isImage ? 'jpg' : undefined,
            public_id: `${file.fieldname}-${Date.now()}`,
            resource_type: isImage ? 'image' : 'auto', // Auto-detect file type for non-images
        };
    }),
});
// File type check function remains the same
function checkFileType(file, cb) {
    const imageFiletypes = /jpg|jpeg|png/;
    const videoFiletypes = /mp4|mov|avi|mkv/;
    const extname = imageFiletypes.test(path_1.default.extname(file.originalname).toLowerCase()) ||
        videoFiletypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimeType = imageFiletypes.test(file.mimetype) || videoFiletypes.test(file.mimetype);
    if (extname && mimeType) {
        return cb(null, true);
    }
    else {
        cb(new Error("Images and videos only!"), false);
    }
}
// Multer configuration using Cloudinary storage
const upload = (0, multer_1.default)({
    storage,
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
});
exports.default = upload;
//# sourceMappingURL=uploadImage.middleware.js.map