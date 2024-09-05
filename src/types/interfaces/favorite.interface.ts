import mongoose from "mongoose";

export interface IFavorite {
    post: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    _id: string;

}