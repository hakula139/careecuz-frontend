import { Resp } from './base';

export interface UserAuthResp extends Resp {
  id: string;
  token: string;
}
