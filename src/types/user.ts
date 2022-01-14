export interface UserForm {
  email: string;
  password: string;
  verifyCode?: string;
}

export interface User {
  id: string;
  isBlocked: boolean;
  isRemoved: boolean;
}
