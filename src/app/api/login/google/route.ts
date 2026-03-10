export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 백엔드에 idToken 전달
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/users/login/google",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // { idToken: "..." }
      },
    );

    const data = await response.json();

    if (response.status === 200) {
      // 백엔드가 발급한 JWT 쿠키를 브라우저에 그대로 전달
      const headers = new Headers();
      const setCookieHeader = response.headers.get("set-cookie");

      if (setCookieHeader) {
        headers.append("Set-Cookie", setCookieHeader);
      }

      return Response.json(data, { status: 200, headers });
    } else {
      return Response.json(data, { status: response.status });
    }
  } catch (error) {
    console.error("Error in POST /api/login/google:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
