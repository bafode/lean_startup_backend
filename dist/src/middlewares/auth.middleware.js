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
const services_1 = require("../services");
const types_1 = require("../types");
const http_status_1 = __importDefault(require("http-status"));
/**
 * Authentication and authorization
 */
exports.default = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            throw new utils_1.ApiError(http_status_1.default.UNAUTHORIZED, "⛔ Please authenticate first!");
        }
        const token = req.headers.authorization.split(" ")[1];
        const accessTokenDoc = yield services_1.tokenService.verifyToken(token, types_1.ETokenType.ACCESS);
        const user = yield services_1.userService.getUserById(accessTokenDoc.user.toString());
        if (!user ||
            (requiredRoles &&
                requiredRoles.length > 0 &&
                !requiredRoles.includes(user.role))) {
            throw new utils_1.ApiError(http_status_1.default.FORBIDDEN, "⛔ You don't have access to this ressource!");
        }
        req.user = user._id;
        if (req.params.userId && user.role !== types_1.EUserRole.ADMIN) {
            if (user._id != req.params.userId) {
                throw new utils_1.ApiError(http_status_1.default.FORBIDDEN, "⛔ You don't have access to this ressource!");
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=auth.middleware.js.map