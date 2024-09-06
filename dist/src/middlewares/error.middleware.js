"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorConverter = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = require("../config");
const utils_1 = require("../utils");
const types_1 = require("../types");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof utils_1.ApiError)) {
        const statusCode = error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
        const message = error.message;
        error = new utils_1.ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};
exports.errorConverter = errorConverter;
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res) => {
    let { statusCode, message } = err;
    if (config_1.config.env === types_1.ENodeEnv.PROD && !err.isOperational) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = http_status_1.default[http_status_1.default.INTERNAL_SERVER_ERROR].toString();
    }
    res.locals.errorMessage = err.message;
    const response = Object.assign({ code: statusCode, message }, (config_1.config.env === types_1.ENodeEnv.DEV && { stack: err.stack }));
    config_1.logger.error(err);
    res.status(statusCode).send(response);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map