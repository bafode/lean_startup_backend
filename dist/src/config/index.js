"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.config = void 0;
var app_config_1 = require("./app.config");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return __importDefault(app_config_1).default; } });
var logger_config_1 = require("./logger.config");
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return __importDefault(logger_config_1).default; } });
//# sourceMappingURL=index.js.map