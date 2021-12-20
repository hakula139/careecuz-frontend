import { ChannelListItem } from './channel';

export interface Resp {
  code: number;
  message?: string;
}

export interface GetChannelsResp extends Resp {
  data: ChannelListItem[];
}

export interface AddChannelResp extends Resp {
  id: number;
}
