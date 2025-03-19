import { User, Notification } from '../models';
import { IUserDocument, INotificationPush, INotificationDocument, ENotificationType, ENotificationStatus } from '../types';
import { messaging } from '../config';
import * as admin from 'firebase-admin';
import mongoose from 'mongoose';

/**
 * Envoie une notification push via Firebase Cloud Messaging
 * @param data Données de la notification
 * @returns Résultat de l'envoi
 */
const sendPushNotification = async (data: INotificationPush) => {
    const { toToken } = data;
    console.log('Sending notification to:', data);
    // Cherche l'utilisateur avec `toToken`, qui devrait être l'ID MongoDB
    const user = await User.findById(toToken) as IUserDocument | null;
    if (!user || !user.fcmtoken) {
        return { code: -1, msg: 'User or FCM token not found' };
    }

    const deviceToken = user.fcmtoken;
    const message = createPushMessage(data, deviceToken);

    try {
        await messaging.send(message);
        if (data.type &&
            data.type !== ENotificationType.CANCEL &&
            data.type !== ENotificationType.ACCEPT 
        ) {
            
            const notificationData: Partial<INotificationDocument> = {
                sender: new mongoose.Types.ObjectId(data.userToken),
                recipient: new mongoose.Types.ObjectId(toToken),
                type: data.type,
                status: ENotificationStatus.UNREAD,
                docId: data.docId,
                targetType: data.targetType,
                message: data.message
            };
            await createNotification(notificationData);
        }
        
        return { code: 0, msg: 'Notification sent successfully' };
    } catch (error) {
        console.error('Error sending notification:', error);
        return { code: -1, msg: 'Notification sending failed' };
    }
};

/**
 * Crée un message pour Firebase Cloud Messaging
 * @param data Données de la notification
 * @param deviceToken Token FCM de l'appareil cible
 * @returns Message formaté pour FCM
 */
const createPushMessage = (data: INotificationPush, deviceToken: string): admin.messaging.Message => {
    const { userToken, userAvatar, userFirstName, userLastName, callType, type, message,docId } = data;
    
    let notificationTitle = '';
    let notificationBody = '';
    let sound = 'default';
    let channelId = 'com.beehiveapp.beehive.notification';
    // Déterminer le contenu de la notification en fonction du type
    if (callType) {
        // Notifications d'appel (ancien système)
        switch (callType) {
            case 'voice':
                notificationTitle = `Voice call from ${userFirstName} ${userLastName}`;
                notificationBody = 'Please click to answer the voice call';
                channelId = 'com.beehiveapp.beehivevoice';
                break;
            case 'video':
                notificationTitle = `Video call from ${userFirstName} ${userLastName}`;
                notificationBody = 'Please click to answer the video call';
                sound = 'task_cancel.caf';
                channelId = 'com.beehiveapp.beehivevideo';
                break;
            case 'text':
                notificationTitle = `Message from ${userFirstName} ${userLastName}`;
                notificationBody = 'Please click to view the message';
                sound = 'ding.caf';
                channelId = 'com.beehiveapp.beehivetext';
                break;
            case 'cancel':
                notificationTitle = 'Call canceled';
                notificationBody = 'The call has been canceled';
                sound = 'task_cancel.caf';
                channelId = 'com.beehiveapp.beehivecancel';
                break;
            case 'accept':
                notificationTitle = 'Call accepted';
                notificationBody = `${userFirstName} ${userLastName} accepted your call`;
                sound = 'default';
                channelId = 'com.beehiveapp.beehiveaccept';
                break;
        }
    } else if (type) {
        // Notifications sociales (nouveau système)
        const userName = `${userFirstName} ${userLastName}`;
        
        switch (type) {
            case ENotificationType.LIKE:
                notificationTitle = 'Nouveau like';
                notificationBody = `${userName} a aimé votre publication`;
                break;
            case ENotificationType.COMMENT:
                notificationTitle = 'Nouveau commentaire';
                notificationBody = `${userName} a commenté votre publication`;
                break;
            case ENotificationType.FOLLOW:
                notificationTitle = 'Nouvel abonné';
                notificationBody = `${userName} a commencé à vous suivre`;
                break;
            case ENotificationType.MENTION:
                notificationTitle = 'Nouvelle mention';
                notificationBody = `${userName} vous a mentionné dans une publication`;
                break;
            case ENotificationType.TAG:
                notificationTitle = 'Nouveau tag';
                notificationBody = `${userName} vous a tagué dans une publication`;
                break;
            case ENotificationType.SHARE:
                notificationTitle = 'Nouveau partage';
                notificationBody = `${userName} a partagé votre publication`;
                break;
            case ENotificationType.NEW_POST:
                notificationTitle = 'Nouvelle publication';
                notificationBody = `${userName} a publié quelque chose de nouveau`;
                break;
            case ENotificationType.FRIEND_REQUEST:
                notificationTitle = 'Demande d\'ami';
                notificationBody = `${userName} vous a envoyé une demande d'ami`;
                break;
            case ENotificationType.FRIEND_ACCEPT:
                notificationTitle = 'Demande acceptée';
                notificationBody = `${userName} a accepté votre demande d'ami`;
                break;
            case ENotificationType.SYSTEM:
                notificationTitle = 'Notification système';
                notificationBody = message || 'Vous avez une notification système';
                break;
            default:
                notificationTitle = 'Nouvelle notification';
                notificationBody = message || `Vous avez une notification de ${userName}`;
        }
    }

    // Construire le message FCM
    return {
        token: deviceToken,
        data: {
            token: userToken || '',
            avatar: userAvatar || '',
            firstname: userFirstName || '',
            lastname: userLastName || '',
            call_type: callType || '',
            notification_type: type || '',
            target_id: data.targetId || '',
            target_type: data.targetType || '',
            message: data.message || '',
        },
        android: {
            priority: 'high',
            notification: {
                channelId,
                title: notificationTitle,
                body: notificationBody,
            },
        },
        apns: {
            headers: {
                'apns-priority': '10',
            },
            payload: {
                aps: {
                    alert: {
                        title: notificationTitle,
                        body: notificationBody,
                    },
                    badge: 1,
                    sound,
                },
            },
        },
    };
};

