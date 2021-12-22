import { ChannelForm } from './channel';

export interface GetChannelReq {
  id: number;
}

export interface AddChannelReq {
  data: ChannelForm;
}

export interface GetHistoryMessagesReq extends GetChannelReq {
  lastMessageId?: number;
  maxMessageCount?: number;
}

export interface GetMessageReq {
  channelId: number;
  messageId: number;
}
