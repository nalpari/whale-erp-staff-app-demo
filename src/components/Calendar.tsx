import "./Calendar.css";

interface CalendarDayProps {
  day: number;
  isCurrentMonth: boolean;
  isSunday?: boolean;
  isSaturday?: boolean;
  isToday?: boolean;
  hasSchedule?: boolean;
  scheduleTime?: string;
  isHighlightBg?: boolean;
  holiday?: string;
}

function CalendarDay({
  day,
  isCurrentMonth,
  isSunday,
  isSaturday,
  isToday,
  hasSchedule,
  scheduleTime,
  isHighlightBg,
  holiday,
}: CalendarDayProps) {
  const getDayNumberClass = () => {
    const classes = ["whale-calendar__day-number"];

    if (isToday) {
      classes.push("whale-calendar__day-number--today");
    } else if (hasSchedule) {
      classes.push("whale-calendar__day-number--has-schedule");
    }

    if (!isCurrentMonth) {
      if (isSunday) {
        classes.push("whale-calendar__day-number--other-month-sunday");
      } else if (isSaturday) {
        classes.push("whale-calendar__day-number--other-month-saturday");
      } else {
        classes.push("whale-calendar__day-number--other-month");
      }
    } else if (isSunday || holiday) {
      classes.push("whale-calendar__day-number--sunday");
    } else if (isSaturday) {
      classes.push("whale-calendar__day-number--saturday");
    }

    return classes.join(" ");
  };

  const dayClass = [
    "whale-calendar__day",
    isHighlightBg ? "whale-calendar__day--highlight" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={dayClass}>
      <div className="whale-calendar__day-header">
        <div
          className={`whale-calendar__day-number-wrapper ${
            isToday ? "whale-calendar__day-number-wrapper--today" : ""
          }`}
        >
          <div className={getDayNumberClass()}>{day}</div>
        </div>
      </div>
      {hasSchedule && scheduleTime && (
        <div className="whale-calendar__schedule-badge">
          <div className="whale-calendar__schedule-badge-text">
            {scheduleTime}
          </div>
        </div>
      )}
      {holiday && <div className="whale-calendar__holiday">{holiday}</div>}
    </div>
  );
}

export default function Calendar() {
  return (
    <div className="whale-calendar">
      <div className="whale-calendar__nav">
        <button className="whale-calendar__nav-button" aria-label="이전 달">
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
        <div className="whale-calendar__title">12월 스케줄</div>
        <button className="whale-calendar__nav-button" aria-label="다음 달">
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
        {/* Week Header */}
        <div className="whale-calendar__week-header">
          <div className="whale-calendar__weekday">
            <div className="whale-calendar__weekday-text whale-calendar__weekday-text--sunday">
              일
            </div>
          </div>
          <div className="whale-calendar__weekday">
            <div className="whale-calendar__weekday-text">월</div>
          </div>
          <div className="whale-calendar__weekday">
            <div className="whale-calendar__weekday-text">화</div>
          </div>
          <div className="whale-calendar__weekday">
            <div className="whale-calendar__weekday-text">수</div>
          </div>
          <div className="whale-calendar__weekday">
            <div className="whale-calendar__weekday-text">목</div>
          </div>
          <div className="whale-calendar__weekday">
            <div className="whale-calendar__weekday-text">금</div>
          </div>
          <div className="whale-calendar__weekday">
            <div className="whale-calendar__weekday-text whale-calendar__weekday-text--saturday">
              토
            </div>
          </div>
        </div>

        {/* Week 1 */}
        <div className="whale-calendar__week-row">
          <CalendarDay day={26} isCurrentMonth={false} isSunday />
          <CalendarDay day={27} isCurrentMonth={false} />
          <CalendarDay day={28} isCurrentMonth={false} />
          <CalendarDay day={29} isCurrentMonth={false} />
          <CalendarDay day={30} isCurrentMonth={false} />
          <CalendarDay day={31} isCurrentMonth={false} />
          <CalendarDay day={1} isCurrentMonth isSaturday />
        </div>

        {/* Week 2 */}
        <div className="whale-calendar__week-row">
          <CalendarDay day={2} isCurrentMonth isSunday />
          <CalendarDay
            day={3}
            isCurrentMonth
            hasSchedule
            scheduleTime="10:00~11:00"
          />
          <CalendarDay
            day={4}
            isCurrentMonth
            hasSchedule
            scheduleTime="10:00~11:00"
          />
          <CalendarDay
            day={5}
            isCurrentMonth
            isToday
            hasSchedule
            scheduleTime="10:00~11:00"
          />
          <CalendarDay
            day={6}
            isCurrentMonth
            hasSchedule
            scheduleTime="10:00~11:00"
          />
          <CalendarDay
            day={7}
            isCurrentMonth
            isHighlightBg
            hasSchedule
            scheduleTime="10:00~11:00"
          />
          <CalendarDay day={8} isCurrentMonth isSaturday />
        </div>

        {/* Week 3 */}
        <div className="whale-calendar__week-row">
          <CalendarDay day={9} isCurrentMonth isSunday />
          <CalendarDay day={10} isCurrentMonth isToday />
          <CalendarDay day={11} isCurrentMonth />
          <CalendarDay day={12} isCurrentMonth />
          <CalendarDay day={13} isCurrentMonth />
          <CalendarDay day={14} isCurrentMonth />
          <CalendarDay day={15} isCurrentMonth isSaturday />
        </div>

        {/* Week 4 */}
        <div className="whale-calendar__week-row">
          <CalendarDay day={16} isCurrentMonth isSunday />
          <CalendarDay day={17} isCurrentMonth />
          <CalendarDay day={18} isCurrentMonth isToday />
          <CalendarDay day={19} isCurrentMonth />
          <CalendarDay day={20} isCurrentMonth isToday />
          <CalendarDay day={21} isCurrentMonth />
          <CalendarDay day={22} isCurrentMonth isSaturday />
        </div>

        {/* Week 5 */}
        <div className="whale-calendar__week-row">
          <CalendarDay day={23} isCurrentMonth isSunday />
          <CalendarDay day={24} isCurrentMonth />
          <CalendarDay day={25} isCurrentMonth holiday="한글날" />
          <CalendarDay day={26} isCurrentMonth />
          <CalendarDay day={27} isCurrentMonth />
          <CalendarDay day={28} isCurrentMonth isToday />
          <CalendarDay day={29} isCurrentMonth isSaturday />
        </div>

        {/* Week 6 */}
        <div className="whale-calendar__week-row">
          <CalendarDay day={30} isCurrentMonth isSunday />
          <CalendarDay day={31} isCurrentMonth />
          <CalendarDay day={1} isCurrentMonth={false} />
          <CalendarDay day={2} isCurrentMonth={false} />
          <CalendarDay day={3} isCurrentMonth={false} />
          <CalendarDay day={4} isCurrentMonth={false} />
          <CalendarDay day={5} isCurrentMonth={false} isSaturday />
        </div>
      </div>
    </div>
  );
}
