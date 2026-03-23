export async function POST(
    request: Request,
    { params }: { params: Promise<{ rentalId: string }> },
) {
    try {
        const incomingCookie = request.headers.get("Cookie");
        const rentalId = (await params).rentalId;
        const uuid = crypto.randomUUID();

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL +
                `/api/payments/${rentalId}/cancel`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: incomingCookie || "",
                    ...(uuid && {
                        "Idempotency-Key": uuid,
                    }),
                },
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
                    : "결제 취소 API 호출에 실패했습니다.";

            return Response.json(
                {
                    success: false,
                    code: "PAYMENT_CANCEL_FAILED",
                    message: errorMessage,
                    data: null,
                },
                { status: response.status },
            );
        }

        return Response.json(responseData, { status: response.status });
    } catch (error) {
        console.error("Error in PATCH /api/payments/:rentalId/cancel:", error);
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
