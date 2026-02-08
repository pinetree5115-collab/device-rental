import MainPageClient from "./_component/MainPageClient";
import { fetchCategories, fetchItems } from "@/services/post.service";

async function Home() {
    const categories = await fetchCategories();

    if (!categories || categories.length === 0) {
        return <div>No categories available.</div>;
    }

    const items = await fetchItems("", null, null, 0);

    return <MainPageClient initialItems={items} categories={categories} />;
}

export default Home;
