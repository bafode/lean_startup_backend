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
        firstname: joi_1.default.string().required(),
        lastname: joi_1.default.string().required(),
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().custom(_1.validation.password),
        gender: joi_1.default.string().valid(types_1.EGender.FEMALE, types_1.EGender.MALE),
        role: joi_1.default.forbidden(),
        isEmailVerified: joi_1.default.forbidden(),
        accountClosed: joi_1.default.forbidden()
    }),
};
const login = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
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
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required().description('The generated reset password token getted from forgotPassword request'),
    }),
    body: joi_1.default.object().keys({
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