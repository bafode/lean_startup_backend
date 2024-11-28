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
const services_1 = require("../services");
const types_1 = require("../types");
const utils_1 = require("../utils");
const register = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    data.role = types_1.EUserRole.USER;
    data.authType = req.body.authType || types_1.EAuthType.EMAIL;
    const user = yield services_1.authService.register(data);
    if (data.authType === types_1.EAuthType.EMAIL) {
        const verificationCode = yield services_1.tokenService.generateVerifyEmailCode(user.id);
        yield services_1.emailService.sendVerificationEmail(req.body.email, verificationCode);
    }
    const tokens = yield services_1.tokenService.generateAuthTokens(user.id);
    res.status(http_status_1.default.CREATED).send({
        code: http_status_1.default.CREATED,
        message: "User Registered Successfully",
        user,
        tokens,
    });
}));
const login = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let authType = req.body.authType || types_1.EAuthType.EMAIL;
    const user = yield services_1.authService.login(email, password, authType);
    const tokens = yield services_1.tokenService.generateAuthTokens(user.id);
    res.send({
        code: http_status_1.default.OK,
        message: "Login Success",
        user,
        tokens,
    });
}));
const logout = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.authService.logout(req.body.refreshToken);
    res.status(http_status_1.default.OK).send({
        code: http_status_1.default.OK,
        message: "Logout Success",
    });
}));
const refreshTokens = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield services_1.authService.refreshAuth(req.body.refreshToken);
    res.send(Object.assign({}, tokens));
}));
const forgotPassword = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationCode = yield services_1.tokenService.generateResetPasswordCode(req.body.email);
    yield services_1.emailService.sendResetPasswordEmail(req.body.email, verificationCode);
    res.status(http_status_1.default.OK).send({
        code: http_status_1.default.OK,
        message: "Si un compte existe avec cet email, un email de réinitialisation de mot de passe a été envoyé",
    });
}));
const resetPassword = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.authService.resetPassword(req.body.token, req.body.password);
    res.status(http_status_1.default.OK).send({
        code: http_status_1.default.OK,
        message: "Mot de passe réinitialisé avec succès",
    });
}));
const sendVerificationEmail = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield services_1.tokenService.generateVerifyEmailCode(req.user);
    const loggedUser = yield services_1.userService.getUserById(req.user);
    yield services_1.emailService.sendVerificationEmail(loggedUser.email, token);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
const verifyEmail = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.authService.verifyEmail(req.body.token);
    res.status(http_status_1.default.OK).send({
        code: http_status_1.default.OK,
        message: "Email Verified Successfully",
    });
}));
exports.default = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
};
//# sourceMappingURL=auth.controller.js.map