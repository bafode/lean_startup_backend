import mongoose from 'mongoose';
import { ENotificationStatus, ENotificationType } from '../enums/notification.enum';

export interface INotificationBase {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  type: ENotificationType;
  status: ENotificationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationSocial extends INotificationBase {
  targetId?: mongoose.Types.ObjectId; // ID de la ressource concernée (post, commentaire, etc.) si c'est un ObjectId MongoDB
  targetStringId?: string; // ID de la ressource concernée si ce n'est pas un ObjectId MongoDB
  targetType?: string; // Type de la ressource (post, commentaire, etc.)
  message?: string; // Message personnalisé
  callType?: 'voice' | 'video' | 'text' | 'cancel' | 'accept';
  docId?: string;
}

export interface INotificationPush {
  userToken: string;
  userAvatar: string;
  userFirstName: string;
  userLastName: string;
  toToken: string;
  toFirstname?: string;
  toLastname?: string;
  toAvatar?: string;
  callType?: 'voice' | 'video' | 'text' | 'cancel' | 'accept';
  docId?: string;
  
  // Champs pour les notifications sociales
  type?: ENotificationType;
  targetId?: string;
  targetType?: string;
  message?: string;
}

export interface INotificationDocument extends mongoose.Document, INotificationSocial {
  // Méthodes de document si nécessaire
}
