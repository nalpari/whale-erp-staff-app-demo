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
  let textColor = "#666";
  if (!isCurrentMonth) {
    textColor = isSunday ? "#EBC1C5" : isSaturday ? "#BDD8FA" : "#CCC";
  } else if (isSunday || holiday) {
    textColor = "#C93B48";
  } else if (isSaturday) {
    textColor = "#5A9AEA";
  }

  return (
    <div
      className={`flex min-h-[54px] flex-1 flex-col items-end gap-2.5 border-b border-[#EDEDED] border-r p-[0_4px_4px_4px] ${
        isHighlightBg ? "bg-[#F2F8D4]" : "bg-white"
      } ${isSaturday ? "border-r-0" : ""}`}
    >
      <div className="flex items-center justify-end">
        <div
          className={`flex aspect-square h-[18px] w-[18px] flex-col items-center justify-center rounded-full ${
            isToday ? "bg-[#6F70FA]" : ""
          }`}
        >
          <div
            className={`w-[14px] text-right text-[11px] font-${
              isToday || hasSchedule ? "600" : "500"
            } leading-normal tracking-[-0.275px]`}
            style={{ color: isToday ? "#FFF" : textColor }}
          >
            {day}
          </div>
        </div>
      </div>
      {hasSchedule && scheduleTime && (
        <div className="flex items-center justify-center self-stretch rounded-[3px] bg-[#6F70FA] px-1 py-0.5">
          <div className="text-center text-[8px] font-semibold leading-normal tracking-[-0.52px] text-white">
            {scheduleTime}
          </div>
        </div>
      )}
      {holiday && (
        <div className="text-right text-[10px] font-medium leading-normal tracking-[-0.25px] text-[#C93B48]">
          {holiday}
        </div>
      )}
    </div>
  );
}

export default function Calendar() {
  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex items-center justify-center gap-4 self-stretch px-6 py-4">
        <button
          className="flex aspect-square h-8 w-8 items-center justify-center rounded-full border border-[#E2E2E2] bg-white"
          aria-label="이전 달"
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
        <div className="text-center text-base font-medium leading-[150%] tracking-[-0.4px] text-[#1A1A1A]">
          12월 스케줄
        </div>
        <button
          className="flex aspect-square h-8 w-8 items-center justify-center rounded-full border border-[#E2E2E2] bg-white"
          aria-label="다음 달"
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

      <div className="flex flex-col items-start self-stretch">
        {/* Week Header */}
        <div className="flex h-[34px] items-start self-stretch">
          <div className="flex h-[34px] flex-1 flex-col items-center justify-center border-r border-t border-[#EDEDED]">
            <div className="self-stretch text-center text-[11px] font-medium leading-normal tracking-[-0.275px] text-[#C93B48]">
              일
            </div>
          </div>
          <div className="flex h-[34px] flex-1 flex-col items-center justify-center border-r border-t border-[#EDEDED]">
            <div className="self-stretch text-center text-[11px] font-medium leading-normal tracking-[-0.275px] text-[#666]">
              월
            </div>
          </div>
          <div className="flex h-[34px] flex-1 flex-col items-center justify-center border-r border-t border-[#EDEDED]">
            <div className="self-stretch text-center text-[11px] font-medium leading-normal tracking-[-0.275px] text-[#666]">
              화
            </div>
          </div>
          <div className="flex h-[34px] flex-1 flex-col items-center justify-center border-r border-t border-[#EDEDED]">
            <div className="self-stretch text-center text-[11px] font-medium leading-normal tracking-[-0.275px] text-[#666]">
              수
            </div>
          </div>
          <div className="flex h-[34px] flex-1 flex-col items-center justify-center border-r border-t border-[#EDEDED]">
            <div className="self-stretch text-center text-[11px] font-medium leading-normal tracking-[-0.275px] text-[#666]">
              목
            </div>
          </div>
          <div className="flex h-[34px] flex-1 flex-col items-center justify-center border-r border-t border-[#EDEDED]">
            <div className="self-stretch text-center text-[11px] font-medium leading-normal tracking-[-0.275px] text-[#666]">
              금
            </div>
          </div>
          <div className="flex h-[34px] flex-1 flex-col items-center justify-center border-t border-[#EDEDED]">
            <div className="self-stretch text-center text-[11px] font-medium leading-normal tracking-[-0.275px] text-[#5A9AEA]">
              토
            </div>
          </div>
        </div>

        {/* Week 1 */}
        <div className="flex items-start self-stretch">
          <CalendarDay day={26} isCurrentMonth={false} isSunday />
          <CalendarDay day={27} isCurrentMonth={false} />
          <CalendarDay day={28} isCurrentMonth={false} />
          <CalendarDay day={29} isCurrentMonth={false} />
          <CalendarDay day={30} isCurrentMonth={false} />
          <CalendarDay day={31} isCurrentMonth={false} />
          <CalendarDay day={1} isCurrentMonth isSaturday />
        </div>

        {/* Week 2 */}
        <div className="flex items-start self-stretch">
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
        <div className="flex items-start self-stretch">
          <CalendarDay day={9} isCurrentMonth isSunday />
          <CalendarDay day={10} isCurrentMonth isToday />
          <CalendarDay day={11} isCurrentMonth />
          <CalendarDay day={12} isCurrentMonth />
          <CalendarDay day={13} isCurrentMonth />
          <CalendarDay day={14} isCurrentMonth />
          <CalendarDay day={15} isCurrentMonth isSaturday />
        </div>

        {/* Week 4 */}
        <div className="flex items-start self-stretch">
          <CalendarDay day={16} isCurrentMonth isSunday />
          <CalendarDay day={17} isCurrentMonth />
          <CalendarDay day={18} isCurrentMonth isToday />
          <CalendarDay day={19} isCurrentMonth />
          <CalendarDay day={20} isCurrentMonth isToday />
          <CalendarDay day={21} isCurrentMonth />
          <CalendarDay day={22} isCurrentMonth isSaturday />
        </div>

        {/* Week 5 */}
        <div className="flex items-start self-stretch">
          <CalendarDay day={23} isCurrentMonth isSunday />
          <CalendarDay day={24} isCurrentMonth />
          <CalendarDay day={25} isCurrentMonth holiday="한글날" />
          <CalendarDay day={26} isCurrentMonth />
          <CalendarDay day={27} isCurrentMonth />
          <CalendarDay day={28} isCurrentMonth isToday />
          <CalendarDay day={29} isCurrentMonth isSaturday />
        </div>

        {/* Week 6 */}
        <div className="flex items-start self-stretch">
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
