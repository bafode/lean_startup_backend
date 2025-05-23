import { Request, Response } from "express";
import httpStatus from "http-status";
import { authService, tokenService, emailService,userService } from "../services";
import { EAuthType, EUserRole, IAppRequest, IUser } from "../types";
import { catchReq } from "../utils";

const register = catchReq(async (req: Request, res: Response) => {
  const data: IUser = req.body;
  data.role = EUserRole.USER;
  data.authType = req.body.authType || EAuthType.EMAIL;
  const user = await authService.register(data);
  if (data.authType === EAuthType.EMAIL) {
    const verificationCode = await tokenService.generateVerifyEmailCode(user.id);
    await emailService.sendVerificationEmail(req.body.email, verificationCode);
  }
  const tokens = await tokenService.generateAuthTokens(user.id);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: "User Registered Successfully",
    user,
    tokens,
  });
});

const login = catchReq(async (req, res) => {
  const { email, password } = req.body;
  const authType = req.body.authType || EAuthType.EMAIL;
  const user = await authService.login(email, password, authType);
  const tokens = await tokenService.generateAuthTokens(user.id);
  res.send({
    code: httpStatus.OK,
    message: "Login Success",
    user,
    tokens,
  });
});

const logout = catchReq(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Logout Success",
  });
});

const refreshTokens = catchReq(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchReq(async (req, res) => {
  const verificationCode = await tokenService.generateResetPasswordCode(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, verificationCode);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: `Un code de réinitialisation a été envoyé à ${req.body.email}`,
  });
});

const resetPassword = catchReq(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Mot de passe réinitialisé avec succès",
  });
});

const sendVerificationEmail = catchReq(async (req, res) => {
  const token = await tokenService.generateVerifyEmailCode(req.user);
  const loggedUser = await userService.getUserById(req.user);
  await emailService.sendVerificationEmail(loggedUser.email, token);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchReq(async (req, res) => {
  await authService.verifyEmail(req.body.token);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Email Verified Successfully",
  });
});

const getAgoraToken = catchReq(async (req, res) => {
  const token = await authService.getAgoraToken(req.query.channel_name);
  res.status(httpStatus.OK).json({
    code: 0,
    data: token,
    msg: 'Token retrieved successfully',
  });
});

const bind_fcmtoken = catchReq(async (req: IAppRequest, res: Response) => {
  const userId = req.user;
  const { fcmtoken } = req.query;
  await authService.bind_fcmtoken(userId.toString(), fcmtoken as string);
  res.status(httpStatus.OK).json({
    code: 0,
    data: "",
    msg: 'FCM token binded successfully',
  });
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
  bind_fcmtoken
};
