import { NewItemData } from "@/app/items/register/_component/RegisterItemClient";
import { RentalData } from "@/app/items/rent/[itemId]/_component/ItemRentClient";
import { BaseResponse, Category, Item } from "@/types/common";

/**
 * 카테고리 목록을 가져오는 함수
 *
 * @returns Category[] | undefined
 */
interface CategoryResponse {
    categories: Category[];
}
export const fetchCategories = async () => {
    try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/api/categories",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            },
        );

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        const result: BaseResponse<CategoryResponse> = await response.json();

        if (result.success) {
            return result.data.categories;
        }

        throw new Error("Failed to fetch categories");
    } catch (err) {
        console.error("Failed to fetch categories:::", err);
        throw err;
    }
};

/**
 * 물품 목록을 가져오는 함수
 *
 * @param keyword
 * @param categoryId
 * @param status
 * @param page
 *
 * @returns Item[]
 */
export interface FetchItemsResponse {
    content: Item[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}
export const fetchItems = async (
    keyword: string = "",
    categoryId: number | null,
    status: string | null = null,
    page: number = 0,
) => {
    try {
        const queryString = new URLSearchParams({
            categoryId: categoryId?.toString() || "",
            status: status || "",
            keyword,
            page: page.toString(),
            size: "6",
            sort: "DESC",
        }).toString();

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/api/posts?" + queryString,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.ok) {
            throw new Error("Failed to fetch items");
        }

        const result: BaseResponse<FetchItemsResponse> = await response.json();

        if (result.success) {
            return result.data;
        }

        throw new Error("Failed to fetch items");
    } catch (err) {
        console.error("Failed to fetch items:::", err);
        throw err;
    }
};

/**
 * 이미지 업로드 API 호출 함수
 *
 * @param images
 *
 * @returns imageUrls
 */
interface ImgsUploadResponse {
    imageUrls: string[];
}
export const createImgsApi = async (images: File[]) => {
    try {
        const formData = new FormData();
        images.forEach((image) => {
            formData.append("files", image);
        });
        const response = await fetch("/api/images", {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Image upload failed");
        }

        const result: BaseResponse<ImgsUploadResponse> = await response.json();

        console.log("imgs upload result:::", result);
        if (result.success) {
            return result.data.imageUrls;
        }

        throw new Error("Image upload failed");
    } catch (err) {
        console.error("Error uploading images:", err);
        throw err;
    }
};

/**
 * 물품 등록 API 호출 함수
 *
 * @param data
 * @param idempotencyKey
 *
 * @returns postId
 */
interface CreatePostResponse {
    postId: number;
}
export const createPostApi = async (
    data: NewItemData,
    idempotencyKey: string,
) => {
    try {
        const response = await fetch("/api/posts", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Idempotency-Key": idempotencyKey,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create post");
        }

        const result: BaseResponse<CreatePostResponse> = await response.json();

        if (result.success) {
            return result.data.postId;
        }

        throw new Error("Failed to create post");
    } catch (err) {
        console.error("Error creating post:", err);
        throw err;
    }
};

/**
 * 내 물품 목록을 가져오는 함수
 * @returns Item[]
 */
interface FetchMyItemsOptions {
    baseUrl?: string;
    cookie?: string;
}
interface FetchMyItemsResponse {
    content: Item[];
    totalPages: number;
    totalElements: number;
}
export const fetchMyItems = async (options?: FetchMyItemsOptions) => {
    try {
        const requestUrl = options?.baseUrl
            ? `${options.baseUrl}/api/items/my`
            : "/api/items/my";

        const response = await fetch(requestUrl, {
            method: "GET",
            ...(options?.baseUrl
                ? {
                      headers: {
                          ...(options.cookie
                              ? {
                                    Cookie: options.cookie,
                                }
                              : {}),
                      },
                      cache: "no-store" as const,
                  }
                : { credentials: "include" as RequestCredentials }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch my items");
        }

        const result: BaseResponse<FetchMyItemsResponse> =
            await response.json();

        if (result.success) {
            return result.data.content;
        }

        throw new Error("Failed to fetch my items");
    } catch (err) {
        console.error("Failed to fetch my items:::", err);
        throw err;
    }
};

/**
 * 물품 대여 요청 API 호출 함수
 *
 * @param data: RentalData
 *
 * @returns rentalId
 */
export interface CreateRentalResponse {
    rentalId: number;
}
export const createRentalApi = async (data: RentalData) => {
    try {
        const response = await fetch("/api/rentals", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result: BaseResponse<CreateRentalResponse> | null = await response
            .json()
            .catch(() => null);

        if (!response.ok) {
            throw new Error(
                result?.message || "Failed to create rental request",
            );
        }

        if (result?.success && result.data) {
            return result.data.rentalId;
        }

        throw new Error(result?.message || "Failed to create rental request");
    } catch (err) {
        console.error("Error creating rental request:", err);
        throw err;
    }
};
