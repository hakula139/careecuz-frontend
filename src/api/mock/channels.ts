import { mock } from 'mockjs';

import { AddChannelResp, GetChannelResp, GetChannelsResp } from '@/types';
import { mockDatetimeTemplate } from './datetime';
import { mockRespTemplate } from './response';

export const mockChannelInfoTemplate = {
  name: '@ctitle',
};

export const mockChannelListItemTemplate = {
  ...mockChannelInfoTemplate,
  'id': '@increment',
  'replyCount|1': [0, '@integer(1, 1000)'],
  'lastReplyTime|1': mockDatetimeTemplate,
  'isTop': '@boolean',
};

export const mockGetChannelsResp: GetChannelsResp = mock({
  ...mockRespTemplate,
  'data|0-50': [mockChannelListItemTemplate],
});

export const mockGetChannelResp: GetChannelResp = mock({
  ...mockRespTemplate,
  data: mockChannelInfoTemplate,
});

export const mockAddChannelResp: AddChannelResp = mock({
  ...mockRespTemplate,
  id: '@integer(1, 1000)',
});
