import httpStatus from "http-status";
import mongoose, { FilterQuery } from "mongoose";
import { User } from "../models";
import { IUserDocument, IPaginateOption } from "../types";
import { ApiError } from "../utils";

const getUsers = async (
  filter: FilterQuery<IUserDocument>,
  options: IPaginateOption
) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getUserById = async (id: string) => {
  return await User.findById(id);
};

const getOneUser = async (filter: FilterQuery<IUserDocument>) => {
  return await User.findOne(filter);
};

const updateUserById = async (
  userId: string,
  updateBody: FilterQuery<IUserDocument>
) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (
    updateBody.email &&
    (await User.isEmailTaken(updateBody.email.toString(), userId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<IUserDocument>}
 */
const deleteUserById = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

const toggleUserFavorites = async (postStringId: string, userId:string ) => {
  
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const postId =new  mongoose.Types.ObjectId(postStringId);
 
  const postIndex = user.favorites.indexOf(postId);
  if (postIndex > -1) {
    user.favorites.splice(postIndex, 1);
  } else {
    user.favorites.push(postId);
  }
  await user.save();
  return user
}

const toggleFollowUser = async (userId: string, followId: string) => { 
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const followUser = await getUserById(followId);
  if (!followUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "Follow user not found");
  }
  const followIndex = user.following.indexOf(new mongoose.Types.ObjectId(followId));
  if (followIndex > -1) {
    user.following.splice(followIndex, 1);
    followUser.followers.splice(followUser.followers.indexOf(new mongoose.Types.ObjectId(userId)), 1);
  } else {
    user.following.push(new mongoose.Types.ObjectId(followId));
    followUser.followers.push(new mongoose.Types.ObjectId(userId));
  }
  await user.save();
  await followUser.save();
  return user;
}

export default {
  getUserById,
  updateUserById,
  deleteUserById,
  getOneUser,
  getUsers,
  toggleUserFavorites,
  toggleFollowUser
};
