import httpStatus from "http-status";
import mongoose, { FilterQuery, ObjectId } from "mongoose";
import { User } from "../models";
import { IUserDocument, IPaginateOption } from "../types";
import { ApiError } from "../utils";
import userService from "./user.service";
import postService from "./post.service";

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
  await postService.deletePostsByAuthorId(userId);
  return user;
};

const toggleUserFavorites = async (postStringId: string, userId:string ) => {
  
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const postIndex = user.favorites.findIndex((id) => id.toString() === postStringId);
  if (postIndex > -1) {
    user.favorites.splice(postIndex, 1);
  } else {
    user.favorites.push(new mongoose.Types.ObjectId(postStringId));
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
  const followIndex = user.following.findIndex((id) => id.toString() === followId);
  if (followIndex > -1) {
    user.following.splice(followIndex, 1);
    const followerIndex = followUser.followers.findIndex((id) => id.toString() === userId);
    if (followerIndex > -1) {
      followUser.followers.splice(followerIndex, 1);
    }
  } else {
    user.following.push(new mongoose.Types.ObjectId(followId));
    followUser.followers.push(new mongoose.Types.ObjectId(userId));
  }
  await user.save();
  await followUser.save();
  return user;
}


const getContacts = async (userId: string, filter: FilterQuery<IUserDocument>, options: IPaginateOption) => {
  const users = await User.paginate(
    { _id: { $ne: userId }, ...filter }, // Combine le filtre d'exclusion avec les autres filtres
    options
  );
  return users;
};

const getFollowers = async (userId: string, filter: FilterQuery<IUserDocument>, options: IPaginateOption) => {
  const user = await getUserById(userId);
  let followersIds: mongoose.Types.ObjectId[];
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  followersIds = user.followers
  const users = await User.paginate(
    { _id: { $in: followersIds }, ...filter }, 
    options
  );
  return users??[];
};

const getFollowings = async (userId: string, filter: FilterQuery<IUserDocument>, options: IPaginateOption) => {
  const user = await getUserById(userId);
  let followersIds: mongoose.Types.ObjectId[];
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  followersIds = user.following
  const users = await User.paginate(
    { _id: { $in: followersIds }, ...filter },
    options
  );
  return users ?? [];
};



export default {
  getUserById,
  updateUserById,
  deleteUserById,
  getOneUser,
  getUsers,
  toggleUserFavorites,
  toggleFollowUser,
  getContacts,
  getFollowers,
  getFollowings
};
