import Joi from "joi";
import { validation } from ".";

const getPosts = {
  query: Joi.object().keys({
    search: Joi.string(),
    title: Joi.string(),
    content: Joi.string(),
    category: Joi.string(),
    author: Joi.string().custom(validation.objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createPost = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
    category: Joi.string().required(),
  }),
};

const getOnePost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(validation.objectId),
  }),
};

const updatePost = {
  params: Joi.object().keys({
    postId: Joi.required().custom(validation.objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      content: Joi.string(),
      category: Joi.string(),
      postImage: Joi.string(),
    })
    .min(1),
};

const deletePost = {
  params: Joi.object().keys({
    userId: Joi.string().custom(validation.objectId),
  }),
};

const addComment = {
  params: Joi.object().keys({
    postId: Joi.string().custom(validation.objectId),
  }),
  body: Joi.object().keys({
    content: Joi.string().required(),
  }),

};
export default {
  createPost,
  getPosts,
  getOnePost,
  updatePost,
  deletePost,
  addComment,
};
