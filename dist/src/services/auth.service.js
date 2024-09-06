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
const http_status_1 = __importDefault(require("http-status"));
const _1 = require("./");
const models_1 = require("../models");
const utils_1 = require("../utils");
const types_1 = require("../types");
const register = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield models_1.User.isEmailTaken(user.email)) {
        throw new utils_1.ApiError(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    return models_1.User.create(user);
});
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _1.userService.getOneUser({ email });
    if (!user || !(yield user.isPasswordMatch(password))) {
        throw new utils_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
});
/**
 * TODO --- Logout (Think about it)
 */
const logout = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenDoc = yield models_1.Token.findOne({ token: refreshToken, type: types_1.ETokenType.REFRESH });
    if (!refreshTokenDoc) {
        throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'Not found');
    }
    yield refreshTokenDoc.remove();
});
/**
 * Renew authentication tokens
 */
const refreshAuth = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshTokenDoc = yield _1.tokenService.verifyToken(refreshToken, types_1.ETokenType.REFRESH);
        const userId = refreshTokenDoc.user.toString();
        yield refreshTokenDoc.remove();
        return yield _1.tokenService.generateAuthTokens(userId);
    }
    catch (error) {
        throw new utils_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Refresh token error');
    }
});
const resetPassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield _1.userService.updateUserById(userId, { password: newPassword });
    }
    catch (error) {
        throw new utils_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Password reset failed');
    }
});
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = (verifyEmailToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('verifyEmailToken', verifyEmailToken);
        const verifyEmailTokenDoc = yield _1.tokenService.verifyCode(verifyEmailToken, types_1.ETokenType.VERIFY_EMAIL);
        const user = yield _1.userService.getUserById(verifyEmailTokenDoc.user.toString());
        if (!user) {
            throw new Error();
        }
        yield models_1.Token.deleteMany({ user: user.id, type: types_1.ETokenType.VERIFY_EMAIL });
        yield _1.userService.updateUserById(user.id, { isEmailVerified: true });
    }
    catch (error) {
        throw new utils_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Email verification failed');
    }
});
exports.default = {
    register,
    login,
    refreshAuth,
    resetPassword,
    verifyEmail,
    logout
};
//# sourceMappingURL=auth.service.js.map