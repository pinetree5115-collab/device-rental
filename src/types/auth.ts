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
  name: string | null;
  request: string | null;
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
