import { NewItemData } from "@/app/items/register/_component/RegisterItemClient";
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
interface fetchItemResponse {
    content: Item[];
    totalPages: number;
    totalElements: number;
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
            size: "10",
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

        const result: BaseResponse<fetchItemResponse> = await response.json();

        if (result.success) {
            return result.data.content;
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
