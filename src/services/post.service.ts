import { ApiError } from "../utils";
import { EModelNames, ESearchIndex, IComment, IPaginateOption, IPost } from "../types";
import { Post, User } from "../models";
import mongoose, { FilterQuery, Schema } from "mongoose";
import httpStatus from "http-status";

const getPosts = async (
  filter: FilterQuery<IPost>,
  options: IPaginateOption
) => {
  if (filter.query && filter.query !== "" && filter.query.length > 2) {
    filter.searchIndex =ESearchIndex.POST;
  }
  if (options.sortBy === "nouveaute") {
    options.sortBy = "createdAt:desc";
  } else if (options.sortBy === "populaire") {
    options.sortBy = "likesCount:-1";
  } else if (options.sortBy === "domaine") { 
    options.sortBy = "category";
  } else {
    options.sortBy = "createdAt:desc";
  }
  
  options.populate = [
    { path: "author", select: "firstname lastname email school avatar", model: EModelNames.USER },
    {path: "likes", select: "firstname lastname email avatar", model: EModelNames.USER},
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
    { path: "author", select: "firstname lastname email school avatar", model: EModelNames.USER },
    { path: "likes", select: "firstname lastname email avatar", model: EModelNames.USER },
  ];
  const posts = await Post.paginate(filter, options);
  return posts;
}


const getPostByAuthorId = async (authorId: string) => {
  return await Post.find({ author: authorId }).sort({ createdAt: -1 });
};

const deletePostsByAuthorId = async (authorId: string) => { 
  await Post.deleteMany({ author: authorId });
  return true;
}

const getPostById = async (id: string) => {
  const post = await Post.findById(id).populate([
    { path: "likes", select: "firstname lastname email avatar" },
    { path: "author", select: "firstname lastname email school avatar" },
  ]);
  return post;
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
  try {
    // Valider les paramètres d'entrée
    if (!postId || !userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Post ID and User ID are required");
    }

    // Rechercher et mettre à jour le post en une seule opération
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
    }

    // Vérifier si l'utilisateur a déjà liké le post
    const hasLiked = post.likes.includes(userId);

    // Utiliser l'opérateur $pull ou $push selon le cas
    const updateOperation = hasLiked
      ? { $pull: { likes: userId }, $inc: { likesCount: -1 } }
      : { $push: { likes: userId }, $inc: { likesCount: 1 } };

    // Mettre à jour le document et récupérer la nouvelle version
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updateOperation,
      {
        new: true,
        runValidators: true
      }
    ).populate([
      {
        path: "likes",
        select: "firstname lastname email avatar",
      },
      {
        path: "author",
        select: "firstname lastname email avatar"
      }
    ]);

    if (!updatedPost) {
      throw new ApiError(httpStatus.NOT_FOUND, "Post not found after update");
    }

    return updatedPost;

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred while toggling like"
    );
  }
}
const updatePosts = async ()=>{
  const posts = await Post.find();
  posts.forEach(post => {
    post.likesCount = post.likes.length;
    post.save();
  });
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
  getLoggedUserPost,
  deletePostsByAuthorId,
};
