import Joi from "joi";
import { validation } from ".";

const getFavorites = {
    query: Joi.object().keys({
        user: Joi.string().custom(validation.objectId),
        post: Joi.string().custom(validation.objectId),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const toggleFavorite = {
    body: Joi.object().keys({
        postId: Joi.string().custom(validation.objectId),
    }),
};


export default {
    getFavorites,
    toggleFavorite,
};
