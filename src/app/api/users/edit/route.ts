export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const incomingCookie = request.headers.get("Cookie");
        const accessToken = incomingCookie
            ?.split("; ")
            .find((v) => v.startsWith("accessToken="))
            ?.split("=")[1];

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + `/api/users/me`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `accessToken=${accessToken}` || "",
                },
                body: JSON.stringify(body),
            },
        );

        if (!response.ok) {
            throw new Error("Failed to update user profile");
        }

        const result = await response.json();

        if (result.success) {
            return Response.json({
                success: true,
            });
        } else {
            return Response.json(
                { success: false, error: result.error },
                { status: 400 },
            );
        }
    } catch (error) {
        console.error("Error in PATCH /api/users/edit:", error);
        return Response.json(
            { success: false, message: "프로필 수정에 실패했습니다." },
            { status: 500 },
        );
    }
}
