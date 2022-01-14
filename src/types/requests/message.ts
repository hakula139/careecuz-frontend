import { MessageForm } from '../message';

export interface GetHistoryMessagesReq {
  channelId: string;
  lastMessageId?: string;
  maxMessageCount?: number;
}

export interface GetMessageReq {
  channelId: string;
  threadId: string;
}

export interface AddMessageReq {
  channelId: string;
  threadId?: string;
  data: MessageForm;
}
