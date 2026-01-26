import { useState, useEffect, useRef } from "react";
import { X, Upload, ChevronDown } from "lucide-react";
import { Item } from "@/app/(main)/_component/MainPageClient";

interface ItemEditModalProps {
    item: Item;
    onClose: () => void;
    onSubmit: (itemId: string, data: EditItemData) => void;
}

export interface EditItemData {
    name: string;
    description: string;
    detailedDescription: string;
    price: number;
    category: "갤럭시 울트라" | "아이폰" | "캠코더" | "DSLR";
    availablePeriod: string;
    pickupMethods: string[];
    image?: string;
}

function ItemEditModal({ item, onClose, onSubmit }: ItemEditModalProps) {
    const [formData, setFormData] = useState<EditItemData>({
        name: item.name,
        description: item.description,
        detailedDescription: item.detailedDescription || "",
        price: item.price,
        category: item.category as
            | "갤럭시 울트라"
            | "아이폰"
            | "캠코더"
            | "DSLR",
        availablePeriod: item.availablePeriod || "",
        pickupMethods: item.pickupMethod.includes("/")
            ? item.pickupMethod.split(" / ").map((m) => m.trim())
            : [item.pickupMethod],
        image: item.image,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const categoryRef = useRef<HTMLDivElement>(null);

    const categories = ["갤럭시 울트라", "아이폰", "캠코더", "DSLR"];

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
        value: string | number,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handlePickupMethodToggle = (method: string) => {
        setFormData((prev) => {
            const currentMethods = prev.pickupMethods;
            if (currentMethods.includes(method)) {
                return {
                    ...prev,
                    pickupMethods: currentMethods.filter((m) => m !== method),
                };
            } else {
                if (currentMethods.length < 2) {
                    return {
                        ...prev,
                        pickupMethods: [...currentMethods, method],
                    };
                }
                return prev;
            }
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

        if (!formData.name.trim()) {
            newErrors.name = "물품명을 입력해주세요";
        }
        if (!formData.description.trim()) {
            newErrors.description = "간단한 설명을 입력해주세요";
        }
        if (!formData.detailedDescription.trim()) {
            newErrors.detailedDescription = "상세 설명을 입력해주세요";
        }
        if (formData.price <= 0) {
            newErrors.price = "올바른 대여 금액을 입력해주세요";
        }
        if (!formData.category) {
            newErrors.category = "카테고리를 선택해주세요";
        }
        if (!formData.availablePeriod.trim()) {
            newErrors.availablePeriod = "대여 가능 기간을 입력해주세요";
        }
        if (formData.pickupMethods.length === 0) {
            newErrors.pickupMethods = "최소 1개의 수령 방식을 선택해주세요";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(item.id, formData);
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
                            value={formData.name}
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                            placeholder="예: 맥북 프로 16인치 2023"
                            className={`w-full px-4 py-2.5 border ${
                                errors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:outline-none focus:border-gray-900 transition-colors`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
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
                                className={`w-full px-4 py-2.5 border ${
                                    errors.category
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } focus:outline-none focus:border-gray-900 transition-colors bg-white flex items-center justify-between`}
                            >
                                <span
                                    className={
                                        formData.category
                                            ? "text-gray-900"
                                            : "text-gray-400"
                                    }
                                >
                                    {formData.category ||
                                        "카테고리를 선택해주세요"}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            {isCategoryOpen && (
                                <div className="absolute z-10 w-full mt-1 border border-gray-300 bg-white shadow-lg">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => {
                                                handleInputChange(
                                                    "category",
                                                    cat,
                                                );
                                                setIsCategoryOpen(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left transition-colors ${
                                                formData.category === cat
                                                    ? "bg-gray-900 text-white"
                                                    : "text-gray-900 hover:bg-gray-100"
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.category}
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

                    {/* Detailed Description */}
                    <div>
                        <label className="block text-gray-900 mb-2">
                            상세 설명 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.detailedDescription}
                            onChange={(e) =>
                                handleInputChange(
                                    "detailedDescription",
                                    e.target.value,
                                )
                            }
                            placeholder="물품의 상세 정보, 포함 구성품, 상태 등을 자세히 작성해주세요"
                            rows={6}
                            className={`w-full px-4 py-2.5 border ${
                                errors.detailedDescription
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:outline-none focus:border-gray-900 transition-colors resize-none`}
                        />
                        {errors.detailedDescription && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.detailedDescription}
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
                                value={formData.price || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        "price",
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                                placeholder="0"
                                className={`w-full px-4 py-2.5 border ${
                                    errors.price
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } focus:outline-none focus:border-gray-900 transition-colors`}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                원/일
                            </span>
                        </div>
                        {errors.price && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    {/* Available Period */}
                    <div>
                        <label className="block text-gray-900 mb-2">
                            대여 가능 기간{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.availablePeriod}
                            onChange={(e) =>
                                handleInputChange(
                                    "availablePeriod",
                                    e.target.value,
                                )
                            }
                            placeholder="예: 2024년 1월 ~ 2024년 12월"
                            className={`w-full px-4 py-2.5 border ${
                                errors.availablePeriod
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:outline-none focus:border-gray-900 transition-colors`}
                        />
                        {errors.availablePeriod && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.availablePeriod}
                            </p>
                        )}
                    </div>

                    {/* Pickup Methods */}
                    <div>
                        <label className="block text-gray-900 mb-2">
                            수령 방식 <span className="text-red-500">*</span>
                        </label>
                        <p className="text-gray-500 text-sm mb-3">
                            최소 1개, 최대 2개까지 선택 가능합니다
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    handlePickupMethodToggle("택배 수령")
                                }
                                className={`px-6 py-3 border transition-colors ${
                                    formData.pickupMethods.includes("택배 수령")
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                                }`}
                            >
                                택배 수령
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    handlePickupMethodToggle("직접 만나서 수령")
                                }
                                className={`px-6 py-3 border transition-colors ${
                                    formData.pickupMethods.includes(
                                        "직접 만나서 수령",
                                    )
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
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

                    {/* Image Upload (Optional) */}
                    <div>
                        <label className="block text-gray-900 mb-2">
                            물품 이미지
                        </label>
                        <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors p-6 text-center">
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm mb-1">
                                이미지를 변경하려면 업로드하세요
                            </p>
                            <p className="text-gray-400 text-xs">
                                최대 5개, 최대 10MB, JPG, PNG 파일
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

                            {images.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-gray-600 text-sm mb-2">
                                        {images.length}개 중 5개 선택됨
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
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                    >
                        수정 완료
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemEditModal;
