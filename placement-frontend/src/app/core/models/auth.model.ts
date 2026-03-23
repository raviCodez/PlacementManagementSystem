export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  departmentId?: number;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: string;
  userId: number;
}