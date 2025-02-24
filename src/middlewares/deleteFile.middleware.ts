import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config";

// Configuration de Cloudinary (si ce n'est pas déjà fait ailleurs)
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
});

/**
 * Extrait l'ID public Cloudinary à partir d'une URL
 * @param cloudinaryUrl URL Cloudinary complète
 * @returns ID public du fichier ou null si l'extraction échoue
 */
const extractPublicIdFromUrl=(cloudinaryUrl: string): string | null=> {
    if (!cloudinaryUrl) return null;

    try {
        // Format d'URL Cloudinary typique: https://res.cloudinary.com/cloud_name/resource_type/upload/v123456789/folder/public_id.ext
        const urlParts = cloudinaryUrl.split('/');
        const filenameWithExt = urlParts[urlParts.length - 1];
        const publicIdParts = urlParts.slice(urlParts.indexOf('upload') + 1);

        // Réassemble le public_id avec les dossiers et supprime l'extension si présente
        const publicId = publicIdParts.join('/').replace(/\.[^/.]+$/, '');

        return publicId;
    } catch (error) {
        console.error("Erreur lors de l'extraction du public_id:", error);
        return null;
    }
}

/**
 * Middleware pour supprimer un fichier Cloudinary
 * @param urlField Nom du champ contenant l'URL Cloudinary dans le document à supprimer
 */
export const deleteCloudinaryFile =async (fileUrl:string)=> {
        try {
            if (!fileUrl) {
                return; // Pas d'URL de fichier, on continue
            }

            // Extraire l'ID public de l'URL
            const publicId = extractPublicIdFromUrl(fileUrl);

            if (!publicId) {
                console.warn(`Impossible d'extraire le public_id de l'URL: ${fileUrl}`);
                return; // On continue sans supprimer le fichier
            }
            const resourceType = getResourceTypeFromUrl(fileUrl);
            // Supprimer le fichier de Cloudinary
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: resourceType
            });

            console.log(`Fichier Cloudinary supprimé: ${publicId}`, result);
            
        } catch (error) {
            console.error("Erreur lors de la suppression du fichier Cloudinary:", error);
        }
    };

// Middleware pour supprimer plusieurs fichiers Cloudinary (pour les posts avec plusieurs médias)
export const deleteMultipleCloudinaryFiles=async(fileUrls:string[])=> {
        try {
            if (!fileUrls.length) {
                return ;
            }
            const deletePromises = fileUrls.map(async (url: string) => {
                const publicId = extractPublicIdFromUrl(url);
                if (publicId) {
                    const resourceType = getResourceTypeFromUrl(url);
                    return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
                }
                return null;
            });
            await Promise.all(deletePromises);

            console.log(`${fileUrls.length} fichiers Cloudinary supprimés`);
        } catch (error) {
            console.error("Erreur lors de la suppression des fichiers Cloudinary:", error);
        }
};
    
const getResourceTypeFromUrl = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (!extension) return "raw";

    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv"];

    if (imageExtensions.includes(extension)) return "image";
    if (videoExtensions.includes(extension)) return "video";

    return "raw"; // Fichiers autres (PDF, ZIP, etc.)
};