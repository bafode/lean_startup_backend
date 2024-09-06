"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const utils_1 = require("../utils");
const models_1 = require("../models");
const http_status_1 = __importDefault(require("http-status"));
const getPosts = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    options.sortBy = "createdAt:desc";
    options.populate = [
        { path: "author", select: "firstname lastname email avatar" },
        { path: "likes", select: "firstname lastname email avatar" },
    ];
    const posts = yield models_1.Post.paginate(filter, options);
    return posts;
});
const getPostByAuthorId = (authorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.Post.find({ author: authorId }).sort({ createdAt: -1 });
});
const getPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.Post.findById(id).populate([
        { path: "author", select: "firstname lastname email avatar" },
    ]);
});
const createPost = (post) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.Post.create(post);
});
exports.createPost = createPost;
const updatePostById = (postId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield getPostById(postId);
    if (!post) {
        throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, "Post not found");
    }
    Object.assign(post, updateBody);
    yield post.save();
    return post;
});
/**
 * Delete user by id
 * @param {ObjectId} postId
 * @returns {Promise<IPost>}
 */
const deletePostById = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield getPostById(postId);
    if (!post) {
        throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, "Post not found");
    }
    yield models_1.Post.findByIdAndRemove(postId);
    return post;
});
const addCommentToPost = (postId, comment) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield getPostById(postId);
    if (!post) {
        throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, "Post not found");
    }
    post.comments.push(comment);
    yield post.save();
    return post;
});
const toggleLikePost = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield getPostById(postId);
    if (!post) {
        throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, "Post not found");
    }
    const userIndex = post.likes.indexOf(userId);
    if (userIndex > -1) {
        post.likes.splice(userIndex, 1);
    }
    else {
        post.likes.push(userId);
    }
    yield post.save();
    return post;
});
exports.default = {
    createPost: exports.createPost,
    getPosts,
    getPostById,
    updatePostById,
    deletePostById,
    getPostByAuthorId,
    addCommentToPost,
    toggleLikePost,
};
//# sourceMappingURL=post.service.js.map