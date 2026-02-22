"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import MainPageClient from "./MainPageClient";
import { Category } from "@/types/common";

export default function HydrateClient({
    state,
    categories,
}: {
    state: any;
    categories: Category[];
}) {
    return (
        <HydrationBoundary state={state}>
            <MainPageClient categories={categories} />
        </HydrationBoundary>
    );
}
