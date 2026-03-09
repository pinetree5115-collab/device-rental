"use client";

import { createRentalApi } from "@/services/post.service";
import { Item } from "@/types/common";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface RentalData {
    postId: number;
    startDate: string;
    endDate: string;
    receiveMethod: "PARCEL" | "MEETUP";
}

interface Coupon {
    id: string;
    name: string;
    discount: number;
    type: "percentage" | "fixed";
    minAmount: number;
}

const mockCoupons: Coupon[] = [
    {
        id: "1",
        name: "신규 회원 10% 할인",
        discount: 10,
        type: "percentage",
        minAmount: 10000,
    },
    {
        id: "2",
        name: "5,000원 할인 쿠폰",
        discount: 5000,
        type: "fixed",
        minAmount: 20000,
    },
    {
        id: "3",
        name: "20% 할인 쿠폰",
        discount: 20,
        type: "percentage",
        minAmount: 30000,
    },
];

function ItemRentClient({ item }: { item: Item }) {
    const router = useRouter();
    const host =
        typeof window !== "undefined" ? window.location.host : undefined;
    const protocol =
        typeof window !== "undefined"
            ? window.location.protocol.replace(":", "")
            : "http";

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedPickupMethod, setSelectedPickupMethod] = useState("");
    const [selectedCouponId, setSelectedCouponId] = useState<string | null>(
        null,
    );
    const [pointsToUse, setPointsToUse] = useState(0);
    const [showCouponModal, setShowCouponModal] = useState(false);

    const userPoints = 15000; // 유저 포인트 예시

    // 대여 일수 계산
    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1; // 시작 및 종료일 포함
    };

    const days = calculateDays();
    const basePrice = item.pricePerDay * days;

    // 쿠폰 및 포인트 할인 계산
    const selectedCoupon = mockCoupons.find((c) => c.id === selectedCouponId);
    let couponDiscount = 0;
    if (selectedCoupon && basePrice >= selectedCoupon.minAmount) {
        if (selectedCoupon.type === "percentage") {
            couponDiscount = Math.floor(
                basePrice * (selectedCoupon.discount / 100),
            );
        } else {
            couponDiscount = selectedCoupon.discount;
        }
    }

    const priceAfterCoupon = basePrice - couponDiscount;
    const maxPoints = Math.min(userPoints, Math.floor(priceAfterCoupon * 0.5)); // Max 50% of price
    const validPointsToUse = Math.min(pointsToUse, maxPoints);
    const finalPrice = priceAfterCoupon - validPointsToUse;

    //     const handlePointsChange = (value: string) => {
    //         const points = parseInt(value) || 0;
    //         setPointsToUse(Math.max(0, Math.min(points, maxPoints)));
    //     };

    const handleSubmit = async () => {
        if (!startDate || !endDate || !selectedPickupMethod) {
            alert("모든 필수 항목을 선택해주세요");
            return;
        }

        const rentalData: RentalData = {
            postId: item.postId,
            startDate,
            endDate,
            receiveMethod:
                selectedPickupMethod === "택배 수령" ? "PARCEL" : "MEETUP",
        };

        try {
            const response = await createRentalApi(rentalData, {
                baseUrl: host ? `${protocol}://${host}` : undefined,
            });

            if (response) {
                alert("대여 신청이 완료되었습니다!");
                router.push("/items/rent/history");
            }
        } catch (err) {
            console.error("대여 신청 실패:::", err);
            alert(
                err instanceof Error
                    ? err.message
                    : "대여 신청 중 오류가 발생했습니다. 다시 시도해주세요.",
            );
        }
    };

    let availablePickupMethods = [];

    if (item.isParcel) {
        availablePickupMethods.push("택배 수령");
    }
    if (item.isMeetup) {
        availablePickupMethods.push("직접 수령");
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <button
                    onClick={() => {}}
                    className="hover:text-gray-900 cursor-pointer"
                >
                    홈
                </button>
                <span>/</span>
                <span className="hover:text-gray-900 cursor-pointer">
                    {item.title}
                </span>
                <span>/</span>
                <span className="text-gray-900">대여 신청</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side - Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-gray-900 mb-8">대여 신청서</h1>

                        {/* 아이템 요약 */}
                        <div className="flex gap-6 pb-8 mb-8 border-b-2 border-gray-200">
                            <img
                                src={item.imageUrls[0]}
                                alt={item.title}
                                className="w-32 h-32 object-cover bg-gray-100"
                            />
                            <div className="flex-1">
                                <h3 className="text-gray-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {item.description}
                                </p>
                                <p className="text-2xl text-gray-900">
                                    {item.pricePerDay.toLocaleString()}원
                                    <span className="text-gray-500 text-base">
                                        /일
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* 대여 기간 선택 */}
                        <div className="mb-8">
                            <label className="flex items-center gap-2 text-gray-900 mb-4">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.6665 1.66666V4.99999"
                                        stroke="#101828"
                                        strokeWidth="1.66667"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M13.3335 1.66666V4.99999"
                                        stroke="#101828"
                                        strokeWidth="1.66667"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M15.8333 3.33334H4.16667C3.24619 3.33334 2.5 4.07954 2.5 5.00001V16.6667C2.5 17.5872 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5872 17.5 16.6667V5.00001C17.5 4.07954 16.7538 3.33334 15.8333 3.33334Z"
                                        stroke="#101828"
                                        strokeWidth="1.66667"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M2.5 8.33334H17.5"
                                        stroke="#101828"
                                        strokeWidth="1.66667"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                대여 기간 선택
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 mb-2">
                                        시작일
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">
                                        종료일
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        min={
                                            startDate ||
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            </div>
                            {days > 0 && (
                                <p className="text-gray-600 mt-3">
                                    선택한 기간:{" "}
                                    <span className="text-gray-900">
                                        {days}일
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* 수령 방식 선택 */}
                        <div className="mb-8">
                            <label className="flex items-center gap-2 text-gray-900 mb-4">
                                수령 방식 선택
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {availablePickupMethods.map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() =>
                                            setSelectedPickupMethod(method)
                                        }
                                        className={`flex items-center justify-center gap-2 cursor-pointer px-6 py-4 border-2 transition-colors ${
                                            selectedPickupMethod === method
                                                ? "border-red-500 bg-red-50 text-red-600"
                                                : "border-gray-300 bg-white text-gray-700 hover:border-black"
                                        }`}
                                    >
                                        {method === "택배 수령" ? (
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M11.6665 15V4.99998C11.6665 4.55795 11.4909 4.13403 11.1783 3.82147C10.8658 3.50891 10.4419 3.33331 9.99984 3.33331H3.33317C2.89114 3.33331 2.46722 3.50891 2.15466 3.82147C1.8421 4.13403 1.6665 4.55795 1.6665 4.99998V14.1666C1.6665 14.3877 1.7543 14.5996 1.91058 14.7559C2.06686 14.9122 2.27882 15 2.49984 15H4.1665"
                                                    stroke="#364153"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M12.5 15H7.5"
                                                    stroke="#364153"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M15.8332 15H17.4998C17.7209 15 17.9328 14.9122 18.0891 14.7559C18.2454 14.5997 18.3332 14.3877 18.3332 14.1667V11.125C18.3328 10.9359 18.2682 10.7525 18.1498 10.605L15.2498 6.98002C15.1719 6.88242 15.073 6.80359 14.9605 6.74935C14.848 6.69512 14.7247 6.66687 14.5998 6.66669H11.6665"
                                                    stroke="#364153"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M14.1667 16.6666C15.0871 16.6666 15.8333 15.9205 15.8333 15C15.8333 14.0795 15.0871 13.3333 14.1667 13.3333C13.2462 13.3333 12.5 14.0795 12.5 15C12.5 15.9205 13.2462 16.6666 14.1667 16.6666Z"
                                                    stroke="#364153"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M5.83317 16.6666C6.75365 16.6666 7.49984 15.9205 7.49984 15C7.49984 14.0795 6.75365 13.3333 5.83317 13.3333C4.9127 13.3333 4.1665 14.0795 4.1665 15C4.1665 15.9205 4.9127 16.6666 5.83317 16.6666Z"
                                                    stroke="#364153"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M9.16667 12.5H10.8333C11.2754 12.5 11.6993 12.3244 12.0118 12.0119C12.3244 11.6993 12.5 11.2754 12.5 10.8334C12.5 10.3913 12.3244 9.9674 12.0118 9.65484C11.6993 9.34228 11.2754 9.16669 10.8333 9.16669H8.33333C7.83333 9.16669 7.41667 9.33335 7.16667 9.66669L2.5 14.1667"
                                                    stroke="#364153"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M5.8335 17.5L7.16683 16.3334C7.41683 16 7.8335 15.8334 8.3335 15.8334H11.6668C12.5835 15.8334 13.4168 15.5 14.0002 14.8334L17.8335 11.1667C18.1551 10.8628 18.3428 10.4436 18.3553 10.0014C18.3678 9.55908 18.2041 9.12995 17.9002 8.80838C17.5963 8.4868 17.1771 8.29912 16.7348 8.28662C16.2925 8.27411 15.8634 8.43782 15.5418 8.74171L12.0418 11.9917"
                                                    stroke="#364153"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M1.6665 13.3333L6.6665 18.3333"
                                                    stroke="#364153"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M13.3332 9.91665C14.6679 9.91665 15.7498 8.83467 15.7498 7.49998C15.7498 6.16529 14.6679 5.08331 13.3332 5.08331C11.9985 5.08331 10.9165 6.16529 10.9165 7.49998C10.9165 8.83467 11.9985 9.91665 13.3332 9.91665Z"
                                                    stroke="#364153"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M5 6.66669C6.38071 6.66669 7.5 5.5474 7.5 4.16669C7.5 2.78598 6.38071 1.66669 5 1.66669C3.61929 1.66669 2.5 2.78598 2.5 4.16669C2.5 5.5474 3.61929 6.66669 5 6.66669Z"
                                                    stroke="#364153"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 쿠폰 선택 */}
                        {/* <div className="mb-8">
                            <label className="flex items-center gap-2 text-gray-900 mb-4">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_11_495)">
                                        <path
                                            d="M10.4882 2.15502C10.1757 1.84244 9.75183 1.66678 9.30984 1.66669H3.33317C2.89114 1.66669 2.46722 1.84228 2.15466 2.15484C1.8421 2.4674 1.6665 2.89133 1.6665 3.33335V9.31002C1.6666 9.75201 1.84225 10.1759 2.15484 10.4884L9.40817 17.7417C9.78693 18.1181 10.2992 18.3293 10.8332 18.3293C11.3671 18.3293 11.8794 18.1181 12.2582 17.7417L17.7415 12.2584C18.1179 11.8796 18.3291 11.3673 18.3291 10.8334C18.3291 10.2994 18.1179 9.78712 17.7415 9.40835L10.4882 2.15502Z"
                                            stroke="#101828"
                                            strokeWidth="1.66667"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M6.25016 6.66665C6.48028 6.66665 6.66683 6.4801 6.66683 6.24998C6.66683 6.01986 6.48028 5.83331 6.25016 5.83331C6.02004 5.83331 5.8335 6.01986 5.8335 6.24998C5.8335 6.4801 6.02004 6.66665 6.25016 6.66665Z"
                                            fill="#101828"
                                            stroke="#101828"
                                            strokeWidth="1.66667"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_11_495">
                                            <rect
                                                width="20"
                                                height="20"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                                쿠폰 선택
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowCouponModal(true)}
                                className="w-full px-4 py-4 cursor-pointer border-2 border-gray-300 text-left flex items-center justify-between hover:border-black transition-colors"
                            >
                                <span
                                    className={
                                        selectedCoupon
                                            ? "text-gray-900"
                                            : "text-gray-500"
                                    }
                                >
                                    {selectedCoupon
                                        ? selectedCoupon.name
                                        : "쿠폰을 선택해주세요"}
                                </span>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M7.5 15L12.5 10L7.5 5"
                                        stroke="#99A1AF"
                                        strokeWidth="1.66667"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div> */}

                        {/* 포인트 사용 */}
                        {/* <div className="mb-8">
                            <label className="flex items-center gap-2 text-gray-900 mb-4">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_11_506)">
                                        <path
                                            d="M6.6665 11.6667C9.42793 11.6667 11.6665 9.42811 11.6665 6.66669C11.6665 3.90526 9.42793 1.66669 6.6665 1.66669C3.90508 1.66669 1.6665 3.90526 1.6665 6.66669C1.6665 9.42811 3.90508 11.6667 6.6665 11.6667Z"
                                            stroke="#101828"
                                            strokeWidth="1.66667"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M15.075 8.64166C15.8628 8.93535 16.5638 9.42294 17.1132 10.0593C17.6625 10.6957 18.0426 11.4604 18.2182 12.2826C18.3937 13.1047 18.3591 13.9579 18.1176 14.7632C17.876 15.5685 17.4353 16.2998 16.8362 16.8897C16.2371 17.4795 15.499 17.9087 14.69 18.1377C13.8811 18.3666 13.0275 18.3879 12.2081 18.1995C11.3888 18.0112 10.6301 17.6192 10.0024 17.06C9.37465 16.5007 8.89806 15.7922 8.6167 15"
                                            stroke="#101828"
                                            strokeWidth="1.66667"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M5.8335 5H6.66683V8.33333"
                                            stroke="#101828"
                                            strokeWidth="1.66667"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M13.9249 11.5667L14.5082 12.1583L12.1582 14.5083"
                                            stroke="#101828"
                                            strokeWidth="1.66667"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_11_506">
                                            <rect
                                                width="20"
                                                height="20"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                                포인트 사용
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    value={pointsToUse || ""}
                                    onChange={(e) =>
                                        handlePointsChange(e.target.value)
                                    }
                                    placeholder="0"
                                    min="0"
                                    max={maxPoints}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPointsToUse(maxPoints)}
                                    className="px-6 py-3 cursor-pointer border-2 border-black text-black hover:bg-black hover:text-white transition-colors whitespace-nowrap"
                                >
                                    전액 사용
                                </button>
                            </div>
                            <p className="text-gray-500 mt-2">
                                보유 포인트: {userPoints.toLocaleString()}P |
                                최대 사용 가능: {maxPoints.toLocaleString()}P
                            </p>
                        </div> */}
                    </div>
                </div>

                {/* Right side - 결제 요약 */}
                <div className="lg:col-span-1">
                    <div className="border-2 border-gray-300 p-6 sticky top-8">
                        <h3 className="text-gray-900 mb-6">결제 요약</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>기본 금액</span>
                                <span className="text-gray-900">
                                    {days > 0
                                        ? `${basePrice.toLocaleString()}원`
                                        : "-"}
                                </span>
                            </div>

                            {days > 0 && (
                                <div className="text-gray-500 text-sm pl-4">
                                    {item.pricePerDay.toLocaleString()}원 ×{" "}
                                    {days}일
                                </div>
                            )}

                            {couponDiscount > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>쿠폰 할인</span>
                                    <span className="text-red-600">
                                        -{couponDiscount.toLocaleString()}원
                                    </span>
                                </div>
                            )}

                            {validPointsToUse > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>포인트 사용</span>
                                    <span className="text-red-600">
                                        -{validPointsToUse.toLocaleString()}P
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t-2 border-gray-300 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-900">
                                    총 결제 금액
                                </span>
                                <span className="text-2xl text-gray-900">
                                    {days > 0
                                        ? `${finalPrice.toLocaleString()}원`
                                        : "-"}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={
                                !startDate || !endDate || !selectedPickupMethod
                            }
                            className="w-full px-6 py-4 cursor-pointer bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            대여 신청하기
                        </button>

                        <p className="text-gray-500 text-sm text-center mt-4">
                            결제는 대여 신청 후 진행됩니다
                        </p>
                    </div>
                </div>
            </div>

            {/* 쿠폰 모달 */}
            {/* {showCouponModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white max-w-md w-full p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-gray-900">쿠폰 선택</h3>
                            <button
                                onClick={() => setShowCouponModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setSelectedCouponId(null);
                                    setShowCouponModal(false);
                                }}
                                className={`w-full p-4 cursor-pointer border-2 text-left transition-colors ${
                                    !selectedCouponId
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-200 hover:border-black"
                                }`}
                            >
                                <p className="text-gray-900">쿠폰 사용 안 함</p>
                            </button>

                            {mockCoupons.map((coupon) => {
                                const isDisabled = basePrice < coupon.minAmount;
                                return (
                                    <button
                                        key={coupon.id}
                                        onClick={() => {
                                            if (!isDisabled) {
                                                setSelectedCouponId(coupon.id);
                                                setShowCouponModal(false);
                                            }
                                        }}
                                        disabled={isDisabled}
                                        className={`w-full p-4 cursor-pointer border-2 text-left transition-colors ${
                                            isDisabled
                                                ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                                                : selectedCouponId === coupon.id
                                                  ? "border-red-500 bg-red-50"
                                                  : "border-gray-200 hover:border-black"
                                        }`}
                                    >
                                        <p className="text-gray-900 mb-1">
                                            {coupon.name}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            최소 주문 금액:{" "}
                                            {coupon.minAmount.toLocaleString()}
                                            원
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )} */}
        </main>
    );
}

export default ItemRentClient;
