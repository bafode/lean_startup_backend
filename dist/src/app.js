"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const config_1 = require("./config");
const types_1 = require("./types");
const routes_1 = require("./routes");
const utils_1 = require("./utils");
const http_status_1 = __importDefault(require("http-status"));
const middlewares_1 = require("./middlewares");
const socket_1 = __importDefault(require("./socket"));
const app = (0, express_1.default)();
// set security HTTP headers
if (config_1.config.env === types_1.ENodeEnv.PROD) {
    app.use((0, helmet_1.default)());
}
// parse json request body
app.use(express_1.default.json());
// parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// sanitize request data
app.use((0, xss_clean_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
// gzip compression
app.use((0, compression_1.default)());
// Serve static files from the 'uploads' directory
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// enable cors
app.use((0, cors_1.default)());
app.options("*", (0, cors_1.default)());
// routes
app.use("/v1", routes_1.routeV1);
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new utils_1.ApiError(http_status_1.default.NOT_FOUND, "Not found"));
});
// convert any error to an ApiError
app.use(middlewares_1.errorConverter);
// handle error
app.use(middlewares_1.errorHandler);
// Create HTTP server and integrate socket.io
const server = (0, http_1.createServer)(app);
(0, socket_1.default)(server);
exports.default = app;
//# sourceMappingURL=app.js.map