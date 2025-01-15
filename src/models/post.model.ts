import mongoose, { FilterQuery, Model, Schema } from "mongoose";
import { IPost, EModelNames, IPaginateOption, IComment, EPostCategory, EPostDomain } from "../types";
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
  userFirstName: {
    type: String,
    trim: true,
    required: [true, "Please provide user first name"],
  },
  userLastName: {
    type: String,
    trim: true,
    required: [true, "Please provide user last name"],
  },
  userAvatar: {
    type: String,
    trim: true,
    required: [true, "Please provide user avatar"],
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
    likesCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: EPostCategory.ALL,
      enum:EPostCategory,
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
    domain: {
      type: [String],
      enum: EPostDomain,
      default: [EPostDomain.ALL],
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

// Plugin that converts mongoose to json
postSchema.plugin(paginate);
postSchema.plugin(toJSON);
//postCommentSchema.plugin(paginate);
postCommentSchema.plugin(toJSON);


const Post = mongoose.model<IPost, IPostModel>(EModelNames.POST, postSchema);

export default Post;
