import apiClient from './api.service';
import type {
  LoginRequest,
  LoginApiResponse,
  SignupRequest,
  SignupApiResponse,
  MeApiResponse,
  AuthSuccessResponse,
  User,
} from '@/types/auth';

export async function login(data: LoginRequest): Promise<AuthSuccessResponse> {
  const response = await apiClient.post<LoginApiResponse>('/api/users/login', data);
  const apiData = response.data;

  return {
    user: {
      id: apiData.email,
      email: apiData.email,
      name: apiData.nickname,
    },
    token: apiData.token,
    refreshToken: apiData.refreshToken,
  };
}

export async function signup(data: SignupRequest): Promise<AuthSuccessResponse> {
  const response = await apiClient.post<SignupApiResponse>('/api/users', data);
  const apiData = response.data;

  return {
    user: {
      id: data.email,
      email: data.email,
      name: data.name,
    },
    token: apiData.token,
    message: apiData.message,
  };
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/users/logout');
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<MeApiResponse>('/auth/me');
  const apiData = response.data;

  return {
    id: apiData.userId,
    email: apiData.email,
    name: apiData.name,
  };
}

export async function sendVerificationCode(email: string): Promise<unknown> {
  const response = await apiClient.post('/auth/send-code', { email });
  return response.data;
}

export async function verifyCode(email: string, code: string): Promise<unknown> {
  const response = await apiClient.post('/auth/verify-code', { email, code });
  return response.data;
}
