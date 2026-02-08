export async function GET(request: Request) {
    try {
        const cookie = request.headers.get("Cookie");

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/auth/me",
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookie || "",
                },
            },
        );

        const data = await response.json();

        if (data.success) {
            return Response.json(
                { success: true, data: data.data },
                { status: 200 },
            );
        }

        return Response.json(
            {
                success: false,
                error: data.error || "Failed to fetch user info",
            },
            { status: 401 },
        );
    } catch (error) {
        console.log("Error in GET /api/auth/me:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
