export async function POST(request: Request) {
    try {
        const body = await request.json();
        const idempotencyKey = request.headers.get("Idempotency-Key");
        const incomingCookie = request.headers.get("Cookie");

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/api/posts",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(idempotencyKey && {
                        "Idempotency-Key": idempotencyKey,
                    }),
                    Cookie: incomingCookie || "",
                },
                body: JSON.stringify(body),
            },
        );

        if (!response.ok) {
            throw new Error("Failed to create post");
        }

        const result = await response.json();

        if (result.success) {
            return Response.json({
                success: true,
                data: result.data,
            });
        } else {
            return Response.json(
                { success: false, error: result.error },
                { status: 400 },
            );
        }
    } catch (error) {
        console.error("Error in POST /api/posts:", error);
        return Response.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            },
            { status: 500 },
        );
    }
}
