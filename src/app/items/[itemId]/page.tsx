"use client";

interface Item {
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

const mockItem: Item = {
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
};

function ItemDetailPage() {
    const isLoggedIn = false;

    const canRent = mockItem.status === "대여 가능" && isLoggedIn;
    const isAvailable = mockItem.status === "대여 가능";

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
                <span className="text-gray-900">{mockItem.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                {/* Left column - Images */}
                <div className="space-y-4">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                            src={mockItem.image}
                            alt={mockItem.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="aspect-square bg-gray-100 border-2 border-transparent hover:border-gray-900 cursor-pointer transition-colors"
                            >
                                <img
                                    src={mockItem.image}
                                    alt=""
                                    className="w-full h-full object-cover opacity-60"
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
                                {mockItem.category}
                            </span>
                        </div>

                        <h1 className="text-gray-900 mb-4 tracking-tight">
                            {mockItem.name}
                        </h1>

                        {/* Status */}
                        <div className="flex items-center gap-3 mb-4">
                            <span
                                className={
                                    mockItem.status === "대여 가능"
                                        ? "text-emerald-600"
                                        : "text-gray-500"
                                }
                            >
                                {mockItem.status}
                            </span>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-6">
                            {mockItem.description}
                        </p>
                    </div>

                    {/* Price */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-2xl text-gray-900">
                                {mockItem.price.toLocaleString()}원
                            </span>
                            <span className="text-gray-500">/일</span>
                        </div>
                    </div>

                    {/* Pickup Methods */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-900 w-24">
                                수령 방식:
                            </span>
                            <div className="flex gap-2">
                                {mockItem.pickupMethod.includes("택배") && (
                                    <span className="px-3 py-1 bg-gray-100 text-sm">
                                        택배
                                    </span>
                                )}
                                {mockItem.pickupMethod.includes("직접") && (
                                    <span className="px-3 py-1 bg-gray-100 text-sm">
                                        직접 수령
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 pt-4">
                        <span className="text-gray-900 w-24">대여 일수:</span>
                        <div className="flex items-center border-2 border-gray-300">
                            <button className="w-10 h-10 cursor-pointer hover:bg-red-500 hover:text-white transition-colors">
                                -
                            </button>
                            <input
                                type="number"
                                value="1"
                                readOnly
                                className="w-16 h-10 text-center border-x-2 border-gray-300 outline-none flex items-center justify-center"
                            />
                            <button className="w-10 h-10 cursor-pointer bg-red-500 text-white hover:bg-red-600 transition-colors">
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                        {canRent ? (
                            <>
                                <button
                                    onClick={() => {}}
                                    className="flex-1 px-8 py-3 cursor-pointer bg-red-500 text-white hover:bg-red-600 transition-colors"
                                >
                                    지금 대여하기
                                </button>
                            </>
                        ) : !isLoggedIn && isAvailable ? (
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
                    {mockItem.detailedDescription
                        .split("\n")
                        .map((paragraph, index) => (
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

export default ItemDetailPage;
