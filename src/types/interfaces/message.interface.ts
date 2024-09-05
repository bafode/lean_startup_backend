import mongoose from "mongoose";

export interface IMessage {
    sender: mongoose.Schema.Types.ObjectId;
    content: string;
    receiver: mongoose.Schema.Types.ObjectId;
    chat: mongoose.Schema.Types.ObjectId;
    readBy: mongoose.Schema.Types.ObjectId[];

}