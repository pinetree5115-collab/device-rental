// 1. import
import type { IssueCouponRequest, IssueCouponResponse } from '@/types/coupon';

// 2. 타입/인터페이스

// 3. 상수

// 4. 컴포넌트
export const issueCoupon = async (couponId: number): Promise<IssueCouponResponse> => {
  const requestData: IssueCouponRequest = { couponId };

  const response = await fetch('/api/users/me/coupons', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
    body: JSON.stringify(requestData),
  });

  const data = await response.json();

  // 백엔드 API 응답 구조에 따른 에러 처리
  if (!data.success) {
    throw new Error(data.message || '쿠폰 발급에 실패했습니다.');
  }

  return data;
};

// 5. export
