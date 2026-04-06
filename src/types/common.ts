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

export type ItemStatus = "AVAILABLE" | "HIDDEN" | "RESERVED" | "ENDED"; // 백엔드한테 물어봐서 더 추가해야함

export interface Rental {
    rentalId: number;
    userId: number;
    postId: number;
    lenderName: string;
    title: string;
    startDate: string;
    endDate: string;
    receiveMethod: "MEETUP" | "PARCEL";
    status:
    | "REQUESTED"
    | "CONFIRMED"
    | "IN_USE"
    | "RETURNED"
    | "ENDED"
    | "CANCELED";
}

// 페이지네이션 응답 타입
export interface PageInfo {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

export interface PagedResponse<T> {
    content: T[];
    page: PageInfo;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    thumbnailUrl: string;
}
