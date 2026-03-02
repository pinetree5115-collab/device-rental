import { fetchMyRentals } from "@/services/rent.service";
import RentalHistoryClient from "./_component/RentalHistoryClient";
import { cookies } from "next/headers";
import { BaseResponse, Rental } from "@/types/common";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import HydrateClient from "./_component/HydrateClient";

interface RentalResponseData {
    content: Rental[];
}

async function RentalHistoryPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["myrentals", "BORROWER"],
        queryFn: () => fetchMyRentals({ role: "BORROWER", accessToken }),
    });
    // const data: BaseResponse<RentalResponseData> = await fetchMyRentals({
    //     role: "BORROWER",
    //     accessToken,
    // });

    return <HydrateClient state={dehydrate(queryClient)} />;
}

export default RentalHistoryPage;
