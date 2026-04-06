import type { Item } from "@/types/common";

interface ItemCardProps {
    item: Item;
    onClick: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
    const statusConfig: Record<
        string,
        { bg: string; text: string; label: string }
    > = {
        AVAILABLE: {
            bg: "bg-green-100",
            text: "text-green-700",
            label: "대여 가능",
        },
        RENTED: { bg: "bg-red-100", text: "text-red-700", label: "대여 중" },
        RESERVED: {
            bg: "bg-green-100",
            text: "text-green-700",
            label: "대여 가능",
        },
    };

    const config = statusConfig[item.status] || statusConfig["AVAILABLE"];

    return (
        <div className="group relative cursor-pointer" onClick={onClick}>
            {/* Status Badge */}
            <div
                className={`absolute top-3 left-3 ${config.bg} ${config.text} px-3 py-1 text-sm z-10`}
            >
                {config.label}
            </div>

            {/* Image Container */}
            <div className="aspect-square overflow-hidden bg-gray-100 relative">
                <img
                    src={
                        item.imageUrls?.[0]
                            ? `/api/image?url=${item.imageUrls[0]}`
                            : "https://via.placeholder.com/400"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
            </div>

            {/* Product Info */}
            <div className="py-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500 px-2 py-0.5 border border-gray-300">
                        {item.categoryName}
                    </span>
                </div>

                <h3 className="text-gray-900 mb-2 line-clamp-1">
                    {item.title}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                    <span className="text-gray-900">
                        {item.pricePerDay.toLocaleString()}원
                    </span>
                    <span className="text-gray-500 text-sm">/일</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">
                    {item.description}
                </p>
            </div>
        </div>
    );
}
