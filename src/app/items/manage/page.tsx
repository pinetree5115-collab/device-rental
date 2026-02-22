import { fetchCategories, fetchMyItems } from "@/services/post.service";
import { cookies, headers } from "next/headers";
import ManageMyItemClient from "./_component/ManageMyItemClient";
import { Category } from "@/types/common";

async function MyItemsPage() {
    let items = [];
    let categories: Category[] = [];
    const headerStore = await headers();
    const host = headerStore.get("x-forwarded-host") || headerStore.get("host");
    const protocol = headerStore.get("x-forwarded-proto") || "http";
    const cookieStore = await cookies();

    if (host) {
        items = await fetchMyItems({
            baseUrl: `${protocol}://${host}`,
            cookie: cookieStore.toString(),
        });
    } else {
        items = await fetchMyItems();
    }

    categories = await fetchCategories();

    return <ManageMyItemClient items={items} categories={categories} />;
}

export default MyItemsPage;
