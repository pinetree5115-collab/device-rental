export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const incomingCookie = request.headers.get("Cookie");
        const accessToken = incomingCookie
            ?.split("; ")
            .find((v) => v.startsWith("accessToken="))
            ?.split("=")[1];

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/api/images",
            {
                method: "POST",
                headers: {
                    Cookie: `accessToken=${accessToken}` || "",
                },
                body: formData,
            },
        );

        if (!response.ok) {
            throw new Error("Image upload failed");
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
        console.error("Error in POST /api/images:", error);
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
