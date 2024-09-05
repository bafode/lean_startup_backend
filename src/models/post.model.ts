import mongoose, { FilterQuery, Model, Schema } from "mongoose";
import { IPost, EModelNames, IPaginateOption, IComment } from "../types";
import { paginate, toJSON } from "./plugins";

interface IPostModel extends Model<IPost> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paginate?: (
    filter: FilterQuery<IPost>,
    options: IPaginateOption
  ) => Promise<[IPost, any]>;
}

const postCommentSchema: Schema<IComment> = new Schema({
  content: {
    type: String,
    trim: true,
    required: [true, "Please provide comment content"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: EModelNames.USER,
    required: [true, "Please provide user"],
  },

});

const postSchema: Schema<IPost> = new Schema(
  {
    title: {
      type: String,
      trim: true,
      // lowercase: true,
      required: [true, "Please provide title"],
    },
    content: {
      type: String,
      trim: true,
      // lowercase: true,
      required: [true, "Please provide post description"],
    },
    author: {
      // every post shuold blong to user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // add relationship
      required: [true, "author is required"],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: EModelNames.USER,
      default: [],
    },
    category: {
      type: String,
      lowercase: true,
      enum: ["inspiration", "communauté", "all"],
      default: "all",
      trim: true,
    },
    media: {
      type: [String],
      default: [],
    },
    comments: {
      type: [postCommentSchema],
      default: [],
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

// Plugin that converts mongoose to json
postSchema.plugin(toJSON);
postSchema.plugin(paginate);
postCommentSchema.plugin(toJSON);
postCommentSchema.plugin(paginate);

const Post = mongoose.model<IPost, IPostModel>(EModelNames.POST, postSchema);

export default Post;
