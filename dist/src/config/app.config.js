"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
const types_1 = require("../types");
dotenv_1.default.config({ path: ".env" });
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string()
        .valid(types_1.ENodeEnv.PROD, types_1.ENodeEnv.DEV, types_1.ENodeEnv.TEST)
        .required(),
    PORT: joi_1.default.number().default(4000),
    MONGODB_URL: joi_1.default.string().required().description("url for mongodb"),
    MONGODB_URL_DEV: joi_1.default.string()
        .required()
        .description("url for mongodb in development"),
    TOKEN_SECRET: joi_1.default.string().required().description("JWT secret key"),
    TOKEN_ACCESS_EXPIRATION_MINUTES: joi_1.default.number()
        .default(30)
        .description("minutes after which access tokens expire"),
    TOKEN_REFRESH_EXPIRATION_DAYS: joi_1.default.number()
        .default(30)
        .description("days after which refresh tokens expire"),
    TOKEN_RESET_PASSWORD_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description("minutes after which reset password token expires"),
    TOKEN_VERIFY_EMAIL_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description("minutes after which verify email token expires"),
    HOST: joi_1.default.string()
        .default("http://127.0.0.1")
        .description("Application base url or hostname"),
    SENDGRID_API_KEY: joi_1.default.string()
        .required()
        .description("Sendgrid api key required"),
})
    .unknown();
const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
exports.default = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    host: envVars.HOST,
    mongoose: {
        url: envVars.NODE_ENV === types_1.ENodeEnv.PROD
            ? envVars.MONGODB_URL
            : envVars.MONGODB_URL_DEV +
                (envVars.NODE_ENV === types_1.ENodeEnv.TEST ? "-test" : ""),
        options: {
            autoIndex: true,
        },
    },
    jwt: {
        secret: envVars.TOKEN_SECRET,
        accessExpirationMinutes: envVars.TOKEN_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.TOKEN_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.TOKEN_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.TOKEN_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    email: {
        sendgridAPIKey: envVars.SENDGRID_API_KEY,
    },
    cloudinary: {
        cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
        api_key: envVars.CLOUDINARY_API_KEY,
        api_secret: envVars.CLOUDINARY_API_SECRET,
    },
};
//# sourceMappingURL=app.config.js.map