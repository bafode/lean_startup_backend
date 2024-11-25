export enum ENodeEnv {
  DEV = "development",
  PROD = "production",
  TEST = "test",
}

export enum EModelNames {
  USER = "User",
  TOKEN = "Token",
  POST = "Post",
  FAVORITE = "Favorite",
  MESSAGE = "Message",
  CHAT = "Chat",
}

export enum EUserRole {
  USER = "user",
  ADMIN = "admin",
}

export enum EGender {
  MALE = "male",
  FEMALE = "female",
}

export enum ETokenType {
  ACCESS = "access",
  REFRESH = "refresh",
  RESET_PASSWORD = "resetPassword",
  VERIFY_EMAIL = "verifyEmail",
}

export enum EAuthType { 
  EMAIL = "email",
  GOOGLE = "google",
  FACEBOOK = "facebook",
  Apple = "apple",
}
