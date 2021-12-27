import { ChannelForm } from '../channel';

export interface GetChannelReq {
  id: number;
}

export interface AddChannelReq {
  data: ChannelForm;
}
