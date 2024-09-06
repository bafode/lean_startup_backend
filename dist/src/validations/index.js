"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageValidation = exports.chatValidation = exports.favoriteValidation = exports.postValidation = exports.authValidation = exports.userValidation = exports.validation = void 0;
var validation_1 = require("./validation");
Object.defineProperty(exports, "validation", { enumerable: true, get: function () { return __importDefault(validation_1).default; } });
var user_validation_1 = require("./user.validation");
Object.defineProperty(exports, "userValidation", { enumerable: true, get: function () { return __importDefault(user_validation_1).default; } });
var auth_validation_1 = require("./auth.validation");
Object.defineProperty(exports, "authValidation", { enumerable: true, get: function () { return __importDefault(auth_validation_1).default; } });
var post_validation_1 = require("./post.validation");
Object.defineProperty(exports, "postValidation", { enumerable: true, get: function () { return __importDefault(post_validation_1).default; } });
var favorite_validation_1 = require("./favorite.validation");
Object.defineProperty(exports, "favoriteValidation", { enumerable: true, get: function () { return __importDefault(favorite_validation_1).default; } });
var chat_validation_1 = require("./chat.validation");
Object.defineProperty(exports, "chatValidation", { enumerable: true, get: function () { return __importDefault(chat_validation_1).default; } });
var message_validation_1 = require("./message.validation");
Object.defineProperty(exports, "messageValidation", { enumerable: true, get: function () { return __importDefault(message_validation_1).default; } });
//# sourceMappingURL=index.js.map