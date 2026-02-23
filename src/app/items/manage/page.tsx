import { fetchCategories, fetchMyItems } from "@/services/post.service";
import { cookies, headers } from "next/headers";
import ManageMyItemClient from "./_component/ManageMyItemClient";
import { Category } from "@/types/common";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

async function MyItemsPage() {
    let categories: Category[] = [];
    const headerStore = await headers();
    const host = headerStore.get("x-forwarded-host") || headerStore.get("host");
    const protocol = headerStore.get("x-forwarded-proto") || "http";
    const cookieStore = await cookies();
    const queryClient = new QueryClient();

    if (host) {
        await queryClient.prefetchQuery({
            queryKey: ["myItems"],
            queryFn: () =>
                fetchMyItems({
                    baseUrl: `${protocol}://${host}`,
                    cookie: cookieStore.toString(),
                }),
        });
    } else {
        await queryClient.prefetchQuery({
            queryKey: ["myItems"],
            queryFn: () => fetchMyItems(),
        });
    }

    categories = await fetchCategories();

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ManageMyItemClient categories={categories} />
        </HydrationBoundary>
    );
}

export default MyItemsPage;
