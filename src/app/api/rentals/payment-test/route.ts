export async function POST(request: Request) {
    try {
        const body = await request.json();
        const incomingCookie = request.headers.get("Cookie");

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL +
                `/api/rentals/${body.rentalId}/confirm`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: incomingCookie || "",
                },
            },
        );

        console.log("Response from backend:", response);

        let responseData: unknown = null;
        try {
            responseData = await response.json();
        } catch {
            responseData = null;
        }
        console.log("Response data from backend:", responseData);

        if (!response.ok) {
            const errorMessage =
                typeof responseData === "object" &&
                responseData !== null &&
                "message" in responseData &&
                typeof (responseData as { message: unknown }).message ===
                    "string"
                    ? (responseData as { message: string }).message
                    : "결제 테스트 API 호출에 실패했습니다.";

            return Response.json(
                {
                    success: false,
                    code: "PAYMENT_CONFIRM_FAILED",
                    message: errorMessage,
                    data: null,
                },
                { status: response.status },
            );
        }

        return Response.json(responseData, { status: response.status });
    } catch (error) {
        console.error("Error in PATCH /api/rentals/:rentalId/confirm:", error);
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
