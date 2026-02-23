export async function POST(
    request: Request,
    { params }: { params: Promise<{ rentalId: string }> },
) {
    try {
        const incomingCookie = request.headers.get("Cookie");
        const rentalId = (await params).rentalId;

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + `/api/rentals/${rentalId}/cancel`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: incomingCookie || "",
                },
            },
        );

        return response;
    } catch (error) {
        console.error("Error in PATCH /api/rentals/:rentalId/cancel:", error);
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
