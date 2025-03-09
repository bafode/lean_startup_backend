import { Request, Response } from 'express';
import { notificationService, userService } from '../services';
import { ApiError, catchReq } from '../utils';
import { IAppRequest } from '../types';
import httpStatus from 'http-status';
import { ENotificationStatus } from '../types';

/**
 * Envoie une notification push (compatible avec l'ancien système)
 */
const send_notice = catchReq(async (req: IAppRequest, res: Response) => {
    const loggedUser = await userService.getUserById(req.user.toString());
    const { to_firstname, to_lastname, to_avatar, to_token, call_type, doc_id } = req.body;
    
    const response = await notificationService.sendNotification({
        userToken: loggedUser.id,
        userAvatar: loggedUser.avatar,
        userFirstName: loggedUser.firstname,
        userLastName: loggedUser.lastname,
        toToken: to_token,
        toFirstname: to_firstname,
        toLastname: to_lastname,
        toAvatar: to_avatar,
        callType: call_type,
        docId: doc_id
    });
    return res.status(response.code === 0 ? 200 : 400).json(response);
});

/**
 * Envoie une notification sociale
 */
const sendSocialNotification = catchReq(async (req: IAppRequest, res: Response) => {
    const loggedUser = await userService.getUserById(req.user.toString());
    const { to_token, type, call_type, target_id, target_type, message } = req.body;
    const response = await notificationService.sendPushNotification({
        userToken: loggedUser.id,
        userAvatar: loggedUser.avatar,
        userFirstName: loggedUser.firstname,
        userLastName: loggedUser.lastname,
        toToken: to_token,
        type,
        callType: call_type, // Ajouter le call_type pour les notifications d'appel
        targetId: target_id,
        targetType: target_type,
        message
    });
    
    return res.status(response.code === 0 ? 200 : 400).json(response);
});

/**
 * Récupère les notifications de l'utilisateur connecté
 */
const getUserNotifications = catchReq(async (req: IAppRequest, res: Response) => {
    const userId = req.user.toString();
    const { page = '1', limit = '10', status } = req.query;
    
    const options: { page: number; limit: number; status?: ENotificationStatus } = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10)
    };
    
    if (status && Object.values(ENotificationStatus).includes(status as ENotificationStatus)) {
        options.status = status as ENotificationStatus;
    }
    
    const result = await notificationService.getUserNotifications(userId, options);
    
    return res.status(httpStatus.OK).json({
        code: 0,
        msg: 'Notifications retrieved successfully',
        data: result
    });
});

/**
 * Marque des notifications comme lues
 */
const markAsRead = catchReq(async (req: IAppRequest, res: Response) => {
    const userId = req.user.toString();
    const { notification_ids } = req.body;
    
    if (!notification_ids || !Array.isArray(notification_ids)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'notification_ids must be an array');
    }
    
    const result = await notificationService.markNotificationsAsRead(notification_ids, userId);
    
    return res.status(httpStatus.OK).json({
        code: 0,
        msg: 'Notifications marked as read',
        data: result
    });
});

/**
 * Marque toutes les notifications comme lues
 */
const markAllAsRead = catchReq(async (req: IAppRequest, res: Response) => {
    const userId = req.user.toString();
    
    const result = await notificationService.markAllNotificationsAsRead(userId);
    
    return res.status(httpStatus.OK).json({
        code: 0,
        msg: 'All notifications marked as read',
        data: result
    });
});

/**
 * Supprime une notification
 */
const deleteNotification = catchReq(async (req: IAppRequest, res: Response) => {
    const userId = req.user.toString();
    const { notification_id } = req.params;
    
    if (!notification_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'notification_id is required');
    }
    
    const result = await notificationService.deleteNotification(notification_id, userId);
    
    return res.status(httpStatus.OK).json({
        code: 0,
        msg: 'Notification deleted',
        data: result
    });
});

/**
 * Compte les notifications non lues
 */
const countUnread = catchReq(async (req: IAppRequest, res: Response) => {
    const userId = req.user.toString();
    
    const result = await notificationService.countUnreadNotifications(userId);
    
    return res.status(httpStatus.OK).json({
        code: 0,
        msg: 'Unread notifications counted',
        data: result
    });
});

/**
 * Télécharge un média pour une notification
 */
const uploadMedia = catchReq(async (req: IAppRequest, res: Response) => {
    let filePath: string;
    if (!req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, "No files uploaded");
    }
    const file: Express.Multer.File = req.file as Express.Multer.File;
    filePath = file.path;
    return res.status(httpStatus.OK).send({
        code: 0,
        msg: 'File Uploaded Succefully',
        data: filePath
    });
});

export default {
    // Méthodes de l'ancien système
    send_notice,
    uploadMedia,
    
    // Nouvelles méthodes
    sendSocialNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    countUnread
};
