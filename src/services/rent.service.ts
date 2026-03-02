import { BaseResponse, Rental } from "@/types/common";

interface RentalResponseData {
    content: Rental[];
}

export const fetchMyRentals = async ({
    role,
    accessToken,
}: {
    role: string;
    accessToken?: string | null;
}) => {
    try {
        const baseUrl =
            typeof window === "undefined"
                ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
                : "";

        const response = await fetch(
            `${baseUrl}/api/users/me/rentals?role=${encodeURIComponent(role)}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken
                        ? { Cookie: `accessToken=${accessToken}` }
                        : {}),
                },
                cache: "no-store",
            },
        );

        let responseData: unknown = null;
        try {
            responseData = await response.json();
        } catch {
            responseData = null;
        }

        if (!response.ok) {
            const errorMessage =
                typeof responseData === "object" &&
                responseData !== null &&
                "message" in responseData &&
                typeof (responseData as { message: unknown }).message ===
                    "string"
                    ? (responseData as { message: string }).message
                    : "대여 내역 조회 API 호출에 실패했습니다.";

            throw new Error(errorMessage);
        }

        return responseData as BaseResponse<RentalResponseData>;
    } catch (err) {
        console.error("Failed to fetch rental history:::", err);
        throw err;
    }
};
