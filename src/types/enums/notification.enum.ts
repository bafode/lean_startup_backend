export enum ENotificationType {
  // Types de notifications d'appel uniformisés avec le frontend
  VOICE = 'voice',
  VIDEO = 'video',
  TEXT = 'text',
  CANCEL = 'cancel',
  ACCEPT = 'accept',
  
  // Anciens types pour la compatibilité
  VOICE_CALL = 'voice_call',
  VIDEO_CALL = 'video_call',
  TEXT_MESSAGE = 'text_message',
  CALL_CANCELED = 'call_canceled',
  ACCEPT_CALL = 'accept_call',
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow',
  MENTION = 'mention',
  TAG = 'tag',
  SHARE = 'share',
  NEW_POST = 'new_post',
  FRIEND_REQUEST = 'friend_request',
  FRIEND_ACCEPT = 'friend_accept',
  SYSTEM = 'system'
}

export enum ENotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}
