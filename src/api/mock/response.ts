import { mock } from 'mockjs';

import { Resp } from '@/types';

export const mockRespTemplate = {
  code: 200,
  message: 'success',
};

export const mockResp: Resp = mock(mockRespTemplate);