/**
 * Crée une notification en base de données
 * @param notificationData Données de la notification
 * @returns La notification créée
 */
const createNotification = async (notificationData: Partial<INotificationDocument>) => {
    return Notification.create(notificationData);
};

/**
 * Récupère les notifications d'un utilisateur
 * @param userId ID de l'utilisateur
 * @param options Options de pagination
 * @returns Liste des notifications
 */
const getUserNotifications = async (userId: string, options: { limit?: number; page?: number; status?: ENotificationStatus } = {}) => {
    const { limit = 10, page = 1, status } = options;
    
    const filter: any = { recipient: userId };
    if (status) {
        filter.status = status;
    }
    
    const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('sender', 'firstname lastname avatar')
        .populate('targetId');
        
    // Transformer les résultats pour inclure targetId ou targetStringId dans un champ unifié
    const transformedNotifications = notifications.map(notification => {
        const notificationObj = notification.toJSON();
        // Si targetStringId existe, l'utiliser comme targetId dans la réponse
        if (notificationObj.targetStringId && !notificationObj.targetId) {
            notificationObj.targetId = new mongoose.Types.ObjectId(notificationObj.targetStringId);
        }
        return notificationObj;
    });
    
    const total = await Notification.countDocuments(filter);
    
    return {
        notifications: transformedNotifications,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    };
};

/**
 * Marque une notification comme lue
 * @param notificationId ID de notification à marquer
 * @param userId ID de l'utilisateur propriétaire des notifications
 * @returns Nombre de notifications mises à jour
 */
const markOneNotificationAsRead = async (notificationId: string, userId: string) => {
    const result = await Notification.updateOne(
        {
            _id: notificationId,
            recipient: userId,
            status: ENotificationStatus.UNREAD
        },
        { status: ENotificationStatus.READ }
    );

    return { updatedCount: result.modifiedCount };
};

/**
 * Marque des notifications comme lues
 * @param notificationIds IDs des notifications à marquer
 * @param userId ID de l'utilisateur propriétaire des notifications
 * @returns Nombre de notifications mises à jour
 */
const markNotificationsAsRead = async (notificationIds: string[], userId: string) => {
    const result = await Notification.updateMany(
        { 
            _id: { $in: notificationIds }, 
            recipient: userId,
            status: ENotificationStatus.UNREAD
        },
        { status: ENotificationStatus.READ }
    );
    
    return { updatedCount: result.modifiedCount };
};

/**
 * Marque toutes les notifications d'un utilisateur comme lues
 * @param userId ID de l'utilisateur
 * @returns Nombre de notifications mises à jour
 */
const markAllNotificationsAsRead = async (userId: string) => {
    const result = await Notification.updateMany(
        { recipient: userId, status: ENotificationStatus.UNREAD },
        { status: ENotificationStatus.READ }
    );
    
    return { updatedCount: result.modifiedCount };
};

/**
 * Supprime une notification
 * @param notificationId ID de la notification
 * @param userId ID de l'utilisateur propriétaire de la notification
 * @returns Résultat de la suppression
 */
const deleteNotification = async (notificationId: string, userId: string) => {
    const result = await Notification.deleteOne({ _id: notificationId, recipient: userId });
    return { deleted: result.deletedCount > 0 };
};

/**
 * Compte le nombre de notifications non lues d'un utilisateur
 * @param userId ID de l'utilisateur
 * @returns Nombre de notifications non lues
 */
const countUnreadNotifications = async (userId: string) => {
    const count = await Notification.countDocuments({ 
        recipient: userId, 
        status: ENotificationStatus.UNREAD 
    });
    
    return { unreadCount: count };
};

// Pour la compatibilité avec l'ancien système
const sendNotification = sendPushNotification;

export default {
    // Méthodes de l'ancien système (pour compatibilité)
    sendNotification,
    
    // Nouvelles méthodes
    sendPushNotification,
    createNotification,
    getUserNotifications,
    markNotificationsAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    countUnreadNotifications,
    markOneNotificationAsRead,
};
