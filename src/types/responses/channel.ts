import { Resp } from './base';
import { ChannelInfo, ChannelSummary } from '../channel';

export interface GetChannelsResp extends Resp {
  data?: ChannelSummary[];
}

export interface GetChannelResp extends Resp {
  data?: ChannelInfo;
}

export interface AddChannelResp extends Resp {
  id?: number;
}
