import mongoose, { FilterQuery, Model, Schema } from "mongoose";
import { EModelNames, IPaginateOption, IFavorite } from "../types";
import { paginate, toJSON } from "./plugins";

interface IFavoriteModel extends Model<IFavorite> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paginate?: (
        filter: FilterQuery<IFavorite>,
        options: IPaginateOption
    ) => Promise<[IFavorite, any]>;
}

const favoriteSchema: Schema<IFavorite> = new Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: EModelNames.POST,
            required: [true, "Please provide post"],
        },
        user: {
            // every post shuold blong to user
            type: mongoose.Schema.Types.ObjectId,
            ref: EModelNames.USER, // add relationship
            required: [true, "author is required"],
        },
    },

    {
        timestamps: true,
        versionKey: false,
    }
);

// Plugin that converts mongoose to json
favoriteSchema.plugin(toJSON);
favoriteSchema.plugin(paginate);

const Favorite = mongoose.model<IFavorite, IFavoriteModel>(EModelNames.FAVORITE, favoriteSchema);

export default Favorite;
