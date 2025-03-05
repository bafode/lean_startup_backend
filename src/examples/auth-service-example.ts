import httpStatus from 'http-status';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import { tokenService, userService } from '../services';
import { config } from '../config';
import { Token, User } from '../models';
import { ApiError } from '../utils';
import { EAuthType, ETokenType, IUser } from '../types';

/**
 * Exemple d'implémentation améliorée du service d'authentification
 * avec une meilleure gestion des erreurs
 */

const register = async (user: IUser) => {
  // Vérifier si l'email est déjà pris
  if (await User.isEmailTaken(user.email)) {
    throw new ApiError(
      httpStatus.CONFLICT, 
      'Cet email est déjà utilisé'
    );
  }
  
  try {
    return await User.create(user);
  } catch (error: any) {
    // Gérer les erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Erreur de validation des données utilisateur',
        true,
        error.stack
      );
    }
    
    // Gérer les erreurs de duplication MongoDB (au cas où la vérification précédente échouerait)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      throw new ApiError(
        httpStatus.CONFLICT,
        `Le champ ${field} avec la valeur '${value}' existe déjà`,
        true,
        error.stack
      );
    }
    
    // Autres erreurs
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Erreur lors de la création du compte',
      false,
      error.stack
    );
  }
};

const login = async (email: string, password: string, authType: string) => {
  try {
    const user = await userService.getOneUser({ email });

    // Utilisateur non trouvé
    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED, 
        'Email ou mot de passe incorrect'
      );
    }
    
    // Vérification du mot de passe pour l'authentification par email
    if (authType === EAuthType.EMAIL && !(await user.isPasswordMatch(password))) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED, 
        'Email ou mot de passe incorrect'
      );
    }
    
    // Vérifier si l'email est vérifié (si nécessaire)
      if (
        //   config.emailVerificationRequired &&
          !user.isEmailVerified) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Veuillez vérifier votre email avant de vous connecter',
        true
      );
    }
    
    return user;
  } catch (error) {
    // Si ce n'est pas déjà une ApiError, la convertir
    if (!(error instanceof ApiError)) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Erreur lors de la connexion',
        false,
        error.stack
      );
    }
    throw error;
  }
};

const logout = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await Token.findOne({ 
      token: refreshToken, 
      type: ETokenType.REFRESH 
    });
    
    if (!refreshTokenDoc) {
      throw new ApiError(
        httpStatus.NOT_FOUND, 
        'Token de rafraîchissement non trouvé'
      );
    }
    
    await refreshTokenDoc.remove();
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Erreur lors de la déconnexion',
        false,
        error.stack
      );
    }
    throw error;
  }
};

const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, ETokenType.REFRESH);
    const userId = refreshTokenDoc.user.toString();
    await refreshTokenDoc.remove();
    return await tokenService.generateAuthTokens(userId);
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED, 
      'Session expirée, veuillez vous reconnecter',
      true,
      error.stack
    );
  }
};

const resetPassword = async (token: string, newPassword: string) => {
  try {
    // Vérifier le token de réinitialisation
    const resetPasswordTokenDoc = await tokenService.verifyCode(token, ETokenType.RESET_PASSWORD);
    
    if (!resetPasswordTokenDoc) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Token de réinitialisation invalide ou expiré'
      );
    }
    
    // Récupérer l'utilisateur
    const user = await userService.getUserById(resetPasswordTokenDoc.user.toString());
    
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Utilisateur non trouvé'
      );
    }
    
    // Mettre à jour le mot de passe
    await userService.updateUserById(user.id, { password: newPassword });
    
    // Supprimer tous les tokens de réinitialisation pour cet utilisateur
    await Token.deleteMany({ 
      user: user.id, 
      type: ETokenType.RESET_PASSWORD 
    });
    
    // Optionnel: déconnecter l'utilisateur de tous les appareils
    // await Token.deleteMany({ user: user.id, type: ETokenType.REFRESH });
    
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Erreur lors de la réinitialisation du mot de passe',
        false,
        error.stack
      );
    }
    throw error;
  }
};

const verifyEmail = async (verifyEmailToken: string) => {
  try {
    // Vérifier le token de vérification d'email
    const verifyEmailTokenDoc = await tokenService.verifyCode(
      verifyEmailToken, 
      ETokenType.VERIFY_EMAIL
    );
    
    if (!verifyEmailTokenDoc) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Code de vérification invalide ou expiré'
      );
    }
    
    // Récupérer l'utilisateur
    const user = await userService.getUserById(verifyEmailTokenDoc.user.toString());
    
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Utilisateur non trouvé'
      );
    }
    
    // Marquer l'email comme vérifié
    await userService.updateUserById(user.id, { isEmailVerified: true });
    
    // Supprimer tous les tokens de vérification pour cet utilisateur
    await Token.deleteMany({ 
      user: user.id, 
      type: ETokenType.VERIFY_EMAIL 
    });
    
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Erreur lors de la vérification de l\'email',
        false,
        error.stack
      );
    }
    throw error;
  }
};

const getAgoraToken = async (channelName: string) => {
  if (!channelName) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Le nom du canal est requis'
    );
  }
  
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
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR, 
      'Erreur lors de la génération du token Agora',
      false,
      error.stack
    );
  }
};

const bindFcmToken = async (userId: string, fcmtoken: string) => {
  // Validation des entrées
  if (!userId || !fcmtoken) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'L\'ID utilisateur et le token FCM sont requis'
    );
  }
  
  try {
    const user = await userService.getUserById(userId);
    
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND, 
        'Utilisateur non trouvé'
      );
    }
    
    user.fcmtoken = fcmtoken;
    await user.save();
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Erreur lors de l\'association du token FCM',
        false,
        error.stack
      );
    }
    throw error;
  }
};

export default {
  register,
  login,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  getAgoraToken,
  bindFcmToken
};
