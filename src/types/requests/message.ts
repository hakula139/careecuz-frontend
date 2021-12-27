import { GetChannelReq } from './channel';
import { MessageForm } from '../message';

export interface GetHistoryMessagesReq extends GetChannelReq {
  lastMessageId?: number;
  maxMessageCount?: number;
}

export interface GetMessageReq {
  channelId: number;
  messageId: number;
}

export interface AddMessageReq {
  userId: string;
  userToken: string;
  channelId: number;
  data: MessageForm;
}
