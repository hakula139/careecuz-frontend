import { mock } from 'mockjs';

import { GetHistoryMessagesResp, PushNewMessage } from '@/types';
import { mockDatetimeTemplate } from './datetime';
import { mockRespTemplate } from './response';
import { mockUserTemplate } from './user';

export const mockMessageTemplate = {
  'id': '@increment',
  'user': mockUserTemplate,
  'content': '@cparagraph',
  'time|1': mockDatetimeTemplate,
  'replyTo|1': [0, '@integer(1, 10)'],
  'replies': [],
};

export const getMockPushNewMessage = (): PushNewMessage =>
  mock({
    data: mockMessageTemplate,
  });

export const getMockGetHistoryMessagesResp = (): GetHistoryMessagesResp =>
  mock({
    ...mockRespTemplate,
    'data|20': [mockMessageTemplate],
  });
