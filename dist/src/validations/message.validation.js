"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const _1 = require(".");
const getMessages = {
    query: joi_1.default.object().keys({
        sortBy: joi_1.default.string(),
        chat: joi_1.default.string().custom(_1.validation.objectId),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
const sendMessage = {
    body: joi_1.default.object().keys({
        chat: joi_1.default.string().custom(_1.validation.objectId),
        content: joi_1.default.string().required(),
        receiver: joi_1.default.string().custom(_1.validation.objectId),
    }),
};
exports.default = {
    getMessages,
    sendMessage,
};
//# sourceMappingURL=message.validation.js.map