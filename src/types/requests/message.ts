import { MessageForm } from '../message';

export interface GetHistoryMessagesReq {
  channelId: string;
  lastMessageId?: string;
  maxMessageCount?: number;
}

export interface GetMessageReq {
  channelId: string;
  messageId: string;
}

export interface AddMessageReq {
  channelId: string;
  data: MessageForm;
}
