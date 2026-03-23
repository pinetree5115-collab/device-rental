"use client";

import { getMyInfoApi } from "@/services/auth_copy.service";
import { Item } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ItemDetailClient({ item }: { item: Item }) {
    const router = useRouter();

    const { data: user } = useQuery({
        queryKey: ["myInfo"],
        queryFn: getMyInfoApi,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const canRent = item.status === "AVAILABLE" && !!user;
    const isAvailable = item.status === "AVAILABLE";

    const [selectedImgIndex, setSelectedImgIndex] = useState(0);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <button
                    onClick={() => {}}
                    className="cursor-pointer hover:text-gray-900"
                >
                    홈
                </button>
                <span>/</span>
                <span className="text-gray-900">{item.categoryName}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                {/* Left column - Images */}
                <div className="space-y-4">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                            src={`/api/image?url=${item.imageUrls[selectedImgIndex]}`}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {item.imageUrls.map((i, index) => (
                            <div
                                key={i}
                                className="aspect-square bg-gray-100 border-2 border-transparent hover:border-gray-900 cursor-pointer transition-colors"
                            >
                                <img
                                    src={`/api/image?url=${i}`}
                                    alt=""
                                    className={`w-full h-full object-cover transition-opacity ${selectedImgIndex === index ? "opacity-100" : "opacity-60"}`}
                                    onClick={() => setSelectedImgIndex(index)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right column - Details */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-gray-500 px-2 py-1 border border-gray-300">
                                {item.categoryName}
                            </span>
                        </div>

                        <h1 className="text-gray-900 mb-4 tracking-tight">
                            {item.title}
                        </h1>

                        {/* Status */}
                        <div className="flex items-center gap-3 mb-4">
                            <span
                                className={
                                    item.status === "AVAILABLE"
                                        ? "text-emerald-600"
                                        : "text-gray-500"
                                }
                            >
                                {item.status === "AVAILABLE"
                                    ? "대여 가능"
                                    : "대여 불가"}
                            </span>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-6">
                            {item.description}
                        </p>
                    </div>

                    {/* Price */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-2xl text-gray-900">
                                {item.pricePerDay.toLocaleString()}원
                            </span>
                            <span className="text-gray-500">/일</span>
                        </div>
                    </div>

                    {/* Pickup Methods */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-900 w-24">
                                수령 가능 방식
                            </span>
                            <div className="flex gap-2">
                                {item.isParcel && (
                                    <span className="px-3 py-1 bg-gray-100 text-sm">
                                        택배
                                    </span>
                                )}
                                {item.isMeetup && (
                                    <span className="px-3 py-1 bg-gray-100 text-sm">
                                        직접 수령
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                        {canRent ? (
                            <>
                                <button
                                    onClick={() => {
                                        router.push(
                                            `/items/rent/${item.postId}`,
                                        );
                                    }}
                                    className="flex-1 px-8 py-3 cursor-pointer bg-red-500 text-white hover:bg-red-600 transition-colors"
                                >
                                    지금 대여하기
                                </button>
                            </>
                        ) : !user && isAvailable ? (
                            <div className="w-full border-2 border-red-500 bg-red-50 p-6">
                                <p className="text-red-900 mb-1">
                                    로그인이 필요합니다
                                </p>
                                <p className="text-red-700 text-sm">
                                    물품을 대여하려면 로그인해 주세요
                                </p>
                            </div>
                        ) : (
                            <button
                                disabled
                                className="flex-1 px-8 py-3 bg-gray-200 text-gray-400 cursor-not-allowed"
                            >
                                대여 불가
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Information */}
            <div className="border-t border-gray-200 pt-12">
                <div className="mb-8">
                    <h2 className="text-gray-900 mb-6 inline-block border-b-4 border-red-500 pb-2">
                        상세 정보
                    </h2>
                </div>
                <div className="max-w-4xl">
                    {item.description.split("\n").map((paragraph, index) => (
                        <p
                            key={index}
                            className="text-gray-600 mb-4 leading-relaxed whitespace-pre-line"
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default ItemDetailClient;
