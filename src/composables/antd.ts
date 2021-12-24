import { message } from 'ant-design-vue';
import 'ant-design-vue/lib/message/style/index.css';

import { NoticeType } from '@/types';

message.config({
  top: '88px',
  duration: 2,
  maxCount: 3,
});

export const openMessage = (type: NoticeType, content: string): void => {
  message[type](content);
};
