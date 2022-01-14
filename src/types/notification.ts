import { MessageBase } from './message';

export interface NotificationBase {
  fromUserId: string;
  channelId: string;
  threadId: string;
}

export interface NotificationSummary extends NotificationBase {
  messageId: string;
}

export interface Notification extends NotificationBase {
  message: MessageBase;
  replyToMessage: MessageBase;
}
