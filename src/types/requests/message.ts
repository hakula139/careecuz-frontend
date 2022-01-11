import { GetChannelReq } from './channel';
import { MessageForm } from '../message';

export interface GetHistoryMessagesReq extends GetChannelReq {
  lastMessageId?: string;
  maxMessageCount?: number;
}

export interface GetMessageReq {
  channelId: string;
  messageId: string;
}

export interface AddMessageReq {
  userId: string;
  userToken: string;
  channelId: string;
  data: MessageForm;
}
