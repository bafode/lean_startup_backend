import httpStatus from "http-status";
import mongoose, { FilterQuery} from "mongoose";
import { Post, User } from "../models";
import { IUserDocument, IPaginateOption } from "../types";
import { ApiError, isStrongPassword } from "../utils";
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Validation Error', [
      {
        field: 'userId',
        message: 'User not found',
      },
    ]);
  }
  if (
    updateBody.email &&
    (await User.isEmailTaken(updateBody.email.toString(), userId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Validation Error', [
      {
        field: 'email',
        message: 'Email already taken',
      },
    ]);
  }
  if (updateBody.password&&!isStrongPassword(updateBody.password)) {
     throw new ApiError(httpStatus.BAD_REQUEST, 'Erreur de Validation', [
          {
            field: 'password',
            message: 'Le mot de passe doit comporter au moins 8 caractères, inclure une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.',
          },
        ]);

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
  await User.deleteOne({ _id: userId });
  await postService.deletePostsByAuthorId(userId);
  return user;
};

const toggleUserFavorites = async (postId: string, userId: string) => {
  try {
    // Vérifier l'existence du post avant de procéder
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
    }

    // Vérifier l'existence de l'utilisateur
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Utiliser directement les opérateurs MongoDB pour la mise à jour
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        [user.favorites.includes(new mongoose.Types.ObjectId(postId)) ? '$pull' : '$addToSet']: {
          favorites: postId
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new ApiError(httpStatus.NOT_FOUND, "Failed to update user favorites");
    }

    return updatedUser;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to toggle favorite: ${error.message}`
      );
  }
};

const toggleFollowUser = async (userId: string, followId: string) => {
  if (userId === followId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Validation Error', [
      {
        field: 'followId',
        message: 'Users cannot follow themselves',
      },
    ]);
  }

  const [user, followUser] = await Promise.all([
    getUserById(userId),
    getUserById(followId),
  ]);

  if (!user || !followUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Validation Error',
      !user
        ? [{ field: 'userId', message: 'User not found' }]
        : [{ field: 'followId', message: 'Follow user not found' }]
    );
  }

  // Utiliser les méthodes MongoDB natives pour une meilleure performance
  const isFollowing = user.following.includes(new mongoose.Types.ObjectId(followId));

  if (isFollowing) {
    // Retirer les relations en utilisant $pull
    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $pull: { following: followId }
      }),
      User.findByIdAndUpdate(followId, {
        $pull: { followers: userId }
      })
    ]);
  } else {
    // Ajouter les relations en utilisant $addToSet pour éviter les doublons
    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $addToSet: { following: followId }
      }),
      User.findByIdAndUpdate(followId, {
        $addToSet: { followers: userId }
      })
    ]);
  }

  // Retourner l'utilisateur mis à jour
  return await getUserById(userId);
};

const getContacts = async (userId: string, filter: FilterQuery<IUserDocument>, options: IPaginateOption) => {
  options.limit = 200;
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Combine followers and following lists and remove duplicates
  const contactIds = [...new Set([...user.followers, ...user.following])];

  const users = await User.paginate(
    { _id: { $in: contactIds, $ne: userId }, ...filter },
    options
  );
  return users;
};

const getFollowers = async (userId: string, filter: FilterQuery<IUserDocument>, options: IPaginateOption) => {
  options.limit = 200;
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
  options.limit = 200;
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
