import { message } from 'ant-design-vue';
import 'ant-design-vue/lib/message/style/index.css';

import { NoticeType } from '@/types';

message.config({
  top: '88px',
  maxCount: 1,
});

export const openMessage = (
  type: NoticeType,
  content: string,
  duration = 2,
  key?: string,
  onClick?: () => void,
): void => {
  message.open({
    type,
    content,
    duration,
    key,
    onClick: () => {
      if (onClick) onClick();
      message.destroy(key);
    },
  });
};
