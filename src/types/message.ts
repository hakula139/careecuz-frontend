import { User } from './user';

interface MessageBase {
  id: number;
  user: User;
  content: string;
  time: string;
  replyTo: number;
}

export interface MessageSummary extends MessageBase {
  replyCount: number;
  lastReplyTime: string;
}

export interface Message extends MessageBase {
  replies: Message[];
}
