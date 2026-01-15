"use client";

import { useState } from "react";
import { FilterBar } from "./FilterBar";
import { ItemCard } from "./ItemCard";

export interface Item {
    id: string;
    name: string;
    description: string;
    detailedDescription: string;
    price: number;
    status: "대여 가능" | "대여 중" | "결제 보관 중";
    image: string;
    category: "갤럭시 울트라" | "아이폰" | "캠코더" | "DSLR";
    pickupMethod: "택배 수령" | "직접 만나서 수령" | "택배 / 직접 수령";
    availablePeriod?: string;
}

// Mock data
const mockItems: Item[] = [
    {
        id: "1",
        name: "갤럭시 S24 울트라",
        description: "256GB, 티타늄 그레이, S펜 포함",
        detailedDescription:
            "삼성의 최신 플래그십 스마트폰 갤럭시 S24 울트라입니다. 강력한 성능과 S펜을 활용한 다양한 기능을 제공합니다.\n\n포함 구성품:\n- 갤럭시 S24 울트라 본체 (256GB)\n- S펜\n- 45W 고속 충전기\n- USB-C 케이블\n- 투명 케이스\n\n상태: 2024년 1월 구입, 사용감 거의 없음",
        price: 25000,
        status: "대여 가능",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
        category: "갤럭시 울트라",
        pickupMethod: "택배 / 직접 수령",
    },
    {
        id: "2",
        name: "아이폰 15 Pro Max",
        description: "512GB, 티타늄 블루, A17 Pro 칩",
        detailedDescription:
            "애플의 최신 프리미엄 스마트폰 아이폰 15 Pro Max입니다. 티타늄 소재와 강력한 A17 Pro 칩을 탑재했습니다.\n\n포함 구성품:\n- 아이폰 15 Pro Max 본체 (512GB)\n- USB-C 충전 케이블\n- 정품 가죽 케이스\n- 강화유리 필름 부착\n\n상태: 2023년 11월 구입, 배터리 100%",
        price: 30000,
        status: "대여 가능",
        image: "https://images.unsplash.com/photo-1592286927505-4a9d0c8d5d4b?w=400",
        category: "아이폰",
        pickupMethod: "직접 만나서 수령",
    },
    {
        id: "3",
        name: "소니 FDR-AX700 캠코더",
        description: "4K HDR, 광학 12배 줌, 1인치 센서",
        detailedDescription:
            "소니의 프리미엄 4K 캠코더입니다. 1인치 Exmor RS CMOS 센서와 광학 12배 줌을 탑재하여 전문가급 영상 촬영이 가능합니다.\n\n포함 구성품:\n- 소니 FDR-AX700 본체\n- 배터리 2개\n- 충전기\n- 128GB SD 카드\n- 캠코더 가방\n\n상태: 촬영 시간 약 30시간",
        price: 40000,
        status: "대여 중",
        image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400",
        category: "캠코더",
        pickupMethod: "택배 수령",
    },
    {
        id: "4",
        name: "캐논 EOS R5",
        description: "4500만 화소 풀프레임, 8K 동영상 촬영",
        detailedDescription:
            "캐논의 프로급 미러리스 카메라 EOS R5입니다. 4500만 화소의 고해상도와 8K 동영상 촬영 기능을 제공합니다.\n\n포함 구성품:\n- 캐논 EOS R5 본체\n- RF 24-105mm F4L IS USM 렌즈\n- 배터리 2개\n- 충전기\n- CFexpress 카드 256GB\n\n현재 상태: 결제 보관 중 (다른 사용자가 결제 진행 중)",
        price: 50000,
        status: "결제 보관 중",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
        category: "DSLR",
        pickupMethod: "택배 / 직접 수령",
    },
    {
        id: "5",
        name: "니콘 D850 DSLR",
        description: "4575만 화소, 풀프레임 센서, 4K UHD",
        detailedDescription:
            "니콘의 고해상도 DSLR 카메라입니다. 뛰어난 화질과 견고한 바디로 전문 사진가들에게 사랑받는 모델입니다.\n\n포함 구성품:\n- 니콘 D850 본체\n- AF-S 24-70mm f/2.8E ED VR 렌즈\n- 배터리 그립\n- 배터리 3개\n- 충전기\n- 64GB SD 카드 2개\n\n상태: 셔터 횟수 약 10,000회",
        price: 42000,
        status: "대여 가능",
        image: "https://images.unsplash.com/photo-1606980702796-61e1c7f9b235?w=400",
        category: "DSLR",
        pickupMethod: "직접 만나서 수령",
    },
    {
        id: "6",
        name: "갤럭시 S23 울트라",
        description: "512GB, 팬텀 블랙, 200MP 카메라",
        detailedDescription:
            "삼성의 프리미엄 스마트폰입니다. 2억 화소 카메라와 강력한 배터리로 하루 종일 사용 가능합니다.\n\n포함 구성품:\n- 갤럭시 S23 울트라 본체 (512GB)\n- S펜\n- 25W 고속 충전기\n- USB-C 케이블\n- 가죽 케이스\n\n상태: 2023년 3월 구입, 배터리 건강도 95%",
        price: 22000,
        status: "대여 가능",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
        category: "갤럭시 울트라",
        pickupMethod: "택배 수령",
    },
    {
        id: "7",
        name: "아이폰 14 Pro",
        description: "256GB, 딥 퍼플, Dynamic Island",
        detailedDescription:
            "아이폰 14 Pro는 Dynamic Island와 상시 표시 기능을 탑재한 프리미엄 스마트폰입니다.\n\n포함 구성품:\n- 아이폰 14 Pro 본체 (256GB)\n- 라이트닝-USB-C 케이블\n- 실리콘 케이스\n- 강화유리 필름\n\n상태: 2022년 10월 구입, 배터리 97%",
        price: 24000,
        status: "대여 가능",
        image: "https://images.unsplash.com/photo-1592286927505-4a9d0c8d5d4b?w=400",
        category: "아이폰",
        pickupMethod: "택배 / 직접 수령",
    },
    {
        id: "8",
        name: "파나소닉 HC-X1500 캠코더",
        description: "4K 60p, 24배 광학 줌, 방송용 퀄리티",
        detailedDescription:
            "파나소닉의 전문가용 4K 캠코더입니다. 방송 품질의 영상을 촬영할 수 있으며, 다양한 수동 조작이 가능합니다.\n\n포함 구성품:\n- 파나소닉 HC-X1500 본체\n- 배터리 2개\n- 충전기\n- 256GB SD 카드\n- 캠코더 가방\n- 외장 마이크\n\n상태: 작동 완벽, 렌즈 깨끗",
        price: 38000,
        status: "대여 중",
        image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400",
        category: "캠코더",
        pickupMethod: "직접 만나서 수령",
    },
    {
        id: "9",
        name: "소니 A7 IV 미러리스",
        description: "3300만 화소, 5축 손떨림 보정, 4K 60p",
        detailedDescription:
            "소니의 베스트셀러 풀프레임 미러리스 카메라입니다. 사진과 동영상 모두 뛰어난 성능을 제공합니다.\n\n포함 구성품:\n- 소니 A7 IV 본체\n- FE 28-70mm F3.5-5.6 OSS 렌즈\n- 배터리 2개\n- 충전기\n- 128GB SD 카드\n\n상태: 셔터 횟수 5,000회",
        price: 45000,
        status: "대여 가능",
        image: "https://images.unsplash.com/photo-1606980702796-61e1c7f9b235?w=400",
        category: "DSLR",
        pickupMethod: "택배 수령",
    },
];

