import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchCategories, fetchItems } from "@/services/post.service";
import HydrateClient from "./_component/HydrateClient";

async function Home() {
    const categories = await fetchCategories();

    if (!categories || categories.length === 0) {
        return <div>No categories available.</div>;
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["items", null, "", 1, null],
        queryFn: () => fetchItems("", null, null, 0),
    });

    return (
        <HydrateClient state={dehydrate(queryClient)} categories={categories} />
    );
}

export default Home;
