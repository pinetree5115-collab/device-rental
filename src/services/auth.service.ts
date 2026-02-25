import apiClient from './api.service';
import axios from 'axios';
import type {
  LoginRequest,
  LoginApiResponse,
  SignupRequest,
  SignupApiResponse,
  MeApiResponse,
  AuthSuccessResponse,
  User,
  SendVerificationCodeResponse,
  VerifyEmailCodeResponse,
} from '@/types/auth';

// 인증이 필요 없는 public API용 클라이언트
const publicClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://43.201.87.180:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export async function signup(
  email: string,
  password: string,
  name: string,
  address: string | null,
  bank: string | null,
  account: string | null,
  phone: string | null
): Promise<AuthSuccessResponse> {
  // 추가 정보를 request 필드에 JSON 문자열로 담기
  const additionalInfo = {
    address,
    bank,
    account,
    phone,
  };

  const requestData: SignupRequest = {
    email,
    password,
    name,
    request: JSON.stringify(additionalInfo),
  };

  // Idempotency-Key 생성 (중복 요청 방지용)
  const idempotencyKey = crypto.randomUUID();

  const response = await publicClient.post<SignupApiResponse>(
    '/api/users',
    requestData,
    {
      headers: {
        'Idempotency-Key': idempotencyKey,
      }
    }
  );
  const apiData = response.data;

  return {
    user: {
      id: email,
      email: email,
      name: name,
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

export async function sendVerificationCode(
  email: string
): Promise<SendVerificationCodeResponse> {
  const response = await publicClient.post<SendVerificationCodeResponse>(
    '/auth/email-verification/code',
    { email }
  );
  return response.data;
}

export async function verifyEmailCode(
  email: string,
  code: string
): Promise<VerifyEmailCodeResponse> {
  const response = await publicClient.post<VerifyEmailCodeResponse>(
    '/auth/email-verification/code/verify',
    { email, code }
  );
  return response.data;
}
