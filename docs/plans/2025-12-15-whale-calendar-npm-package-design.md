# Whale Calendar npm 패키지 설계

## 개요

Whale ERP의 Calendar 컴포넌트를 독립적인 npm 패키지로 분리하여 일반 React 개발자들이 사용할 수 있는 오픈소스로 배포한다.

## 핵심 결정 사항

| 항목 | 결정 |
|------|------|
| 배포 형태 | npm 공개 패키지 |
| 타겟 사용자 | 일반 React 개발자 (오픈소스) |
| 스타일링 | 순수 CSS 파일 |
| 기능 범위 | 월간 뷰 전용 |
| 데이터 형식 | 날짜별 객체 (`{ 'YYYY-MM-DD': DayData }`) |
| 인터랙션 | 확장 콜백 (onMonthChange, onDayClick, onDayHover, onScheduleClick) |
| 패키지 구조 | 단일 패키지 |
| React 버전 | 19.2.1 (정확히) |

## 패키지 구조

```
whale-calendar/
├── src/
│   ├── index.ts              # 진입점 (export)
│   ├── Calendar.tsx          # 메인 컴포넌트
│   ├── CalendarDay.tsx       # 개별 날짜 셀 (내부용)
│   ├── types.ts              # 타입 정의
│   ├── utils.ts              # 날짜 계산 유틸
│   └── styles.css            # 스타일
│   └── __tests__/
│       ├── Calendar.test.tsx
│       └── utils.test.ts
├── dist/                     # 빌드 결과물
│   ├── index.js              # CJS
│   ├── index.mjs             # ESM
│   ├── index.d.ts            # 타입 선언
│   └── styles.css            # CSS 번들
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

## package.json

```json
{
  "name": "whale-calendar",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "import": "./dist/index.mjs", "require": "./dist/index.js" },
    "./styles.css": "./dist/styles.css"
  },
  "peerDependencies": {
    "react": "19.2.1",
    "react-dom": "19.2.1"
  }
}
```

## 컴포넌트 API

```typescript
interface WhaleCalendarProps {
  /** 표시할 연도 (기본값: 현재 연도) */
  year?: number;

  /** 표시할 월 1-12 (기본값: 현재 월) */
  month?: number;

  /** 날짜별 데이터 */
  data?: CalendarData;

  /** 오늘 날짜 하이라이트 여부 (기본값: true) */
  showToday?: boolean;

  /** 이전/다음 달 날짜 표시 여부 (기본값: true) */
  showAdjacentDays?: boolean;

  /** 월 변경 시 콜백 */
  onMonthChange?: (year: number, month: number) => void;

  /** 날짜 클릭 시 콜백 */
  onDayClick?: (date: Date) => void;

  /** 날짜 호버 시 콜백 */
  onDayHover?: (date: Date | null) => void;

  /** 스케줄 클릭 시 콜백 */
  onScheduleClick?: (date: Date, schedule: ScheduleItem) => void;

  /** 커스텀 클래스명 */
  className?: string;

  /** 로케일 (기본값: 'ko') */
  locale?: 'ko' | 'en';
}
```

## 데이터 타입

```typescript
/** 날짜별 데이터 맵 */
type CalendarData = {
  [dateKey: string]: DayData;  // key: 'YYYY-MM-DD'
};

/** 개별 날짜 데이터 */
interface DayData {
  /** 스케줄 목록 */
  schedules?: ScheduleItem[];

  /** 공휴일/기념일 이름 */
  holiday?: string;

  /** 배경 하이라이트 여부 */
  highlight?: boolean;
}

/** 스케줄 아이템 */
interface ScheduleItem {
  /** 고유 ID */
  id: string;

  /** 표시 텍스트 (예: '10:00~18:00') */
  label: string;

  /** 뱃지 배경색 (기본값: primary color) */
  color?: string;
}
```

## CSS 변수 (테마)

```css
.whale-calendar {
  /* 색상 */
  --whale-calendar-primary: #6F70FA;
  --whale-calendar-sunday: #C93B48;
  --whale-calendar-saturday: #5A9AEA;
  --whale-calendar-text: #1A1A1A;
  --whale-calendar-text-muted: #666666;
  --whale-calendar-text-disabled: #CCCCCC;
  --whale-calendar-border: #EDEDED;
  --whale-calendar-bg: #FFFFFF;
  --whale-calendar-highlight-bg: #F2F8D4;

  /* 크기 */
  --whale-calendar-day-min-height: 54px;
  --whale-calendar-nav-button-size: 32px;
  --whale-calendar-font-size-title: 16px;
  --whale-calendar-font-size-day: 11px;
  --whale-calendar-font-size-schedule: 8px;

  /* 간격 */
  --whale-calendar-padding: 24px;
  --whale-calendar-gap: 10px;

  /* 반경 */
  --whale-calendar-radius: 3px;
  --whale-calendar-radius-full: 9999px;
}
```

## 내부 유틸리티

```typescript
/** 해당 월의 캘린더 그리드 생성 (6주 고정) */
function generateCalendarGrid(year: number, month: number): CalendarCell[][];

/** 날짜를 'YYYY-MM-DD' 형식으로 변환 */
function formatDateKey(date: Date): string;

/** 'YYYY-MM-DD' 문자열을 Date로 변환 */
function parseDateKey(key: string): Date;

/** 해당 날짜가 오늘인지 확인 */
function isToday(date: Date): boolean;

/** 요일 인덱스 반환 (0=일, 6=토) */
function getDayOfWeek(date: Date): number;

interface CalendarCell {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isSunday: boolean;
  isSaturday: boolean;
}
```

외부 날짜 라이브러리 없이 순수 JavaScript Date 사용.

## 사용 예시

**기본 사용:**
```tsx
import { WhaleCalendar } from 'whale-calendar';
import 'whale-calendar/styles.css';

function App() {
  return <WhaleCalendar />;
}
```

**실제 사용 시나리오:**
```tsx
import { useState, useEffect } from 'react';
import { WhaleCalendar, CalendarData } from 'whale-calendar';
import 'whale-calendar/styles.css';

function SchedulePage() {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(12);
  const [data, setData] = useState<CalendarData>({});

  useEffect(() => {
    fetchSchedules(year, month).then(setData);
  }, [year, month]);

  return (
    <WhaleCalendar
      year={year}
      month={month}
      data={data}
      onMonthChange={(y, m) => {
        setYear(y);
        setMonth(m);
      }}
      onDayClick={(date) => openDetailModal(date)}
      onScheduleClick={(date, schedule) => {
        console.log(`${date}: ${schedule.label} 클릭`);
      }}
    />
  );
}
```

## 에러 핸들링

- 잘못된 `year`/`month` 값 → 현재 날짜로 폴백
- `data`가 undefined → 빈 캘린더 렌더
- 잘못된 날짜 키 형식 → 콘솔 경고, 해당 데이터 무시

## 테스트

- **도구**: Vitest + React Testing Library
- **핵심 케이스**:
  - 기본 렌더링 (props 없이)
  - 월 이동 버튼 클릭 → onMonthChange 호출
  - 날짜 클릭 → onDayClick 호출
  - 스케줄 데이터 전달 시 뱃지 표시
  - 공휴일 표시
  - 날짜 계산 유틸 (윤년, 월말 등)

## 빌드 & 배포

```bash
pnpm build        # tsup으로 빌드
pnpm test         # 테스트 실행
npm publish       # npm 배포
```
