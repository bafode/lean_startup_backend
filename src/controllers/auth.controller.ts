import { Request, Response } from "express";
import httpStatus from "http-status";
import { authService, tokenService, emailService } from "../services";
import { ETokenType, EUserRole, IUser } from "../types";
import { catchReq } from "../utils";

const register = catchReq(async (req: Request, res: Response) => {
  const data: IUser = req.body;
  data.role = EUserRole.USER;
  const user = await authService.register(req.body)
  const token = await tokenService.generateVerifyEmailCode(user.id);
  await emailService.sendVerificationEmail(req.body.email, token);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: "User Registered Successfully",
  });
});

const login = catchReq(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
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

  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchReq(async (req, res) => {
  const token = await tokenService.verifyToken(
    req.query.token,
    ETokenType.RESET_PASSWORD
  );
  await authService.resetPassword(token.user.toString(), req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchReq(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailCode(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchReq(async (req, res) => {
  await authService.verifyEmail(req.body.token);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Email Verified Successfully",
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
};
