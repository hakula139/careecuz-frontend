import { mock } from 'mockjs';

import {
  AddMessageResp, GetHistoryMessagesResp, GetMessageResp, PushNewMessage,
} from '@/types';
import { mockDatetimeTemplate } from './datetime';
import { mockRespTemplate } from './response';
import { mockUserTemplate } from './user';

const mockMessageBaseTemplate = {
  'id': '@increment',
  'user': mockUserTemplate,
  'content': '@cparagraph',
  'time|1': mockDatetimeTemplate,
  'replyTo|1': [0, '@integer(1, 10)'],
};

export const mockMessagListItemTemplate = {
  ...mockMessageBaseTemplate,
  'replyCount|1': [0, '@integer(1, 100)'],
  'lastReplyTime|1': mockDatetimeTemplate,
};

export const mockMessageTemplate = {
  ...mockMessageBaseTemplate,
  'replies|0-20': [
    {
      ...mockMessageBaseTemplate,
      replies: [],
    },
  ],
};

export const getMockGetHistoryMessagesResp = (): GetHistoryMessagesResp =>
  mock({
    ...mockRespTemplate,
    'data|20': [mockMessagListItemTemplate],
  });

export const getMockPushNewMessage = (): PushNewMessage =>
  mock({
    data: mockMessagListItemTemplate,
  });

export const getMockGetMessageResp = (): GetMessageResp =>
  mock({
    ...mockRespTemplate,
    data: mockMessageTemplate,
  });

export const mockAddMessageResp: AddMessageResp = mock({
  ...mockRespTemplate,
  id: '@integer(1, 1000)',
});
