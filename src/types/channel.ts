export interface ChannelInfo {
  name: string;
}

export interface ChannelForm extends ChannelInfo {}

export interface ChannelListItem extends ChannelForm {
  id: number;
  replyCount: number;
  lastReplyTime: string;
  isTop: boolean;
}
