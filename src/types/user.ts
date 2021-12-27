export interface UserForm {
  email: string;
  password: string;
  verifyCode?: string;
}

export interface User {
  userId: string;
  isBlocked: boolean;
}
