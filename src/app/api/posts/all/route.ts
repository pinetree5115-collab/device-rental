export async function GET(request: Request) {
    try {
        const params = new URL(request.url).searchParams;
        const keyword = params.get("keyword") || "";
        const categoryId = params.get("categoryId");
        const status = params.get("status");
        const page = params.get("page") || "1";

        const queryParams = new URLSearchParams({
            keyword,
            categoryId: categoryId || "",
            status: status || "",
            page,
            size: "6",
            sort: "DESC",
        });

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL +
                "/api/posts?" +
                queryParams.toString(),
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
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
        console.error("Error in GET /api/posts:", error);
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
