// API 테스트용 간단한 스크립트
// 브라우저 콘솔에서 실행 가능

// 1. 로그인 테스트
async function testLogin() {
  try {
    const response = await fetch('http://43.201.87.180:8080/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test1234'
      })
    });

    const data = await response.json();
    console.log('로그인 성공:', data);

    // 토큰 저장
    localStorage.setItem('accessToken', data.token);

    return data;
  } catch (error) {
    console.error('로그인 실패:', error);
  }
}

// 2. 내 정보 조회 테스트
async function testGetMe() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('토큰이 없습니다. 먼저 로그인하세요.');
    return;
  }

  try {
    const response = await fetch('http://43.201.87.180:8080/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('내 정보:', data);

    return data;
  } catch (error) {
    console.error('내 정보 조회 실패:', error);
  }
}

// 3. 회원가입 테스트
async function testSignup() {
  try {
    const response = await fetch('http://43.201.87.180:8080/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'newuser@example.com',
        password: 'password123',
        name: null,
        request: null
      })
    });

    const data = await response.json();
    console.log('회원가입 성공:', data);

    return data;
  } catch (error) {
    console.error('회원가입 실패:', error);
  }
}

// 사용법:
// 브라우저 콘솔에서:
// await testLogin()
// await testGetMe()
// await testSignup()
