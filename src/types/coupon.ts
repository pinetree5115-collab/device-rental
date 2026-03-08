// 1. import

// 2. 타입/인터페이스
export interface IssueCouponRequest {
  couponId: number;
}

export interface IssueCouponResponse {
  success: boolean;
  code: string;
  message: string;
  data: null;
}

export interface CouponData {
  couponId: number;
  couponName: string;
  description: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderAmount: number | null;
  totalQuantity: number;
  issuedQuantity: number;
  perUserLimit: number;
  validFrom: string;
  validUntil: string;
  status: 'ACTIVE' | 'ENDED' | 'INACTIVE';
}

export interface GetCouponsResponse {
  success: boolean;
  code: string;
  message: string;
  data: CouponData[];
}

// 3. 상수

// 4. 컴포넌트

// 5. export
