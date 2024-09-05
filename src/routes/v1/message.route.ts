import express from "express";

import { messageController } from "../../controllers";
import { auth, validate } from "../../middlewares";
import { EUserRole } from "../../types";
import { messageValidation } from "../../validations";

const router = express.Router();

router.post(
    "/",
    auth(EUserRole.ADMIN, EUserRole.USER),
    validate(messageValidation.sendMessage),
    messageController.sendMessage
);

router.get(
    "/",
    auth(EUserRole.ADMIN, EUserRole.USER),
    validate(messageValidation.getMessages),
    messageController.getMessages
);
export default router;
