"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = exports.chatController = exports.favoriteController = exports.postController = exports.authController = exports.userController = void 0;
var user_controller_1 = require("./user.controller");
Object.defineProperty(exports, "userController", { enumerable: true, get: function () { return __importDefault(user_controller_1).default; } });
var auth_controller_1 = require("./auth.controller");
Object.defineProperty(exports, "authController", { enumerable: true, get: function () { return __importDefault(auth_controller_1).default; } });
var post_controller_1 = require("./post.controller");
Object.defineProperty(exports, "postController", { enumerable: true, get: function () { return __importDefault(post_controller_1).default; } });
var favorite_controller_1 = require("./favorite.controller");
Object.defineProperty(exports, "favoriteController", { enumerable: true, get: function () { return __importDefault(favorite_controller_1).default; } });
var chat_controller_1 = require("./chat.controller");
Object.defineProperty(exports, "chatController", { enumerable: true, get: function () { return __importDefault(chat_controller_1).default; } });
var message_controller_1 = require("./message.controller");
Object.defineProperty(exports, "messageController", { enumerable: true, get: function () { return __importDefault(message_controller_1).default; } });
//# sourceMappingURL=index.js.map