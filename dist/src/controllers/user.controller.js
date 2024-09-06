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
const utils_1 = require("../utils");
const createUser = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    data.password = "password1";
    const user = yield services_1.authService.register(data);
    res.status(http_status_1.default.CREATED).send(user);
}));
const getUsers = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, utils_1.pick)(req.query, ["role"]);
    const options = (0, utils_1.pick)(req.query, ["sortBy", "limit", "page"]);
    const result = yield services_1.userService.getUsers(filter, options);
    res.send(result);
}));
const getOneUser = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield services_1.userService.getUserById(req.params.userId);
    if (!user) {
        throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, "User not found");
    }
    res.send(user);
}));
const updateUser = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let updatedUserData = Object.assign({}, req.body);
    if (req.file) {
        updatedUserData.avatar = `uploads/images/${req.file.filename}`;
    }
    const user = yield services_1.userService.updateUserById(req.params.userId, updatedUserData);
    res.send(user);
}));
const deleteUser = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.userService.deleteUserById(req.params.userId);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.default = {
    createUser,
    getUsers,
    getOneUser,
    updateUser,
    deleteUser,
};
//# sourceMappingURL=user.controller.js.map