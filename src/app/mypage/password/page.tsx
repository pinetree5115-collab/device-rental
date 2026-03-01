// 1. 임포트
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 2. 타입/인터페이스
interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 3. 상수
const SIDEBAR_MENU = [
  {
    id: 'profile-management',
    label: '프로필 관리',
    items: [
      { id: 'my-profile', label: '내 프로필', href: '/mypage' },
      { id: 'change-password', label: '비밀번호 변경', href: '/mypage/password' },
    ],
  },
  {
    id: 'rental-management',
    label: '나의 대여',
    items: [
      { id: 'rental-history', label: '대여 내역', href: '/mypage/rentals' },
      { id: 'my-items', label: '내 물품 관리', href: '/mypage/items' },
    ],
  },
  {
    id: 'points',
    label: '포인트',
    items: [{ id: 'points', label: '포인트', href: '/mypage/points' }],
  },
  {
    id: 'logout',
    label: '로그아웃',
    items: [{ id: 'logout', label: '로그아웃', href: '#' }],
  },
] as const;

// 4. 컴포넌트
export default function PasswordChangePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setStep(1);
  };

  const handleCurrentPasswordSubmit = async () => {
    if (!passwordForm.currentPassword) {
      alert('현재 비밀번호를 입력하세요.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: API 호출 - 현재 비밀번호 확인
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep(2);
    } catch (error) {
      alert('비밀번호 확인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!passwordForm.newPassword) {
      alert('새 비밀번호를 입력하세요.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('비밀번호가 변경되었습니다.');
      router.push('/mypage');
    } catch (error) {
      alert('비밀번호 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // TODO: 로그아웃 처리
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-8">내 계정</h1>
        <div className="flex gap-8">
          {/* 사이드바 */}
          <aside className="w-64 shrink-0">
            <nav className="bg-white p-4">
              {SIDEBAR_MENU.map((section) => (
                <div key={section.id} className="mb-6 last:mb-0">
                  <h3 className="text-base font-medium text-gray-900 mb-2">
                    {section.label}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = item.id === 'change-password';
                      const isLogout = item.id === 'logout';

                      if (isLogout) {
                        return (
                          <li key={item.id}>
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {item.label}
                            </button>
                          </li>
                        );
                      }

                      return (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            className={`block px-3 py-2 text-sm ${isActive
                              ? 'text-red-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                              }`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* 메인 콘텐츠 영역 */}
          <main className="flex-1">
            <h2 className="flex items-center gap-2 text-xl font-medium text-red-600 mb-6">
              <span className="w-1 h-6 bg-red-600"></span>
              비밀번호 변경
            </h2>

            <div className="bg-white border border-gray-200 p-8">
              <div className="space-y-6">
                {step === 1 ? (
                  <>
                    {/* 현재 비밀번호 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        현재 비밀번호
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="현재 비밀번호를 입력하세요"
                      />
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleCurrentPasswordSubmit}
                        disabled={isLoading}
                        className="px-6 py-2 bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isLoading ? '확인 중...' : '확인'}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* 새 비밀번호 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        새 비밀번호
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="새 비밀번호를 입력하세요"
                      />
                    </div>

                    {/* 새 비밀번호 확인 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        새 비밀번호 확인
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="새 비밀번호를 다시 입력하세요"
                      />
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-2 bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isLoading ? '변경 중...' : '비밀번호 변경'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// 5. 익스포트
