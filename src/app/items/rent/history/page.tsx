"use client";

import { Calendar, Clock, Package } from "lucide-react";
import { useState } from "react";

interface RentalHistoryPageProps {
    onBack: () => void;
}

interface RentalRecord {
    id: string;
    itemId: string;
    itemName: string;
    itemImage: string;
    rentalPeriod: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: "결제 보관 중" | "대여 중" | "완료";
    pickupMethod: string;
    ownerName: string;
    type: "borrowed" | "lent"; // borrowed: 내가 대여 받음, lent: 내가 대여 해줌
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

const userPoints = 15000;

// Mock rental history data
const mockRentalHistory: RentalRecord[] = [
    {
        id: "R001",
        itemId: "5",
        itemName: "캐논 EOS R5",
        itemImage:
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
        rentalPeriod: "3일",
        startDate: "2024-01-15",
        endDate: "2024-01-18",
        totalPrice: 150000,
        status: "결제 보관 중",
        pickupMethod: "택배 수령",
        ownerName: "김철수",
        type: "borrowed",
    },
    {
        id: "R002",
        itemId: "1",
        itemName: "맥북 프로 16인치",
        itemImage:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
        rentalPeriod: "7일",
        startDate: "2024-01-10",
        endDate: "2024-01-17",
        totalPrice: 350000,
        status: "대여 중",
        pickupMethod: "직접 만나서 수령",
        ownerName: "이영희",
        type: "borrowed",
    },
    {
        id: "R003",
        itemId: "8",
        itemName: "로지텍 MX Keys 키보드",
        itemImage:
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
        rentalPeriod: "5일",
        startDate: "2024-01-05",
        endDate: "2024-01-10",
        totalPrice: 40000,
        status: "대여 중",
        pickupMethod: "택배 수령",
        ownerName: "박민수",
        type: "borrowed",
    },
    {
        id: "R004",
        itemId: "6",
        itemName: "에어팟 맥스",
        itemImage:
            "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&q=80",
        rentalPeriod: "2일",
        startDate: "2024-01-08",
        endDate: "2024-01-10",
        totalPrice: 24000,
        status: "완료",
        pickupMethod: "택배 수령",
        ownerName: "최지원",
        type: "borrowed",
    },
    {
        id: "R005",
        itemId: "3",
        itemName: "소니 A7IV 카메라",
        itemImage:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        rentalPeriod: "4일",
        startDate: "2024-01-12",
        endDate: "2024-01-16",
        totalPrice: 160000,
        status: "결제 보관 중",
        pickupMethod: "직접 만나서 수령",
        ownerName: "홍길동",
        type: "lent",
    },
    {
        id: "R006",
        itemId: "3",
        itemName: "소니 A7IV 카메라",
        itemImage:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        rentalPeriod: "3일",
        startDate: "2024-01-18",
        endDate: "2024-01-21",
        totalPrice: 120000,
        status: "대여 중",
        pickupMethod: "택배 수령",
        ownerName: "김민지",
        type: "lent",
    },
    {
        id: "R007",
        itemId: "3",
        itemName: "소니 A7IV 카메라",
        itemImage:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        rentalPeriod: "2일",
        startDate: "2024-01-20",
        endDate: "2024-01-22",
        totalPrice: 80000,
        status: "완료",
        pickupMethod: "택배 수령",
        ownerName: "박서준",
        type: "lent",
    },
];

function RentalHistoryPage({ onBack }: RentalHistoryPageProps) {
    const [rentals, setRentals] = useState<RentalRecord[]>(mockRentalHistory);
    const [activeTab, setActiveTab] = useState<"borrowed" | "lent">("borrowed");
    const [showStartModal, setShowStartModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [usedPoint, setUsedPoint] = useState(0);
    const [pointLimitMessage, setPointLimitMessage] = useState("");
    const [selectedCouponId, setSelectedCouponId] = useState<string | null>(
        null,
    );
    const [isPaying, setIsPaying] = useState(false);
    const [selectedRental, setSelectedRental] = useState<RentalRecord | null>(
        null,
    );

    const isRentalNotStarted = (rental: RentalRecord) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const rentalStartDate = new Date(`${rental.startDate}T00:00:00`);
        return today < rentalStartDate;
    };

    const canCancelBorrowedRental = (rental: RentalRecord) => {
        if (rental.type !== "borrowed") {
            return false;
        }

        if (rental.status === "결제 보관 중") {
            return true;
        }

        return rental.status === "대여 중" && isRentalNotStarted(rental);
    };

    const handleStartRental = (rentalId: string) => {
        const rental = rentals.find((r) => r.id === rentalId);
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

        const selectedCoupon = mockCoupons.find(
            (coupon) => coupon.id === selectedCouponId,
        );
        let couponDiscount = 0;

        if (
            selectedCoupon &&
            selectedRental.totalPrice >= selectedCoupon.minAmount
        ) {
            if (selectedCoupon.type === "percentage") {
                couponDiscount = Math.floor(
                    selectedRental.totalPrice * (selectedCoupon.discount / 100),
                );
            } else {
                couponDiscount = selectedCoupon.discount;
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
                    rentalId: 11,
                }),
            });

