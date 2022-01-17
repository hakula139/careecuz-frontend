import { UserForm } from '../user';

export interface UserAuthReq {
  data: UserForm;
}

export interface SendVerifyCodeReq {
  email: string;
}

export interface PushUserInfo {
  userId: string;
  token: string;
}
