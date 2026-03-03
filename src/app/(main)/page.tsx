import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchCategories, fetchItems } from "@/services/post.service";
import HydrateClient from "./_component/HydrateClient";
import { headers } from "next/headers";

async function Home() {
    const categories = await fetchCategories();

    if (!categories || categories.length === 0) {
        return <div>No categories available.</div>;
    }

    const headerStore = await headers();
    const host = headerStore.get("x-forwarded-host") || headerStore.get("host");
    const protocol = headerStore.get("x-forwarded-proto") || "http";

    const queryClient = new QueryClient();

    if (host) {
        await queryClient.prefetchQuery({
            queryKey: ["items", null, "", 1, null],
            queryFn: () =>
                fetchItems("", null, null, 0, {
                    baseUrl: `${protocol}://${host}`,
                }),
        });
    } else {
        await queryClient.prefetchQuery({
            queryKey: ["items", null, "", 1, null],
            queryFn: () => fetchItems("", null, null, 0),
        });
    }

    return (
        <HydrateClient state={dehydrate(queryClient)} categories={categories} />
    );
}

export default Home;
