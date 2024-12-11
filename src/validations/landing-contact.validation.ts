import Joi from "joi";
import { validation } from ".";

const getLandingContacts = {
    query: Joi.object().keys({
        email: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const createLandingContact = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
    }),
};

const getLandingContactById = {
    params: Joi.object().keys({
        contactId: Joi.string().custom(validation.objectId),
    }),
};

const updateLandingContactById = {
    params: Joi.object().keys({
        contactId: Joi.required().custom(validation.objectId),
    }),
    body: Joi.object()
        .keys({
            email: Joi.string(),
        })
        .min(1),
};

const deleteLandingContactById = {
    params: Joi.object().keys({
        contactId: Joi.string().custom(validation.objectId),
    }),
};


export default {
    getLandingContacts,
    createLandingContact,
    getLandingContactById,
    updateLandingContactById,
    deleteLandingContactById
};
