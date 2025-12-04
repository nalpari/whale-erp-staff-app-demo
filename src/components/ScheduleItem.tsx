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
}

export default function ScheduleItem({ 
  storeName, 
  timeRange, 
  showButtons,
  tag,
  description,
  descriptionColor = "#2379E4",
  divisionColor = "#6F70FA"
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
        <div className="flex h-[34px] w-[108px] items-center gap-1">
          <button className="flex items-center justify-center gap-2.5 rounded-full bg-[#6F70FA] px-4 py-1.5">
            <div className="text-sm font-semibold leading-[150%] tracking-[-0.35px] text-white">출근</div>
          </button>
          <button className="flex items-center justify-center gap-2.5 rounded-full border border-[#E8E8E8] px-4 py-1.5">
            <div className="text-sm font-medium leading-[150%] tracking-[-0.35px] text-[#C0C0C0]">퇴근</div>
          </button>
        </div>
      )}
    </div>
  );
}
