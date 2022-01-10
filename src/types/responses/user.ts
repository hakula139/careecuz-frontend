import { Resp } from './base';

export interface UserAuthResp extends Resp {
  userId?: string;
  token?: string;
}
