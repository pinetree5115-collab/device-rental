"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import { Rental } from "@/types/common";
import RentalHistoryClient from "./RentalHistoryClient";

export default function HydrateClient({ state }: { state: any }) {
    return (
        <HydrationBoundary state={state}>
            <RentalHistoryClient />
        </HydrationBoundary>
    );
}
