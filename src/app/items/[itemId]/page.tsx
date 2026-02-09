import { BaseResponse, Item } from "@/types/common";
import ItemDetailClient from "./_component/ItemDetailClient";

async function getItem({ id }: { id: string }) {
    try {
        const fetchResponse = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/api/posts/" + id,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            },
        );

        const response: BaseResponse<Item> = await fetchResponse.json();

        if (response.success) {
            return response.data;
        }
    } catch (err) {
        console.error("Failed to fetch items:::", err);
    }
}

async function ItemDetailPage({
    params,
}: {
    params: Promise<{ itemId: string }>;
}) {
    const itemId = (await params).itemId;
    const item = await getItem({ id: itemId });

    if (!item) return <div>Item not found</div>;
    return <ItemDetailClient item={item} />;
}

export default ItemDetailPage;
