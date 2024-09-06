"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("../../config");
const types_1 = require("../../types");
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
const doc_route_1 = __importDefault(require("./doc.route"));
const post_route_1 = __importDefault(require("./post.route"));
const favorite_route_1 = __importDefault(require("./favorite.route"));
const chat_route_1 = __importDefault(require("./chat.route"));
const message_route_1 = __importDefault(require("./message.route"));
const routes = express_1.default.Router();
routes.use("/auth", auth_route_1.default);
routes.use("/users", user_route_1.default);
routes.use("/posts", post_route_1.default);
routes.use("/favorites", favorite_route_1.default);
routes.use("/chats", chat_route_1.default);
routes.use("/messages", message_route_1.default);
if (config_1.config.env === types_1.ENodeEnv.DEV) {
    routes.use("/docs", doc_route_1.default);
}
exports.default = routes;
//# sourceMappingURL=index.js.map