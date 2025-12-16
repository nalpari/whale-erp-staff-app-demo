interface ScheduleItemProps {
  storeName: string;
  timeRange?: string;
  showButtons?: boolean;
  tag?: {
    label: string;
    bgColor: string;
  };
  description?: string;
  descriptionColor?: string;
  divisionColor?: string;
  onCheckInClick?: () => void;
  onCheckOutClick?: () => void;
  isCheckedIn?: boolean;
  isCheckedOut?: boolean;
  isClickable?: boolean;
}

export default function ScheduleItem({
  storeName,
  timeRange,
  showButtons,
  tag,
  description,
  descriptionColor = "#2379E4",
  divisionColor = "#6F70FA",
  onCheckInClick,
  onCheckOutClick,
  isCheckedIn = false,
  isCheckedOut = false,
  isClickable = true,
}: ScheduleItemProps) {
  return (
    <div className="flex items-center gap-1.5 self-stretch border-b border-[#EDEDED] px-6 py-6">
      <div className="flex flex-1 flex-col items-start justify-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: divisionColor }}></div>
          <div className="text-[15px] font-medium leading-[150%] tracking-[-0.375px] text-[#1A1A1A]">
            {storeName}
          </div>
        </div>
        {timeRange && (
          <div className="flex items-center justify-center gap-2.5">
            <div className="text-sm font-normal leading-[150%] tracking-[-0.35px] text-[#1A1A1A]">
              {timeRange}
            </div>
          </div>
        )}
        {tag && description && (
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-start rounded-full px-2 py-0.5" style={{ backgroundColor: tag.bgColor }}>
              <div className="text-xs font-semibold leading-[150%] tracking-[-0.3px] text-white">
                {tag.label}
              </div>
            </div>
            <div className="text-sm font-normal leading-[150%] tracking-[-0.35px]" style={{ color: descriptionColor }}>
              {description}
            </div>
          </div>
        )}
      </div>
      {showButtons && (
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={isClickable && !isCheckedIn ? onCheckInClick : undefined}
            disabled={!isClickable || isCheckedIn}
            className={`flex items-center justify-center rounded-full px-4 py-1.5 ${
              isCheckedIn
                ? "bg-[#6F70FA]"
                : "border border-[#E8E8E8]"
            } ${!isClickable || isCheckedIn ? "cursor-not-allowed" : ""}`}
          >
            <span className={`text-sm leading-[150%] tracking-[-0.35px] ${
              isCheckedIn
                ? "font-semibold text-white"
                : "font-medium text-[#C0C0C0]"
            }`}>출근</span>
          </button>
          <button
            onClick={isClickable && !isCheckedOut ? onCheckOutClick : undefined}
            disabled={!isClickable || isCheckedOut}
            className={`flex items-center justify-center rounded-full px-4 py-1.5 ${
              isCheckedOut
                ? "bg-[#6F70FA]"
                : "border border-[#E8E8E8]"
            } ${!isClickable || isCheckedOut ? "cursor-not-allowed" : ""}`}
          >
            <span className={`text-sm leading-[150%] tracking-[-0.35px] ${
              isCheckedOut
                ? "font-semibold text-white"
                : "font-medium text-[#C0C0C0]"
            }`}>퇴근</span>
          </button>
        </div>
      )}
    </div>
  );
}