            if (!response.ok) {
                throw new Error("결제 테스트 API 호출에 실패했습니다.");
            }

            // setRentals((prev) =>
            //     prev.map((rental) =>
            //         rental.id === selectedRental.id
            //             ? { ...rental, status: "대여 중" as const }
            //             : rental,
            //     ),
            // );
            setShowStartModal(false);
            setSelectedRental(null);
            alert("결제가 완료되어 대여가 확정되었습니다.");
        } catch (error) {
            console.error(error);
            alert("결제 테스트 API 호출 중 오류가 발생했습니다.");
        } finally {
            setIsPaying(false);
        }
    };

    const cancelStartRental = () => {
        setShowStartModal(false);
        setSelectedRental(null);
        setPointLimitMessage("");
    };

    const handleConfirmReturn = (rentalId: string) => {
        const rental = rentals.find((r) => r.id === rentalId);
        if (rental) {
            setSelectedRental(rental);
            setShowReturnModal(true);
        }
    };

    const confirmReturn = () => {
        if (selectedRental) {
            setRentals((prev) =>
                prev.map((rental) =>
                    rental.id === selectedRental.id
                        ? { ...rental, status: "완료" as const }
                        : rental,
                ),
            );
            setShowReturnModal(false);
            setSelectedRental(null);
            alert("반납이 확인되었습니다.");
        }
    };

    const cancelReturn = () => {
        setShowReturnModal(false);
        setSelectedRental(null);
    };

    const handleCancelRental = (rentalId: string) => {
        const rental = rentals.find((r) => r.id === rentalId);
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
            const response = await fetch(`/api/rentals/11/cancel`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("대여 취소 API 호출에 실패했습니다.");
            }

            setRentals((prev) =>
                prev.filter((rental) => rental.id !== selectedRental.id),
            );
            setShowCancelModal(false);
            setSelectedRental(null);
            alert("대여가 취소되었습니다.");
        } catch (error) {
            console.error(error);
            alert("대여 취소 중 오류가 발생했습니다.");
        }
    };

    const cancelCancelRental = () => {
        setShowCancelModal(false);
        setSelectedRental(null);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "결제 보관 중":
                return {
                    bg: "bg-amber-50",
                    text: "text-amber-600",
                    label: "결제 보관 중",
                };
            case "대여 중":
                return {
                    bg: "bg-blue-50",
                    text: "text-blue-600",
                    label: "대여 중",
                };
            case "완료":
                return {
                    bg: "bg-green-50",
                    text: "text-green-600",
                    label: "완료",
                };
            default:
                return {
                    bg: "bg-gray-50",
                    text: "text-gray-600",
                    label: status,
                };
        }
    };

    const filteredRentals = rentals.filter(
        (rental) => rental.type === activeTab,
    );
    const selectedCoupon = mockCoupons.find(
        (coupon) => coupon.id === selectedCouponId,
    );
    let couponDiscount = 0;
    if (
        selectedRental &&
        selectedCoupon &&
        selectedRental.totalPrice >= selectedCoupon.minAmount
    ) {
        if (selectedCoupon.type === "percentage") {
            couponDiscount = Math.floor(
                selectedRental.totalPrice * (selectedCoupon.discount / 100),
            );
        } else {
            couponDiscount = selectedCoupon.discount;
        }
    }
    const priceAfterCoupon = (selectedRental?.totalPrice ?? 0) - couponDiscount;
    const maxUsablePoint = Math.min(
        userPoints,
        Math.floor(priceAfterCoupon * 0.5),
    );
    const safeUsedPoint = Math.max(0, Math.min(usedPoint, maxUsablePoint));
    const finalPaymentAmount = priceAfterCoupon - safeUsedPoint;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <button onClick={onBack} className="hover:text-gray-900">
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
                    onClick={() => setActiveTab("borrowed")}
                    className={`px-6 py-3 transition-colors ${
                        activeTab === "borrowed"
                            ? "border-b-2 border-red-500 text-gray-900 -mb-0.5"
                            : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    대여 받은 내역
                </button>
                <button
                    onClick={() => setActiveTab("lent")}
                    className={`px-6 py-3 transition-colors ${
                        activeTab === "lent"
                            ? "border-b-2 border-red-500 text-gray-900 -mb-0.5"
                            : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    대여 해준 내역
                </button>
            </div>

            {filteredRentals.length === 0 ? (
                <div className="text-center py-24 bg-gray-50">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-1">대여 내역이 없습니다</p>
                    <p className="text-gray-400 text-sm">물품을 대여해보세요</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredRentals.map((rental) => {
                        const config = getStatusConfig(rental.status);

                        return (
                            <div
                                key={rental.id}
                                className="bg-white border-2 border-gray-200 hover:border-gray-400 transition-colors"
                            >
                                <div className="p-6">
                                    <div className="flex gap-6">
                                        <img
                                            src={rental.itemImage}
                                            alt={rental.itemName}
                                            className="w-32 h-32 object-cover bg-gray-100"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-gray-900">
                                                            {rental.itemName}
                                                        </h3>
                                                        <span className="text-sm text-gray-500">
                                                            {rental.type ===
                                                            "borrowed"
                                                                ? `소유자: ${rental.ownerName}`
                                                                : `대여자: ${rental.ownerName}`}
                                                        </span>
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
                                                                {
                                                                    rental.rentalPeriod
                                                                }{" "}
                                                                대여
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
                                                    {rental.type ===
                                                        "borrowed" &&
                                                        rental.status ===
                                                            "결제 보관 중" && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        handleStartRental(
                                                                            rental.id,
                                                                        )
                                                                    }
                                                                    className="px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                                >
                                                                    대여 시작
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleCancelRental(
                                                                            rental.id,
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
                                                            "대여 중" && (
                                                            <button
                                                                onClick={() =>
                                                                    handleCancelRental(
                                                                        rental.id,
                                                                    )
                                                                }
                                                                className="px-6 py-2 border-2 border-gray-300 text-gray-900 hover:border-gray-900 transition-colors"
                                                            >
                                                                대여 취소
                                                            </button>
                                                        )}

                                                    {/* 대여 해준 내역 버튼 */}
                                                    {rental.type === "lent" &&
                                                        rental.status ===
                                                            "대여 중" && (
                                                            <button
                                                                onClick={() =>
                                                                    handleConfirmReturn(
                                                                        rental.id,
                                                                    )
                                                                }
                                                                className="px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                            >
                                                                반납 확인
                                                            </button>
                                                        )}

                                                    {rental.status ===
                                                        "완료" && (
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
            )}

            {/* Start Rental Modal */}
            {showStartModal && selectedRental && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white max-w-md w-full p-8">
                        <h2 className="text-gray-900 mb-4">
                            결제 후 대여를 시작합니다
                        </h2>
                        <p className="text-gray-600 mb-6">
                            "{selectedRental.itemName}" 결제를 진행하세요.
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
                                            event.target.value || null,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
                                >
                                    <option value="">쿠폰 사용 안 함</option>
                                    {mockCoupons.map((coupon) => (
                                        <option
                                            key={coupon.id}
                                            value={coupon.id}
                                        >
                                            {coupon.name}
                                        </option>
                                    ))}
                                </select>
                                {selectedCoupon &&
                                    selectedRental &&
                                    selectedRental.totalPrice <
                                        selectedCoupon.minAmount && (
                                        <p className="text-xs text-red-500 mt-2">
                                            최소 주문 금액{" "}
                                            {selectedCoupon.minAmount.toLocaleString()}
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
                            "{selectedRental.itemName}"의 반납을 확인합니다.
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
                            "{selectedRental.itemName}" 대여를 취소합니다.
                            <br />
                            취소 후 내역에서 제거됩니다.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={cancelCancelRental}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 hover:border-gray-900 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={confirmCancelRental}
                                className="flex-1 px-6 py-3 bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default RentalHistoryPage;
