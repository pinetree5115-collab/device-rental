// 공통 응답 타입
export interface BaseResponse<T> {
    data: T;
    message: string;
    success: boolean;
    code: string;
}

// 카테고리 타입
export interface Category {
    id: number;
    name: string;
}

// 아이템 타입
export interface Item {
    categoryName: string;
    createAt: string;
    description: string;
    imageUrls: string[];
    isMeetup: boolean;
    isParcel: boolean;
    maxRentalDays: number;
    postId: number;
    pricePerDay: number;
    status: string;
    title: string;
    updateAt: string;
    userId: number;
    userName: string;
}
