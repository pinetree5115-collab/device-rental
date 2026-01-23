"use client";

import { useState } from "react";

interface CouponPageProps {
    onBack: () => void;
    isLoggedIn: boolean;
}

interface Coupon {
    id: string;
    title: string;
    description: string;
    discount: string;
    totalQuantity: number;
    remainingQuantity: number;
    minPurchase?: number;
    expiryDays: number;
    received?: boolean;
}

const mockCoupons: Coupon[] = [
    {
        id: "1",
        title: "신규 회원 환영 쿠폰",
        description: "첫 대여 시 사용 가능한 특별 할인 쿠폰",
        discount: "10,000원",
        totalQuantity: 100,
        remainingQuantity: 23,
        minPurchase: 30000,
        expiryDays: 30,
    },
    {
        id: "2",
        title: "주말 특가 쿠폰",
        description: "주말 대여 시 즉시 할인",
        discount: "15%",
        totalQuantity: 50,
        remainingQuantity: 5,
        minPurchase: 20000,
        expiryDays: 7,
    },
    {
        id: "3",
        title: "프리미엄 기기 할인",
        description: "5만원 이상 고가 기기 대여 시 사용",
        discount: "20,000원",
        totalQuantity: 30,
        remainingQuantity: 0,
        minPurchase: 50000,
        expiryDays: 14,
    },
    {
        id: "4",
        title: "첫 구매 감사 쿠폰",
        description: "모든 상품에 사용 가능",
        discount: "5,000원",
        totalQuantity: 200,
        remainingQuantity: 147,
        expiryDays: 60,
    },
];

