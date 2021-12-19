import { mock } from 'mockjs';

import { GetChannelsResp } from '@/types';
import { mockStatusTemplate } from './status';

export const mockChannelTemplate = {
  id: '@increment',
  name: '@ctitle',
};

export const mockGetChannelsResp: GetChannelsResp = mock({
  ...mockStatusTemplate,
  'data|0-50': [mockChannelTemplate],
});
