export interface ChannelInfo {
  name: string;
}

export interface ChannelForm extends ChannelInfo {}

export interface ChannelSummary extends ChannelInfo {
  id: number;
  replyCount: number;
  lastReplyTime: string;
  isTop: boolean;
}
