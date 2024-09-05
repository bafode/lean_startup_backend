import Joi from "joi";
import { validation } from ".";

const getMessages = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        chat: Joi.string().custom(validation.objectId),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const sendMessage = {
    body: Joi.object().keys({
        chat: Joi.string().custom(validation.objectId),
        content: Joi.string().required(),
        receiver: Joi.string().custom(validation.objectId),
    }),
};


export default {
    getMessages,
    sendMessage,
};
