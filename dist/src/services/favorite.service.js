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
const utils_1 = require("../utils");
const types_1 = require("../types");
const models_1 = require("../models");
const http_status_1 = __importDefault(require("http-status"));
const getFavorites = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    options.sortBy = "createdAt:desc";
    options.populate = [
        { path: "post" },
        { path: "user", select: "firstname lastname email avatar" },
    ];
    const favorites = yield models_1.Favorite.paginate(filter, options);
    return favorites;
});
const toggleFavorite = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield models_1.Post.findById(postId);
    if (!post) {
        throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, "Post not found");
    }
    const favorite = yield models_1.Favorite.findOne({ post: postId, user: userId });
    if (favorite) {
        yield models_1.Favorite.findByIdAndRemove(favorite._id);
        return { message: "Favorite removed" };
    }
    yield models_1.Favorite.create({ post: postId, user: userId });
    return { message: "Favorite added" };
});
const getLoggedUserFavorites = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    options.sortBy = "createdAt:desc";
    options.populate = [
        { path: "post", model: types_1.EModelNames.POST, },
        { path: "post.author", select: "firstname lastname email avatar", model: types_1.EModelNames.USER, },
        { path: "post.likes", select: "firstname lastname email avatar", model: types_1.EModelNames.USER },
    ];
    return yield models_1.Favorite.paginate(filter, options);
});
exports.default = {
    getFavorites,
    toggleFavorite,
    getLoggedUserFavorites
};
//# sourceMappingURL=favorite.service.js.map