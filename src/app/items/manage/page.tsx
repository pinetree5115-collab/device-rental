"use client";

import { Edit, Trash2, Package } from "lucide-react";
import { useState } from "react";
import { Item } from "@/app/(main)/_component/MainPageClient";
import ItemEditModal, { EditItemData } from "./_component/ItemEditModal";

interface MyItemsPageProps {
    onBack: () => void;
    onEdit: (itemId: string, data: EditItemData) => void;
    onDelete: (itemId: string) => void;
}

// Mock user's registered items
const mockUserItems: Item[] = [
    {
        id: "1",
        name: "갤럭시 S24 울트라",
        description: "256GB, 티타늄 그레이, S펜 포함",
        detailedDescription:
            "삼성의 최신 플래그십 스마트폰 갤럭시 S24 울트라입니다. 강력한 성능과 S펜을 활용한 다양한 기능을 제공합니다.",
        price: 25000,
        status: "대여 중",
        category: "갤럭시 울트라",
        pickupMethod: "택배 수령",
        availablePeriod: "2024년 1월 ~ 2024년 12월",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
    },
    {
        id: "3",
        name: "아이폰 15 Pro Max",
        description: "512GB, 티타늄 블루, A17 Pro 칩",
        detailedDescription:
            "애플의 최신 프리미엄 스마트폰 아이폰 15 Pro Max입니다. 티타늄 소재와 강력한 A17 Pro 칩을 탑재했습니다.",
        price: 30000,
        status: "대여 가능",
        category: "아이폰",
        pickupMethod: "직접 만나서 수령",
        availablePeriod: "2024년 3월 ~ 2024년 12월",
        image: "https://images.unsplash.com/photo-1592286927505-4a9d0c8d5d4b?w=800&q=80",
    },
    {
        id: "8",
        name: "소니 FDR-AX700 캠코더",
        description: "4K HDR, 광학 12배 줌, 1인치 센서",
        detailedDescription:
            "소니의 프리미엄 4K 캠코더입니다. 1인치 Exmor RS CMOS 센서와 광학 12배 줌을 탑재하여 전문가급 영상 촬영이 가능합니다.",
        price: 40000,
        status: "결제 보관 중",
        category: "캠코더",
        pickupMethod: "택배 수령",
        availablePeriod: "2024년 2월 ~ 2024년 12월",
        image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&q=80",
    },
];

function MyItemsPage({ onBack, onEdit, onDelete }: MyItemsPageProps) {
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "대여 가능":
                return "text-emerald-600 bg-emerald-50";
            case "대여 중":
                return "text-blue-600 bg-blue-50";
            case "결제 보관 중":
                return "text-amber-600 bg-amber-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    const canDelete = (status: string) => {
        return status === "대여 가능";
    };

    const handleDelete = (item: Item) => {
        if (!canDelete(item.status)) {
            return;
        }
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            onDelete(itemToDelete.id);
        }
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const handleEdit = (itemId: string) => {
        setEditingItemId(itemId);
    };

    const handleEditSave = (itemId: string, data: EditItemData) => {
        onEdit(itemId, data);
        setEditingItemId(null);
    };

    const handleEditCancel = () => {
        setEditingItemId(null);
    };

    const editingItem = editingItemId
        ? mockUserItems.find((item) => item.id === editingItemId)
        : null;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <button onClick={onBack} className="hover:text-gray-900">
                    계정
                </button>
                <span>/</span>
                <span className="text-gray-900">내 물품 관리</span>
            </div>

            <div className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-8 bg-red-500"></div>
                    <h1 className="text-gray-900">내 물품 관리</h1>
                </div>
                <p className="text-gray-600">
                    등록한 물품을 관리하고 수정할 수 있습니다
                </p>
            </div>

            {mockUserItems.length === 0 ? (
                <div className="text-center py-24 bg-gray-50">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-1">등록된 물품이 없습니다</p>
                    <p className="text-gray-400 text-sm">
                        새로운 물품을 등록해보세요
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {mockUserItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border-2 border-gray-200 hover:border-gray-400 transition-colors"
                        >
                            <div className="p-6">
                                <div className="flex gap-6">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-32 h-32 object-cover bg-gray-100"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-gray-900 mb-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-gray-600 mb-3">
                                                    {item.description}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`px-3 py-1 text-sm ${getStatusColor(item.status)}`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                    <span className="text-gray-900 text-lg">
                                                        {item.price.toLocaleString()}
                                                        원
                                                        <span className="text-gray-500 text-sm">
                                                            /일
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(item.id)
                                                    }
                                                    className="px-4 py-2 border-2 border-gray-300 hover:border-black transition-colors flex items-center gap-2"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item)
                                                    }
                                                    disabled={
                                                        !canDelete(item.status)
                                                    }
                                                    className={`px-4 py-2 border-2 flex items-center gap-2 transition-colors ${
                                                        canDelete(item.status)
                                                            ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                            : "border-gray-200 text-gray-400 cursor-not-allowed"
                                                    }`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    삭제
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingItem && (
                <ItemEditModal
                    item={editingItem}
                    onSubmit={(data) =>
                        handleEditSave(editingItem.id, {
                            name: "abc",
                            description: "abc",
                            detailedDescription: "abc",
                            price: 0,
                            category: "갤럭시 울트라",
                            availablePeriod: "abc",
                            pickupMethods: ["abc"],
                            image: "abc",
                        })
                    }
                    onClose={handleEditCancel}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && itemToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white max-w-md w-full p-8">
                        <h2 className="text-gray-900 mb-4">
                            물품을 삭제하시겠습니까?
                        </h2>
                        <p className="text-gray-600 mb-8">
                            "{itemToDelete.name}"을(를) 삭제하시겠습니까?
                            <br />이 작업은 되돌릴 수 없습니다.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 hover:border-gray-900 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={confirmDelete}
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

export default MyItemsPage;
