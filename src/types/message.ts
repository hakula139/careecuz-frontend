import { User } from './user';

export interface Message {
  id: number;
  user: User;
  content: string;
  time: string;
  replyTo: number;
  replies: Message[];
  lastReplyTime?: string;
}
