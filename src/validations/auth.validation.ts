import { EGender } from '../types';
import Joi from 'joi';
import { validation } from '.';

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().allow(null),
    lastName: Joi.string().allow(null),
    email: Joi.string().required().email(),
    password: Joi.string().custom(validation.password).allow(null),
    type: Joi.number().allow(null),
    description: Joi.string().allow(null),
    phone: Joi.string().allow(null),
    avatar: Joi.string().uri().allow(null),
    open_id: Joi.string().allow(null),
    online: Joi.boolean().allow(null),
    gender: Joi.string().valid(EGender.FEMALE, EGender.MALE),
    role: Joi.forbidden(),
    isEmailVerified: Joi.forbidden(),
    accountClosed: Joi.forbidden()
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().allow(null),
    type: Joi.number().allow(null),
    firstName: Joi.string().allow(null),
    lastName: Joi.string().allow(null),
    description: Joi.string().allow(null),
    phone: Joi.string().allow(null),
    avatar: Joi.string().uri().allow(null),
    open_id: Joi.string().allow(null),
    online: Joi.boolean().allow(null),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    token: Joi.string().required().description('The generated reset password token getted from forgotPassword request'),
    password: Joi.string().required().custom(validation.password).description('Generated verify email token'),
  }),
};

const verifyEmail = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail
};
