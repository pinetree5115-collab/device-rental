import { BaseResponse, Category, Item } from "@/types/common";
import MainPageClient from "./_component/MainPageClient";

interface getItemParams {
    categoryId: null;
    status: string;
    keyword: string;
    page: number;
    size: number;
    sort: string;
}

interface CategoryResponse {
    categories: Category[];
}

async function getCategories() {
    try {
        const fetchResponse = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/categories",
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

async function getItems() {
    try {
        const params: getItemParams = {
            categoryId: null,
            status: "AVAILABLE",
            keyword: "",
            page: 0,
            size: 10,
            sort: "DESC",
        };

        const queryString = new URLSearchParams({
            categoryId: "",
            status: params.status,
            keyword: params.keyword,
            page: params.page.toString(),
            size: params.size.toString(),
            sort: params.sort,
        }).toString();

        const fetchResponse = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/posts?" + queryString,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            },
        );

        const response: BaseResponse<Item[]> = await fetchResponse.json();

        if (response.success) {
            return response.data;
        }
    } catch (err) {
        console.error("Failed to fetch items:::", err);
    }
}

async function Home() {
    const categories = await getCategories();

    if (!categories || categories.categories.length === 0) {
        return <div>No categories available.</div>;
    }

    const items = await getItems();

    return (
        <MainPageClient
            initialItems={items}
            categories={categories.categories}
        />
    );
}

export default Home;
