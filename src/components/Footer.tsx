import type { EmployeeDisplay } from "@/app/page";

interface FooterProps {
  employees: EmployeeDisplay[];
  currentEmployee: EmployeeDisplay;
  onEmployeeChange: (employee: EmployeeDisplay) => void;
}

export default function Footer({ employees, currentEmployee, onEmployeeChange }: FooterProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4 px-6 pb-[34px] pt-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#777]">로그인:</span>
        {employees.map((employee) => (
          <button
            key={employee.id}
            onClick={() => onEmployeeChange(employee)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              currentEmployee.id === employee.id
                ? "bg-[#5B5DED] text-white"
                : "bg-[#F0F0F0] text-[#555] hover:bg-[#E0E0E0]"
            }`}
          >
            {employee.name}
          </button>
        ))}
      </div>
      <div className="text-center text-sm font-normal leading-[140%] tracking-[-0.35px] text-[#777]">
        Copyrights© 2025 따름인 All Rights Reserved.
      </div>
    </div>
  );
}
