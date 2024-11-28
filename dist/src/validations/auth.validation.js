"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const joi_1 = __importDefault(require("joi"));
const _1 = require(".");
const register = {
    body: joi_1.default.object().keys({
        firstname: joi_1.default.string().allow(null).empty(''),
        lastname: joi_1.default.string().allow(null).empty(''),
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().custom(_1.validation.password).allow(null),
        authType: joi_1.default.string().allow(null),
        description: joi_1.default.string().allow(null),
        phone: joi_1.default.string().allow(null),
        avatar: joi_1.default.string().uri().allow(null),
        open_id: joi_1.default.string().allow(null),
        online: joi_1.default.boolean().allow(null),
        gender: joi_1.default.string().valid(types_1.EGender.FEMALE, types_1.EGender.MALE),
        role: joi_1.default.forbidden(),
        isEmailVerified: joi_1.default.forbidden(),
        accountClosed: joi_1.default.forbidden()
    }),
};
const login = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().allow(null),
        authType: joi_1.default.string().allow(null),
        firstname: joi_1.default.string().allow(null).empty(''),
        lastname: joi_1.default.string().allow(null).empty(''),
        description: joi_1.default.string().allow(null),
        phone: joi_1.default.string().allow(null),
        avatar: joi_1.default.string().uri().allow(null),
        open_id: joi_1.default.string().allow(null),
        online: joi_1.default.boolean().allow(null),
    }),
};
const logout = {
    body: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required(),
    }),
};
const refreshTokens = {
    body: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required(),
    }),
};
const forgotPassword = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
    }),
};
const resetPassword = {
    body: joi_1.default.object().keys({
        token: joi_1.default.string().required().description('The generated reset password token getted from forgotPassword request'),
        password: joi_1.default.string().required().custom(_1.validation.password).description('Generated verify email token'),
    }),
};
const verifyEmail = {
    body: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
};
exports.default = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail
};
//# sourceMappingURL=auth.validation.js.map