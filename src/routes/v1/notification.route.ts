import express from 'express';
import { auth, upload } from '../../middlewares';
import { notificationController } from '../../controllers';
import { EUserRole } from '../../types';

const router = express.Router();

// Routes de l'ancien système (pour compatibilité)
router.post('/send_notice', auth(EUserRole.USER, EUserRole.ADMIN), notificationController.send_notice);
router.post('/upload_photo', auth(EUserRole.USER, EUserRole.ADMIN), upload.single("file"), notificationController.uploadMedia);

// Nouvelles routes pour les notifications sociales
router.post('/social', auth(EUserRole.USER, EUserRole.ADMIN), notificationController.sendSocialNotification);
router.get('/', auth(EUserRole.USER, EUserRole.ADMIN), notificationController.getUserNotifications);
router.post('/mark-read', auth(EUserRole.USER, EUserRole.ADMIN), notificationController.markAsRead);
router.post('/mark-all-read', auth(EUserRole.USER, EUserRole.ADMIN), notificationController.markAllAsRead);
router.delete('/:notification_id', auth(EUserRole.USER, EUserRole.ADMIN), notificationController.deleteNotification);
router.get('/unread-count', auth(EUserRole.USER, EUserRole.ADMIN), notificationController.countUnread);

export default router;
