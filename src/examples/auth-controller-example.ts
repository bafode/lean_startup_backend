import { Request, Response } from "express";
import httpStatus from "http-status";
import { authService, tokenService, emailService, userService } from "../services";
import { EAuthType, EUserRole, IAppRequest, IUser } from "../types";
import { catchReq, response, ApiError } from "../utils";

/**
 * Exemple d'implémentation améliorée du contrôleur d'authentification
 * avec une meilleure gestion des erreurs et des réponses standardisées
 */

const register = catchReq(async (req: Request, res: Response) => {
  try {
    // Préparer les données utilisateur
    const userData: IUser = req.body;
    userData.role = EUserRole.USER;
    userData.authType = req.body.authType || EAuthType.EMAIL;
    
    // Créer l'utilisateur
    const user = await authService.register(userData);
    
    // Envoyer un email de vérification si nécessaire
    if (userData.authType === EAuthType.EMAIL) {
      const verificationCode = await tokenService.generateVerifyEmailCode(user.id);
      await emailService.sendVerificationEmail(req.body.email, verificationCode);
    }
    
    // Générer les tokens d'authentification
    const tokens = await tokenService.generateAuthTokens(user.id);
    
    // Envoyer la réponse
    res.status(httpStatus.CREATED).send(response({
      data: { user, tokens },
      success: true,
      error: false,
      message: "Inscription réussie",
      status: httpStatus.CREATED
    }));
  } catch (error) {
    // Le middleware d'erreur s'occupera de formater l'erreur
    throw error;
  }
});

const login = catchReq(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const authType = req.body.authType || EAuthType.EMAIL;
    
    // Authentifier l'utilisateur
    const user = await authService.login(email, password, authType);
    
    // Générer les tokens d'authentification
    const tokens = await tokenService.generateAuthTokens(user.id);
    
    // Envoyer la réponse
    res.send(response({
      data: { user, tokens },
      success: true,
      error: false,
      message: "Connexion réussie",
      status: httpStatus.OK
    }));
  } catch (error) {
    // Le middleware d'erreur s'occupera de formater l'erreur
    throw error;
  }
});

const logout = catchReq(async (req: Request, res: Response) => {
  try {
    await authService.logout(req.body.refreshToken);
    
    res.status(httpStatus.OK).send(response({
      data: null,
      success: true,
      error: false,
      message: "Déconnexion réussie",
      status: httpStatus.OK
    }));
  } catch (error) {
    throw error;
  }
});

const refreshTokens = catchReq(async (req: Request, res: Response) => {
  try {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    
    res.send(response({
      data: tokens,
      success: true,
      error: false,
      message: "Tokens rafraîchis avec succès",
      status: httpStatus.OK
    }));
  } catch (error) {
    throw error;
  }
});

const forgotPassword = catchReq(async (req: Request, res: Response) => {
  try {
    // Vérifier si l'email existe
    const user = await userService.getOneUser({ email: req.body.email });
    
    // Générer et envoyer le code de réinitialisation si l'utilisateur existe
    if (user) {
      const verificationCode = await tokenService.generateResetPasswordCode(req.body.email);
      await emailService.sendResetPasswordEmail(req.body.email, verificationCode);
    }
    
    // Toujours renvoyer un message de succès pour éviter les attaques par énumération
    res.status(httpStatus.OK).send(response({
      data: null,
      success: true,
      error: false,
      message: "Si un compte existe avec cet email, un email de réinitialisation de mot de passe a été envoyé",
      status: httpStatus.OK
    }));
  } catch (error) {
    throw error;
  }
});

const resetPassword = catchReq(async (req: Request, res: Response) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    
    res.status(httpStatus.OK).send(response({
      data: null,
      success: true,
      error: false,
      message: "Mot de passe réinitialisé avec succès",
      status: httpStatus.OK
    }));
  } catch (error) {
    throw error;
  }
});

const sendVerificationEmail = catchReq(async (req: IAppRequest, res: Response) => {
  try {
    // Générer un nouveau code de vérification
    const token = await tokenService.generateVerifyEmailCode(req.user.toString());
    
    // Récupérer l'email de l'utilisateur
    const loggedUser = await userService.getUserById(req.user.toString());
    
    // Envoyer l'email de vérification
    await emailService.sendVerificationEmail(loggedUser.email, token);
    
    res.status(httpStatus.OK).send(response({
      data: null,
      success: true,
      error: false,
      message: "Email de vérification envoyé avec succès",
      status: httpStatus.OK
    }));
  } catch (error) {
    throw error;
  }
});

const verifyEmail = catchReq(async (req: Request, res: Response) => {
  try {
    await authService.verifyEmail(req.body.token);
    
    res.status(httpStatus.OK).send(response({
      data: null,
      success: true,
      error: false,
      message: "Email vérifié avec succès",
      status: httpStatus.OK
    }));
  } catch (error) {
    throw error;
  }
});

const getAgoraToken = catchReq(async (req: Request, res: Response) => {
  try {
    const channelName = req.query.channel_name as string;
    
    if (!channelName) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Le nom du canal est requis");
    }
    
    const token = await authService.getAgoraToken(channelName);
    
    res.status(httpStatus.OK).send(response({
      data: token,
      success: true,
      error: false,
      message: "Token Agora généré avec succès",
      status: httpStatus.OK
    }));
  } catch (error) {
    throw error;
  }
});

const bindFcmToken = catchReq(async (req: IAppRequest, res: Response) => {
  try {
    const userId = req.user;
    const fcmtoken = req.query.fcmtoken as string;
    
    if (!fcmtoken) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Le token FCM est requis");
    }
    
    await authService.bind_fcmtoken(userId.toString(), fcmtoken);
    
    res.status(httpStatus.OK).send(response({
      data: null,
      success: true,
      error: false,
      message: "Token FCM associé avec succès",
      status: httpStatus.OK
    }));
  } catch (error) {
    throw error;
  }
});

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  getAgoraToken,
  bindFcmToken
};
