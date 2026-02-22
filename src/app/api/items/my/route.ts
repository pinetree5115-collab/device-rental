export async function GET(request: Request) {
    try {
        const incomingCookie = request.headers.get("Cookie");
        const queryString = new URLSearchParams({
            includeHidden: "true",
            page: "0",
            size: "20",
            sort: "createAt,desc",
        }).toString();

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL +
                `/api/users/me/posts?${queryString}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: incomingCookie || "",
                },
            },
        );

        if (!response.ok) {
            throw new Error("Failed to fetch my items");
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
        console.error("Error in GET /api/users/me/posts:", error);
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
