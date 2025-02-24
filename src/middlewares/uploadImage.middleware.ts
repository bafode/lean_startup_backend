import multer from "multer";
import path from "path";
import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "../config";

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// Types de fichiers autorisés avec leurs extensions et types MIME
const ALLOWED_FILES = {
  images: {
    extensions: /jpg|jpeg|png|gif|webp/,
    mimeTypes: /^image\/(jpeg|jpg|png|gif|webp)$|^application\/octet-stream$/,
    cloudinaryResourceType: 'image',
    folder: 'images',
    maxSize: 25 * 1024 * 1024, // 25MB
  },
  videos: {
    extensions: /mp4|mov|avi|mkv|webm/,
    mimeTypes: /^video\/(mp4|quicktime|x-msvideo|x-matroska|webm)$|^application\/octet-stream$/,
    cloudinaryResourceType: 'video',
    folder: 'videos',
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  documents: {
    extensions: /pdf|doc|docx|xls|xlsx/,
    mimeTypes: /^application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/,
    cloudinaryResourceType: 'raw',
    folder: 'documents',
    maxSize: 50 * 1024 * 1024, // 20MB
  }
};

// Configuration du stockage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    // Déterminer le type de fichier
    const fileType = getFileType(file);
    if (!fileType) {
      throw new Error('Type de fichier non supporté');
    }

    // Configuration spécifique pour chaque type de fichier
    return {
      folder: ALLOWED_FILES[fileType].folder,
      resource_type: ALLOWED_FILES[fileType].cloudinaryResourceType,
      public_id: `${fileType}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      // Options supplémentaires pour l'optimisation
      transformation: fileType === 'images' ? [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ] : undefined,
    };
  },
});

// Fonction pour déterminer le type de fichier
function getFileType(file: Express.Multer.File): keyof typeof ALLOWED_FILES | null {
  console.log("Checking file:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    extension: path.extname(file.originalname).toLowerCase()
  });

  const extension = path.extname(file.originalname).toLowerCase();

  // Vérifier d'abord par extension
  for (const [type, config] of Object.entries(ALLOWED_FILES)) {
    if (config.extensions.test(extension)) {
      // Si l'extension correspond, on accepte indépendamment du MIME type
      return type as keyof typeof ALLOWED_FILES;
    }
  }
  // Si aucune extension ne correspond, on essaie avec le MIME type
  for (const [type, config] of Object.entries(ALLOWED_FILES)) {
    if (config.mimeTypes.test(file.mimetype)) {
      return type as keyof typeof ALLOWED_FILES;
    }
  }

  return null;
}

// Fonction de vérification des fichiers
function checkFileType(
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void
) {
  const fileType = getFileType(file);

  if (!fileType) {
    return cb(
      new Error(
        `Type de fichier non supporté. Types acceptés: ${Object.keys(ALLOWED_FILES)
          .map(type => ALLOWED_FILES[type as keyof typeof ALLOWED_FILES].extensions.source.slice(0).split('|').join(', '))
          .join(', ')}`
      ),
      false
    );
  }

  // Vérification de la taille
  if (file.size > ALLOWED_FILES[fileType].maxSize) {
    return cb(
      new Error(
        `La taille du fichier dépasse la limite autorisée de ${ALLOWED_FILES[fileType].maxSize / (1024 * 1024)}MB`
      ),
      false
    );
  }

  return cb(null, true);
}

// Configuration de Multer
const upload = multer({
  storage,
  limits: {
    fileSize: Math.max(...Object.values(ALLOWED_FILES).map(config => config.maxSize)),
  },
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void
  ) {
    checkFileType(file, cb);
  },
});

// Middleware de gestion des erreurs pour Multer
const handleUploadError = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Taille de fichier dépassée',
      });
    }
    return res.status(400).json({
      error: `Erreur d'upload: ${error.message}`,
    });
  }
  next(error);
};

export { upload, handleUploadError };