"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../controllers");
const middlewares_1 = require("../../middlewares");
const types_1 = require("../../types");
const validations_1 = require("../../validations");
const router = express_1.default.Router();
router.post("/", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), (0, middlewares_1.validate)(validations_1.chatValidation.accessChat), controllers_1.chatController.accessChat);
router.get("/", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), (0, middlewares_1.validate)(validations_1.chatValidation.getChats), controllers_1.chatController.getChats);
exports.default = router;
//# sourceMappingURL=chat.route.js.map