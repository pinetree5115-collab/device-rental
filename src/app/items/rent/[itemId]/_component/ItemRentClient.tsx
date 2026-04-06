"use client";

import { createRentalApi } from "@/services/post.service";
import { Item } from "@/types/common";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";

export interface RentalData {
    postId: number;
    startDate: string;
    endDate: string;
    receiveMethod: "PARCEL" | "MEETUP";
}

const parseLocalDate = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
};

const formatDate = (value?: Date) => {
    if (!value) return "";

    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatDateLabel = (value?: Date) => {
    if (!value) return "-";

    return value.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const isDateRangeOverlapping = (
    selectedRange: { from: Date; to: Date },
    rentalPeriods: Item["rentalPeriods"],
) => {
    return rentalPeriods.some((period) => {
        const blockedStart = parseLocalDate(period.startDate);
        const blockedEnd = parseLocalDate(period.endDate);

        return (
            selectedRange.from <= blockedEnd && selectedRange.to >= blockedStart
        );
    });
};

function ItemRentClient({ item }: { item: Item }) {
    const router = useRouter();
    const host =
        typeof window !== "undefined" ? window.location.host : undefined;
    const protocol =
        typeof window !== "undefined"
            ? window.location.protocol.replace(":", "")
            : "http";
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
    const [selectedPickupMethod, setSelectedPickupMethod] = useState("");
    const [dateError, setDateError] = useState("");

    const startDate = formatDate(selectedRange?.from);
    const endDate = formatDate(selectedRange?.to);

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

    const finalPrice = basePrice;
    const disabledDays = [
        { before: today },
        ...item.rentalPeriods.map((period) => ({
            from: parseLocalDate(period.startDate),
            to: parseLocalDate(period.endDate),
        })),
    ];

    const handleDateRangeChange = (range: DateRange | undefined) => {
        if (!range) {
            setSelectedRange(undefined);
            setDateError("");
            return;
        }

        if (range.from && range.to) {
            const normalizedRange =
                range.from <= range.to
                    ? { from: range.from, to: range.to }
                    : { from: range.to, to: range.from };

            if (isDateRangeOverlapping(normalizedRange, item.rentalPeriods)) {
                setSelectedRange(undefined);
                setDateError(
                    "이미 대여 중인 기간과 겹치지 않는 날짜만 선택해주세요.",
                );
                return;
            }
        }

        setSelectedRange(range);
        setDateError("");
    };

    const handleSubmit = async () => {
        if (!startDate || !endDate || !selectedPickupMethod) {
            alert("모든 필수 항목을 선택해주세요");
            return;
        }

        if (
            isDateRangeOverlapping(
                {
                    from: parseLocalDate(startDate),
                    to: parseLocalDate(endDate),
                },
                item.rentalPeriods,
            )
        ) {
            alert("이미 대여 중인 기간과 겹치지 않는 날짜만 선택해주세요.");
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
                                src={`/api/image?url=${item.imageUrls[0]}`}
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

                            <div className="border-2 border-gray-300 p-4 sm:p-6">
                                <DayPicker
                                    mode="range"
                                    selected={selectedRange}
                                    onSelect={handleDateRangeChange}
                                    disabled={disabledDays}
                                    excludeDisabled
                                    showOutsideDays
                                    className="mx-auto"
                                    classNames={{
                                        months: "",
                                        month: "space-y-4",
                                        month_caption:
                                            "flex items-center justify-center text-gray-900",
                                        caption_label: "text-lg",
                                        nav: "flex items-center gap-2",
                                        button_previous:
                                            "h-9 w-9 border border-gray-300 text-gray-700 flex justify-center items-center hover:border-black hover:text-black",
                                        button_next:
                                            "h-9 w-9 border border-gray-300 text-gray-700 flex justify-center items-center hover:border-black hover:text-black",
                                        month_grid: "w-full border-collapse",
                                        weekdays: "grid grid-cols-7 mb-2",
                                        weekday:
                                            "text-center text-sm text-gray-500 font-normal",
                                        week: "grid grid-cols-7",
                                        day: "aspect-square p-0 text-sm",
                                        day_button:
                                            "h-11 w-11 rounded-none border border-transparent transition-colors",
                                        selected:
                                            "bg-black text-white hover:bg-black",
                                        range_start:
                                            "bg-black text-white hover:bg-black",
                                        range_end:
                                            "bg-black text-white hover:bg-black",
                                        range_middle:
                                            "bg-gray-100 text-gray-900",
                                        today: "text-red-500 font-semibold",
                                        disabled:
                                            "text-gray-300 line-through opacity-100",
                                        outside: "text-gray-300",
                                    }}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    <div className="border-2 border-gray-200 px-4 py-3">
                                        <p className="text-sm text-gray-500 mb-1">
                                            시작일
                                        </p>
                                        <p className="text-gray-900">
                                            {formatDateLabel(
                                                selectedRange?.from,
                                            )}
                                        </p>
                                    </div>
                                    <div className="border-2 border-gray-200 px-4 py-3">
                                        <p className="text-sm text-gray-500 mb-1">
                                            종료일
                                        </p>
                                        <p className="text-gray-900">
                                            {formatDateLabel(selectedRange?.to)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {item.rentalPeriods.length > 0 && (
                                <p className="text-sm text-gray-500 mt-3">
                                    예약 불가 기간:{" "}
                                    {item.rentalPeriods
                                        .map(
                                            (period) =>
                                                `${period.startDate} ~ ${period.endDate}`,
                                        )
                                        .join(", ")}
                                </p>
                            )}

                            {dateError && (
                                <p className="text-sm text-red-600 mt-3">
                                    {dateError}
                                </p>
                            )}

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
        </main>
    );
}

export default ItemRentClient;
