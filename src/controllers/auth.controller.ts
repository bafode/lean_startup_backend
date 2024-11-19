import { Request, Response } from "express";
import httpStatus from "http-status";
import { authService, tokenService, emailService,userService } from "../services";
import { ETokenType, EUserRole, IUser } from "../types";
import { catchReq } from "../utils";

const register = catchReq(async (req: Request, res: Response) => {
  console.log(req.body);
  const data: IUser = req.body;
  data.role = EUserRole.USER;
  const user = await authService.register(req.body)
  const verificationCode = await tokenService.generateVerifyEmailCode(user.id);
  await emailService.sendVerificationEmail(req.body.email, verificationCode);
  const tokens = await tokenService.generateAuthTokens(user.id);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: "User Registered Successfully",
    user,
    tokens,
  });
});

const login = catchReq(async (req, res) => {
  console.log(req.body);
   const { email, password,type } = req.body;
  const user = await authService.login(email, password,type);
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
  const token = await tokenService.generateVerifyEmailCode(
    req.user
  );
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
