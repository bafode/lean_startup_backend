import httpStatus from 'http-status';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import { tokenService, userService } from './';
import { config } from '../config';
import { Token, User } from '../models';
import { ApiError } from '../utils';
import { EAuthType, ETokenType, IUser } from '../types';


const register = async (user: IUser) => {
  if (await User.isEmailTaken(user.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(user);
};

const login = async (email: string, password: string, authType: string) => {
  const user = await userService.getOneUser({ email });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (authType === EAuthType.EMAIL && !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};



/**
 * TODO --- Logout (Think about it) 
 */
const logout = async (refreshToken: string) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: ETokenType.REFRESH });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Renew authentication tokens
 */
const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, ETokenType.REFRESH);
    const userId = refreshTokenDoc.user.toString();
    await refreshTokenDoc.remove();
    return await tokenService.generateAuthTokens(userId);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token error');
  }
};

const resetPassword = async (token: string, newPassword: string) => {
  console.log('reset password', token);
  const verifyEmailTokenDoc = await tokenService.verifyCode(token, ETokenType.RESET_PASSWORD);
  const user = await userService.getUserById(verifyEmailTokenDoc.user.toString());
  try {
    await userService.updateUserById(user.id, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken: string) => {
  try {
    console.log('verifyEmailToken', verifyEmailToken);
    const verifyEmailTokenDoc = await tokenService.verifyCode(verifyEmailToken, ETokenType.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user.toString());
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: ETokenType.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed ' + error);
  }
};

const getAgoraToken = async (channelName: string) => {
  console.log('getAgoraToken', channelName);
  const privilegeExpiredTs = Math.floor(Date.now() / 1000) + 3600;
  const uid = 0;
  const role = RtcRole.PUBLISHER;
  try {
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
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'internal server error');
  }
};

const bind_fcmtoken = async (userId: string, fcmtoken: string) => {
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    user.fcmtoken = fcmtoken;
    await user.save();
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Role not found');
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
  bind_fcmtoken
};
