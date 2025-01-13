import Joi from "joi";
import { validation } from ".";

const getLandingContacts = {
    query: Joi.object().keys({
        email: Joi.string(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const createLandingContact = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().email(),
        subject: Joi.string().required(),
        message: Joi.string().required(),
        terms: Joi.boolean().required(),
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
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string(),
            subject: Joi.string(),
            message: Joi.string(),
            terms: Joi.boolean(),
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
