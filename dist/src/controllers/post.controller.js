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
const services_1 = require("../services");
const utils_1 = require("../utils");
const http_status_1 = __importDefault(require("http-status"));
const createPost = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = Object.assign({}, req.body);
    data.author = req.user;
    if (!req.files) {
        throw new utils_1.ApiError(http_status_1.default.BAD_REQUEST, "No files uploaded");
    }
    const files = req.files;
    data.media = files.map((file) => {
        const isImage = file.mimetype.startsWith("image/");
        const pathPrefix = isImage ? "uploads/images" : "uploads/files";
        return `${pathPrefix}/${file.filename}`;
    });
    const post = yield services_1.postService.createPost(data);
    res.status(http_status_1.default.CREATED).send({
        code: http_status_1.default.CREATED,
        message: 'Post Created Succefully',
        post: post
    });
}));
const getPosts = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, utils_1.pick)(req.query, ["title", "content", "category", "author"]);
    const options = (0, utils_1.pick)(req.query, ["sortBy", "limit", "page"]);
    const result = yield services_1.postService.getPosts(filter, options);
    res.send(result);
}));
const getPostsByAuthorId = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorId = req.query.authorId ? req.query.authorId : req.user.toString();
    const result = yield services_1.postService.getPostByAuthorId(authorId);
    res.send(result);
}));
const getOnePost = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield services_1.postService.getPostById(req.params.postId);
    if (!post) {
        throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, "Post not found");
    }
    res.send(post);
}));
const updatePost = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let updatedPostData = Object.assign({}, req.body);
    if (req.files) {
        const files = req.files;
        updatedPostData.media = files.map((file) => `uploads/images/${file.filename}`);
    }
    const post = yield services_1.postService.updatePostById(req.params.postId, updatedPostData);
    res.send(post);
}));
const deletePost = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.postService.deletePostById(req.params.postId);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
const addCommentToPost = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const post = yield services_1.postService.addCommentToPost(req.params.postId, data);
    res.status(http_status_1.default.CREATED).send(post);
}));
const toggleLikePost = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield services_1.postService.toggleLikePost(req.params.postId, req.user);
    res.status(http_status_1.default.CREATED).send(post);
}));
exports.default = {
    createPost,
    getPosts,
    getOnePost,
    updatePost,
    deletePost,
    getPostsByAuthorId,
    addCommentToPost,
    toggleLikePost
};
//# sourceMappingURL=post.controller.js.map