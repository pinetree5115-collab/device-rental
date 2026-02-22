import { useState, useRef } from "react";
import type { Category } from "@/types/common";
import { useClickOutside } from "@/hooks/common";

interface FilterBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    statusFilter: string | null;
    onStatusFilterChange: (value: string | null) => void;
    categoryFilter: number | null;
    onCategoryFilterChange: (value: number | null) => void;
    categories: Category[];
}

export function FilterBar({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    categoryFilter,
    onCategoryFilterChange,
    categories,
}: FilterBarProps) {
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const statusRef = useRef<HTMLDivElement | null>(null);
    const categoryRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(statusRef as React.RefObject<HTMLElement>, () =>
        setIsStatusOpen(false),
    );
    useClickOutside(categoryRef as React.RefObject<HTMLElement>, () =>
        setIsCategoryOpen(false),
    );

    const statusOptions = [
        { value: null, label: "전체 상태" },
        { value: "AVAILABLE", label: "대여 가능" },
        { value: "RESERVED", label: "대여 중" },
        { value: "HIDDEN", label: "대여 불가능" },
        { value: "ENDED", label: "대여 종료" },
    ];

    const categoryOptions = [
        { value: null, label: "전체 카테고리" },
        ...categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
        })),
    ];

    return (
        <div className="flex flex-col md:flex-row gap-3 mb-10">
            {/* Search */}
            <div className="relative flex-1 flex items-center gap-2.5 border border-gray-200 bg-white px-3.5">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                        stroke="#99A1AF"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M14 14L11.1333 11.1333"
                        stroke="#99A1AF"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <input
                    type="text"
                    placeholder="물품명 검색"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full py-2.5 border-none bg-white text-sm focus:outline-none"
                />
            </div>

            {/* Category Filter */}
            <div className="relative" ref={categoryRef}>
                <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full md:w-44 px-4 py-2.5 border border-gray-200 bg-white text-sm focus:outline-none focus:border-gray-900 transition-colors appearance-none cursor-pointer text-left flex items-center justify-between"
                >
                    <span>
                        {categoryOptions.find(
                            (opt) => opt.value === categoryFilter,
                        )?.label || "카테고리 선택"}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        className={`transition-transform ${
                            isCategoryOpen ? "rotate-180" : ""
                        }`}
                    >
                        <path fill="#666" d="M6 9L1 4h10z" />
                    </svg>
                </button>

                {isCategoryOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50">
                        {categoryOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onCategoryFilterChange(option.value);
                                    setIsCategoryOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-sm text-left cursor-pointer hover:bg-gray-50 transition-colors ${
                                    categoryFilter === option.value
                                        ? "bg-gray-900 text-white hover:bg-gray-800"
                                        : "text-gray-900"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Status Filter */}
            <div className="relative" ref={statusRef}>
                <button
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                    className="w-full md:w-44 px-4 py-2.5 border border-gray-200 bg-white text-sm focus:outline-none focus:border-gray-900 transition-colors appearance-none cursor-pointer text-left flex items-center justify-between"
                >
                    <span>
                        {statusOptions.find((opt) => opt.value === statusFilter)
                            ?.label || "전체 상태"}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        className={`transition-transform ${
                            isStatusOpen ? "rotate-180" : ""
                        }`}
                    >
                        <path fill="#666" d="M6 9L1 4h10z" />
                    </svg>
                </button>

                {isStatusOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onStatusFilterChange(option.value);
                                    setIsStatusOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-sm text-left cursor-pointer hover:bg-gray-50 transition-colors ${
                                    statusFilter === option.value
                                        ? "bg-gray-900 text-white hover:bg-gray-800"
                                        : "text-gray-900"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
