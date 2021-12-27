import { User } from './user';

export interface MessageForm {
  content: string;
  replyTo: number;
}

interface MessageBase extends MessageForm {
  id: number;
  user: User;
  time: string;
}

export interface MessageSummary extends MessageBase {
  replyCount: number;
  lastReplyTime: string;
}

export interface Message extends MessageBase {
  replies: Message[];
}
