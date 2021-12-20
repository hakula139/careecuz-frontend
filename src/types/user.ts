export interface UserForm {
  email: string;
  password: string;
}

export interface User {
  userId: string;
  isBlocked: boolean;
}
