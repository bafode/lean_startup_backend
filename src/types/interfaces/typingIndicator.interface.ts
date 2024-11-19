import mongoose from "mongoose";

export interface ITypingIdicator {
    senderUserId: mongoose.Schema.Types.ObjectId;
    receiverUserId: mongoose.Schema.Types.ObjectId;
}