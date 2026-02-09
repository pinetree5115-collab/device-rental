import { BaseResponse, Category } from "@/types/common";
import RegisterItemClient from "./_component/RegisterItemClient";

interface CategoryResponse {
    categories: Category[];
}

async function getCategories() {
    try {
        const fetchResponse = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/api/categories",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            },
        );

        const response: BaseResponse<CategoryResponse> =
            await fetchResponse.json();

        if (response.success) {
            return response.data;
        }
    } catch (err) {
        console.error("Failed to fetch categories:::", err);
    }
}

async function ItemRegistrationPage() {
    const categories = await getCategories();

    if (!categories || categories.categories.length === 0) {
        return <div>No categories available.</div>;
    }

    return <RegisterItemClient categories={categories.categories} />;
}

export default ItemRegistrationPage;
