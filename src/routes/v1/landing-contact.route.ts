import express from "express";

import { landingContactController } from "../../controllers";
import { auth,  validate } from "../../middlewares";
import { EUserRole } from "../../types";
import { landingContactValidation, } from "../../validations";

const router = express.Router();

router.get(
    "/",
    auth(EUserRole.ADMIN, EUserRole.USER),
    validate(landingContactValidation.getLandingContacts),
    landingContactController.getLandingContacts
);

router.post(
    "/",
    validate(landingContactValidation.createLandingContact),
   landingContactController.createLandingContact
);

router.delete(
    "/:contactId",
    auth(EUserRole.ADMIN),
    validate(landingContactValidation.deleteLandingContactById),
    landingContactController.deleteLandingContactById
);
router.patch(
    "/:contactId",
    auth(EUserRole.ADMIN),
    validate(landingContactValidation.updateLandingContactById),
    landingContactController.updateLandingContactById
);


export default router;
