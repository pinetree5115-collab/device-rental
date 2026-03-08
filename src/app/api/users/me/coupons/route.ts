// 1. import

// 2. 타입/인터페이스

// 3. 상수

// 4. 컴포넌트
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 클라이언트로부터 받은 쿠키를 백엔드로 전달
    const cookieHeader = request.headers.get('Cookie');

    const response = await fetch(
      process.env.API_URL + '/api/users/me/coupons',
      {
        method: 'POST',
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
    console.error('Error in POST /api/users/me/coupons:', error);
    return Response.json(
      { success: false, message: '쿠폰 발급에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 5. export
