import { mock } from 'mockjs';

import { UserLoginResp } from '@/types';
import { mockRespTemplate } from './response';

export const mockUserTemplate = {
  userId: '@guid',
  isBlocked: '@boolean',
};

export const mockUserLoginResp: UserLoginResp = mock({
  ...mockRespTemplate,
  id: '@guid',
  token: '@string(20)',
});

export const mockUserRegisterRequiredResp: UserLoginResp = mock({
  code: 100,
  message: 'user not registered',
  id: '@guid',
  token: '@string(20)',
});

export const mockUserRegisterResp: UserLoginResp = mockUserLoginResp;
