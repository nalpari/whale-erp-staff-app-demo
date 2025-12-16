import type { EmployeeDisplay } from "@/app/page";

interface UserProfileProps {
  employee: EmployeeDisplay;
}

export default function UserProfile({ employee }: UserProfileProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#8E8FFA]">
        <span className="text-[17px] font-semibold text-white">{employee.initial}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-[15px] leading-[140%] tracking-[-0.375px] text-white">
          <span className="font-semibold">{employee.name} </span>
          <span className="font-normal">{employee.position}</span>
        </div>
        <div className="h-2.5 w-px"></div>
        <div className="text-[15px] font-normal leading-[140%] tracking-[-0.375px] text-white">
          {employee.role}
        </div>
      </div>
    </div>
  );
}
