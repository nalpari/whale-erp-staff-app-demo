interface SalaryListItemProps {
  period: string;
  location: string;
  date: string;
}

export default function SalaryListItem({
  period,
  location,
  date,
}: SalaryListItemProps) {
  return (
    <div className="flex flex-col items-start gap-2.5 self-stretch border-b border-[#EDEDED] py-4">
      <div className="flex flex-col items-start justify-center gap-3.5 self-stretch">
        <div className="self-stretch text-[15px] font-normal leading-[150%] tracking-[-0.375px] text-[#777]">
          {period}
        </div>
        <div className="flex items-center gap-3 self-stretch">
          <div className="flex-1 text-[15px] font-medium leading-[150%] tracking-[-0.375px] text-[#1A1A1A]">
            {location}
          </div>
          <div className="text-[15px] font-normal leading-[150%] tracking-[-0.375px] text-[#777]">
            {date}
          </div>
        </div>
      </div>
    </div>
  );
}