function CouponPage({ onBack, isLoggedIn = true }: CouponPageProps) {
    const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
    const [receivingCoupon, setReceivingCoupon] = useState<string | null>(null);

    const handleReceiveCoupon = (couponId: string) => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }

        setReceivingCoupon(couponId);

        // Simulate API call
        setTimeout(() => {
            setCoupons((prev) =>
                prev.map((coupon) => {
                    if (coupon.id === couponId) {
                        if (coupon.remainingQuantity > 0) {
                            return {
                                ...coupon,
                                remainingQuantity: coupon.remainingQuantity - 1,
                                received: true,
                            };
                        }
                    }
                    return coupon;
                }),
            );
            setReceivingCoupon(null);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors mb-6"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.5 15L7.5 10L12.5 5"
                                stroke="#4A5565"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <span>뒤로 가기</span>
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M26.6667 10.6667H5.33333C4.59695 10.6667 4 11.2637 4 12.0001V14.6667C4 15.4031 4.59695 16.0001 5.33333 16.0001H26.6667C27.403 16.0001 28 15.4031 28 14.6667V12.0001C28 11.2637 27.403 10.6667 26.6667 10.6667Z"
                                stroke="#FB2C36"
                                strokeWidth="2.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M16 10.6667V28.0001"
                                stroke="#FB2C36"
                                strokeWidth="2.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M25.3332 16V25.3333C25.3332 26.0406 25.0522 26.7189 24.5521 27.219C24.052 27.719 23.3737 28 22.6665 28H9.33317C8.62593 28 7.94765 27.719 7.44755 27.219C6.94746 26.7189 6.6665 26.0406 6.6665 25.3333V16"
                                stroke="#FB2C36"
                                strokeWidth="2.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M9.99984 10.6668C9.11578 10.6668 8.26794 10.3156 7.64281 9.69045C7.01769 9.06533 6.6665 8.21748 6.6665 7.33343C6.6665 6.44937 7.01769 5.60153 7.64281 4.97641C8.26794 4.35128 9.11578 4.00009 9.99984 4.00009C11.2861 3.97768 12.5465 4.60177 13.6168 5.79098C14.6871 6.98018 15.5175 8.6793 15.9998 10.6668C16.4821 8.6793 17.3126 6.98018 18.3829 5.79098C19.4531 4.60177 20.7136 3.97768 21.9998 4.00009C22.8839 4.00009 23.7317 4.35128 24.3569 4.97641C24.982 5.60153 25.3332 6.44937 25.3332 7.33343C25.3332 8.21748 24.982 9.06533 24.3569 9.69045C23.7317 10.3156 22.8839 10.6668 21.9998 10.6668"
                                stroke="#FB2C36"
                                strokeWidth="2.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <h1 className="text-gray-900">선착순 쿠폰 이벤트</h1>
                    </div>
                    <p className="text-gray-600">
                        지금 바로 쿠폰을 받고 대여 요금을 절약하세요
                    </p>
                </div>
            </div>

            {/* Coupon List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {coupons.map((coupon) => {
                        const isSoldOut = coupon.remainingQuantity === 0;
                        const isReceived = coupon.received;
                        const isReceiving = receivingCoupon === coupon.id;
                        const percentage =
                            (coupon.remainingQuantity / coupon.totalQuantity) *
                            100;

                        return (
                            <div
                                key={coupon.id}
                                className={`bg-white border-2 p-8 transition-all ${
                                    isSoldOut
                                        ? "border-gray-200 opacity-60"
                                        : isReceived
                                          ? "border-green-500"
                                          : "border-gray-200 hover:border-red-500"
                                }`}
                            >
                                {/* Coupon Header */}
                                <div className="mb-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-gray-900 flex-1">
                                            {coupon.title}
                                        </h3>
                                        {isReceived && (
                                            <div className="flex items-center gap-1 text-green-600 ml-2">
                                                <span className="text-sm">
                                                    받음
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        {coupon.description}
                                    </p>

                                    {/* Discount Amount */}
                                    <div className="inline-block px-4 py-2 bg-red-50 border border-red-200 mb-4">
                                        <span className="text-red-600">
                                            {coupon.discount} 할인
                                        </span>
                                    </div>

                                    {/* Coupon Details */}
                                    <div className="space-y-2 text-sm text-gray-600">
                                        {coupon.minPurchase && (
                                            <p>
                                                • 최소 대여금액:{" "}
                                                {coupon.minPurchase.toLocaleString()}
                                                원
                                            </p>
                                        )}
                                        <p>
                                            • 유효기간: 발급일로부터{" "}
                                            {coupon.expiryDays}일
                                        </p>
                                    </div>
                                </div>

                                {/* Remaining Quantity */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">
                                            남은 수량
                                        </span>
                                        <span
                                            className={`text-sm ${
                                                isSoldOut
                                                    ? "text-gray-400"
                                                    : percentage <= 20
                                                      ? "text-red-600"
                                                      : "text-gray-900"
                                            }`}
                                        >
                                            {coupon.remainingQuantity} /{" "}
                                            {coupon.totalQuantity}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${
                                                isSoldOut
                                                    ? "bg-gray-300"
                                                    : percentage <= 20
                                                      ? "bg-red-500"
                                                      : "bg-green-500"
                                            }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Action Button */}
                                {isSoldOut ? (
                                    <div className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-500">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clipPath="url(#clip0_11_1829)">
                                                <path
                                                    d="M9.99984 18.3332C14.6022 18.3332 18.3332 14.6022 18.3332 9.99984C18.3332 5.39746 14.6022 1.6665 9.99984 1.6665C5.39746 1.6665 1.6665 5.39746 1.6665 9.99984C1.6665 14.6022 5.39746 18.3332 9.99984 18.3332Z"
                                                    stroke="#6A7282"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M10 6.6665V9.99984"
                                                    stroke="#6A7282"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M10 13.3335H10.0083"
                                                    stroke="#6A7282"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_11_1829">
                                                    <rect
                                                        width="20"
                                                        height="20"
                                                        fill="white"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                        <span>쿠폰이 모두 소진되었습니다</span>
                                    </div>
                                ) : isReceived ? (
                                    <div className="flex items-center justify-center gap-2 px-8 py-4 bg-green-50 border-2 border-green-500 text-green-700">
                                        <span>쿠폰 받기 완료</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() =>
                                            handleReceiveCoupon(coupon.id)
                                        }
                                        disabled={isReceiving || !isLoggedIn}
                                        className="w-full px-8 py-4 bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {isReceiving
                                            ? "처리 중..."
                                            : isLoggedIn
                                              ? "쿠폰 받기"
                                              : "로그인 후 받기"}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Notice */}
                <div className="mt-12 p-6 bg-gray-100 border border-gray-200">
                    <h3 className="text-gray-900 mb-3">쿠폰 사용 안내</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• 쿠폰은 1인 1회만 받을 수 있습니다.</li>
                        <li>
                            • 쿠폰은 선착순으로 제공되며, 소진 시 받을 수
                            없습니다.
                        </li>
                        <li>
                            • 받은 쿠폰은 마이페이지에서 확인할 수 있습니다.
                        </li>
                        <li>
                            • 쿠폰은 최소 대여금액 이상 결제 시 사용 가능합니다.
                        </li>
                        <li>
                            • 쿠폰은 발급일로부터 유효기간 내에만 사용
                            가능합니다.
                        </li>
                        <li>
                            • 중복 할인은 불가하며, 1회 결제 시 1개의 쿠폰만
                            사용할 수 있습니다.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CouponPage;
