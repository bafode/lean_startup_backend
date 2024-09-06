"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const plugins_1 = require("./plugins");
const types_1 = require("../types");
const userSchema = new mongoose_1.Schema({
    firstname: {
        type: String,
        trim: true,
    },
    lastname: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
    },
    gender: {
        type: String,
        enum: types_1.EGender,
    },
    avatar: {
        type: String,
        default: 'uploads/default.png'
    },
    description: {
        type: String,
        default: 'No description'
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        // used by the toJSON plugin
        private: true,
    },
    role: {
        type: String,
        enum: types_1.EUserRole,
        default: types_1.EUserRole.USER,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    accountClosed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Plugin that converts mongoose to json
userSchema.plugin(plugins_1.toJSON);
userSchema.plugin(plugins_1.paginate);
/**
 * Check if email is taken
 */
userSchema.statics.isEmailTaken = function (email, excludeUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email, _id: { $ne: excludeUserId } });
        return !!user;
    });
};
/**
 * Check if password matches the user's password
 */
userSchema.methods.isPasswordMatch = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const user = this;
        return bcryptjs_1.default.compare(password, user.get('password'));
    });
};
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const user = this;
        if (user.isModified('password')) {
            const hashedPass = yield bcryptjs_1.default.hash(user.get('password'), 8);
            user.set('password', hashedPass);
        }
        next();
    });
});
const User = (0, mongoose_1.model)(types_1.EModelNames.USER, userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map