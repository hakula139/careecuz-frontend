import { Resp } from './base';

export interface UserLoginResp extends Resp {
  id: string;
  token: string;
}

export type UserRegisterResp = UserLoginResp;
