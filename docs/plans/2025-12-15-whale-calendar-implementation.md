# Whale Calendar npm 패키지 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** whale-calendar npm 패키지를 생성하여 독립적인 React 캘린더 컴포넌트를 배포한다.

**Architecture:** 현재 프로젝트의 Calendar 컴포넌트를 별도 디렉토리(`packages/whale-calendar`)로 분리하고, tsup으로 빌드하여 npm에 배포할 수 있는 형태로 만든다. 기존 하드코딩된 데이터를 props로 받도록 리팩토링한다.

**Tech Stack:** React 19.2.1, TypeScript, tsup (번들러), Vitest + React Testing Library (테스트)

---

## Task 1: 패키지 디렉토리 구조 생성

**Files:**
- Create: `packages/whale-calendar/package.json`
- Create: `packages/whale-calendar/tsconfig.json`
- Create: `packages/whale-calendar/tsup.config.ts`

**Step 1: packages 디렉토리 생성**

Run:
```bash
mkdir -p packages/whale-calendar/src
```

**Step 2: package.json 생성**

Create `packages/whale-calendar/package.json`:
```json
{
  "name": "whale-calendar",
  "version": "0.1.0",
  "description": "A Korean-style monthly schedule calendar component for React",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": [
    "dist"
  ],
  "sideEffects": [
    "*.css"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "19.2.1",
    "react-dom": "19.2.1"
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.0",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "jsdom": "^25.0.0",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "tsup": "^8.0.0",
    "typescript": "^5",
    "vitest": "^2.0.0"
  },
  "keywords": [
    "react",
    "calendar",
    "schedule",
    "korean",
    "monthly"
  ],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/whale-calendar"
  }
}
```

**Step 3: tsconfig.json 생성**

Create `packages/whale-calendar/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "declaration": true,
    "declarationDir": "./dist",
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 4: tsup.config.ts 생성**

Create `packages/whale-calendar/tsup.config.ts`:
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
});
```

**Step 5: Commit**

```bash
git add packages/whale-calendar/
git commit -m "chore: initialize whale-calendar package structure"
```

---

## Task 2: 타입 정의 파일 생성

**Files:**
- Create: `packages/whale-calendar/src/types.ts`

**Step 1: Write the failing test**

Create `packages/whale-calendar/src/__tests__/types.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import type { CalendarData, DayData, ScheduleItem, WhaleCalendarProps } from '../types';

describe('types', () => {
  it('should allow valid CalendarData structure', () => {
    const data: CalendarData = {
      '2024-12-05': {
        schedules: [{ id: '1', label: '10:00~18:00' }],
        holiday: undefined,
        highlight: true,
      },
    };
    expect(data['2024-12-05'].schedules).toHaveLength(1);
  });

  it('should allow DayData with optional fields', () => {
    const dayData: DayData = {};
    expect(dayData.schedules).toBeUndefined();
    expect(dayData.holiday).toBeUndefined();
    expect(dayData.highlight).toBeUndefined();
  });

  it('should allow ScheduleItem with optional color', () => {
    const item: ScheduleItem = { id: '1', label: '10:00~18:00' };
    expect(item.color).toBeUndefined();

    const itemWithColor: ScheduleItem = { id: '2', label: '19:00~22:00', color: '#90C96E' };
    expect(itemWithColor.color).toBe('#90C96E');
  });
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
cd packages/whale-calendar && pnpm install && pnpm test
```
Expected: FAIL with "Cannot find module '../types'"

**Step 3: Write types.ts**

