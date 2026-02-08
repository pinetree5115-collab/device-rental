export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/api/users/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            },
        );

        const data = await response.json();

        if (response.status === 200) {
            // 백엔드에서 받은 set-cookie 헤더를 그대로 전달
            const headers = new Headers();
            const setCookieHeader = response.headers.get("set-cookie");

            if (setCookieHeader) {
                headers.append("Set-Cookie", setCookieHeader);
            }

            return Response.json(data, { status: response.status, headers });
        } else {
            return Response.json(data, { status: response.status });
        }
    } catch (error) {
        console.error("Error in POST /api/users/login:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
