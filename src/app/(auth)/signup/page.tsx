'use client'
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function SingnUpPage() {
  // 폼 상태 정의
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  const [phone, setPhone] = useState('');

  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false); // 이메일 인증 완료 여부

  const { signup, isLoading, error } = useAuth();

  const handleSendCode = () => {
    // TODO: 실제 인증번호 발송 API 연결
    setIsCodeSent(true);
  };

  const handleVerifyCode = () => {
    // TODO: 실제 인증번호 확인 API 연결
    setIsVerified(true);
    alert('이메일 인증이 완료되었습니다!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!isVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await signup(
        email,
        password,
        name || null,
        address || null,
        bank || null,
        account || null,
        phone || null
      );
      // 성공하면 useAuth에서 자동으로 메인 페이지로 이동
    } catch (err) {
      console.error('회원가입 실패:', err);
    }
  };

  return (
    //중앙정렬, 흰색카드 형태
    //입력칸: border 1px, 회색 테두리, padding
    //빨간색 버튼: #FF0000 계열, 흰색 글자
    //간격: 섹션마다 여백(margin/padding)
    <main className="min-h-screen bg-[#ffffff] flex items-center justify-center p-4">
      {/* 흰색 카드 형태의 레이아웃 */}
      <div className='bg-white w-full max-w-150 p-8 md:p-12'>
        {/* 뒤로가기 및 제목 */}
        <div className="mb-10">
          <button className="text-gray-400 text-sm mb-3 flex items-center">
            <span className="mr-1">←</span> 뒤로가기
          </button>
          <h1 className="text-base mb-1">회원가입</h1>
          <p className="text-gray-500 text-sm">이메일 인증을 통해 회원가입을 진행합니다</p>
        </div>

        {/* 4. HTML 태그*/}
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* 이메일 인증 섹션 */}
          <section className="border-2 border-[#edeef0] p-6 bg-white">
            <div className="border-l-[3px] border-red-500 pl-3 mb-6">
              <h2 className="text-red-500 font-bold">이메일 인증</h2>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-normal text-gray-700">이메일 *</label>
                <div className="flex gap-2">
                  <input
                    id="email"
                    type="email"
                    placeholder="이메일 주소를 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 border border-gray-300 p-2.5 focus:outline-none focus:border-red-500"
                    required
                  />
                  {!isCodeSent ? (
                    <button
                      type="button"
                      onClick={handleSendCode}
                      className="bg-[#1e293b] px-5 py-2.5 text-sm text-white font-normal whitespace-nowrap"
                    >
                      인증번호 발송
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendCode}
                      className="bg-[#d7d8da] px-5 py-2.5 text-sm text-white font-normal"
                    >
                      재전송
                    </button>
                  )}
                </div>
              </div>

              {isCodeSent && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="authCode" className="text-xs font-normal text-gray-700">
                    인증번호 * <span className="text-red-500 ml-1">2:51</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="authCode"
                      type="text"
                      placeholder="6자리 인증번호 입력"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="flex-1 border border-gray-300 p-2.5  focus:outline-none focus:border-red-500"
                      maxLength={6}
                      disabled={isVerified}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={isVerified || isLoading}
                      className="bg-[#FF4D4D] px-5 py-2.5  text-sm text-white font-normal disabled:bg-gray-300"
                    >
                      {isVerified ? '인증완료' : '인증 확인'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 비밀번호 설정 섹션 */}
          <section className="border-2 border-[#edeef0] p-6 bg-white">
            <div className="border-l-[3px] border-red-500 pl-3 mb-6">
              <h2 className="text-red-500 font-bold">비밀번호 설정</h2>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-normal text-gray-700">비밀번호 *</label>
                <input
                  type="password"
                  placeholder="최소 8자 이상"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 focus:outline-none focus:border-red-500"
                  required
                />
                <p className="text-[11px] text-gray-400">영문, 숫자, 특수문자를 조합하여 8자 이상 입력해주세요</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-normal text-gray-700">비밀번호 확인 *</label>
                <input
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 focus:outline-none focus:border-red-500"
                  required
                />
              </div>
            </div>
          </section>

          {/* 추가 정보 섹션 */}
          <section className="border-2 border-[#edeef0] p-6 bg-white">
            <div className="border-l-[3px] border-red-500 pl-3 mb-6">
              <h2 className="text-red-500 font-bold">추가 정보</h2>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-normal text-gray-700">이름</label>
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-normal text-gray-700">주소</label>
                <input
                  type="text"
                  placeholder="주소를 입력하세요"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-normal text-gray-700">전화번호</label>
                <input
                  type="tel"
                  placeholder="전화번호를 입력하세요 (예: 01012345678)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-normal text-gray-700">은행명</label>
                <input
                  type="text"
                  placeholder="은행명을 입력하세요"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-normal text-gray-700">계좌번호</label>
                <input
                  type="text"
                  placeholder="계좌번호를 입력하세요"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </section>

          {/* 하단 버튼 구역 */}
          <div className="flex gap-3 pt-4 justify-end">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="border border-gray-300 py-3.5  text-gray-600 font-normal hover:bg-gray-50 transition-colors px-12"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !isVerified}
              className="bg-[#FF4D4D] text-white py-3.5 font-normal hover:bg-red-600 transition-colors px-12 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리중...' : '회원가입 완료'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}