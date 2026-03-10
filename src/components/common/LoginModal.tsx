"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { GoogleLogin } from "@react-oauth/google";
import { login, googleLogin } from "@/services/auth_copy.service";

const GOOGLE_ICON = (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

interface GoogleLoginButtonProps {
  onError: (message: string) => void;
  onSuccess: () => void;
}

// GoogleLogin은 GoogleOAuthProvider 안에서만 호출 가능하므로 별도 컴포넌트로 분리
function GoogleLoginButton({ onError, onSuccess }: GoogleLoginButtonProps) {
  const queryClient = useQueryClient();

  return (
    <div className="relative w-full">
      {/* 기존 디자인 버튼 (뒤에 깔림) */}
      <div className="w-full border border-gray-300 bg-white text-gray-700 py-3 font-medium flex items-center justify-center gap-2 pointer-events-none">
        {GOOGLE_ICON}
        Google로 로그인
      </div>
      {/* GoogleLogin을 투명하게 덮어서 클릭 이벤트만 가져옴 */}
      <div className="absolute inset-0 opacity-0">
        <GoogleLogin
          onSuccess={async (response) => {
            try {
              // response.credential = 구글이 발급한 idToken
              await googleLogin(response.credential!);
              queryClient.invalidateQueries({ queryKey: ["myInfo"] });
              onSuccess();
            } catch (err) {
              onError(err instanceof Error ? err.message : "구글 로그인에 실패했습니다.");
            }
          }}
          onError={() => onError("구글 로그인에 실패했습니다.")}
          width="100%"
        />
      </div>
    </div>
  );
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const isGoogleEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      await login({ email, password });

      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "로그인에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md shadow-lg p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-8">
          <h1 className="text-xl font-normal mb-2">로그인</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3">
              {error}
            </div>
          )}

          {/* 이메일 */}
          <div>
            <label
              htmlFor="modal-email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              이메일
            </label>
            <input
              id="modal-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-red-500"
              required
              disabled={isLoading}
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="modal-password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              비밀번호
            </label>
            <input
              id="modal-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-red-500"
              required
              disabled={isLoading}
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-3 font-medium hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>

          {/* 또는 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                또는
              </span>
            </div>
          </div>

          {/* Google 로그인 버튼 */}
          {isGoogleEnabled ? (
            <GoogleLoginButton
              onSuccess={onClose}
              onError={(message) => setError(message)}
            />
          ) : (
            <button
              type="button"
              disabled
              className="w-full border border-gray-300 bg-white text-gray-700 py-3 font-medium opacity-40 cursor-not-allowed flex items-center justify-center gap-2"
            >
              {GOOGLE_ICON}
              Google로 로그인
            </button>
          )}

          {/* 회원가입 링크 */}
          <div className="text-center text-sm pt-4">
            <span className="text-gray-600">
              아직 계정이 없으신가요?{" "}
            </span>
            <a
              href="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              회원가입
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
