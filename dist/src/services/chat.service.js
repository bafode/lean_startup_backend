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
exports.accessChat = void 0;
const types_1 = require("../types");
const models_1 = require("../models");
const utils_1 = require("../utils");
const http_status_1 = __importDefault(require("http-status"));
const getChats = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    options.sortBy = "updatedAt:-1";
    options.populate = [
        { path: "users", select: "-password", model: types_1.EModelNames.USER },
        { path: "latestMessage" },
        { path: "groupAdmin", select: "-password" },
    ];
    let results = yield models_1.Chat.paginate(filter, options);
    results = yield models_1.User.populate(results, {
        path: "latestMessage.sender",
        select: "firstname lastname email avatar",
    });
    return results;
});
const accessChat = (userId, loggedUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var isChat = yield models_1.Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: loggedUserId } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");
    isChat = yield models_1.User.populate(isChat, {
        path: "latestMessage.sender",
        select: "firstname lastname email avatar",
    });
    if (isChat.length > 0) {
        return isChat[0];
    }
    else {
        var chatData = {
            chatName: loggedUserId,
            isGroupChat: false,
            users: [loggedUserId, userId],
        };
        try {
            const createdChat = yield models_1.Chat.create(chatData);
            const FullChat = yield models_1.Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            return FullChat;
        }
        catch (error) {
            throw new utils_1.ApiError(http_status_1.default.BAD_REQUEST, 'failed');
        }
    }
});
exports.accessChat = accessChat;
exports.default = {
    getChats,
    accessChat: exports.accessChat
};
//# sourceMappingURL=chat.service.js.map