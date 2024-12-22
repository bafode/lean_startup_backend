import dotenv from "dotenv";
import Joi from "joi";
import { ENodeEnv } from "../types";

dotenv.config({ path: ".env" });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid(ENodeEnv.PROD, ENodeEnv.DEV, ENodeEnv.TEST)
      .required(),
    PORT: Joi.number().default(4000),
    MONGODB_URL: Joi.string().required().description("url for mongodb"),
    MONGODB_URL_DEV: Joi.string()
      .required()
      .description("url for mongodb in development"),
    TOKEN_SECRET: Joi.string().required().description("JWT secret key"),
    TOKEN_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    TOKEN_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    TOKEN_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    TOKEN_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    HOST: Joi.string()
      .default("http://127.0.0.1")
      .description("Application base url or hostname"),
    SENDGRID_API_KEY: Joi.string()
      .required()
      .description("Sendgrid api key required"),
    AGORA_APP_ID: Joi.string().required().description('Agora app id required'),
    AGORA_APP_CERTIFICATE: Joi.string().required().description('Agora app certificate required'),
    FIREBASE_DATABASE_URL: Joi.string().required().description('Firebase database url required'),
    FIREBASE_TYPE: Joi.string().required().description('Firebase type required'),
    FIREBASE_PROJECT_ID: Joi.string().required().description('Firebase project id required'),
    FIREBASE_PRIVATE_KEY_ID: Joi.string().required().description('Firebase private key id required'),
    FIREBASE_PRIVATE_KEY: Joi.string().required().description('Firebase private key required'),
    FIREBASE_CLIENT_EMAIL: Joi.string().required().description('Firebase client email required'),
    FIREBASE_CLIENT_ID: Joi.string().required().description('Firebase client id required'),
    FIREBASE_AUTH_URI: Joi.string().required().description('Firebase auth uri required'),
    FIREBASE_TOKEN_URI: Joi.string().required().description('Firebase token uri required'),
    FIREBASE_AUTH_PROVIDER_CERT_URL: Joi.string().required().description('Firebase auth provider cert url required'),
    FIREBASE_CLIENT_CERT_URL: Joi.string().required().description('Firebase client cert url required'),
    FIREBASE_UNIVERSE_DOMAIN: Joi.string().required().description('Firebase universe domain required'),

  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  host: envVars.HOST,
  mongoose: {
    url:
      envVars.NODE_ENV === ENodeEnv.PROD
        ? envVars.MONGODB_URL
        : envVars.MONGODB_URL_DEV +
        (envVars.NODE_ENV === ENodeEnv.TEST ? "-test" : ""),
    options: {
      autoIndex: true,
    },
  },
  jwt: {
    secret: envVars.TOKEN_SECRET,
    accessExpirationMinutes: envVars.TOKEN_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.TOKEN_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.TOKEN_RESET_PASSWORD_EXPIRATION_MINUTES,
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
  agora: {
    appId: envVars.AGORA_APP_ID,
    appCertificate: envVars.AGORA_APP_CERTIFICATE
  },
  firebase: {
    databaseURL: envVars.FIREBASE_DATABASE_URL,
    type: envVars.FIREBASE_TYPE,
    projectId: envVars.FIREBASE_PROJECT_ID,
    privateKeyId: envVars.FIREBASE_PRIVATE_KEY_ID,
    privateKey: envVars.FIREBASE_PRIVATE_KEY,
    clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
    clientId: envVars.FIREBASE_CLIENT_ID,
    authUri: envVars.FIREBASE_AUTH_URI,
    tokenUri: envVars.FIREBASE_TOKEN_URI,
    authProviderCertUrl: envVars.FIREBASE_AUTH_PROVIDER_CERT_URL,
    clientCertUrl: envVars.FIREBASE_CLIENT_CERT_URL,
    universeDomain: envVars.FIREBASE_UNIVERSE_DOMAIN,
  },
};
