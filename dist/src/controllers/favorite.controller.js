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
const toggleFavorite = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.body.postId;
    const userId = req.user.toString();
    const favorite = yield services_1.favoriteService.toggleFavorite(postId, userId);
    res.status(http_status_1.default.OK).send(favorite);
}));
const getFavorites = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, utils_1.pick)(req.query, ["user", "post"]);
    const options = (0, utils_1.pick)(req.query, ["sortBy", "limit", "page"]);
    const result = yield services_1.favoriteService.getFavorites(filter, options);
    res.send(result);
}));
const getLoggedUserFavorites = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.toString();
    const result = yield services_1.favoriteService.getLoggedUserFavorites(userId);
    res.send(result);
}));
exports.default = {
    toggleFavorite,
    getFavorites,
    getLoggedUserFavorites
};
//# sourceMappingURL=favorite.controller.js.map