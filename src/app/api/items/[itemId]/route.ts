export async function PUT(
    request: Request,
    { params }: { params: Promise<{ itemId: string }> },
) {
    try {
        const body = await request.json();
        const incomingCookie = request.headers.get("Cookie");
        const accessToken = incomingCookie
            ?.split("; ")
            .find((v) => v.startsWith("accessToken="))
            ?.split("=")[1];
        const itemId = (await params).itemId;

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + `/api/posts/${itemId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `accessToken=${accessToken}` || "",
                },
                body: JSON.stringify(body),
            },
        );

        if (!response.ok) {
            throw new Error("Failed to update post");
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
        console.error("Error in PUT /api/posts:", error);
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
