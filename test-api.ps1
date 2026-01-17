# 로그인 API 테스트
curl -X POST http://43.201.87.180:8080/api/users/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@test.com","password":"test1234"}'

# 내 정보 조회 (토큰 필요)
# curl -X GET http://43.201.87.180:8080/auth/me `
#   -H "Authorization: Bearer {여기에_로그인에서_받은_토큰}"
