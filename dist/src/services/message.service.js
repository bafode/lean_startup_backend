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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const models_1 = require("../models");
const getMessages = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    options.sortBy = "createdAt:desc";
    options.populate = [
        { path: "sender", select: "firstname lastname email avatar" },
        { path: "chat" },
    ];
    const posts = yield models_1.Message.paginate(filter, options);
    return posts;
});
const sendMessage = (newMessage) => __awaiter(void 0, void 0, void 0, function* () {
    let message = yield models_1.Message.create(newMessage);
    message = yield message.populate("sender", "firstname lastname email avatar");
    message = yield message.populate("chat");
    message = yield models_1.User.populate(message, {
        path: "chat.users",
        select: "firstname lastname email avatar",
    });
    yield models_1.Chat.findByIdAndUpdate(message.chat, { latestMessage: message });
    return message;
});
exports.sendMessage = sendMessage;
exports.default = {
    getMessages, sendMessage: exports.sendMessage
};
//# sourceMappingURL=message.service.js.map