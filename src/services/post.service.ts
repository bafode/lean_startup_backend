import { ApiError } from "../utils";
import { EModelNames, IComment, IPaginateOption, IPost } from "../types";
import { Post, User } from "../models";
import mongoose, { FilterQuery, Schema } from "mongoose";
import httpStatus from "http-status";

const getPosts = async (
  filter: FilterQuery<IPost>,
  options: IPaginateOption
) => {
   options.sortBy = "createdAt:desc";
  options.populate = [
    { path: "author", select: "firstname lastname email avatar", model: EModelNames.USER },
    {path: "likes", select: "firstname lastname email avatar", model: EModelNames.USER},
    // { path: "likes", select: "firstname lastname email avatar" },
  ];
  const posts = await Post.paginate(filter, options);
  return posts;
};

const getFavorites = async (
  userId: Schema.Types.ObjectId,
  filter: FilterQuery<IPost>,
  options: IPaginateOption
) => {

  const user = await User.findById(userId).select("favorites").lean();
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  // Add favorites to the filter
  filter._id = { $in: user.favorites };
  options.sortBy = "createdAt:desc";
  options.populate = [
    { path: "author", select: "firstname lastname email avatar", model: EModelNames.USER },
    { path: "likes", select: "firstname lastname email avatar", model: EModelNames.USER },
  ];
  const posts = await Post.paginate(filter, options);
  return posts;
};
const getLoggedUserPost = async (
  userId: Schema.Types.ObjectId,
  filter: FilterQuery<IPost>,
  options: IPaginateOption
) => { 
  filter.author = userId;
  options.sortBy = "createdAt:desc";
  options.populate = [
    { path: "author", select: "firstname lastname email avatar", model: EModelNames.USER },
    { path: "likes", select: "firstname lastname email avatar", model: EModelNames.USER },
  ];
  const posts = await Post.paginate(filter, options);
  return posts;
}


const getPostByAuthorId = async (authorId: string) => {
  return await Post.find({ author: authorId }).sort({ createdAt: -1 });
};

const getPostById = async (id: string) => {
  console.log(id);
  return await Post.findById(id).populate([
    { path: "likes", select: "firstname lastname email avatar" },
    { path: "author", select: "firstname lastname email avatar" },
  ]);
};

export const createPost = async (post: IPost) => {
  return (await Post.create(post)).populate([
    { path: "author", select: "firstname lastname email avatar", model: EModelNames.USER },
    { path: "likes", select: "firstname lastname email avatar", model: EModelNames.USER },
  ]);
};

const updatePostById = async (
  postId: string,
  updateBody: FilterQuery<IPost>
) => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  Object.assign(post, updateBody);
  await post.save();
  return post;
};

/**
 * Delete user by id
 * @param {ObjectId} postId
 * @returns {Promise<IPost>}
 */
const deletePostById = async (postId: string) => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  await Post.findByIdAndRemove(postId);
  return post;
};

const addCommentToPost = async (postId: string, comment: IComment) => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  post.comments.push(comment);
  await post.save();
  return post;
};

const toggleLikePost = async (postId: string, userId: mongoose.Schema.Types.ObjectId) => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  const userIndex = post.likes.indexOf(userId);
  if (userIndex > -1) {
    post.likes.splice(userIndex, 1);
  } else {
    post.likes.push(userId);
  }
  await post.save();
  return post.populate([
    { path: "likes", select: "firstname lastname email avatar" },
    { path: "author", select: "firstname lastname email avatar" },
  ]);
}

export default {
  createPost,
  getPosts,
  getPostById,
  updatePostById,
  deletePostById,
  getPostByAuthorId,
  addCommentToPost,
  toggleLikePost,
  getFavorites,
  getLoggedUserPost
};
