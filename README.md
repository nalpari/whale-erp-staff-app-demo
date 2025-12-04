# 힘이 나는 커피생활 - 직원용 앱

커피 프랜차이즈 "힘이 나는 커피생활" 매장 직원을 위한 모바일 퍼스트 급여명세서 조회 앱입니다.

## 주요 기능

- **급여명세서 조회**: 월별 급여명세서 목록 확인
- **매장 선택**: 근무 매장 선택 기능
- **직원 프로필**: 이름, 직급, 직무 표시

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI**: shadcn/ui (new-york style), Lucide Icons
- **Font**: Pretendard (한글 최적화)

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린트 검사
pnpm lint
```

개발 서버 실행 후 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx      # 루트 레이아웃 (한국어, Pretendard 폰트)
│   ├── page.tsx        # 메인 페이지 (급여명세서)
│   └── globals.css     # 전역 스타일, CSS 변수
├── components/
│   ├── TopBar.tsx      # 상단 헤더 (매장명, 메뉴 버튼)
│   ├── StatusBar.tsx   # 모바일 상태바 영역
│   ├── SelectForm.tsx  # 매장 선택 드롭다운
│   ├── UserProfile.tsx # 직원 프로필 (이름, 직급, 직무)
│   ├── SalaryList.tsx  # 급여명세서 목록
│   ├── SalaryListItem.tsx # 급여명세서 항목
│   ├── BackButton.tsx  # 하단 스크롤 버튼
│   └── Footer.tsx      # 푸터 (저작권)
└── lib/
    └── utils.ts        # cn() 유틸리티 함수
```

## 디자인 시스템

- **Target**: 375px 모바일 뷰포트 (데스크톱에서 모바일 프레임 표시)
- **Primary Color**: `#5B5DED` ~ `#6F70FA` (그라데이션)
- **Text Colors**: `#1A1A1A` (primary), `#777` (secondary)
- **Dark Mode**: CSS 변수 기반 지원

## 라이선스

Copyrights© 2025 따름인 All Rights Reserved.