Create `packages/whale-calendar/src/types.ts`:
```typescript
/** 날짜별 데이터 맵 */
export type CalendarData = {
  [dateKey: string]: DayData;
};

/** 개별 날짜 데이터 */
export interface DayData {
  /** 스케줄 목록 */
  schedules?: ScheduleItem[];
  /** 공휴일/기념일 이름 */
  holiday?: string;
  /** 배경 하이라이트 여부 */
  highlight?: boolean;
}

/** 스케줄 아이템 */
export interface ScheduleItem {
  /** 고유 ID */
  id: string;
  /** 표시 텍스트 (예: '10:00~18:00') */
  label: string;
  /** 뱃지 배경색 (기본값: primary color) */
  color?: string;
}

/** 캘린더 셀 (내부용) */
export interface CalendarCell {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isSunday: boolean;
  isSaturday: boolean;
}

/** WhaleCalendar 컴포넌트 Props */
export interface WhaleCalendarProps {
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

**Step 4: Run test to verify it passes**

Run:
```bash
cd packages/whale-calendar && pnpm test
```
Expected: PASS

**Step 5: Commit**

```bash
git add packages/whale-calendar/src/
git commit -m "feat(whale-calendar): add type definitions"
```

---

## Task 3: 유틸리티 함수 구현

**Files:**
- Create: `packages/whale-calendar/src/utils.ts`
- Create: `packages/whale-calendar/src/__tests__/utils.test.ts`

**Step 1: Write the failing tests**

Create `packages/whale-calendar/src/__tests__/utils.test.ts`:
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatDateKey,
  parseDateKey,
  isToday,
  getDayOfWeek,
  generateCalendarGrid,
} from '../utils';

describe('formatDateKey', () => {
  it('should format date as YYYY-MM-DD', () => {
    const date = new Date(2024, 11, 5); // Dec 5, 2024
    expect(formatDateKey(date)).toBe('2024-12-05');
  });

  it('should pad single digit month and day', () => {
    const date = new Date(2024, 0, 1); // Jan 1, 2024
    expect(formatDateKey(date)).toBe('2024-01-01');
  });
});

describe('parseDateKey', () => {
  it('should parse YYYY-MM-DD string to Date', () => {
    const date = parseDateKey('2024-12-05');
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(11); // 0-indexed
    expect(date.getDate()).toBe(5);
  });
});

describe('isToday', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 11, 15)); // Dec 15, 2024
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return true for today', () => {
    const today = new Date(2024, 11, 15);
    expect(isToday(today)).toBe(true);
  });

  it('should return false for other days', () => {
    const otherDay = new Date(2024, 11, 16);
    expect(isToday(otherDay)).toBe(false);
  });
});

describe('getDayOfWeek', () => {
  it('should return 0 for Sunday', () => {
    const sunday = new Date(2024, 11, 15); // Dec 15, 2024 is Sunday
    expect(getDayOfWeek(sunday)).toBe(0);
  });

  it('should return 6 for Saturday', () => {
    const saturday = new Date(2024, 11, 14); // Dec 14, 2024 is Saturday
    expect(getDayOfWeek(saturday)).toBe(6);
  });
});

describe('generateCalendarGrid', () => {
  it('should generate 6 weeks (42 days)', () => {
    const grid = generateCalendarGrid(2024, 12);
    expect(grid).toHaveLength(6);
    expect(grid.flat()).toHaveLength(42);
  });

  it('should start with Sunday', () => {
    const grid = generateCalendarGrid(2024, 12);
    expect(grid[0][0].isSunday).toBe(true);
  });

  it('should mark current month days correctly', () => {
    const grid = generateCalendarGrid(2024, 12);
    const flatGrid = grid.flat();
    const currentMonthDays = flatGrid.filter((cell) => cell.isCurrentMonth);
    expect(currentMonthDays).toHaveLength(31); // December has 31 days
  });

  it('should handle February leap year', () => {
    const grid = generateCalendarGrid(2024, 2);
    const flatGrid = grid.flat();
    const currentMonthDays = flatGrid.filter((cell) => cell.isCurrentMonth);
    expect(currentMonthDays).toHaveLength(29); // 2024 is leap year
  });

  it('should handle February non-leap year', () => {
    const grid = generateCalendarGrid(2023, 2);
    const flatGrid = grid.flat();
    const currentMonthDays = flatGrid.filter((cell) => cell.isCurrentMonth);
    expect(currentMonthDays).toHaveLength(28);
  });
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
cd packages/whale-calendar && pnpm test
```
Expected: FAIL with "Cannot find module '../utils'"

**Step 3: Write utils.ts**

