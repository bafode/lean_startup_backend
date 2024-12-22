import { User } from '../models';
import { IUserDocument } from '../types';
import { messaging } from '../config';
import * as admin from 'firebase-admin';

interface INotification {
    userToken: string;
    userAvatar: string;
    userFirstName: string;
    userLastName: string;
    toToken: string;
    toFirstname: string;
    toLastname: string;
    toAvatar: string;
    callType: 'voice' | 'video' | 'text' | 'cancel';
    docId: string;
}

const sendNotification = async (data: INotification) => {
    const { toToken} = data;

    // Cherche l'utilisateur avec `toToken`, qui devrait être l'ID MongoDB
    const user = await User.findById(toToken) as IUserDocument | null;
    if (!user || !user.fcmtoken) {
        return { code: -1, msg: 'User or FCM token not found' };
    }

    const deviceToken = user.fcmtoken;
    const message = createMessage(data, deviceToken);

    try {
        await messaging.send(message);
        return { code: 0, msg: 'Notification sent successfully' };
    } catch (error) {
        console.error('Error sending notification:', error);
        return { code: -1, msg: 'Notification sending failed' };
    }
};

const createMessage = (data: INotification, deviceToken: string): admin.messaging.Message => {
    const { userToken, userAvatar, userFirstName,userLastName, callType, docId } = data;

    let notificationTitle = '';
    let notificationBody = '';
    let sound = '';

    switch (callType) {
        case 'voice':
            notificationTitle = `Voice call from ${userFirstName} ${userLastName}`;
            notificationBody = 'Please click to answer the voice call';
            sound = 'default';
            break;
        case 'video':
            notificationTitle = `Video call from ${userFirstName} ${userLastName}`;
            notificationBody = 'Please click to answer the video call';
            sound = 'task_cancel.caf';
            break;
        case 'text':
            notificationTitle = `Message from ${userFirstName} ${userLastName}`;
            notificationBody = 'Please click to view the message';
            sound = 'ding.caf';
            break;
        case 'cancel':
            notificationTitle = 'Call canceled';
            notificationBody = 'The call has been canceled';
            sound = 'task_cancel.caf';
            break;
    }

    return {
        token: deviceToken,
        data: {
            token: userToken||'',
            avatar: userAvatar||'',
            firstname: userFirstName || '',
            lastname: userLastName || '',
            // doc_id: docId,
            call_type: callType || '',
        },
        android: {
            priority: 'high',
            notification: {
                channelId: `com.beehiveapp.beehive${callType}`,
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

export default {
    sendNotification,
};
