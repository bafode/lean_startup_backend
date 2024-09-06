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
const models_1 = require("../models");
const utils_1 = require("../utils");
const getUsers = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield models_1.User.paginate(filter, options);
    return users;
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.User.findById(id);
});
const getOneUser = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.User.findOne(filter);
});
const updateUserById = (userId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserById(userId);
    if (!user) {
        throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (updateBody.email &&
        (yield models_1.User.isEmailTaken(updateBody.email.toString(), userId))) {
        throw new utils_1.ApiError(http_status_1.default.BAD_REQUEST, "Email already taken");
    }
    Object.assign(user, updateBody);
    yield user.save();
    return user;
});
/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<IUserDocument>}
 */
const deleteUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserById(userId);
    if (!user) {
        throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, "User not found");
    }
    yield user.remove();
    return user;
});
exports.default = {
    getUserById,
    updateUserById,
    deleteUserById,
    getOneUser,
    getUsers,
};
//# sourceMappingURL=user.service.js.map