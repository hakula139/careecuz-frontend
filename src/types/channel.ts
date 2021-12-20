import { Message } from './message';

export interface ChannelForm {
  name: string;
}

export interface ChannelListItem extends ChannelForm {
  id: number;
  replyCount: number;
  lastReplyTime: string;
  isTop: boolean;
}

export interface Channel extends ChannelForm {
  messages: Message[];
}
