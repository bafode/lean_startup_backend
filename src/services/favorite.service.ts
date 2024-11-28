import { ApiError } from "../utils";
import { EModelNames, IFavorite, IPaginateOption } from "../types";
import { Favorite, Post } from "../models";
import { FilterQuery } from "mongoose";
import httpStatus from "http-status";

const getFavorites = async (
    filter: FilterQuery<IFavorite>,
    options: IPaginateOption
) => {
    options.sortBy = "createdAt:desc";
    options.populate = [
        { path: "post" },
        { path: "user", select: "firstname lastname email avatar" },
    ];
    const favorites = await Favorite.paginate(filter, options);
    return favorites;
};




const toggleFavorite = async (postId: string, userId: string) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
    }
    const favorite = await Favorite.findOne({ post: postId, user: userId });
    if (favorite) {
        await Favorite.findByIdAndRemove(favorite._id);
        return { message: "Favorite removed" };
    }
    await Favorite.create({ post: postId, user: userId });
    return { message: "Favorite added" };
};

const getLoggedUserFavorites = async (filter: FilterQuery<IFavorite>,
    options: IPaginateOption) => {
    options.sortBy = "createdAt:desc";
    options.populate = [
        { path: "post", model: EModelNames.POST, },
        { path: "post.author", select: "firstname lastname email avatar", model: EModelNames.USER, },
        { path: "post.likes", select: "firstname lastname email avatar", model: EModelNames.USER }, 
    ];
    return await Favorite.paginate(filter, options);
};

export default {
    getFavorites,
    toggleFavorite,
    getLoggedUserFavorites
};
