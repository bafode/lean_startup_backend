import express from "express";

import { chatController } from "../../controllers";
import { auth, validate } from "../../middlewares";
import { EUserRole } from "../../types";
import { chatValidation } from "../../validations";

const router = express.Router();

router.post(
    "/",
    auth(EUserRole.ADMIN, EUserRole.USER),
    validate(chatValidation.accessChat),
    chatController.accessChat
);

router.get(
    "/",
    auth(EUserRole.ADMIN, EUserRole.USER),
    validate(chatValidation.getChats),
    chatController.getChats
);
export default router;
