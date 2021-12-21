import { ChannelForm } from './channel';

export interface GetChannelReq {
  id: number;
}

export interface GetHistoryMessagesReq extends GetChannelReq {
  lastMessageId?: number;
  maxMessageCount?: number;
}

export interface AddChannelReq {
  data: ChannelForm;
}
