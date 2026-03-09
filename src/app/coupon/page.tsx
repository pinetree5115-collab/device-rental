// 1. import
"use client";

import { useState, useEffect } from "react";
import { issueCoupon, getCoupons, getUserCoupons } from '@/services/coupon.service';
import type { CouponData, UserCoupon } from '@/types/coupon';

// 2. 타입/인터페이스
interface CouponPageProps {
    isLoggedIn?: boolean;
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

// 3. 상수
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

// 4. 컴포넌트
function CouponPage({ isLoggedIn = true }: CouponPageProps) {
    const [activeTab, setActiveTab] = useState<'available' | 'my'>('available');
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [myCoupons, setMyCoupons] = useState<UserCoupon[]>([]);
    const [isLoadingCoupons, setIsLoadingCoupons] = useState(true);
    const [isLoadingMyCoupons, setIsLoadingMyCoupons] = useState(false);
    const [receivingCoupon, setReceivingCoupon] = useState<string | null>(null);

    // 전체 쿠폰 로드
    useEffect(() => {
        loadCoupons();
    }, []);

    // 내 쿠폰 로드
    useEffect(() => {
        if (activeTab === 'my' && isLoggedIn) {
            loadMyCoupons();
        }
    }, [activeTab, isLoggedIn]);

    const loadCoupons = async () => {
        setIsLoadingCoupons(true);
        try {
            const [couponsResponse, myCouponsResponse] = await Promise.all([
                getCoupons(),
                isLoggedIn ? getUserCoupons().catch(() => null) : Promise.resolve(null),
            ]);

            const myIssuedCouponIds = new Set(
                myCouponsResponse?.data?.map((c) => c.couponId) ?? [],
            );

            if (couponsResponse.success && couponsResponse.data) {
                const transformedCoupons: Coupon[] = couponsResponse.data.map((coupon: CouponData) => ({
                    id: coupon.couponId.toString(),
                    title: coupon.couponName,
                    description: coupon.description,
                    discount: formatDiscount(coupon),
                    totalQuantity: coupon.totalQuantity,
                    remainingQuantity: coupon.totalQuantity - coupon.issuedQuantity,
                    minPurchase: coupon.minOrderAmount || undefined,
                    expiryDays: calculateExpiryDays(coupon.validUntil),
                    received: myIssuedCouponIds.has(coupon.couponId),
                }));
                setCoupons(transformedCoupons);
            }
        } catch (error) {
            console.error('쿠폰 로드 실패:', error);
        } finally {
            setIsLoadingCoupons(false);
        }
    };

    const formatDiscount = (coupon: CouponData) => {
        if (coupon.discountType === 'PERCENT') {
            return `${coupon.discountValue}%`;
        }
        return `${coupon.discountValue.toLocaleString()}원`;
    };

    const calculateExpiryDays = (validUntil: string) => {
        const today = new Date();
        const expiryDate = new Date(validUntil);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    const loadMyCoupons = async () => {
        setIsLoadingMyCoupons(true);
        try {
            const response = await getUserCoupons();
            if (response.success && response.data) {
                setMyCoupons(response.data);
            }
        } catch (error) {
            console.error('내 쿠폰 조회 실패:', error);
        } finally {
            setIsLoadingMyCoupons(false);
        }
    };

    const formatMyCouponDiscount = (coupon: UserCoupon) => {
        if (coupon.discountType === 'PERCENT') {
            return `${coupon.discountValue}%`;
        }
        return `${coupon.discountValue.toLocaleString()}원`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR');
    };

    const getStatusText = (status: UserCoupon['status']) => {
        switch (status) {
            case 'AVAILABLE': return '사용가능';
            case 'USED': return '사용완료';
            case 'EXPIRED': return '만료';
            default: return status;
        }
    };

    const getStatusColor = (status: UserCoupon['status']) => {
        switch (status) {
            case 'AVAILABLE': return 'text-green-600 bg-green-50';
            case 'USED': return 'text-gray-600 bg-gray-50';
            case 'EXPIRED': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const handleReceiveCoupon = async (couponId: string) => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }

        setReceivingCoupon(couponId);

        try {
            // 실제 API 호출
            const response = await issueCoupon(parseInt(couponId));

            if (response.success) {
                // 성공 시 UI 업데이트
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
                alert('쿠폰 발급이 완료되었습니다!');
            } else {
                alert(response.message || '쿠폰 발급에 실패했습니다.');
            }
        } catch (error: any) {
            console.error('쿠폰 발급 오류:', error);
            alert(error.message || '쿠폰 발급에 실패했습니다.');
        } finally {
            setReceivingCoupon(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                쿠폰
                            </h1>
                            <p className="mt-1 text-lg text-gray-500">
                                다양한 할인 쿠폰을 발급받고 특별한 혜택을 누려보세요
                            </p>
                        </div>
                    </div>

                    {/* 탭 메뉴 */}
                    <div className="mt-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('available')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'available'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                발급 가능한 쿠폰
                            </button>
                            <button
                                onClick={() => setActiveTab('my')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'my'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                내 쿠폰
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {/* 컨텐츠 영역 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'available' ? (
                    // 발급 가능한 쿠폰 탭
                    <>
                        {isLoadingCoupons ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                <span className="ml-2 text-gray-600">쿠폰을 불러오는 중...</span>
                            </div>
                        ) : coupons.length === 0 ? (
                            <div className="bg-white border border-gray-200 p-8 text-center">
                                <p className="text-gray-500">발급 가능한 쿠폰이 없습니다.</p>
                            </div>
                        ) : (
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
                                            className={`bg-white border-2 p-8 transition-all ${isSoldOut
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
                                                        className={`text-sm ${isSoldOut
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
                                                        className={`h-full transition-all duration-500 ${isSoldOut
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
                        )}

                        {/* Notice */}
                        <div className="mt-12 p-6 bg-gray-100 border border-gray-200">
                            <h3 className="text-gray-900 mb-3">쿠폰 사용 안내</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• 쿠폰은 1인 1회만 받을 수 있습니다.</li>
                                <li>• 쿠폰은 선착순으로 제공되며, 소진 시 받을 수 없습니다.</li>
                                <li>• 받은 쿠폰은 마이페이지에서 확인할 수 있습니다.</li>
                                <li>• 쿠폰은 최소 대여금액 이상 결제 시 사용 가능합니다.</li>
                                <li>• 쿠폰은 발급일로부터 유효기간 내에만 사용 가능합니다.</li>
                                <li>• 중복 할인은 불가하며, 1회 결제 시 1개의 쿠폰만 사용할 수 있습니다.</li>
                            </ul>
                        </div>
                    </>
                ) : (
                    // 내 쿠폰 탭
                    <div className="space-y-6">
                        {!isLoggedIn ? (
                            <div className="bg-white border border-gray-200 p-8 text-center">
                                <p className="text-gray-500 mb-4">로그인이 필요합니다.</p>
                                <button className="px-6 py-2 bg-red-500 text-white hover:bg-red-600">
                                    로그인
                                </button>
                            </div>
                        ) : isLoadingMyCoupons ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                <span className="ml-2 text-gray-600">쿠폰을 불러오는 중...</span>
                            </div>
                        ) : myCoupons.length === 0 ? (
                            <div className="bg-white border border-gray-200 p-8 text-center">
                                <p className="text-gray-500">보유한 쿠폰이 없습니다.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myCoupons.map((coupon) => (
                                    <div
                                        key={coupon.userCouponId}
                                        className={`bg-white border-2 p-6 transition-all duration-200 ${coupon.status === 'AVAILABLE'
                                            ? 'border-gray-200 hover:border-red-300 hover:shadow-lg'
                                            : 'border-gray-100 opacity-75'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                                {coupon.couponName}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon.status)}`}>
                                                {getStatusText(coupon.status)}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {coupon.description}
                                        </p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">할인:</span>
                                                <span className="font-semibold text-red-600">
                                                    {formatMyCouponDiscount(coupon)}
                                                    {coupon.maxDiscountAmount && (
                                                        <span className="text-gray-500 text-xs ml-1">
                                                            (최대 {coupon.maxDiscountAmount.toLocaleString()}원)
                                                        </span>
                                                    )}
                                                </span>
                                            </div>

                                            {coupon.minOrderAmount && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">최소 주문:</span>
                                                    <span className="text-gray-700">
                                                        {coupon.minOrderAmount.toLocaleString()}원 이상
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">유효기간:</span>
                                                <span className="text-gray-700">
                                                    {formatDate(coupon.validFrom)} ~ {formatDate(coupon.validUntil)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">발급일:</span>
                                                <span className="text-gray-700">
                                                    {formatDate(coupon.issuedAt)}
                                                </span>
                                            </div>

                                            {coupon.usedAt && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">사용일:</span>
                                                    <span className="text-gray-700">
                                                        {formatDate(coupon.usedAt)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// 5. export
export default CouponPage;
