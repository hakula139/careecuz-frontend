import { ChannelForm } from '../channel';

export interface GetChannelReq {
  id: string;
}

export interface AddChannelReq {
  data: ChannelForm;
}

export type JoinChannel = GetChannelReq;

export type LeaveChannel = JoinChannel;
