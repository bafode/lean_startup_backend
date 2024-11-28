"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const joi_1 = __importDefault(require("joi"));
const _1 = require(".");
const createUser = {
    body: joi_1.default.object().keys({
        firstname: joi_1.default.string().required(),
        lastname: joi_1.default.string().required(),
        email: joi_1.default.string().required().email(),
        password: joi_1.default.forbidden(),
        role: joi_1.default.string().required().valid(types_1.EUserRole.ADMIN, types_1.EUserRole.USER),
        gender: joi_1.default.string().valid(types_1.EGender.FEMALE, types_1.EGender.MALE),
        isEmailVerified: joi_1.default.forbidden(),
        accountClosed: joi_1.default.forbidden(),
    }),
};
const getUsers = {
    query: joi_1.default.object().keys({
        role: joi_1.default.string().valid(types_1.EUserRole.ADMIN, types_1.EUserRole.USER),
        sortBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
const getOneUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(_1.validation.objectId),
    }),
};
const updateUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.required().custom(_1.validation.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        email: joi_1.default.string().email(),
        password: joi_1.default.string().custom(_1.validation.password),
        firstname: joi_1.default.string(),
        lastname: joi_1.default.string(),
        avatar: joi_1.default.string(),
        description: joi_1.default.string(),
        gender: joi_1.default.string().valid(types_1.EGender.FEMALE, types_1.EGender.MALE),
        role: joi_1.default.forbidden(),
        city: joi_1.default.string(),
        school: joi_1.default.string(),
        fieldOfStudy: joi_1.default.string(),
        levelOfStudy: joi_1.default.string(),
        categories: joi_1.default.array().items(joi_1.default.string()).unique().allow(null),
    })
        .min(1),
};
const deleteUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(_1.validation.objectId),
    }),
};
exports.default = {
    getUsers,
    getOneUser,
    updateUser,
    deleteUser,
    createUser,
};
//# sourceMappingURL=user.validation.js.map