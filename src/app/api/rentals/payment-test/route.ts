export async function POST(request: Request) {
    try {
        const body = await request.json();
        const incomingCookie = request.headers.get("Cookie");

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL +
                `/api/rentals/${body.rentalId}/confirm`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: incomingCookie || "",
                },
            },
        );

        console.log("Response from backend:", response);

        return response;
    } catch (error) {
        console.error("Error in POST /api/rentals/:rentalId/confirm:", error);
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
