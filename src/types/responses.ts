import { Channel } from './channel';

export interface Resp {
  code: number;
  message: string;
}

export interface GetChannelsResp extends Resp {
  data: Channel[];
}
