"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../types");
const plugins_1 = require("./plugins");
const postCommentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        trim: true,
        required: [true, "Please provide comment content"],
    },
    userFirstName: {
        type: String,
        trim: true,
        required: [true, "Please provide user first name"],
    },
    userLastName: {
        type: String,
        trim: true,
        required: [true, "Please provide user last name"],
    },
    userAvatar: {
        type: String,
        trim: true,
        required: [true, "Please provide user avatar"],
    },
});
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
        // lowercase: true,
        required: [true, "Please provide title"],
    },
    content: {
        type: String,
        trim: true,
        // lowercase: true,
        required: [true, "Please provide post description"],
    },
    author: {
        // every post shuold blong to user
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "author is required"],
    },
    likes: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: types_1.EModelNames.USER,
        default: [],
    },
    category: {
        type: String,
        lowercase: true,
        enum: ["inspiration", "communauté", "all"],
        default: "all",
        trim: true,
    },
    media: {
        type: [String],
        default: [],
    },
    comments: {
        type: [postCommentSchema],
        default: [],
    },
}, {
    timestamps: true,
    versionKey: false,
});
// Plugin that converts mongoose to json
postSchema.plugin(plugins_1.toJSON);
postSchema.plugin(plugins_1.paginate);
postCommentSchema.plugin(plugins_1.toJSON);
postCommentSchema.plugin(plugins_1.paginate);
const Post = mongoose_1.default.model(types_1.EModelNames.POST, postSchema);
exports.default = Post;
//# sourceMappingURL=post.model.js.map