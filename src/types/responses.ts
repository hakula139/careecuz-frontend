import { ChannelInfo, ChannelListItem } from './channel';
import { Message } from './message';

export interface Resp {
  code: number;
  message?: string;
}

export interface GetChannelsResp extends Resp {
  data: ChannelListItem[];
}

export interface GetChannelResp extends Resp {
  data: ChannelInfo;
}

export interface PushNewMessage {
  data: Message;
}

export interface GetHistoryMessagesResp extends Resp {
  data: Message[];
}

export interface AddChannelResp extends Resp {
  id: number;
}
