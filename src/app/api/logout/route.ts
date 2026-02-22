export async function POST(request: Request) {
    try {
        const secureFlag =
            process.env.NODE_ENV === "production" ? "; Secure" : "";
        const headers = new Headers();

        headers.append(
            "Set-Cookie",
            `accessToken=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secureFlag}`,
        );
        headers.append(
            "Set-Cookie",
            `refreshToken=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secureFlag}`,
        );

        return Response.json({ success: true }, { status: 200, headers });
    } catch (error) {
        console.error("Error in POST /api/users/logout:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
