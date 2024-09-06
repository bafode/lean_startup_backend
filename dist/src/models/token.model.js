"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const types_1 = require("../types");
const plugins_1 = require("./plugins");
const tokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    },
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: types_1.EModelNames.USER,
        required: true,
    },
    type: {
        type: String,
        enum: [types_1.ETokenType.REFRESH, types_1.ETokenType.RESET_PASSWORD, types_1.ETokenType.VERIFY_EMAIL],
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});
tokenSchema.plugin(plugins_1.toJSON);
const Token = mongoose_1.default.model(types_1.EModelNames.TOKEN, tokenSchema);
exports.default = Token;
//# sourceMappingURL=token.model.js.map