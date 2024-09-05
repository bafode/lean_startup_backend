import mongoose, { FilterQuery, Model, Schema } from "mongoose";
import { EModelNames, IPaginateOption, IFavorite, IMessage } from "../types";
import { paginate, toJSON } from "./plugins";

interface IMessageModel extends Model<IMessage> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paginate?: (
        filter: FilterQuery<IMessage>,
        options: IPaginateOption
    ) => Promise<[IMessage, any]>;
}

const messageSchema: Schema<IMessage> = new Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: EModelNames.USER },
        content: { type: String, trim: true },
        receiver: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: EModelNames.CHAT },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: EModelNames.USER }],
    },

    {
        timestamps: true,
        versionKey: false,
    }
);

// Plugin that converts mongoose to json
messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

const Message = mongoose.model<IMessage, IMessageModel>(EModelNames.MESSAGE, messageSchema);

export default Message;
