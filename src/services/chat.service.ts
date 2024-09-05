import { EModelNames, IChat, IPaginateOption } from "../types";
import { Chat, Message, User } from "../models";
import { FilterQuery } from "mongoose";
import { ApiError } from "../utils";
import httpStatus from "http-status";

const getChats = async (
    filter: FilterQuery<IChat>,
    options: IPaginateOption
) => {
    options.sortBy = "updatedAt:-1";
    options.populate = [
        { path: "users", select: "-password", model: EModelNames.USER },
        { path: "latestMessage" },
        { path: "groupAdmin", select: "-password" },
    ];
    let results: any = await Chat.paginate(filter, options);
    results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "firstname lastname email avatar",
    });
    return results;
};




export const accessChat = async (userId: string, loggedUserId: string) => {
    var isChat: any = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: loggedUserId } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "firstname lastname email avatar",
    });

    if (isChat.length > 0) {
        return isChat[0];
    } else {
        var chatData = {
            chatName: loggedUserId,
            isGroupChat: false,
            users: [loggedUserId, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            return FullChat;
        } catch (error) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'failed');

        }
    }
};



export default {
    getChats,
    accessChat
};
