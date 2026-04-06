// 사용자 타입
export interface User {
  id: string;
  email: string;
  name: string | null;
}

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 (백엔드)
export interface LoginApiResponse {
  success: boolean;
  token: string;
  email: string;
  nickname: string | null;
  refreshToken: string;
}

// 회원가입 요청
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  address: string | null;
  bank: string | null;
  account: string | null;
  phone: string | null;
}

// 회원가입 응답 (백엔드)
export interface SignupApiResponse {
  token: string;
  message: string;
}

// 내 정보 응답 (백엔드)
export interface MeApiResponse {
  userId: string;
  email: string;
  name: string | null;
}

// 로그인/회원가입 성공 응답 (프론트엔드 통합)
export interface AuthSuccessResponse {
  user: User;
  token: string;
  refreshToken?: string;
  message?: string;
}

// 이메일 인증 코드 발송 요청
export interface SendVerificationCodeRequest {
  email: string;
}

// 이메일 인증 코드 발송 응답
export interface SendVerificationCodeResponse {
  success: boolean;
  code: string;
  message: string;
  data: null;
}

// 이메일 인증 확인 요청
export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}

// 이메일 인증 확인 응답
export interface VerifyEmailCodeResponse {
  success: boolean;
  code: string;
  message: string;
  data: null;
}

// 비밀번호 변경 요청
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 비밀번호 변경 응답
export interface ChangePasswordResponse {
  success: boolean;
  code: string;
  message: string;
  data: null;
}
