"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const _1 = require(".");
const getPosts = {
    query: joi_1.default.object().keys({
        search: joi_1.default.string(),
        title: joi_1.default.string(),
        content: joi_1.default.string(),
        category: joi_1.default.string(),
        author: joi_1.default.string().custom(_1.validation.objectId),
        sortBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
const createPost = {
    body: joi_1.default.object().keys({
        title: joi_1.default.string().required(),
        content: joi_1.default.string().required(),
        category: joi_1.default.string().required(),
    }),
};
const getOnePost = {
    params: joi_1.default.object().keys({
        postId: joi_1.default.string().custom(_1.validation.objectId),
    }),
};
const updatePost = {
    params: joi_1.default.object().keys({
        postId: joi_1.default.required().custom(_1.validation.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        title: joi_1.default.string(),
        content: joi_1.default.string(),
        category: joi_1.default.string(),
        postImage: joi_1.default.string(),
    })
        .min(1),
};
const deletePost = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(_1.validation.objectId),
    }),
};
const addComment = {
    params: joi_1.default.object().keys({
        postId: joi_1.default.string().custom(_1.validation.objectId),
    }),
    body: joi_1.default.object().keys({
        content: joi_1.default.string().required(),
    }),
};
exports.default = {
    createPost,
    getPosts,
    getOnePost,
    updatePost,
    deletePost,
    addComment,
};
//# sourceMappingURL=post.validation.js.map