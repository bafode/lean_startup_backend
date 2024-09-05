import express from "express";

import { favoriteController } from "../../controllers";
import { auth, validate } from "../../middlewares";
import { EUserRole } from "../../types";
import { favoriteValidation } from "../../validations";

const router = express.Router();

router.get(
    "/",
    auth(EUserRole.ADMIN, EUserRole.USER),
    validate(favoriteValidation.getFavorites),
    favoriteController.getFavorites
);

router.post(
    "/",
    auth(EUserRole.ADMIN, EUserRole.USER),
    validate(favoriteValidation.toggleFavorite),
    favoriteController.toggleFavorite
);

router.get(
    "/me",
    auth(EUserRole.ADMIN, EUserRole.USER),
    favoriteController.getLoggedUserFavorites
);



export default router;