function MainPageClient() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("전체");
    const [categoryFilter, setCategoryFilter] = useState<string>("전체");
    const [priceSort, setPriceSort] = useState<string>("최신순");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const itemsPerPage = 6;

    // Filter items
    const filteredItems = mockItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "전체" || item.status === statusFilter;
        const matchesCategory =
            categoryFilter === "전체" || item.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort items
    const sortedItems = [...filteredItems].sort((a, b) => {
        if (priceSort === "가격 낮은순") return a.price - b.price;
        if (priceSort === "가격 높은순") return b.price - a.price;
        return 0; // 최신순 (기본 순서 유지)
    });

    // Pagination
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = sortedItems.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleItemClick = (id: string) => {
        setSelectedItemId(id);
    };

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-gray-900 mb-3 tracking-tight">
                        물품 목록
                    </h1>
                    <p className="text-gray-600 text-lg">
                        다양한 전자기기를 편리하게 대여하세요
                    </p>
                </div>

                <FilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    categoryFilter={categoryFilter}
                    onCategoryFilterChange={setCategoryFilter}
                    priceSort={priceSort}
                    onPriceSortChange={setPriceSort}
                />

                {paginatedItems.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-400">검색 결과가 없습니다</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {paginatedItems.map((item) => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    onClick={() => handleItemClick(item.id)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(1, p - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-200 bg-white text-gray-600 text-sm cursor-pointer hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 transition-colors"
                                >
                                    이전
                                </button>

                                <div className="flex gap-1">
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-9 h-9 text-sm transition-colors ${
                                                currentPage === page
                                                    ? "bg-gray-900 text-white cursor-pointer"
                                                    : "bg-white text-gray-600 border border-gray-200 cursor-pointer hover:border-gray-900 hover:text-gray-900"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(totalPages, p + 1)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-200 bg-white text-gray-600 text-sm cursor-pointer hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 transition-colors"
                                >
                                    다음
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default MainPageClient;
