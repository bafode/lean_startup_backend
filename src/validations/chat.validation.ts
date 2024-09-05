import Joi from "joi";
import { validation } from ".";

const getChats = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const accessChat = {
    body: Joi.object().keys({
        userId: Joi.string().custom(validation.objectId),
    }),
};


export default {
    getChats,
    accessChat
};
