import { mock } from 'mockjs';

import { UserAuthResp } from '@/types';
import { mockResp, mockRespTemplate } from './response';

export const mockUserTemplate = {
  userId: '@guid',
  isBlocked: '@boolean',
};

export const mockUserLoginResp: UserAuthResp = mock({
  ...mockRespTemplate,
  id: '@guid',
  token: '@string(20)',
});

export const mockUserRegisterRequiredResp: UserAuthResp = mock({
  code: 100,
  message: 'user not registered',
  id: '@guid',
  token: '@string(20)',
});

export const mockUserRegisterResp = mockUserLoginResp;

export const mockSendVerifyCodeResp = mockResp;
