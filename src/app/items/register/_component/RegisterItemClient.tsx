"use client";

import { createImgsApi, createPostApi } from "@/services/post.service";
import { Category } from "@/types/common";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/common";

export interface NewItemData {
    categoryId: number;
    title: string;
    description: string;
    pricePerDay: number;
    maxRentalDays: number;
    isParcel: boolean;
    isMeetup: boolean;
    imageUrls?: string[];
}

function RegisterItemClient({ categories }: { categories: Category[] }) {
    const router = useRouter();

    const [formData, setFormData] = useState<NewItemData>({
        title: "",
        description: "",
        pricePerDay: 0,
        maxRentalDays: 0,
        categoryId: 1,
        imageUrls: [],
        isParcel: false,
        isMeetup: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const categoryRef = useRef<HTMLDivElement | null>(null);
    const idempotencyKeyRef = useRef<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 드롭다운 외부 클릭 시 닫기
    useClickOutside(categoryRef as React.RefObject<HTMLElement>, () =>
        setIsCategoryOpen(false),
    );

    const handleInputChange = (
        field: keyof NewItemData,
        value: string | number,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // 타이핑 시, 입력 오류가 있으면 지우기
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handlePickupMethodToggle = (method: string) => {
        setFormData((prev) => {
            return {
                ...prev,
                [method]: !prev[method as keyof NewItemData],
            };
        });
        if (errors.pickupMethods) {
            setErrors((prev) => ({ ...prev, pickupMethods: "" }));
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const totalFiles = [...images, ...newFiles];

            if (totalFiles.length > 5) {
                alert("최대 5개의 이미지만 업로드할 수 있습니다.");
                setImages(totalFiles.slice(0, 5));
            } else {
                setImages(totalFiles);
            }
        }
    };

    const handleImageRemove = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "물품명을 입력해주세요";
        }
        if (!formData.description.trim()) {
            newErrors.description = "상세 설명을 입력해주세요";
        }
        if (formData.pricePerDay <= 0) {
            newErrors.pricePerDay = "올바른 대여 금액을 입력해주세요";
        }
        if (formData.maxRentalDays <= 0) {
            newErrors.maxRentalDays = "대여 가능 기간을 입력해주세요";
        }
        if (!formData.isParcel && !formData.isMeetup) {
            newErrors.pickupMethods = "최소 1개의 수령 방식을 선택해주세요";
        }
        if (images.length === 0) {
            newErrors.imageUrls = "물품 이미지를 업로드해주세요";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (validateForm()) {
                setIsSubmitting(true);
                const imagesUploadResponse = await createImgsApi(images);
                formData.imageUrls = [...imagesUploadResponse];

                if (!idempotencyKeyRef.current) {
                    idempotencyKeyRef.current = crypto.randomUUID();
                }

                const response = await createPostApi(
                    formData,
                    idempotencyKeyRef.current,
                );

                idempotencyKeyRef.current = null;
                router.push(`/items/${response}`);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            alert("물품 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <button
                    onClick={() => {}}
                    className="hover:text-gray-900 cursor-pointer"
                >
                    홈
                </button>
                <span>/</span>
                <span className="text-gray-900">물품 등록</span>
            </div>

            <div className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-8 bg-red-500"></div>
                    <h1 className="text-gray-900">물품 등록</h1>
                </div>
                <p className="text-gray-600">
                    대여하실 물품의 정보를 입력해주세요
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Item Name */}
                <div>
                    <label className="block text-gray-900 mb-2">
                        물품명 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            handleInputChange("title", e.target.value)
                        }
                        placeholder="예: 맥북 프로 16인치 2023"
                        className={`w-full px-4 py-3 border-2 ${
                            errors.title ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:border-red-500 transition-colors`}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.title}
                        </p>
                    )}
                </div>

                {/* Detailed Description */}
                <div>
                    <label className="block text-gray-900 mb-2">
                        상세 설명 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            handleInputChange("description", e.target.value)
                        }
                        placeholder="물품의 상세 정보, 포함 구성품, 상태 등을 자세히 작성해주세요"
                        rows={8}
                        className={`w-full px-4 py-3 border-2 ${
                            errors.description
                                ? "border-red-500"
                                : "border-gray-300"
                        } focus:outline-none focus:border-red-500 transition-colors resize-none`}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-gray-900 mb-2">
                        대여 금액 (일 단위){" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={formData.pricePerDay || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "pricePerDay",
                                    parseInt(e.target.value) || 0,
                                )
                            }
                            placeholder="0"
                            className={`w-full px-4 py-3 border-2 ${
                                errors.pricePerDay
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:outline-none focus:border-red-500 transition-colors`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                            원/일
                        </span>
                    </div>
                    {errors.pricePerDay && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.pricePerDay}
                        </p>
                    )}
                </div>

                {/* Available Period */}
                <div>
                    <label className="block text-gray-900 mb-2">
                        대여 가능 기간 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.maxRentalDays}
                        onChange={(e) =>
                            handleInputChange(
                                "maxRentalDays",
                                Number(e.target.value),
                            )
                        }
                        placeholder="예: 2024년 1월 ~ 2024년 12월"
                        className={`w-full px-4 py-3 border-2 ${
                            errors.maxRentalDays
                                ? "border-red-500"
                                : "border-gray-300"
                        } focus:outline-none focus:border-red-500 transition-colors`}
                    />
                    {errors.maxRentalDays && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.maxRentalDays}
                        </p>
                    )}
                </div>

                {/* Pickup Methods */}
                <div>
                    <label className="block text-gray-900 mb-2">
                        수령 방식 <span className="text-red-500">*</span>
                    </label>
                    <p className="text-gray-500 mb-4">
                        최소 1개, 최대 2개까지 선택 가능합니다
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            type="button"
                            onClick={() => handlePickupMethodToggle("isParcel")}
                            className={`px-8 py-4 border-2 transition-colors cursor-pointer ${
                                formData.isParcel
                                    ? "border-red-500 bg-red-500 text-white"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-black"
                            }`}
                        >
                            택배 수령
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePickupMethodToggle("isMeetup")}
                            className={`px-8 py-4 border-2 transition-colors cursor-pointer ${
                                formData.isMeetup
                                    ? "border-red-500 bg-red-500 text-white"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-black"
                            }`}
                        >
                            직접 만나서 수령
                        </button>
                    </div>
                    {errors.pickupMethods && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.pickupMethods}
                        </p>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label className="block text-gray-900 mb-2">
                        카테고리 <span className="text-red-500">*</span>
                    </label>
                    <div ref={categoryRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className={`w-full px-4 py-3 border-2 cursor-pointer ${
                                errors.category
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:outline-none focus:border-red-500 transition-colors bg-white flex items-center justify-between`}
                        >
                            <span className="text-gray-900">
                                {categories.find(
                                    (cat) => cat.id === formData.categoryId,
                                )?.name || "카테고리를 선택하세요"}
                            </span>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                            >
                                <path
                                    d="M5 7.5L10 12.5L15 7.5"
                                    stroke="#6A7282"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        {isCategoryOpen && (
                            <div className="absolute z-10 w-full mt-1 border-2 border-gray-300 bg-white shadow-lg">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => {
                                            handleInputChange(
                                                "categoryId",
                                                category.id,
                                            );
                                            setIsCategoryOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left transition-colors cursor-pointer ${
                                            formData.categoryId === category.id
                                                ? "bg-red-500 text-white"
                                                : "text-gray-900 hover:bg-gray-100"
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {errors.categoryId && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.categoryId}
                        </p>
                    )}
                </div>

                {/* Image Upload (Required) */}
                <div>
                    <label className="block text-gray-900 mb-2">
                        물품 이미지 <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors p-12 text-center">
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto mb-3"
                        >
                            <path
                                d="M42 30V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V30"
                                stroke="#99A1AF"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M34 16L24 6L14 16"
                                stroke="#99A1AF"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M24 6V30"
                                stroke="#99A1AF"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <p className="text-gray-600 mb-1">
                            이미지를 업로드하거나 드래그하세요
                        </p>
                        <p className="text-gray-400 text-sm">
                            최대 5개, 최대 10MB, JPG, PNG 파일
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="image-upload"
                            multiple
                            onChange={handleImageSelect}
                        />
                        <label
                            htmlFor="image-upload"
                            className="inline-block mt-4 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:border-black transition-colors cursor-pointer"
                        >
                            파일 선택
                        </label>

                        {images.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-gray-600 mb-3">
                                    {images.length}개 중 5개 선택됨
                                </p>
                                <div className="space-y-2">
                                    {images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-gray-50 px-4 py-2"
                                        >
                                            <span className="text-gray-700 text-sm truncate flex-1">
                                                {image.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleImageRemove(index)
                                                }
                                                className="ml-3 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M12 4L4 12"
                                                        stroke="#FB2C36"
                                                        strokeWidth="1.33333"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M4 4L12 12"
                                                        stroke="#FB2C36"
                                                        strokeWidth="1.33333"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {errors.imageUrls && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.imageUrls}
                        </p>
                    )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                    <button
                        type="button"
                        onClick={() => {}}
                        className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className={`flex-1 px-6 py-4 bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer ${isSubmitting ? "opacity-70 pointer-events-none" : ""}`}
                    >
                        {isSubmitting ? "등록 중..." : "등록 완료"}
                    </button>
                </div>
            </form>
        </main>
    );
}

export default RegisterItemClient;
