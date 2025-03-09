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
  COMMENT= "Comment",
  MESSAGE = "Message",
  CHAT = "Chat",
  LANDING_CONTACT = "LandingContact",
  NOTIFICATION = "Notification",
}

export enum EUserRole {
  USER = "user",
  ADMIN = "admin",
}

export enum EGender {
  MALE = "male",
  FEMALE = "female",
}

export enum ESearchIndex{
  POST = "postsearch",
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

export enum EPostCategory {
  INSPIRATION = "inspiration",
  COMMUNAUTE = "communaute",
  ALL = "all",
}

export enum EPostDomain {
  DEV = "dev",
  DA = "da",
  UI_UX = "ui_ux",
  MARKETING = "marketing",
  ALL = "all",
}
