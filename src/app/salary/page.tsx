"use client";

import { useState, useEffect } from "react";
import StatusBar from "@/components/StatusBar";
import TopBar from "@/components/TopBar";
import SelectForm from "@/components/SelectForm";
import UserProfile from "@/components/UserProfile";
import SalaryList from "@/components/SalaryList";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import type { EmployeeDisplay } from "@/app/page";
import { supabase } from "@/lib/supabase";

export default function SalaryPage() {
  const [selectedMonth, setSelectedMonth] = useState("2025년 1월");
  const [employees, setEmployees] = useState<EmployeeDisplay[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      const { data, error } = await supabase
        .from("employees")
        .select("id, name, position, workplace_name")
        .in("name", ["임꺽정", "홍길동", "김철수", "이영희", "박민수"]);

      if (error) {
        console.error("Error fetching employees:", error);
        return;
      }

      if (data) {
        const employeeDisplays: EmployeeDisplay[] = data.map((emp) => ({
          id: emp.id,
          name: emp.name,
          initial: emp.name.charAt(0),
          position: emp.position || "",
          role: emp.workplace_name || "직원",
        }));
        setEmployees(employeeDisplays);
        if (employeeDisplays.length > 0) {
          setCurrentEmployee(employeeDisplays[0]);
        }
      }
      setIsLoading(false);
    }

    fetchEmployees();
  }, []);

  const handleSelectClick = () => {
    // TODO: 월 선택 BottomSheet 열기
  };

  if (isLoading || !currentEmployee) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-white">
      <div className="flex w-full flex-col items-start bg-gradient-to-b from-[#5B5DED] to-[#6F70FA]">
        <StatusBar />
        <TopBar />
        <div className="flex flex-col items-start gap-[18px] self-stretch px-6 pb-6">
          <SelectForm value={selectedMonth} onClick={handleSelectClick} />
          <UserProfile employee={currentEmployee} />
        </div>
      </div>

      <div className="flex flex-col items-start self-stretch">
        <div className="flex flex-col items-center justify-center self-stretch">
          <div className="flex w-full items-center border-b border-[#DDD] px-6 py-3">
            <h2 className="flex-1 text-lg font-semibold leading-[150%] tracking-[-0.45px] text-[#1A1A1A]">
              급여명세서
            </h2>
          </div>
          <div className="flex flex-col items-center gap-4 self-stretch px-6 py-4">
            <div className="flex flex-col items-start self-stretch">
              <SalaryList />
            </div>
            <BackButton />
          </div>
        </div>
        <Footer
          employees={employees}
          currentEmployee={currentEmployee}
          onEmployeeChange={setCurrentEmployee}
        />
      </div>
    </div>
  );
}