Create `packages/whale-calendar/src/utils.ts`:
```typescript
import type { CalendarCell } from './types';

/**
 * 날짜를 'YYYY-MM-DD' 형식으로 변환
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 'YYYY-MM-DD' 문자열을 Date로 변환
 */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * 해당 날짜가 오늘인지 확인
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * 요일 인덱스 반환 (0=일, 6=토)
 */
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * 해당 월의 캘린더 그리드 생성 (6주 고정)
 */
export function generateCalendarGrid(year: number, month: number): CalendarCell[][] {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();

  // 그리드 시작일 (이전 달 포함)
  const startDate = new Date(year, month - 1, 1 - startDayOfWeek);

  const grid: CalendarCell[][] = [];

  for (let week = 0; week < 6; week++) {
    const weekRow: CalendarCell[] = [];
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + week * 7 + day);

      const dayOfWeek = currentDate.getDay();

      weekRow.push({
        date: currentDate,
        day: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === month - 1,
        isSunday: dayOfWeek === 0,
        isSaturday: dayOfWeek === 6,
      });
    }
    grid.push(weekRow);
  }

  return grid;
}
```

**Step 4: Run test to verify it passes**

Run:
```bash
cd packages/whale-calendar && pnpm test
```
Expected: PASS

**Step 5: Commit**

```bash
git add packages/whale-calendar/src/
git commit -m "feat(whale-calendar): add date utility functions"
```

---

## Task 4: Vitest 설정 파일 생성

**Files:**
- Create: `packages/whale-calendar/vitest.config.ts`

**Step 1: Create vitest.config.ts**

Create `packages/whale-calendar/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
});
```

**Step 2: Commit**

```bash
git add packages/whale-calendar/vitest.config.ts
git commit -m "chore(whale-calendar): add vitest configuration"
```

---

## Task 5: CSS 스타일 파일 생성

**Files:**
- Create: `packages/whale-calendar/src/styles.css`

**Step 1: Copy and organize styles**

Create `packages/whale-calendar/src/styles.css` (기존 Calendar.css 기반):
```css
/* Whale Calendar Component Styles */

.whale-calendar {
  /* CSS Variables for theming */
  --whale-calendar-primary: #6F70FA;
  --whale-calendar-sunday: #C93B48;
  --whale-calendar-saturday: #5A9AEA;
  --whale-calendar-text: #1A1A1A;
  --whale-calendar-text-muted: #666666;
  --whale-calendar-text-disabled: #CCCCCC;
  --whale-calendar-border: #EDEDED;
  --whale-calendar-bg: #FFFFFF;
  --whale-calendar-highlight-bg: #F2F8D4;
  --whale-calendar-day-min-height: 54px;
  --whale-calendar-nav-button-size: 32px;
  --whale-calendar-font-size-title: 16px;
  --whale-calendar-font-size-day: 11px;
  --whale-calendar-font-size-schedule: 8px;
  --whale-calendar-padding: 24px;
  --whale-calendar-gap: 10px;
  --whale-calendar-radius: 3px;
  --whale-calendar-radius-full: 9999px;

  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Navigation */
.whale-calendar__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  align-self: stretch;
  padding: 1rem var(--whale-calendar-padding);
}

.whale-calendar__nav-button {
  display: flex;
  aspect-ratio: 1;
  height: var(--whale-calendar-nav-button-size);
  width: var(--whale-calendar-nav-button-size);
  align-items: center;
  justify-content: center;
  border-radius: var(--whale-calendar-radius-full);
  border: 1px solid var(--whale-calendar-border);
  background-color: var(--whale-calendar-bg);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.whale-calendar__nav-button:hover {
  background-color: #F5F5F5;
}

.whale-calendar__nav-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.whale-calendar__title {
  text-align: center;
  font-size: var(--whale-calendar-font-size-title);
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.4px;
  color: var(--whale-calendar-text);
}

/* Grid */
.whale-calendar__grid {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
}

/* Week Header */
.whale-calendar__week-header {
  display: flex;
  height: 34px;
  align-items: flex-start;
  align-self: stretch;
}

.whale-calendar__weekday {
  display: flex;
  height: 34px;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--whale-calendar-border);
  border-top: 1px solid var(--whale-calendar-border);
}

.whale-calendar__weekday:last-child {
  border-right: none;
}

.whale-calendar__weekday-text {
  align-self: stretch;
  text-align: center;
  font-size: var(--whale-calendar-font-size-day);
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.275px;
  color: var(--whale-calendar-text-muted);
}

.whale-calendar__weekday-text--sunday {
  color: var(--whale-calendar-sunday);
}

.whale-calendar__weekday-text--saturday {
  color: var(--whale-calendar-saturday);
}

/* Week Row */
.whale-calendar__week-row {
  display: flex;
  align-items: flex-start;
  align-self: stretch;
}

/* Day Cell */
.whale-calendar__day {
  display: flex;
  min-height: var(--whale-calendar-day-min-height);
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--whale-calendar-gap);
  border-bottom: 1px solid var(--whale-calendar-border);
  border-right: 1px solid var(--whale-calendar-border);
  padding: 0 4px 4px 4px;
  background-color: var(--whale-calendar-bg);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.whale-calendar__day:last-child {
  border-right: none;
}

.whale-calendar__day:hover {
  background-color: #FAFAFA;
}

.whale-calendar__day--highlight {
  background-color: var(--whale-calendar-highlight-bg);
}

.whale-calendar__day--highlight:hover {
  background-color: #E8F0C8;
}

/* Day Number */
.whale-calendar__day-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.whale-calendar__day-number-wrapper {
  display: flex;
  aspect-ratio: 1;
  height: 18px;
  width: 18px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--whale-calendar-radius-full);
}

.whale-calendar__day-number-wrapper--today {
  background-color: var(--whale-calendar-primary);
}

.whale-calendar__day-number {
  width: 14px;
  text-align: right;
  font-size: var(--whale-calendar-font-size-day);
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.275px;
}

.whale-calendar__day-number--today {
  color: var(--whale-calendar-bg);
  font-weight: 600;
}

.whale-calendar__day-number--has-schedule {
  font-weight: 600;
}

.whale-calendar__day-number--sunday {
  color: var(--whale-calendar-sunday);
}

.whale-calendar__day-number--saturday {
  color: var(--whale-calendar-saturday);
}

.whale-calendar__day-number--other-month {
  color: var(--whale-calendar-text-disabled);
}

.whale-calendar__day-number--other-month-sunday {
  color: #EBC1C5;
}

.whale-calendar__day-number--other-month-saturday {
  color: #BDD8FA;
}

/* Schedule Badge */
.whale-calendar__schedule-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  border-radius: var(--whale-calendar-radius);
  background-color: var(--whale-calendar-primary);
  padding: 2px 4px;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.whale-calendar__schedule-badge:hover {
  opacity: 0.85;
}

.whale-calendar__schedule-badge-text {
  text-align: center;
  font-size: var(--whale-calendar-font-size-schedule);
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.52px;
  color: var(--whale-calendar-bg);
}

/* Holiday */
.whale-calendar__holiday {
  text-align: right;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.25px;
  color: var(--whale-calendar-sunday);
}
```

