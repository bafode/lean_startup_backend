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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = require("../config");
const models_1 = require("../models");
const utils_1 = require("../utils");
const types_1 = require("../types");
const _1 = require(".");
const generateToken = (userId, expires, type) => {
    const payload = {
        sub: userId,
        iat: (0, moment_1.default)().unix(),
        exp: expires.unix(),
        type,
    };
    return jsonwebtoken_1.default.sign(payload, config_1.config.jwt.secret);
};
const generateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code;
};
const saveToken = (token, userId, expires, type) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenDoc = yield models_1.Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
    });
    return tokenDoc;
});
const verifyToken = (token, type) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenDoc = {};
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
    }
    catch (error) {
        throw new utils_1.ApiError(http_status_1.default.UNAUTHORIZED, "Incorrect token sended!");
    }
    if (typeof payload !== "string" && payload.type !== type) {
        throw new utils_1.ApiError(http_status_1.default.FORBIDDEN, "Wrong token sended!");
    }
    if (type === types_1.ETokenType.ACCESS) {
        Object.assign(tokenDoc, {
            user: payload.sub,
            token: token,
            type: type,
        });
    }
    else {
        tokenDoc = yield models_1.Token.findOne({ token, type, user: payload.sub });
    }
    if (!tokenDoc) {
        throw new utils_1.ApiError(http_status_1.default.UNAUTHORIZED, "Token not found");
    }
    return tokenDoc;
});
/**
 * Generate access and refresh tokens
 */
const generateAuthTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const accessTokenExpires = (0, moment_1.default)().add(config_1.config.jwt.accessExpirationMinutes, "days");
    const accessToken = generateToken(userId, accessTokenExpires, types_1.ETokenType.ACCESS);
    const refreshTokenExpires = (0, moment_1.default)().add(config_1.config.jwt.refreshExpirationDays, "days");
    const refreshToken = generateToken(userId, refreshTokenExpires, types_1.ETokenType.REFRESH);
    yield saveToken(refreshToken, userId, refreshTokenExpires, types_1.ETokenType.REFRESH);
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
});
const generateResetPasswordToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _1.userService.getOneUser({ email });
    if (!user) {
        throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, "No users found with this email");
    }
    const expires = (0, moment_1.default)().add(config_1.config.jwt.resetPasswordExpirationMinutes, "minutes");
    const resetPasswordToken = generateToken(user.id, expires, types_1.ETokenType.RESET_PASSWORD);
    yield saveToken(resetPasswordToken, user.id, expires, types_1.ETokenType.RESET_PASSWORD);
    return resetPasswordToken;
});
const generateVerifyEmailToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const expires = (0, moment_1.default)().add(config_1.config.jwt.verifyEmailExpirationMinutes, "minutes");
    const verifyEmailToken = generateToken(userId, expires, types_1.ETokenType.VERIFY_EMAIL);
    yield saveToken(verifyEmailToken, userId, expires, types_1.ETokenType.VERIFY_EMAIL);
    return verifyEmailToken;
});
const generateVerifyEmailCode = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const expires = (0, moment_1.default)().add(config_1.config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyTelCode = generateCode();
    yield saveToken(verifyTelCode.toString(), userId, expires, types_1.ETokenType.VERIFY_EMAIL);
    return verifyTelCode;
});
const generateResetPasswordCode = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _1.userService.getOneUser({ email });
    const userId = user.id;
    const expires = (0, moment_1.default)().add(config_1.config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyTelCode = generateCode();
    yield saveToken(verifyTelCode.toString(), userId, expires, types_1.ETokenType.RESET_PASSWORD);
    return verifyTelCode;
});
const verifyCode = (code, type) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenDoc = {};
    tokenDoc = yield models_1.Token.findOne({ token: code, type });
    if (!tokenDoc) {
        throw new utils_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Token not found');
    }
    return tokenDoc;
});
exports.default = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
    generateVerifyEmailCode,
    generateResetPasswordCode,
    verifyCode,
};
//# sourceMappingURL=token.service.js.map