"use client";

import { Edit, Trash2, Package } from "lucide-react";
import { useState } from "react";
import ItemEditModal, { EditItemData } from "./ItemEditModal";
import { Category, Item } from "@/types/common";

function ManageMyItemClient({
    items,
    categories,
}: {
    items: Item[];
    categories: Category[];
}) {
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "AVAILABLE":
                return "text-emerald-600 bg-emerald-50";
            case "RESERVED":
                return "text-blue-600 bg-blue-50";
            case "결제 보관 중":
                return "text-amber-600 bg-amber-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "AVAILABLE":
                return "대여 가능";
            case "RESERVED":
                return "대여 중";
            default:
                return "상태 미정";
        }
    };

    const canDelete = (status: string) => {
        return status === "AVAILABLE";
    };

    const getPickupMethodLabel = (item: Item) => {
        const methods: string[] = [];
        if (item.isMeetup) {
            methods.push("직접 만나서 수령");
        }
        if (item.isParcel) {
            methods.push("택배 수령");
        }
        return methods.length > 0 ? methods.join(" / ") : "미정";
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
            //     onDelete(itemToDelete.postId);
        }
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const handleEdit = (itemId: number) => {
        setEditingItemId(itemId);
    };

    const handleEditSave = async (itemId: number, data: EditItemData) => {
        try {
            const response = await fetch(`/api/items/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                alert("물품 수정에 실패했습니다. 다시 시도해주세요.");
                return;
            }

            alert("물품이 성공적으로 수정되었습니다.");
            setEditingItemId(null);
        } catch (err) {
            console.error("Failed to edit item:", err);
        }
    };

    const handleEditCancel = () => {
        setEditingItemId(null);
    };

    const editingItem = editingItemId
        ? items.find((item) => item.postId === editingItemId)
        : null;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <button onClick={() => {}} className="hover:text-gray-900">
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

            {items.length === 0 ? (
                <div className="text-center py-24 bg-gray-50">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-1">등록된 물품이 없습니다</p>
                    <p className="text-gray-400 text-sm">
                        새로운 물품을 등록해보세요
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {items.map((item) => (
                        <div
                            key={item.postId}
                            className="bg-white border-2 border-gray-200 hover:border-gray-400 transition-colors"
                        >
                            <div className="p-6">
                                <div className="flex gap-6">
                                    <img
                                        src={item.imageUrls[0]}
                                        alt={item.title}
                                        className="w-32 h-32 object-cover bg-gray-100"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-gray-900 mb-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 mb-3">
                                                    {item.description}
                                                </p>
                                                <p className="text-gray-500 text-sm mb-3">
                                                    {item.categoryName} · 최대{" "}
                                                    {item.maxRentalDays}일 ·{" "}
                                                    {getPickupMethodLabel(item)}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`px-3 py-1 text-sm ${getStatusColor(item.status)}`}
                                                    >
                                                        {getStatusLabel(
                                                            item.status,
                                                        )}
                                                    </span>
                                                    <span className="text-gray-900 text-lg">
                                                        {item.pricePerDay.toLocaleString()}
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
                                                        handleEdit(item.postId)
                                                    }
                                                    className="cursor-pointer px-4 py-2 border-2 border-gray-300 hover:border-black transition-colors flex items-center gap-2"
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
                                                    className={`cursor-pointer px-4 py-2 border-2 flex items-center gap-2 transition-colors ${
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
                    categories={categories}
                    onSubmit={handleEditSave}
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
                            "{itemToDelete.title}"을(를) 삭제하시겠습니까?
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

export default ManageMyItemClient;
