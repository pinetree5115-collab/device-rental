import { useState, useEffect, useRef } from "react";
import { X, Upload, ChevronDown } from "lucide-react";
import { Category, Item } from "@/types/common";
import { createImgsApi } from "@/services/post.service";

interface ItemEditModalProps {
    item: Item;
    categories: Category[];
    onClose: () => void;
    onSubmit: (itemId: number, data: EditItemData) => void | Promise<void>;
}

export interface EditItemData {
    categoryId: number;
    title: string;
    description: string;
    pricePerDay: number;
    maxRentalDays: number;
    isMeetup: boolean;
    isParcel: boolean;
    status: string;
    imageUrls: string[];
}

const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024;

function ItemEditModal({
    item,
    categories,
    onClose,
    onSubmit,
}: ItemEditModalProps) {
    const [formData, setFormData] = useState<EditItemData>({
        title: item.title,
        description: item.description,
        pricePerDay: item.pricePerDay,
        categoryId:
            categories.find((category) => category.name === item.categoryName)
                ?.id || 1,
        maxRentalDays: item.maxRentalDays,
        isMeetup: item.isMeetup,
        isParcel: item.isParcel,
        status: item.status,
        imageUrls: item.imageUrls,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
        item.imageUrls,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                categoryRef.current &&
                !categoryRef.current.contains(event.target as Node)
            ) {
                setIsCategoryOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (
        field: keyof EditItemData,
        value: string | number | boolean,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handlePickupMethodToggle = (method: "isMeetup" | "isParcel") => {
        setFormData((prev) => ({
            ...prev,
            [method]: !prev[method],
        }));
        if (errors.deliveryMethods) {
            setErrors((prev) => ({ ...prev, deliveryMethods: "" }));
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const oversizedFiles = newFiles.filter(
                (file) => file.size > MAX_IMAGE_SIZE_BYTES,
            );

            if (oversizedFiles.length > 0) {
                alert("1MB 이하 이미지 파일만 업로드할 수 있습니다.");
            }

            const validNewFiles = newFiles.filter(
                (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
            );

            if (validNewFiles.length === 0) {
                return;
            }

            const availableSlots = Math.max(0, 5 - existingImageUrls.length);

            if (availableSlots === 0) {
                alert("기존 이미지를 삭제한 뒤 새 이미지를 추가해주세요.");
                return;
            }

            const totalFiles = [...images, ...validNewFiles].slice(
                0,
                availableSlots,
            );

            if (images.length + validNewFiles.length > availableSlots) {
                alert("최대 5개의 이미지만 업로드할 수 있습니다.");
                setImages(totalFiles);
            } else {
                setImages(totalFiles);
            }

            if (errors.imageUrls) {
                setErrors((prev) => ({ ...prev, imageUrls: "" }));
            }
        }
    };

    const handleImageRemove = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleExistingImageRemove = (index: number) => {
        setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "물품명을 입력해주세요";
        }
        if (!formData.description.trim()) {
            newErrors.description = "간단한 설명을 입력해주세요";
        }
        if (formData.pricePerDay <= 0) {
            newErrors.pricePerDay = "올바른 대여 금액을 입력해주세요";
        }
        if (!formData.categoryId) {
            newErrors.categoryId = "카테고리를 선택해주세요";
        }
        if (formData.maxRentalDays <= 0) {
            newErrors.maxRentalDays = "최대 대여 일수를 입력해주세요";
        }
        if (!formData.isMeetup && !formData.isParcel) {
            newErrors.deliveryMethods = "최소 1개의 수령 방식을 선택해주세요";
        }
        if (existingImageUrls.length + images.length === 0) {
            newErrors.imageUrls = "물품 이미지를 최소 1개 이상 유지해주세요";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (validateForm()) {
            try {
                setIsSubmitting(true);

                let uploadedImageUrls: string[] = [];
                if (images.length > 0) {
                    uploadedImageUrls = await createImgsApi(images);
                }

                const imageUrls = [...existingImageUrls, ...uploadedImageUrls];
                await onSubmit(item.postId, { ...formData, imageUrls });
            } catch (error) {
                console.error("Failed to submit edited item:", error);
                alert("물품 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white max-w-3xl w-full my-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-gray-900">물품 수정</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            물품 정보를 수정하세요
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
                >
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
                            className={`w-full px-4 py-2.5 border ${
                                errors.title
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:outline-none focus:border-gray-900 transition-colors`}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title}
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
                                onClick={() =>
                                    setIsCategoryOpen(!isCategoryOpen)
                                }
                                className={`cursor-pointer w-full px-4 py-2.5 border ${
                                    errors.categoryName
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } focus:outline-none focus:border-gray-900 transition-colors bg-white flex items-center justify-between`}
                            >
                                <span
                                    className={
                                        formData.categoryId
                                            ? "text-gray-900"
                                            : "text-gray-400"
                                    }
                                >
                                    {formData.categoryId
                                        ? categories.find(
                                              (cat) =>
                                                  cat.id ===
                                                  formData.categoryId,
                                          )?.name
                                        : "카테고리를 선택해주세요"}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            {isCategoryOpen && (
                                <div className="absolute z-10 w-full mt-1 border border-gray-300 bg-white shadow-lg">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                handleInputChange(
                                                    "categoryId",
                                                    cat.id,
                                                );
                                                setIsCategoryOpen(false);
                                            }}
                                            className={`cursor-pointer w-full px-4 py-2.5 text-left transition-colors ${
                                                formData.categoryId === cat.id
                                                    ? "bg-gray-900 text-white"
                                                    : "text-gray-900 hover:bg-gray-100"
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.categoryName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.categoryName}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-900 mb-2">
                            간단한 설명 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) =>
                                handleInputChange("description", e.target.value)
                            }
                            placeholder="예: M2 Max 칩셋, 32GB RAM, 1TB SSD"
                            className={`w-full px-4 py-2.5 border ${
                                errors.description
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:outline-none focus:border-gray-900 transition-colors`}
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
                                className={`w-full px-4 py-2.5 border ${
                                    errors.pricePerDay
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } focus:outline-none focus:border-gray-900 transition-colors`}
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

                    {/* Max Rental Days */}
                    <div>
                        <label className="block text-gray-900 mb-2">
                            최대 대여 일수{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={formData.maxRentalDays || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "maxRentalDays",
                                    parseInt(e.target.value) || 0,
                                )
                            }
                            placeholder="예: 7"
                            className={`w-full px-4 py-2.5 border ${
                                errors.maxRentalDays
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:outline-none focus:border-gray-900 transition-colors`}
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
                        <p className="text-gray-500 text-sm mb-3">
                            최소 1개를 선택해주세요
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    handlePickupMethodToggle("isParcel")
                                }
                                className={`px-6 py-3 border transition-colors ${
                                    formData.isParcel
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                                }`}
                            >
                                택배 수령
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    handlePickupMethodToggle("isMeetup")
                                }
                                className={`px-6 py-3 border transition-colors ${
                                    formData.isMeetup
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                                }`}
                            >
                                직접 만나서 수령
                            </button>
                        </div>
                        {errors.deliveryMethods && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.deliveryMethods}
                            </p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-gray-900 mb-2">
                            물품 이미지 <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors p-6 text-center">
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm mb-1">
                                이미지를 변경하려면 업로드하세요
                            </p>
                            <p className="text-gray-400 text-xs">
                                최대 5개, 파일당 최대 1MB, JPG, PNG 파일
                            </p>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="image-upload-edit"
                                multiple
                                onChange={handleImageSelect}
                            />
                            <label
                                htmlFor="image-upload-edit"
                                className="inline-block mt-3 px-4 py-2 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                파일 선택
                            </label>

                            {existingImageUrls.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-gray-600 text-sm mb-2">
                                        기존 이미지 ({existingImageUrls.length}
                                        개)
                                    </p>
                                    <div className="space-y-2">
                                        {existingImageUrls.map((url, index) => (
                                            <div
                                                key={`${url}-${index}`}
                                                className="flex items-center justify-between bg-gray-50 px-3 py-2"
                                            >
                                                <span className="text-gray-700 text-xs truncate flex-1">
                                                    {url}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleExistingImageRemove(
                                                            index,
                                                        )
                                                    }
                                                    className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {images.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-gray-600 text-sm mb-2">
                                        새 이미지 ({images.length}개)
                                    </p>
                                    <div className="space-y-2">
                                        {images.map((image, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-gray-50 px-3 py-2"
                                            >
                                                <span className="text-gray-700 text-xs truncate flex-1">
                                                    {image.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleImageRemove(index)
                                                    }
                                                    className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {errors.imageUrls && (
                                <p className="text-red-500 text-sm mt-3">
                                    {errors.imageUrls}
                                </p>
                            )}
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer flex-1 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={() => void handleSubmit()}
                        className={`cursor-pointer flex-1 px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors ${isSubmitting ? "opacity-70 pointer-events-none" : ""}`}
                    >
                        {isSubmitting ? "수정 중..." : "수정 완료"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemEditModal;
