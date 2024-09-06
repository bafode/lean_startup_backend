"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const types_1 = require("../types");
const _1 = require(".");
const enumerateErrorFormat = winston_1.default.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(enumerateErrorFormat(), winston_1.default.format.uncolorize(), winston_1.default.format.splat(), winston_1.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'warn.log', level: 'warn' }),
        new winston_1.default.transports.File({ filename: 'server-output.log' })
    ],
});
if (_1.config.env !== types_1.ENodeEnv.PROD) {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(enumerateErrorFormat(), winston_1.default.format.colorize(), winston_1.default.format.splat(), winston_1.default.format.simple(), winston_1.default.format.printf(({ level, message }) => `${level}: ${message}`))
    }));
}
exports.default = logger;
//# sourceMappingURL=logger.config.js.map