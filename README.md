# 📱 Device Rental

> 다방면용 전자기기 대여 서비스

<br>

## 프로젝트 소개

**Device Rental**은 전자기기를 손쉽게 대여하고 반납할 수 있는 웹 서비스입니다.  
사용자는 보유 기기를 검색·조회하고, 대여 신청부터 반납까지 한 곳에서 관리할 수 있습니다.  
개인 대여 현황은 마이페이지에서 실시간으로 확인 가능합니다.

- **개발 기간** : 2025. 12. 17 ~ 2025. 04. 27
- **팀 구성** : 프론트엔드 2명, 백엔드 2명
- **배포 URL** : [device-rental.vercel.app](https://device-rental-kappa.vercel.app/)

<br>

## 주요 기능

| 기능 | 설명 |
|------|------|
| 기기 목록 조회 / 검색 | 카테고리 필터 및 키워드 검색으로 원하는 기기를 빠르게 찾을 수 있습니다 |
| 대여 신청 및 반납 | 기기 선택 후 대여 기간 설정, 반납 처리까지 간편하게 진행할 수 있습니다 |
| 대여 현황 / 마이페이지 | 현재 대여 중인 기기와 이력을 한눈에 확인할 수 있습니다 |
| 로그인 / 회원가입 | 계정 기반으로 개인 대여 내역을 안전하게 관리합니다 |

<br>

## 기술 스택

**Core**

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

**상태 관리**

![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=flat-square)

**스타일**

![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

**배포**

![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

**협업**

![Notion](https://img.shields.io/badge/Notion-000000?style=flat-square&logo=notion&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-0052CC?style=flat-square&logo=jira&logoColor=white)

<br>

## 폴더 구조

```
src/
├─ app/
│  ├─ (auth)/
│  │  ├─ login/
│  │  └─ signup/
│  ├─ items/
│  │  ├─ page.tsx
│  │  └─ [itemId]/
│  │     └─ page.tsx
│  ├─ rentals/
│  ├─ coupons/
│  ├─ points/
│  └─ mypage/
├─ components/
│  └─ common/
├─ hooks/
├─ services/
├─ queries/
├─ types/
└─ utils/
```


<br>

## 로컬 실행 방법

```bash
# 저장소 클론
git clone https://github.com/pinetree5115-collab/device-rental.git
cd device-rental

# 패키지 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에 필요한 값 입력

# 개발 서버 실행
npm run dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.
