// 1. import

// 2. 타입/인터페이스

// 3. 상수

// 4. 컴포넌트
export async function GET() {
  try {
    const response = await fetch(
      process.env.API_URL + '/api/coupons',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in GET /api/coupons:', error);
    return Response.json(
      { success: false, message: '쿠폰 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 5. export