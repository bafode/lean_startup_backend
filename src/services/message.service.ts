import { IMessage, IPaginateOption } from "../types";
import { Chat, Message, User } from "../models";
import { FilterQuery } from "mongoose";

const getMessages = async (
    filter: FilterQuery<IMessage>,
    options: IPaginateOption
) => {
    options.sortBy = "createdAt:desc";
    options.populate = [
        { path: "sender", select: "firstname lastname email avatar" },
        { path: "chat" },
    ];
    const posts = await Message.paginate(filter, options);
    return posts;
};




export const sendMessage = async (newMessage: IMessage) => {
    let message: any = await Message.create(newMessage);

    message = await message.populate("sender", "firstname lastname email avatar");
    message = await message.populate("chat");
    message = await User.populate(message, {
        path: "chat.users",
        select: "firstname lastname email avatar",
    });

    await Chat.findByIdAndUpdate(message.chat, { latestMessage: message });

    return message;
};



export default {
    getMessages, sendMessage
};
