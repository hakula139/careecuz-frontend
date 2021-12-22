import { ChannelInfo, ChannelSummary } from './channel';
import { Message, MessageSummary } from './message';

export interface Resp {
  code: number;
  message?: string;
}

export interface GetChannelsResp extends Resp {
  data: ChannelSummary[];
}

export interface GetChannelResp extends Resp {
  data: ChannelInfo;
}

export interface AddChannelResp extends Resp {
  id: number;
}

export interface GetHistoryMessagesResp extends Resp {
  data: MessageSummary[];
}

export interface PushNewMessage {
  data: MessageSummary;
}

export interface GetMessageResp extends Resp {
  data: Message;
}
