import { mock } from 'mockjs';

import { GetChannelsResp } from '@/types';
import { mockStatusTemplate } from './status';

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
  ...mockStatusTemplate,
  'data|0-50': [mockChannelTemplate],
});
