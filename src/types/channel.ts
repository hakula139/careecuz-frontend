export interface ChannelForm {
  name: string;
}

export interface Channel extends ChannelForm {
  id: number;
  replyCount: number;
  lastReplyTime: string;
  isTop: boolean;
}
