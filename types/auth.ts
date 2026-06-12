export interface User {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface RegisterBody {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}
