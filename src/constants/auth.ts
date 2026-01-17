// 인증 관련 상수
export const AUTH_STORAGE_KEY = 'auth-storage';
export const ACCESS_TOKEN_KEY = 'accessToken';

// 인증 상태
export const AUTH_STATUS = {
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  LOADING: 'loading',
} as const;

export type AuthStatus = typeof AUTH_STATUS[keyof typeof AUTH_STATUS];
