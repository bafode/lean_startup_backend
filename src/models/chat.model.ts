import mongoose, { FilterQuery, Model, Schema } from "mongoose";
import { EModelNames, IPaginateOption, IFavorite, IMessage, IChat } from "../types";
import { paginate, toJSON } from "./plugins";

interface IChatModel extends Model<IChat> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paginate?: (
        filter: FilterQuery<IChat>,
        options: IPaginateOption
    ) => Promise<[IChat, any]>;
}

const chatSchema: Schema<IChat> = new Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: EModelNames.USER }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: EModelNames.MESSAGE,
        },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: EModelNames.USER },
    },

    {
        timestamps: true,
        versionKey: false,
    }
);

// Plugin that converts mongoose to json
chatSchema.plugin(toJSON);
chatSchema.plugin(paginate);

const Chat = mongoose.model<IChat, IChatModel>(EModelNames.CHAT, chatSchema);

export default Chat;
