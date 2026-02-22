"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterBar } from "./FilterBar";
import { ItemCard } from "./ItemCard";
import type { Category } from "@/types/common";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type { FetchItemsResponse } from "@/services/post.service";
import { fetchItems } from "@/services/post.service";
import { getMyInfoApi } from "@/services/auth_copy.service";
import { LoadingSpinner } from "@/components/common/Spinner";

interface MainPageClientProps {
    initialItems?: FetchItemsResponse;
    categories: Category[];
}

function MainPageClient({ initialItems, categories }: MainPageClientProps) {
    const router = useRouter();

    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearchSubmit = () => {
        setCurrentPage(1);
        setSearchQuery(searchInput.trim());
    };

    const handleStatusFilterChange = (value: string | null) => {
        setCurrentPage(1);
        setStatusFilter(value);
    };

    const handleCategoryFilterChange = (value: number | null) => {
        setCurrentPage(1);
        setCategoryFilter(value);
    };

    const { data: user } = useQuery({
        queryKey: ["myInfo"],
        queryFn: getMyInfoApi,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Tanstack Query로 데이터 관리 (SSR 데이터를 initialData로 사용)
    const { data, isLoading } = useQuery<FetchItemsResponse>({
        queryKey: [
            "items",
            categoryFilter,
            searchQuery,
            currentPage,
            statusFilter,
        ],
        queryFn: () =>
            fetchItems(
                searchQuery,
                categoryFilter,
                statusFilter,
                currentPage - 1,
            ),
        staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    });

    const items = data?.content ?? [];

    // 필터링 및 정렬 로직
    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === null || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Sort items
    const sortedItems = [...filteredItems].sort(() => {
        return 0; // 최신순 (기본 순서 유지)
    });

    // Pagination (server-side pagination result)
    const totalPages = data?.page.totalPages ?? 0;
    const paginatedItems = sortedItems;

    if (isLoading) {
        return <LoadingSpinner />;
    }
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
                    searchQuery={searchInput}
                    onSearchChange={setSearchInput}
                    onSearchSubmit={handleSearchSubmit}
                    statusFilter={statusFilter}
                    onStatusFilterChange={handleStatusFilterChange}
                    categoryFilter={categoryFilter}
                    onCategoryFilterChange={handleCategoryFilterChange}
                    categories={categories}
                />

                <>
                    {isLoading ? (
                        <div className="text-center py-24">
                            <p className="text-gray-400">로딩 중...</p>
                        </div>
                    ) : paginatedItems.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-gray-400">
                                검색 결과가 없습니다
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {paginatedItems.map((item) => (
                                <ItemCard
                                    key={item.postId}
                                    item={item}
                                    onClick={() =>
                                        router.push(`/items/${item.postId}`)
                                    }
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-200 bg-white text-gray-600 text-sm cursor-pointer hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 transition-colors"
                            >
                                이전
                            </button>

                            <div className="flex gap-1">
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
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
                                        Math.min(totalPages, p + 1),
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
            </main>

            {/* Floating Action Button - Only for logged-in users */}
            {user && (
                <button
                    onClick={() => router.push("items/register")}
                    className="fixed bottom-8 right-8 cursor-pointer bg-gray-900 text-white px-5 py-3 hover:bg-gray-800 transition-all flex items-center gap-2 group shadow-lg shadow-gray-900/10"
                >
                    <Plus className="w-5 h-5" strokeWidth={2} />
                    <span className="text-sm tracking-tight">새 물품 등록</span>
                </button>
            )}
        </div>
    );
}

export default MainPageClient;
