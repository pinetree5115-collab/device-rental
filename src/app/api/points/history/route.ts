import { BaseResponse } from "@/types/common";

interface PointHistory {
    historyId: number;
    type: "EARN" | "SPEND";
    amount: number;
    finalBalance: number;
    description: string;
    createdAt: string;
}

export async function GET(request: Request) {
    try {
        const incomingCookie = request.headers.get("Cookie");

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + `/api/points/history`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: incomingCookie || "",
                },
            },
        );

        let result: BaseResponse<PointHistory[]> | null = null;
        try {
            result = await response.json();
        } catch {
            result = null;
        }

        if (!response.ok) {
            return Response.json(
                {
                    success: false,
                    code: result?.code || "POINT_HISTORY_FETCH_FAILED",
                    message: result?.message || "Failed to fetch point history",
                    data: null,
                },
                { status: response.status },
            );
        }

        if (!result) {
            return Response.json(
                {
                    success: false,
                    code: "INVALID_POINT_HISTORY_RESPONSE",
                    message: "Invalid point history response",
                    data: null,
                },
                { status: 502 },
            );
        }

        return Response.json(result, { status: response.status });
    } catch (error) {
        console.error("Error in GET /api/points/history:", error);
        return Response.json(
            {
                success: false,
                code: "INTERNAL_SERVER_ERROR",
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
                data: null,
            },
            { status: 500 },
        );
    }
}
