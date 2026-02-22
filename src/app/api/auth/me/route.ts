const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getCookieValue = (cookie: string | null, key: string) =>
    cookie
        ?.split("; ")
        .find((v) => v.startsWith(`${key}=`))
        ?.split("=")[1];

const buildHeaders = (cookie?: string) => ({
    "Content-Type": "application/json",
    ...(cookie ? { Cookie: cookie } : {}),
});

const fetchMe = (accessToken?: string) =>
    fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: buildHeaders(
            accessToken ? `accessToken=${accessToken}` : undefined,
        ),
    });

const buildReplaceAccessTokenHeaders = (setCookieHeader: string) => {
    const headers = new Headers();
    const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";

    headers.append(
        "Set-Cookie",
        `accessToken=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secureFlag}`,
    );
    headers.append("Set-Cookie", setCookieHeader);

    return headers;
};

const toUserInfoResponse = async (response: Response, headers?: Headers) => {
    if (!response.ok) {
        throw new Error("Failed to fetch user info");
    }

    const data = await response.json();

    if (data.success) {
        return Response.json(
            { success: true, data: data.data },
            { status: 200, ...(headers ? { headers } : {}) },
        );
    }

    return Response.json(
        {
            success: false,
            error: data.error || "Failed to fetch user info",
        },
        { status: 401, ...(headers ? { headers } : {}) },
    );
};

export async function GET(request: Request) {
    try {
        const cookie = request.headers.get("Cookie");
        const accessToken = getCookieValue(cookie, "accessToken");
        const refreshToken = getCookieValue(cookie, "refreshToken");

        const meResponse = await fetchMe(accessToken);

        if (meResponse.status !== 403) {
            return toUserInfoResponse(meResponse);
        }

        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: buildHeaders(
                refreshToken ? `refreshToken=${refreshToken}` : undefined,
            ),
        });

        if (!refreshResponse.ok) {
            throw new Error("Failed to refresh access token");
        }

        const setCookieHeader = refreshResponse.headers.get("set-cookie");
        const newAccessToken = setCookieHeader?.match(
            /(?:^|,\s*)accessToken=([^;,\s]+)/,
        )?.[1];

        if (!setCookieHeader || !newAccessToken) {
            throw new Error("Failed to refresh access token");
        }

        const headers = buildReplaceAccessTokenHeaders(setCookieHeader);
        const retryMeResponse = await fetchMe(newAccessToken);

        return toUserInfoResponse(retryMeResponse, headers);
    } catch (error) {
        console.log("Error in GET /api/auth/me:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
