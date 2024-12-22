import express from 'express';
import { auth, upload } from '../../middlewares';
import { notificationController } from '../../controllers';
import { EUserRole } from '../../types';

const router = express.Router();

router.post('/send_notice', auth(EUserRole.USER, EUserRole.ADMIN), notificationController.send_notice);
router.post('/upload_photo', auth(EUserRole.USER, EUserRole.ADMIN), upload.single("file"), notificationController.uploadMedia);

export default router;
