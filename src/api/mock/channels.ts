import { mock } from 'mockjs';

import { AddChannelResp, GetChannelsResp } from '@/types';
import { mockRespTemplate } from './response';

export const mockChannelTemplate = {
  'id': '@increment',
  'name': '@ctitle',
  'replyCount': '@integer(0, 999)',
  'lastReplyTime|1': [
    '@datetime',
    '@now("year")',
    '@now("month")',
    '@now("week")',
    '@now("day")',
    '@now("hour")',
    '@now("minute")',
    '@now("second")',
  ],
  'isTop': '@boolean',
};

export const mockGetChannelsResp: GetChannelsResp = mock({
  ...mockRespTemplate,
  'data|0-50': [mockChannelTemplate],
});

export const mockAddChannelResp: AddChannelResp = mock({
  ...mockRespTemplate,
  id: '@integer(1, 1000)',
});
