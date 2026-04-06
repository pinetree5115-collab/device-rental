import { BaseResponse } from "@/types/common";

/**
 * 포인트 이력 조회 API 호출 함수
 *
 * @returns 포인트 이력 목록
 */
export interface PointHistory {
    historyId: number;
    type: "EARN" | "ADJUST";
    amount: number;
    finalBalance: number;
    description: string;
    createdAt: string;
}

export const getPointHistoryApi = async (): Promise<PointHistory[]> => {
    try {
        const response = await fetch("/api/points/history", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch point history");
        }

        const result: PointHistory[] | null = await response
            .json()
            .catch(() => null);

        if (result && Array.isArray(result)) {
            return result;
        }

        throw new Error("Failed to fetch point history");
    } catch (err) {
        console.error("Error fetching point history:", err);
        throw err;
    }
};
