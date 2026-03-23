"use client";

import { getUserCoupons } from "@/services/coupon.service";
import { fetchMyRentals } from "@/services/rent.service";
import { Rental } from "@/types/common";
import { UserCoupon } from "@/types/coupon";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Package } from "lucide-react";
import { useState } from "react";

const userPoints = 15000;

function RentalHistoryClient() {
    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState<"BORROWER" | "LENDER">(
        "BORROWER",
    );
    const [showStartModal, setShowStartModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [usedPoint, setUsedPoint] = useState(0);
    const [pointLimitMessage, setPointLimitMessage] = useState("");
    const [selectedCouponId, setSelectedCouponId] = useState<number | null>(
        null,
    );
    const [isPaying, setIsPaying] = useState(false);
    const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

    const { data: userCouponsData } = useQuery({
        queryKey: ["myCoupons"],
        queryFn: getUserCoupons,
        staleTime: 1000 * 60 * 5,
    });

    const coupons: UserCoupon[] =
        userCouponsData?.data?.filter((c) => c.status === "AVAILABLE") ?? [];

    const { data: rentals, isLoading } = useQuery({
        queryKey: ["myrentals", activeTab],
        queryFn: () => fetchMyRentals({ role: activeTab }),
        staleTime: 1000 * 60 * 5,
    });

    const getRentalDurationDays = (startDate: string, endDate: string) => {
        const [startYear, startMonth, startDay] = startDate
            .split("-")
            .map(Number);
        const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

        if (
            !startYear ||
            !startMonth ||
            !startDay ||
            !endYear ||
            !endMonth ||
            !endDay
        ) {
            return 0;
        }

        const start = new Date(startYear, startMonth - 1, startDay);
        const end = new Date(endYear, endMonth - 1, endDay);
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const diffDays = Math.floor(
            (end.getTime() - start.getTime()) / millisecondsPerDay,
        );

        return Math.max(0, diffDays + 1);
    };

    const isRentalNotStarted = (rental: Rental) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const rentalStartDate = new Date(`${rental.startDate}T00:00:00`);
        return today < rentalStartDate;
    };

    const canCancelBorrowedRental = (rental: Rental) => {
        if (activeTab !== "BORROWER") {
            return false;
        }

        if (rental.status === "REQUESTED") {
            return true;
        }

        return rental.status === "CONFIRMED" && isRentalNotStarted(rental);
    };

    const handleStartRental = (rentalId: number) => {
        const rental = rentals!.data.content.find(
            (r) => r.rentalId === rentalId,
        );
        if (rental) {
            setSelectedRental(rental);
            setUsedPoint(0);
            setPointLimitMessage("");
            setSelectedCouponId(null);
            setShowStartModal(true);
        }
    };

    const handlePointInputChange = (value: string, maxPoint: number) => {
        const onlyDigits = value.replace(/\D/g, "");
        const parsedPoint = Number(onlyDigits || 0);

        if (parsedPoint > userPoints || parsedPoint > maxPoint) {
            setUsedPoint(maxPoint);
            setPointLimitMessage(
                `최대 사용 가능 포인트는 ${maxPoint.toLocaleString()}P입니다.`,
            );
            return;
        }

        setPointLimitMessage("");
        setUsedPoint(parsedPoint);
    };

    const confirmStartRental = async () => {
        if (!selectedRental) {
            return;
        }

        const selectedCoupon = coupons.find(
            (coupon) => coupon.userCouponId === selectedCouponId,
        );
        let couponDiscount = 0;

        if (
            selectedCoupon &&
            selectedRental.totalPrice >= (selectedCoupon.minOrderAmount ?? 0)
        ) {
            if (selectedCoupon.discountType === "PERCENT") {
                couponDiscount = Math.floor(
                    selectedRental.totalPrice *
                        (selectedCoupon.discountValue / 100),
                );
                if (selectedCoupon.maxDiscountAmount) {
                    couponDiscount = Math.min(
                        couponDiscount,
                        selectedCoupon.maxDiscountAmount,
                    );
                }
            } else {
                couponDiscount = selectedCoupon.discountValue;
            }
        }

        const priceAfterCoupon = selectedRental.totalPrice - couponDiscount;
        const maxUsablePoint = Math.min(
            userPoints,
            Math.floor(priceAfterCoupon * 0.5),
        );
        const safeUsedPoint = Math.max(0, Math.min(usedPoint, maxUsablePoint));
        const finalAmount = priceAfterCoupon - safeUsedPoint;

        try {
            setIsPaying(true);

            const response = await fetch("/api/rentals/payment-test", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rentalId: selectedRental.rentalId,
                    userCouponId: selectedCouponId,
                    pointAmount: safeUsedPoint,
                    expectedAmount: finalAmount,
                }),
            });

            let responseData: unknown = null;
            try {
                responseData = await response.json();
            } catch {
                responseData = null;
            }

            if (!response.ok) {
                const errorMessage =
                    typeof responseData === "object" &&
                    responseData !== null &&
                    "message" in responseData &&
                    typeof (responseData as { message: unknown }).message ===
                        "string"
                        ? (responseData as { message: string }).message
                        : "결제 테스트 API 호출에 실패했습니다.";

                throw new Error(errorMessage);
            }

            setShowStartModal(false);
            setSelectedRental(null);
            alert("결제가 완료되어 대여가 확정되었습니다.");

            await queryClient.invalidateQueries({
                queryKey: ["myrentals", activeTab],
            });
        } catch (error) {
            console.error(error);
            alert(
                error instanceof Error
                    ? error.message
                    : "결제 테스트 API 호출 중 오류가 발생했습니다.",
            );
            // alert("결제 테스트 API 호출 중 오류가 발생했습니다.");
        } finally {
            setIsPaying(false);
        }
    };

    const cancelStartRental = () => {
        setShowStartModal(false);
        setSelectedRental(null);
        setPointLimitMessage("");
    };

    const handleConfirmReturn = (rentalId: number) => {
        const rental = rentals!.data.content.find(
            (r) => r.rentalId === rentalId,
        );
        if (rental) {
            setSelectedRental(rental);
            setShowReturnModal(true);
        }
    };

    const confirmReturn = () => {
        if (selectedRental) {
            setShowReturnModal(false);
            setSelectedRental(null);
            alert("반납이 확인되었습니다.");
        }
    };

    const cancelReturn = () => {
        setShowReturnModal(false);
        setSelectedRental(null);
    };

    const handleCancelRental = (rentalId: number) => {
        const rental = rentals!.data.content.find(
            (r) => r.rentalId === rentalId,
        );
        if (rental) {
            setSelectedRental(rental);
            setShowCancelModal(true);
        }
    };

    const confirmCancelRental = async () => {
        if (!selectedRental) {
            return;
        }

        try {
            const response = await fetch(
                `/api/rentals/${selectedRental.rentalId}/cancel`,
                {
                    method: "POST",
                    credentials: "include",
                },
            );

            let responseData: unknown = null;
            try {
                responseData = await response.json();
            } catch {
                responseData = null;
            }

            if (!response.ok) {
                const errorMessage =
                    typeof responseData === "object" &&
                    responseData !== null &&
                    "message" in responseData &&
                    typeof (responseData as { message: unknown }).message ===
                        "string"
                        ? (responseData as { message: string }).message
                        : "대여 취소 API 호출에 실패했습니다.";

                throw new Error(errorMessage);
            }

            setShowCancelModal(false);
            setSelectedRental(null);
            alert("대여가 취소되었습니다.");

            await queryClient.invalidateQueries({
                queryKey: ["myrentals", activeTab],
            });
        } catch (error) {
            console.error(error);
            alert(
                error instanceof Error
                    ? error.message
                    : "대여 취소 중 오류가 발생했습니다.",
            );

            setShowCancelModal(false);
            setSelectedRental(null);
        }
    };

    const cancelCancelRental = () => {
        setShowCancelModal(false);
        setSelectedRental(null);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "REQUESTED":
                return {
                    bg: "bg-amber-50",
                    text: "text-amber-600",
                    label: "결제 보관 중",
                };
            case "CONFIRMED":
                return {
                    bg: "bg-green-50",
                    text: "text-green-600",
                    label: "대여 확정",
                };
            case "IN_USE":
                return {
                    bg: "bg-blue-50",
                    text: "text-blue-600",
                    label: "대여 중",
                };
            case "ENDED":
                return {
                    bg: "bg-green-50",
                    text: "text-green-600",
                    label: "완료",
                };
            case "CANCELED":
                return {
                    bg: "bg-gray-50",
                    text: "text-gray-600",
                    label: "취소",
                };
            default:
                return {
                    bg: "bg-gray-50",
                    text: "text-gray-600",
                    label: status,
                };
        }
    };

    const selectedCoupon = coupons.find(
        (coupon) => coupon.userCouponId === selectedCouponId,
    );
    let couponDiscount = 0;
    if (
        selectedRental &&
        selectedCoupon &&
        selectedRental.totalPrice >= (selectedCoupon.minOrderAmount ?? 0)
    ) {
        if (selectedCoupon.discountType === "PERCENT") {
            couponDiscount = Math.floor(
                selectedRental.totalPrice *
                    (selectedCoupon.discountValue / 100),
            );
            if (selectedCoupon.maxDiscountAmount) {
                couponDiscount = Math.min(
                    couponDiscount,
                    selectedCoupon.maxDiscountAmount,
                );
            }
        } else {
            couponDiscount = selectedCoupon.discountValue;
        }
    }
    const priceAfterCoupon = (selectedRental?.totalPrice ?? 0) - couponDiscount;
    const maxUsablePoint = Math.min(
        userPoints,
        Math.floor(priceAfterCoupon * 0.5),
    );
    const safeUsedPoint = Math.max(0, Math.min(usedPoint, maxUsablePoint));
    const finalPaymentAmount = priceAfterCoupon - safeUsedPoint;

    // if (!rentals && isLoading) {
    //     return (
    //         <div className="text-center py-24 bg-gray-50">
    //             <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    //             <p className="text-gray-500 mb-1">
    //                 대여 내역을 불러오는 중입니다...
    //             </p>
    //         </div>
    //     );
    // }
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <button onClick={() => {}} className="hover:text-gray-900">
                    계정
                </button>
                <span>/</span>
                <span className="text-gray-900">대여 내역</span>
            </div>

            <div className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-8 bg-red-500"></div>
                    <h1 className="text-gray-900">대여 내역</h1>
                </div>
                <p className="text-gray-600">
                    진행 중이거나 완료된 대여 내역을 확인하세요
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b-2 border-gray-200">
                <button
                    onClick={() => setActiveTab("BORROWER")}
                    className={`px-6 py-3 transition-colors ${
                        activeTab === "BORROWER"
                            ? "border-b-2 border-red-500 text-gray-900 -mb-0.5"
                            : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    대여 받은 내역
                </button>
                <button
                    onClick={() => setActiveTab("LENDER")}
                    className={`px-6 py-3 transition-colors ${
                        activeTab === "LENDER"
                            ? "border-b-2 border-red-500 text-gray-900 -mb-0.5"
                            : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    대여 해준 내역
                </button>
            </div>

            {rentals &&
            rentals.data.content &&
            rentals.data.content.length > 0 ? (
                <div className="space-y-6">
                    {rentals!.data.content.map((rental) => {
                        const config = getStatusConfig(rental.status);

                        return (
                            <div
                                key={rental.rentalId}
                                className="bg-white border-2 border-gray-200 hover:border-gray-400 transition-colors"
                            >
                                <div className="p-6">
                                    <div className="flex gap-6">
                                        <img
                                            src={`/api/image?url=${rental.thumbnailUrl}`}
                                            alt={rental.title}
                                            className="w-32 h-32 object-cover bg-gray-100"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-gray-900">
                                                            {rental.title}
                                                        </h3>
                                                    </div>
                                                    <div className="space-y-1 mb-3">
                                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>
                                                                {
                                                                    rental.startDate
                                                                }{" "}
                                                                ~{" "}
                                                                {rental.endDate}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                            <Clock className="w-4 h-4" />
                                                            <span>
                                                                {getRentalDurationDays(
                                                                    rental.startDate,
                                                                    rental.endDate,
                                                                )}
                                                                일 대여
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`px-3 py-1 text-sm ${config.bg} ${config.text}`}
                                                        >
                                                            {config.label}
                                                        </span>
                                                        <span className="text-gray-900 text-lg">
                                                            {rental.totalPrice.toLocaleString()}
                                                            원
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    {/* 대여 받은 내역 버튼 */}
                                                    {activeTab === "BORROWER" &&
                                                        rental.status ===
                                                            "REQUESTED" && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        handleStartRental(
                                                                            rental.rentalId,
                                                                        )
                                                                    }
                                                                    className="px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                                >
                                                                    결제하기
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleCancelRental(
                                                                            rental.rentalId,
                                                                        )
                                                                    }
                                                                    className="px-6 py-2 border-2 border-gray-300 text-gray-900 hover:border-gray-900 transition-colors"
                                                                >
                                                                    대여 취소
                                                                </button>
                                                            </>
                                                        )}

                                                    {canCancelBorrowedRental(
                                                        rental,
                                                    ) &&
                                                        rental.status ===
                                                            "CONFIRMED" && (
                                                            <button
                                                                onClick={() =>
                                                                    handleCancelRental(
                                                                        rental.rentalId,
                                                                    )
                                                                }
                                                                className="px-6 py-2 border-2 border-gray-300 text-gray-900 hover:border-gray-900 transition-colors"
                                                            >
                                                                결제 취소
                                                            </button>
                                                        )}

                                                    {/* 대여 해준 내역 버튼 */}
                                                    {activeTab === "LENDER" &&
                                                        rental.status ===
                                                            "CONFIRMED" && (
                                                            <button
                                                                onClick={() =>
                                                                    handleConfirmReturn(
                                                                        rental.rentalId,
                                                                    )
                                                                }
                                                                className="px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                            >
                                                                반납 확인
                                                            </button>
                                                        )}

                                                    {rental.status ===
                                                        "ENDED" && (
                                                        <span className="px-6 py-2 text-gray-400">
                                                            대여 완료
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : !isLoading ? (
                <div className="text-center py-24 bg-gray-50">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-1">대여 내역이 없습니다</p>
                    <p className="text-gray-400 text-sm">물품을 대여해보세요</p>
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-1">
                        대여 내역을 불러오는 중입니다...
                    </p>
                </div>
            )}

            {/* Start Rental Modal */}
            {showStartModal && selectedRental && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white max-w-md w-full p-8">
                        <h2 className="text-gray-900 mb-4">
                            결제 후 대여를 시작합니다
                        </h2>
                        <p className="text-gray-600 mb-6">
                            "{selectedRental.title}" 결제를 진행하세요.
                            <br />
                            대여 기간: {selectedRental.startDate} ~{" "}
                            {selectedRental.endDate}
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="bg-gray-50 p-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                        결제 금액
                                    </span>
                                    <span className="text-gray-900">
                                        {selectedRental.totalPrice.toLocaleString()}
                                        원
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-2">
                                    쿠폰 선택
                                </label>
                                <select
                                    value={selectedCouponId ?? ""}
                                    onChange={(event) =>
                                        setSelectedCouponId(
                                            event.target.value
                                                ? Number(event.target.value)
                                                : null,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
                                >
                                    <option value="">쿠폰 사용 안 함</option>
                                    {coupons.map((coupon) => (
                                        <option
                                            key={coupon.userCouponId}
                                            value={coupon.userCouponId}
                                        >
                                            {coupon.couponName}
                                        </option>
                                    ))}
                                </select>
                                {selectedCoupon &&
                                    selectedRental &&
                                    selectedRental.totalPrice <
                                        (selectedCoupon.minOrderAmount ??
                                            0) && (
                                        <p className="text-xs text-red-500 mt-2">
                                            최소 주문 금액{" "}
                                            {(
                                                selectedCoupon.minOrderAmount ??
                                                0
                                            ).toLocaleString()}
                                            원 이상에서 사용 가능합니다.
                                        </p>
                                    )}
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-2">
                                    포인트 사용
                                </label>
                                <input
                                    type="text"
                                    value={usedPoint}
                                    onChange={(event) =>
                                        handlePointInputChange(
                                            event.target.value,
                                            maxUsablePoint,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
                                    placeholder="사용할 포인트 입력"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    보유 포인트: {userPoints.toLocaleString()}P
                                    | 최대 사용 가능:{" "}
                                    {maxUsablePoint.toLocaleString()}P
                                </p>
                                {pointLimitMessage && (
                                    <p className="text-xs text-red-500 mt-2">
                                        {pointLimitMessage}
                                    </p>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-600">
                                        포인트
                                    </span>
                                    <span className="text-gray-900">
                                        -{safeUsedPoint.toLocaleString()}원
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600">쿠폰</span>
                                    <span className="text-gray-900">
                                        -{couponDiscount.toLocaleString()}원
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                                    <span className="text-gray-900">
                                        최종 결제 금액
                                    </span>
                                    <span className="text-gray-900">
                                        {finalPaymentAmount.toLocaleString()}원
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={cancelStartRental}
                                disabled={isPaying}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 hover:border-gray-900 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={confirmStartRental}
                                disabled={isPaying}
                                className="flex-1 px-6 py-3 bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                {isPaying ? "결제 중..." : "결제하기"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Return Modal */}
            {showReturnModal && selectedRental && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white max-w-md w-full p-8">
                        <h2 className="text-gray-900 mb-4">
                            반납을 확인하시겠습니까?
                        </h2>
                        <p className="text-gray-600 mb-8">
                            "{selectedRental.title}"의 반납을 확인합니다.
                            <br />
                            확인 후 대여가 완료 처리됩니다.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={cancelReturn}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 hover:border-gray-900 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={confirmReturn}
                                className="flex-1 px-6 py-3 bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCancelModal && selectedRental && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white max-w-md w-full p-8">
                        <h2 className="text-gray-900 mb-4">
                            대여를 취소하시겠습니까?
                        </h2>
                        <p className="text-gray-600 mb-8">
                            "{selectedRental.title}" 대여를 취소합니다.
                            <br />
                            취소 후 내역에서 제거됩니다.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmCancelRental}
                                className="flex-1 px-6 py-3 bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                확인
                            </button>
                            <button
                                onClick={cancelCancelRental}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 hover:border-gray-900 transition-colors"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default RentalHistoryClient;
