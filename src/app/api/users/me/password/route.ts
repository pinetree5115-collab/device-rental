export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    // 클라이언트로부터 받은 쿠키를 백엔드로 전달
    const cookieHeader = request.headers.get('Cookie');

    const response = await fetch(
      process.env.API_URL + '/api/users/me/password',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(cookieHeader && { Cookie: cookieHeader }),
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in PATCH /api/users/me/password:', error);
    return Response.json(
      { success: false, message: '비밀번호 변경에 실패했습니다.' },
      { status: 500 }
    );
  }
}
