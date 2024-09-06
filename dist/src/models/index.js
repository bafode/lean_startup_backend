"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = exports.Message = exports.Favorite = exports.Post = exports.Token = exports.User = void 0;
var user_model_1 = require("./user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(user_model_1).default; } });
var token_model_1 = require("./token.model");
Object.defineProperty(exports, "Token", { enumerable: true, get: function () { return __importDefault(token_model_1).default; } });
var post_model_1 = require("./post.model");
Object.defineProperty(exports, "Post", { enumerable: true, get: function () { return __importDefault(post_model_1).default; } });
var favorite_model_1 = require("./favorite.model");
Object.defineProperty(exports, "Favorite", { enumerable: true, get: function () { return __importDefault(favorite_model_1).default; } });
var message_model_1 = require("./message.model");
Object.defineProperty(exports, "Message", { enumerable: true, get: function () { return __importDefault(message_model_1).default; } });
var chat_model_1 = require("./chat.model");
Object.defineProperty(exports, "Chat", { enumerable: true, get: function () { return __importDefault(chat_model_1).default; } });
//# sourceMappingURL=index.js.map