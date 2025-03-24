import { EGender } from '../types';
import Joi from 'joi';
import { validation } from '.';

const register = {
  body: Joi.object().keys({
    firstname: Joi.string().allow(null).empty(''),
    lastname: Joi.string().allow(null).empty(''),
    email: Joi.string().required().email(),
    password: validation.passwordSchema.allow(null),
    authType: Joi.string().allow(null),
    description: Joi.string().allow(null),
    phone: Joi.string().allow(null),
    avatar: Joi.string().allow(null),
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
    password: Joi.string().allow(null).empty(''),
    authType: Joi.string().allow(null),
    firstname: Joi.string().allow(null).empty(''),
    lastname: Joi.string().allow(null).empty(''),
    description: Joi.string().allow(null),
    phone: Joi.string().allow(null),
    avatar: Joi.string().allow(null),
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
    password: validation.passwordSchema.required().description('The new password'),
  }),
};

const verifyEmail = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
const get_rtc_token = {
  query: Joi.object().keys({
    channel_name: Joi.string().required().description('The channel name'),
  })
};
const bind_fcmtoken = {
  query: Joi.object().keys({
    fcmtoken: Joi.string().required().description('The channel name'),
  })
};


export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  get_rtc_token,
  bind_fcmtoken
};
