import mongoose, { Schema, model, Model, FilterQuery } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { EModelNames, ENotificationStatus, ENotificationType, INotificationDocument, IPaginateOption } from '../types';

interface INotificationModel extends Model<INotificationDocument> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paginate?: (filter: FilterQuery<INotificationDocument>, options: IPaginateOption) => Promise<[INotificationDocument, any]>;
}

const notificationSchema: Schema<INotificationDocument> = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: EModelNames.USER,
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: EModelNames.USER,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ENotificationType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ENotificationStatus),
      default: ENotificationStatus.UNREAD,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetType',
    },
    targetStringId: {
      type: String,
    },
    targetType: {
      type: String,
      enum: [EModelNames.POST, EModelNames.COMMENT, EModelNames.USER, 'message', 'call'],
    },
    message: {
      type: String,
    },
    callType: {
      type: String,
      enum: ['voice', 'video', 'text', 'cancel', 'accept'],
    },
    docId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Plugin that converts mongoose to json
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

// Indexes pour améliorer les performances des requêtes
notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ sender: 1, recipient: 1, type: 1 });

const Notification = model<INotificationDocument, INotificationModel>(
  EModelNames.NOTIFICATION,
  notificationSchema
);

export default Notification;
