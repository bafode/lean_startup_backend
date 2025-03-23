import httpStatus from 'http-status';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import { tokenService, userService } from './';
import { config } from '../config';
import { Token, User } from '../models';
import { ApiError } from '../utils';
import { EAuthType, ETokenType, IUser } from '../types';
import { isStrongPassword } from '../utils/validation.util';

const register = async (user: IUser) => {

  if (!isStrongPassword(user.password)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Erreur de Validation', [
      {
        field: 'password',
        message: 'Le mot de passe doit comporter au moins 8 caractères, inclure une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.',
      },
    ]);
  }

  if (await User.isEmailTaken(user.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Erreur de Validation', [
      {
        field: 'email',
        message: 'L\'email est déjà utilisé',
      },
    ]);
  }
  return User.create(user);
};

const login = async (email: string, password: string, authType: string) => {
  const user = await userService.getOneUser({ email });
  if (!user && authType !== EAuthType.EMAIL) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Compte Inéxistant", [
      {
        field: 'email',
        message: 'Utilisateur non trouvé, veuillez vous inscrire',
      },
    ]);
   }
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Erreur d'Authentification", [
      {
        field: 'email ou password',
        message: 'Email ou mot de passe incorrect',
      },
    ]);
  
  }
  if (authType === EAuthType.EMAIL && !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Erreur d'Authentification", [
      {
        field: 'password',
        message: 'Mot de passe incorrect',
      },
    ]);
  }
  return user;
};

const logout = async (refreshToken: string) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: ETokenType.REFRESH });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Erreur de Déconnexion', [
      {
        field: 'refreshToken',
        message: 'Token de rafraîchissement introuvable',
      },
    ]);
  }
  await Token.deleteMany({ user: refreshTokenDoc.user, type: ETokenType.REFRESH });
};

const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, ETokenType.REFRESH);
    const userId = refreshTokenDoc.user.toString();
    await refreshTokenDoc.remove();
    return await tokenService.generateAuthTokens(userId);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Validation Error', [
      {
        field: 'refreshToken',
        message: 'Invalid or expired refresh token',
      },
    ]);
  }
};

const resetPassword = async (token: string, newPassword: string) => {
  if (!isStrongPassword(newPassword)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Erreur de Validation', [
      {
        field: 'password',
        message: 'Le mot de passe doit comporter au moins 8 caractères, inclure une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.',
      },
    ]);
  }

  try {
    const verifyEmailTokenDoc = await tokenService.verifyCode(token, ETokenType.RESET_PASSWORD);
    if (!verifyEmailTokenDoc) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Erreur de Validation', [
        {
          field: 'token',
          message: 'Token de réinitialisation invalide ou expiré',
        },
      ]);
    }
    const user = await userService.getUserById(verifyEmailTokenDoc.user.toString());
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Validation Error', [
        {
          field: 'user',
          message: 'User not found',
        },
      ]);
    }
    await userService.updateUserById(user.id, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Validation Error', [
      {
        field: 'token',
        message: 'Invalid or expired reset token',
      },
    ]);
  }
};

const verifyEmail = async (verifyEmailToken: string) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyCode(verifyEmailToken, ETokenType.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user.toString());
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Validation Error', [
        {
          field: 'user',
          message: 'User not found',
        },
      ]);
    }
    await Token.deleteMany({ user: user.id, type: ETokenType.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Erreur de Vérification', [
      {
        field: 'verifyEmailToken',
        message: 'Token de vérification invalide ou exp',
      },
    ]);
  }
};

const getAgoraToken = async (channelName: string) => {
  try {
    const privilegeExpiredTs = Math.floor(Date.now() / 1000) + 3600;
    const uid = 0;
    const role = RtcRole.PUBLISHER;
    const token = RtcTokenBuilder.buildTokenWithUid(
      config.agora.appId,
      config.agora.appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );
    return token;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', [
      {
        field: 'agora',
        message: 'Failed to generate Agora token',
      },
    ]);
  }
};

const bind_fcmtoken = async (userId: string, fcmtoken: string) => {
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Validation Error', [
        {
          field: 'userId',
          message: 'User not found',
        },
      ]);
    }
    user.fcmtoken = fcmtoken;
    await user.save();
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', [
      {
        field: 'fcmtoken',
        message: 'Failed to bind FCM token',
      },
    ]);
  }
};

export default {
  register,
  login,
  refreshAuth,
  resetPassword,
  verifyEmail,
  logout,
  getAgoraToken,
  bind_fcmtoken,
};