**Step 2: Commit**

```bash
git add packages/whale-calendar/src/styles.css
git commit -m "feat(whale-calendar): add component styles with CSS variables"
```

---

## Task 6: CalendarDay 컴포넌트 구현

**Files:**
- Create: `packages/whale-calendar/src/CalendarDay.tsx`
- Create: `packages/whale-calendar/src/__tests__/CalendarDay.test.tsx`

**Step 1: Write the failing test**

Create `packages/whale-calendar/src/__tests__/CalendarDay.test.tsx`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarDay } from '../CalendarDay';

describe('CalendarDay', () => {
  const baseProps = {
    date: new Date(2024, 11, 5),
    day: 5,
    isCurrentMonth: true,
    isSunday: false,
    isSaturday: false,
    isToday: false,
  };

  it('should render day number', () => {
    render(<CalendarDay {...baseProps} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should apply today class when isToday is true', () => {
    render(<CalendarDay {...baseProps} isToday />);
    const wrapper = screen.getByText('5').closest('.whale-calendar__day-number-wrapper');
    expect(wrapper).toHaveClass('whale-calendar__day-number-wrapper--today');
  });

  it('should render schedule badge when schedule is provided', () => {
    const schedule = { id: '1', label: '10:00~18:00' };
    render(<CalendarDay {...baseProps} schedules={[schedule]} />);
    expect(screen.getByText('10:00~18:00')).toBeInTheDocument();
  });

  it('should render holiday text', () => {
    render(<CalendarDay {...baseProps} holiday="크리스마스" />);
    expect(screen.getByText('크리스마스')).toBeInTheDocument();
  });

  it('should call onDayClick when clicked', () => {
    const onDayClick = vi.fn();
    render(<CalendarDay {...baseProps} onDayClick={onDayClick} />);
    fireEvent.click(screen.getByText('5').closest('.whale-calendar__day')!);
    expect(onDayClick).toHaveBeenCalledWith(baseProps.date);
  });

  it('should call onScheduleClick when schedule badge is clicked', () => {
    const onScheduleClick = vi.fn();
    const schedule = { id: '1', label: '10:00~18:00' };
    render(
      <CalendarDay {...baseProps} schedules={[schedule]} onScheduleClick={onScheduleClick} />
    );
    fireEvent.click(screen.getByText('10:00~18:00'));
    expect(onScheduleClick).toHaveBeenCalledWith(baseProps.date, schedule);
  });

  it('should apply highlight class when highlight is true', () => {
    render(<CalendarDay {...baseProps} highlight />);
    const dayCell = screen.getByText('5').closest('.whale-calendar__day');
    expect(dayCell).toHaveClass('whale-calendar__day--highlight');
  });
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
cd packages/whale-calendar && pnpm test
```
Expected: FAIL with "Cannot find module '../CalendarDay'"

**Step 3: Write CalendarDay.tsx**

Create `packages/whale-calendar/src/CalendarDay.tsx`:
```typescript
import type { ScheduleItem } from './types';

interface CalendarDayProps {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  isToday?: boolean;
  schedules?: ScheduleItem[];
  holiday?: string;
  highlight?: boolean;
  onDayClick?: (date: Date) => void;
  onDayHover?: (date: Date | null) => void;
  onScheduleClick?: (date: Date, schedule: ScheduleItem) => void;
}

export function CalendarDay({
  date,
  day,
  isCurrentMonth,
  isSunday,
  isSaturday,
  isToday = false,
  schedules,
  holiday,
  highlight = false,
  onDayClick,
  onDayHover,
  onScheduleClick,
}: CalendarDayProps) {
  const hasSchedule = schedules && schedules.length > 0;

  const getDayNumberClass = () => {
    const classes = ['whale-calendar__day-number'];

    if (isToday) {
      classes.push('whale-calendar__day-number--today');
    } else if (hasSchedule) {
      classes.push('whale-calendar__day-number--has-schedule');
    }

    if (!isCurrentMonth) {
      if (isSunday) {
        classes.push('whale-calendar__day-number--other-month-sunday');
      } else if (isSaturday) {
        classes.push('whale-calendar__day-number--other-month-saturday');
      } else {
        classes.push('whale-calendar__day-number--other-month');
      }
    } else if (isSunday || holiday) {
      classes.push('whale-calendar__day-number--sunday');
    } else if (isSaturday) {
      classes.push('whale-calendar__day-number--saturday');
    }

    return classes.join(' ');
  };

  const dayClass = [
    'whale-calendar__day',
    highlight ? 'whale-calendar__day--highlight' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleDayClick = () => {
    onDayClick?.(date);
  };

  const handleDayMouseEnter = () => {
    onDayHover?.(date);
  };

  const handleDayMouseLeave = () => {
    onDayHover?.(null);
  };

  const handleScheduleClick = (schedule: ScheduleItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onScheduleClick?.(date, schedule);
  };

  return (
    <div
      className={dayClass}
      onClick={handleDayClick}
      onMouseEnter={handleDayMouseEnter}
      onMouseLeave={handleDayMouseLeave}
    >
      <div className="whale-calendar__day-header">
        <div
          className={`whale-calendar__day-number-wrapper ${
            isToday ? 'whale-calendar__day-number-wrapper--today' : ''
          }`}
        >
          <div className={getDayNumberClass()}>{day}</div>
        </div>
      </div>
      {schedules?.map((schedule) => (
        <div
          key={schedule.id}
          className="whale-calendar__schedule-badge"
          style={schedule.color ? { backgroundColor: schedule.color } : undefined}
          onClick={(e) => handleScheduleClick(schedule, e)}
        >
          <div className="whale-calendar__schedule-badge-text">{schedule.label}</div>
        </div>
      ))}
      {holiday && <div className="whale-calendar__holiday">{holiday}</div>}
    </div>
  );
}
```

**Step 4: Run test to verify it passes**

Run:
```bash
cd packages/whale-calendar && pnpm test
```
Expected: PASS

**Step 5: Commit**

```bash
git add packages/whale-calendar/src/
git commit -m "feat(whale-calendar): add CalendarDay component"
```

---

## Task 7: WhaleCalendar 메인 컴포넌트 구현

**Files:**
- Create: `packages/whale-calendar/src/WhaleCalendar.tsx`
- Create: `packages/whale-calendar/src/__tests__/WhaleCalendar.test.tsx`

**Step 1: Write the failing test**

Create `packages/whale-calendar/src/__tests__/WhaleCalendar.test.tsx`:
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WhaleCalendar } from '../WhaleCalendar';
import type { CalendarData } from '../types';

describe('WhaleCalendar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 11, 15)); // Dec 15, 2024
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render current month by default', () => {
    render(<WhaleCalendar />);
    expect(screen.getByText('12월 스케줄')).toBeInTheDocument();
  });

  it('should render specified year and month', () => {
    render(<WhaleCalendar year={2024} month={1} />);
    expect(screen.getByText('1월 스케줄')).toBeInTheDocument();
  });

  it('should render English locale', () => {
    render(<WhaleCalendar year={2024} month={12} locale="en" />);
    expect(screen.getByText('December Schedule')).toBeInTheDocument();
  });

  it('should call onMonthChange when prev button clicked', () => {
    const onMonthChange = vi.fn();
    render(<WhaleCalendar year={2024} month={12} onMonthChange={onMonthChange} />);
    fireEvent.click(screen.getByLabelText('이전 달'));
    expect(onMonthChange).toHaveBeenCalledWith(2024, 11);
  });

  it('should call onMonthChange when next button clicked', () => {
    const onMonthChange = vi.fn();
    render(<WhaleCalendar year={2024} month={12} onMonthChange={onMonthChange} />);
    fireEvent.click(screen.getByLabelText('다음 달'));
    expect(onMonthChange).toHaveBeenCalledWith(2025, 1);
  });

  it('should render schedule data', () => {
    const data: CalendarData = {
      '2024-12-05': {
        schedules: [{ id: '1', label: '10:00~18:00' }],
      },
    };
    render(<WhaleCalendar year={2024} month={12} data={data} />);
    expect(screen.getByText('10:00~18:00')).toBeInTheDocument();
  });

  it('should render holiday', () => {
    const data: CalendarData = {
      '2024-12-25': {
        holiday: '크리스마스',
      },
    };
    render(<WhaleCalendar year={2024} month={12} data={data} />);
    expect(screen.getByText('크리스마스')).toBeInTheDocument();
  });

  it('should highlight today when showToday is true', () => {
    render(<WhaleCalendar year={2024} month={12} showToday />);
    const todayWrapper = document.querySelector('.whale-calendar__day-number-wrapper--today');
    expect(todayWrapper).toBeInTheDocument();
  });

  it('should not highlight today when showToday is false', () => {
    render(<WhaleCalendar year={2024} month={12} showToday={false} />);
    const todayWrapper = document.querySelector('.whale-calendar__day-number-wrapper--today');
    expect(todayWrapper).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<WhaleCalendar className="my-calendar" />);
    const calendar = document.querySelector('.whale-calendar');
    expect(calendar).toHaveClass('my-calendar');
  });
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
cd packages/whale-calendar && pnpm test
```
Expected: FAIL with "Cannot find module '../WhaleCalendar'"

**Step 3: Write WhaleCalendar.tsx**

Create `packages/whale-calendar/src/WhaleCalendar.tsx`:
```typescript
import { CalendarDay } from './CalendarDay';
import { generateCalendarGrid, formatDateKey, isToday as checkIsToday } from './utils';
import type { WhaleCalendarProps } from './types';

const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];
const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES_KO = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];
const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function WhaleCalendar({
  year: initialYear,
  month: initialMonth,
  data = {},
  showToday = true,
  showAdjacentDays = true,
  onMonthChange,
  onDayClick,
  onDayHover,
  onScheduleClick,
  className,
  locale = 'ko',
}: WhaleCalendarProps) {
  const now = new Date();
  const year = initialYear ?? now.getFullYear();
  const month = initialMonth ?? now.getMonth() + 1;

  const grid = generateCalendarGrid(year, month);
  const weekdays = locale === 'ko' ? WEEKDAYS_KO : WEEKDAYS_EN;
  const monthNames = locale === 'ko' ? MONTH_NAMES_KO : MONTH_NAMES_EN;

  const title =
    locale === 'ko'
      ? `${month}월 스케줄`
      : `${monthNames[month - 1]} Schedule`;

  const handlePrevMonth = () => {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    onMonthChange?.(prevYear, prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    onMonthChange?.(nextYear, nextMonth);
  };

  const calendarClass = ['whale-calendar', className].filter(Boolean).join(' ');

  return (
    <div className={calendarClass}>
      <div className="whale-calendar__nav">
        <button
          className="whale-calendar__nav-button"
          aria-label="이전 달"
          onClick={handlePrevMonth}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M18.5 12L14.5 16L18.5 20"
              stroke="#777777"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="whale-calendar__title">{title}</div>
        <button
          className="whale-calendar__nav-button"
          aria-label="다음 달"
          onClick={handleNextMonth}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M14.5 20L18.5 16L14.5 12"
              stroke="#777777"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="whale-calendar__grid">
        <div className="whale-calendar__week-header">
          {weekdays.map((day, index) => (
            <div key={day} className="whale-calendar__weekday">
              <div
                className={`whale-calendar__weekday-text ${
                  index === 0
                    ? 'whale-calendar__weekday-text--sunday'
                    : index === 6
                      ? 'whale-calendar__weekday-text--saturday'
                      : ''
                }`}
              >
                {day}
              </div>
            </div>
          ))}
        </div>

        {grid.map((week, weekIndex) => (
          <div key={weekIndex} className="whale-calendar__week-row">
            {week.map((cell) => {
              const dateKey = formatDateKey(cell.date);
              const dayData = data[dateKey];

              if (!showAdjacentDays && !cell.isCurrentMonth) {
                return (
                  <div key={dateKey} className="whale-calendar__day">
                    <div className="whale-calendar__day-header" />
                  </div>
                );
              }

              return (
                <CalendarDay
                  key={dateKey}
                  date={cell.date}
                  day={cell.day}
                  isCurrentMonth={cell.isCurrentMonth}
                  isSunday={cell.isSunday}
                  isSaturday={cell.isSaturday}
                  isToday={showToday && checkIsToday(cell.date)}
                  schedules={dayData?.schedules}
                  holiday={dayData?.holiday}
                  highlight={dayData?.highlight}
                  onDayClick={onDayClick}
                  onDayHover={onDayHover}
                  onScheduleClick={onScheduleClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 4: Run test to verify it passes**

Run:
```bash
cd packages/whale-calendar && pnpm test
```
Expected: PASS

**Step 5: Commit**

```bash
git add packages/whale-calendar/src/
git commit -m "feat(whale-calendar): add WhaleCalendar main component"
```

---

## Task 8: 진입점 및 export 설정

**Files:**
- Create: `packages/whale-calendar/src/index.ts`

**Step 1: Create index.ts**

Create `packages/whale-calendar/src/index.ts`:
```typescript
export { WhaleCalendar } from './WhaleCalendar';
export { CalendarDay } from './CalendarDay';
export type {
  WhaleCalendarProps,
  CalendarData,
  DayData,
  ScheduleItem,
  CalendarCell,
} from './types';
export {
  formatDateKey,
  parseDateKey,
  isToday,
  getDayOfWeek,
  generateCalendarGrid,
} from './utils';
```

**Step 2: Commit**

```bash
git add packages/whale-calendar/src/index.ts
git commit -m "feat(whale-calendar): add package entry point with exports"
```

---

## Task 9: Testing Library 설정 추가

**Files:**
- Modify: `packages/whale-calendar/vitest.config.ts`
- Create: `packages/whale-calendar/src/__tests__/setup.ts`

**Step 1: Create test setup file**

Create `packages/whale-calendar/src/__tests__/setup.ts`:
```typescript
import '@testing-library/jest-dom/vitest';
```

**Step 2: Update vitest.config.ts**

Update `packages/whale-calendar/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
```

**Step 3: Add @testing-library/jest-dom**

Run:
```bash
cd packages/whale-calendar && pnpm add -D @testing-library/jest-dom
```

**Step 4: Run all tests**

Run:
```bash
cd packages/whale-calendar && pnpm test
```
Expected: All tests PASS

**Step 5: Commit**

```bash
git add packages/whale-calendar/
git commit -m "chore(whale-calendar): add testing library setup"
```

---

## Task 10: 빌드 테스트 및 README 작성

**Files:**
- Create: `packages/whale-calendar/README.md`

**Step 1: Run build**

Run:
```bash
cd packages/whale-calendar && pnpm build
```
Expected: dist/ 폴더에 index.js, index.mjs, index.d.ts, styles.css 생성

**Step 2: Create README.md**

Create `packages/whale-calendar/README.md`:
```markdown
# whale-calendar

A Korean-style monthly schedule calendar component for React.

## Installation

```bash
npm install whale-calendar
# or
pnpm add whale-calendar
```

## Usage

```tsx
import { WhaleCalendar } from 'whale-calendar';
import 'whale-calendar/styles.css';

function App() {
  return <WhaleCalendar />;
}
```

## With Schedule Data

```tsx
import { WhaleCalendar, CalendarData } from 'whale-calendar';
import 'whale-calendar/styles.css';

function App() {
  const data: CalendarData = {
    '2024-12-05': {
      schedules: [
        { id: '1', label: '10:00~18:00' },
        { id: '2', label: '19:00~22:00', color: '#90C96E' }
      ],
      highlight: true
    },
    '2024-12-25': {
      holiday: '크리스마스'
    }
  };

  return (
    <WhaleCalendar
      year={2024}
      month={12}
      data={data}
      onDayClick={(date) => console.log(date)}
      onMonthChange={(y, m) => console.log(y, m)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| year | number | current year | Year to display |
| month | number | current month | Month to display (1-12) |
| data | CalendarData | {} | Schedule data by date |
| showToday | boolean | true | Highlight today |
| showAdjacentDays | boolean | true | Show adjacent month days |
| onMonthChange | (year, month) => void | - | Month change callback |
| onDayClick | (date) => void | - | Day click callback |
| onDayHover | (date \| null) => void | - | Day hover callback |
| onScheduleClick | (date, schedule) => void | - | Schedule click callback |
| className | string | - | Custom class name |
| locale | 'ko' \| 'en' | 'ko' | Locale |

## Theming

Customize with CSS variables:

```css
:root {
  --whale-calendar-primary: #6F70FA;
  --whale-calendar-sunday: #C93B48;
  --whale-calendar-saturday: #5A9AEA;
  --whale-calendar-text: #1A1A1A;
  --whale-calendar-border: #EDEDED;
  --whale-calendar-bg: #FFFFFF;
}
```

## License

MIT
```

**Step 3: Commit**

```bash
git add packages/whale-calendar/
git commit -m "docs(whale-calendar): add README and verify build"
```

---

## Task 11: 기존 앱에서 패키지 사용하도록 연결 (선택)

**Files:**
- Modify: `src/components/Calendar.tsx`

이 태스크는 선택 사항입니다. 기존 앱에서 새로 만든 패키지를 사용하도록 연결하려면:

**Step 1: pnpm workspace 설정**

Create `pnpm-workspace.yaml` at root:
```yaml
packages:
  - 'packages/*'
```

**Step 2: 루트 package.json에 워크스페이스 의존성 추가**

```json
{
  "dependencies": {
    "whale-calendar": "workspace:*"
  }
}
```

**Step 3: 기존 Calendar.tsx를 패키지 사용으로 교체**

```tsx
'use client';

import { WhaleCalendar } from 'whale-calendar';
import 'whale-calendar/styles.css';

export default function Calendar() {
  return (
    <WhaleCalendar
      onDayClick={(date) => console.log('clicked:', date)}
    />
  );
}
```

**Step 4: Install and test**

```bash
pnpm install
pnpm dev
```

**Step 5: Commit**

```bash
git add .
git commit -m "refactor: use whale-calendar package in app"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | 패키지 디렉토리 구조 생성 |
| 2 | 타입 정의 파일 생성 |
| 3 | 유틸리티 함수 구현 |
| 4 | Vitest 설정 파일 생성 |
| 5 | CSS 스타일 파일 생성 |
| 6 | CalendarDay 컴포넌트 구현 |
| 7 | WhaleCalendar 메인 컴포넌트 구현 |
| 8 | 진입점 및 export 설정 |
| 9 | Testing Library 설정 추가 |
| 10 | 빌드 테스트 및 README 작성 |
| 11 | 기존 앱에서 패키지 연결 (선택) |
