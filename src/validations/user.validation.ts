import { EGender, EUserRole } from "../types";
import Joi from "joi";
import { validation } from ".";
import { isStrongPassword } from "../utils";

const createUser = {
  body: Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.forbidden(),
    role: Joi.string().required().valid(EUserRole.ADMIN, EUserRole.USER),
    gender: Joi.string().valid(EGender.FEMALE, EGender.MALE),
    isEmailVerified: Joi.forbidden(),
    accountClosed: Joi.forbidden(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    role: Joi.string().valid(EUserRole.ADMIN, EUserRole.USER),
    sortBy: Joi.string(),
     search: Joi.string().allow(""),
     orderBy: Joi.string(),  
     limit: Joi.number().integer(),
     page: Joi.number().integer(),
  }),
};

const getFavorites = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getLoggedUserPost = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOneUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(validation.objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(validation.objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: validation.passwordSchema.allow(null),
      firstname: Joi.string(),
      lastname: Joi.string(),
      avatar: Joi.string(),
      description: Joi.string(),
      accountClosed: Joi.boolean(),
      isEmailVerified: Joi.boolean(),
      gender: Joi.string().valid(EGender.FEMALE, EGender.MALE),
      role: Joi.forbidden(),
      city: Joi.string(),
      school: Joi.string(),
      fieldOfStudy: Joi.string(),
      levelOfStudy: Joi.string(),
      categories: Joi.array().items(Joi.string()).unique().allow(null),
    }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(validation.objectId),
  }),
};

const toggleUserFavorites= {
  params: Joi.object().keys({
    postId: Joi.string().custom(validation.objectId),
  }),
};

const toggleFollowUser = {
  params: Joi.object().keys({
    followId: Joi.string().custom(validation.objectId),
  }),
};

const getFollowers = {
  params: Joi.object().keys({
    userId: Joi.string().custom(validation.objectId),
  }),
};

const getUserPosts = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
  params: Joi.object().keys({
    userId: Joi.string().custom(validation.objectId),
  }),
};

const getOneUserFavorite = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
  params: Joi.object().keys({
    userId: Joi.string().custom(validation.objectId),
  }),
};

const getFollowings = {
  params: Joi.object().keys({
    userId: Joi.string().custom(validation.objectId),
  }),
};

export default {
  getUsers,
  getOneUser,
  updateUser,
  deleteUser,
  createUser,
  getFavorites,
  toggleUserFavorites,
  toggleFollowUser,
  getLoggedUserPost,
  getFollowers,
  getFollowings,
  getOneUserFavorite,
  getUserPosts,
};
