"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const _1 = require(".");
const getChats = {
    query: joi_1.default.object().keys({
        sortBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
const accessChat = {
    body: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(_1.validation.objectId),
    }),
};
exports.default = {
    getChats,
    accessChat
};
//# sourceMappingURL=chat.validation.js.map