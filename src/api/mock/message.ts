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

export const mockPushNewMessage: PushNewMessage = mock({
  data: mockMessageTemplate,
});

export const mockGetHistoryMessagesResp: GetHistoryMessagesResp = mock({
  ...mockRespTemplate,
  'data|50': [mockMessageTemplate],
});
