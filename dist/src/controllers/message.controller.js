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
const services_1 = require("../services");
const utils_1 = require("../utils");
const getMessages = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, utils_1.pick)(req.query, ["chat", "post"]);
    const options = (0, utils_1.pick)(req.query, ["sortBy", "limit", "page"]);
    const result = yield services_1.messageService.getMessages(filter, options);
    res.send(result);
}));
const sendMessage = (0, utils_1.catchReq)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    data.sender = req.user;
    const result = yield services_1.messageService.sendMessage(data);
    res.send(result);
}));
exports.default = {
    getMessages,
    sendMessage
};
//# sourceMappingURL=message.controller.js.map