"use client";

import { useState, useEffect, useMemo } from "react";
import StatusBar from "@/components/StatusBar";
import TopBar from "@/components/TopBar";
import SelectForm from "@/components/SelectForm";
import UserProfile from "@/components/UserProfile";
import { WhaleCalendar, CalendarData } from "whale-calendar";
import "whale-calendar/styles.css";
import ScheduleItem from "@/components/ScheduleItem";
import Footer from "@/components/Footer";
import BottomSheet from "@/components/BottomSheet";
import SideMenu from "@/components/SideMenu";
import QRScanPopup from "@/components/QRScanPopup";
import { supabase } from "@/lib/supabase";
import type { EmployeeTodo, ContractWorkSchedule, AttendanceRecord } from "@/types/database";

export interface EmployeeDisplay {
  id: number;
  name: string;
  initial: string;
  position: string;
  role: string;
}

const storeOptions = [
  "힘이나는커피생활 을지로3가점",
  "메가커피 종로점",
  "바나프레소무교점"
];

const holidays: Record<string, string> = {
  "2025-12-25": "크리스마스",
};

function formatTime(time: string | null): string {
  if (!time) return "";
  return time.slice(0, 5);
}

function generateCalendarDataFromContract(
  schedules: ContractWorkSchedule[],
  year: number,
  month: number
): CalendarData {
  const data: CalendarData = {};
  if (!Array.isArray(schedules)) return data;
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // 공휴일 확인
    if (holidays[dateStr]) {
      data[dateStr] = { holiday: holidays[dateStr] };
      continue;
    }

    // 해당 요일에 맞는 스케줄 찾기
    let schedule: ContractWorkSchedule | undefined;

    if (dayOfWeek === 0) {
      // 일요일
      schedule = schedules.find(s => s.day_type === "SUNDAY");
    } else if (dayOfWeek === 6) {
      // 토요일
      schedule = schedules.find(s => s.day_type === "SATURDAY");
    } else {
      // 평일
      const weekdaySchedule = schedules.find(s => s.day_type === "WEEKDAY");
      if (weekdaySchedule?.work_days) {
        const workDays = weekdaySchedule.work_days.split(",").map(d => d.trim());
        const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
        const currentDayName = dayNames[dayOfWeek];
        if (workDays.includes(currentDayName)) {
          schedule = weekdaySchedule;
        }
      } else if (weekdaySchedule) {
        schedule = weekdaySchedule;
      }
    }

    if (schedule?.work_start_time && schedule?.work_end_time) {
      const startTime = formatTime(schedule.work_start_time);
      const endTime = formatTime(schedule.work_end_time);
      data[dateStr] = {
        schedules: [{ id: dateStr, label: `${startTime}\n${endTime}` }]
      };
    }
  }

  return data;
}

function formatDateKorean(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const dayName = dayNames[date.getDay()];
  return `${month}월 ${day}일 ${dayName}`;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "URGENT": return "#F34A5A";
    case "HIGH": return "#FF8C42";
    case "MEDIUM": return "#6F70FA";
    case "LOW": return "#90C96E";
    default: return "#6F70FA";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "PENDING": return "대기";
    case "IN_PROGRESS": return "진행중";
    case "COMPLETED": return "완료";
    case "CANCELLED": return "취소";
    default: return status;
  }
}

export default function Home() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isQRScanOpen, setIsQRScanOpen] = useState(false);
  const [qrActiveAction, setQRActiveAction] = useState<"checkIn" | "checkOut">("checkIn");
  const [selectedStore, setSelectedStore] = useState(storeOptions[0]);

  const [employees, setEmployees] = useState<EmployeeDisplay[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeDisplay | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  });
  const [currentYear] = useState(() => new Date().getFullYear());
  const [currentMonth] = useState(() => new Date().getMonth() + 1);
  const [todos, setTodos] = useState<EmployeeTodo[]>([]);
  const [contractSchedules, setContractSchedules] = useState<ContractWorkSchedule[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 계약 근무 시간을 기반으로 캘린더 데이터 생성
  const scheduleData = useMemo<CalendarData>(() => {
    // 계약 정보를 기반으로 캘린더 데이터 생성
    const baseData = generateCalendarDataFromContract(contractSchedules, currentYear, currentMonth);

    // 선택된 날짜에 highlight 추가
    if (baseData[selectedDate]) {
      baseData[selectedDate] = { ...baseData[selectedDate], highlight: true };
    } else {
      baseData[selectedDate] = { highlight: true };
    }

    return baseData;
  }, [selectedDate, contractSchedules, currentYear, currentMonth]);

  // 직원 데이터 가져오기
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

  // 계약 근무 시간 데이터 가져오기
  useEffect(() => {
    async function fetchContractSchedules() {
      if (!currentEmployee) {
        setContractSchedules([]);
        return;
      }

      const { data, error } = await supabase
        .from("employment_contracts")
        .select(`
          id,
          employee_id,
          contract_status,
          contract_work_schedules (
            id,
            contract_id,
            day_type,
            work_start_time,
            work_end_time,
            break_start_time,
            break_end_time,
            work_days,
            frequency
          )
        `)
        .eq("employee_id", currentEmployee.id)
        .eq("is_deleted", false)
        .in("contract_status", ["COMPLETED", "IN_PROGRESS"])
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code !== "PGRST116") {
          console.error("Error fetching contract schedules:", error);
        }
        setContractSchedules([]);
        return;
      }

      if (data?.contract_work_schedules) {
        // 배열인지 확인하고 처리
        const schedules = Array.isArray(data.contract_work_schedules)
          ? data.contract_work_schedules
          : [data.contract_work_schedules];
        setContractSchedules(schedules as ContractWorkSchedule[]);
      } else {
        setContractSchedules([]);
      }
    }

    fetchContractSchedules();
  }, [currentEmployee]);

  // TODO 데이터 가져오기
  useEffect(() => {
    async function fetchTodos() {
      if (!currentEmployee) return;

      const { data, error } = await supabase
        .from("employee_todos")
        .select("*")
        .eq("employee_id", currentEmployee.id)
        .eq("due_date", selectedDate)
        .eq("is_deleted", false)
        .order("priority", { ascending: false })
        .order("due_time", { ascending: true });

      if (error) {
        console.error("Error fetching todos:", error);
        return;
      }

      setTodos(data || []);
    }

    fetchTodos();
  }, [currentEmployee, selectedDate]);

  // 출퇴근 데이터 가져오기 (attendance_sessions 조인)
  useEffect(() => {
    async function fetchAttendance() {
      if (!currentEmployee) {
        setAttendance(null);
        return;
      }

      const { data, error } = await supabase
        .from("attendance_records")
        .select(`
          *,
          attendance_sessions (
            id,
            attendance_record_id,
            session_number,
            clock_in_time,
            clock_out_time,
            work_minutes,
            clock_in_method,
            clock_out_method
          )
        `)
        .eq("employee_id", currentEmployee.id)
        .eq("work_date", selectedDate)
        .eq("is_deleted", false)
        .single();

      if (error) {
        if (error.code !== "PGRST116") { // PGRST116 = no rows returned
          console.error("Error fetching attendance:", error);
        }
        setAttendance(null);
        return;
      }

      // attendance_sessions가 배열인지 확인하고 처리
      if (data) {
        const normalizedData = {
          ...data,
          attendance_sessions: Array.isArray(data.attendance_sessions)
            ? data.attendance_sessions
            : data.attendance_sessions
            ? [data.attendance_sessions]
            : [],
        };
        setAttendance(normalizedData as AttendanceRecord);
      } else {
        setAttendance(null);
      }
    }

    fetchAttendance();
  }, [currentEmployee, selectedDate]);

  const handleDayClick = (date: Date) => {
    // 로컬 시간 기준으로 YYYY-MM-DD 포맷 생성 (toISOString은 UTC 기준이라 하루 차이 발생)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    setSelectedDate(dateStr);
  };

  // 선택된 날짜의 근무 시간 가져오기
  const selectedDateSchedule = useMemo(() => {
    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay();

    let schedule: ContractWorkSchedule | undefined;

    if (dayOfWeek === 0) {
      schedule = contractSchedules.find(s => s.day_type === "SUNDAY");
    } else if (dayOfWeek === 6) {
      schedule = contractSchedules.find(s => s.day_type === "SATURDAY");
    } else {
      const weekdaySchedule = contractSchedules.find(s => s.day_type === "WEEKDAY");
      if (weekdaySchedule?.work_days) {
        const workDays = weekdaySchedule.work_days.split(",").map(d => d.trim());
        const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
        const currentDayName = dayNames[dayOfWeek];
        if (workDays.includes(currentDayName)) {
          schedule = weekdaySchedule;
        }
      } else if (weekdaySchedule) {
        schedule = weekdaySchedule;
      }
    }

    if (schedule?.work_start_time && schedule?.work_end_time) {
      return {
        timeRange: `${formatTime(schedule.work_start_time)}-${formatTime(schedule.work_end_time)}`,
        hasSchedule: true
      };
    }

    return { timeRange: "", hasSchedule: false };
  }, [selectedDate, contractSchedules]);

  // 출퇴근 버튼 상태 계산 (첫 번째 세션 기준)
  const attendanceButtonState = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const isToday = selectedDate === todayStr;
    
    // attendance_sessions가 배열인지 확인
    const sessions = attendance?.attendance_sessions;
    const sessionsArray = Array.isArray(sessions) ? sessions : sessions ? [sessions] : [];
    const firstSession = sessionsArray[0];
    
    const isCheckedIn = !!firstSession?.clock_in_time;
    const isCheckedOut = !!firstSession?.clock_out_time;

    // 클릭 가능 여부: 오늘이고, 해당 동작이 아직 안된 경우만
    const isClickable = isToday;

    return {
      isCheckedIn,
      isCheckedOut,
      isClickable,
    };
  }, [selectedDate, attendance]);

  // 출근 처리 핸들러
  const handleCheckIn = async () => {
    if (!currentEmployee) return;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const currentTime = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}:${String(today.getSeconds()).padStart(2, "0")}`;

    try {
      // 1. 오늘 날짜의 attendance_record 확인
      let recordId: number;
      const { data: existingRecord } = await supabase
        .from("attendance_records")
        .select("id")
        .eq("employee_id", currentEmployee.id)
        .eq("work_date", todayStr)
        .eq("is_deleted", false)
        .single();

      if (existingRecord) {
        recordId = existingRecord.id;
      } else {
        // 2. attendance_record 생성
        const { data: newRecord, error: recordError } = await supabase
          .from("attendance_records")
          .insert({
            employee_id: currentEmployee.id,
            work_date: todayStr,
            attendance_status: "PRESENT",
            is_absent: false,
            total_work_minutes: 0,
            is_deleted: false,
          })
          .select("id")
          .single();

        if (recordError || !newRecord) {
          console.error("Error creating attendance record:", recordError);
          alert("출근 기록 생성에 실패했습니다.");
          return;
        }
        recordId = newRecord.id;
      }

      // 3. attendance_session 생성
      const { error: sessionError } = await supabase
        .from("attendance_sessions")
        .insert({
          attendance_record_id: recordId,
          session_number: 1,
          clock_in_time: currentTime,
          clock_in_method: "QR",
          work_minutes: 0,
        });

      if (sessionError) {
        console.error("Error creating attendance session:", sessionError);
        alert("출근 세션 생성에 실패했습니다.");
        return;
      }

      // 4. 출퇴근 데이터 새로고침
      const { data: updatedData } = await supabase
        .from("attendance_records")
        .select(`
          *,
          attendance_sessions (
            id, attendance_record_id, session_number,
            clock_in_time, clock_out_time, work_minutes,
            clock_in_method, clock_out_method
          )
        `)
        .eq("employee_id", currentEmployee.id)
        .eq("work_date", todayStr)
        .eq("is_deleted", false)
        .single();

      if (updatedData) {
        // attendance_sessions가 배열인지 확인하고 처리
        const normalizedData = {
          ...updatedData,
          attendance_sessions: Array.isArray(updatedData.attendance_sessions)
            ? updatedData.attendance_sessions
            : updatedData.attendance_sessions
            ? [updatedData.attendance_sessions]
            : [],
        };
        setAttendance(normalizedData as AttendanceRecord);
      }

      setIsQRScanOpen(false);
      alert("출근 처리되었습니다.");
    } catch (error) {
      console.error("Check-in error:", error);
      alert("출근 처리 중 오류가 발생했습니다.");
    }
  };

  // TODO 상태 토글 핸들러
  const handleToggleTodo = async (todoId: number, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";

    const { error } = await supabase
      .from("employee_todos")
      .update({ status: newStatus })
      .eq("id", todoId);

    if (error) {
      console.error("Error updating todo:", error);
      alert("TODO 상태 변경에 실패했습니다.");
      return;
    }

    // 로컬 상태 업데이트
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, status: newStatus } : todo
      )
    );
  };

  // 퇴근 처리 핸들러
  const handleCheckOut = async () => {
    if (!currentEmployee || !attendance) return;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const currentTime = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}:${String(today.getSeconds()).padStart(2, "0")}`;

    try {
      // 1. 퇴근하지 않은 세션 찾기
      const sessions = attendance.attendance_sessions;
      const sessionsArray = Array.isArray(sessions) ? sessions : sessions ? [sessions] : [];
      const session = sessionsArray.find(s => !s.clock_out_time);
      if (!session) {
        alert("출근 기록이 없거나 이미 퇴근 처리되었습니다.");
        return;
      }

      // 2. 근무 시간 계산 (분 단위)
      const clockInParts = session.clock_in_time!.split(":");
      const clockInMinutes = parseInt(clockInParts[0]) * 60 + parseInt(clockInParts[1]);
      const currentParts = currentTime.split(":");
      const currentMinutes = parseInt(currentParts[0]) * 60 + parseInt(currentParts[1]);
      const workMinutes = currentMinutes - clockInMinutes;

      // 3. attendance_session 업데이트
      const { error: sessionError } = await supabase
        .from("attendance_sessions")
        .update({
          clock_out_time: currentTime,
          clock_out_method: "QR",
          work_minutes: workMinutes > 0 ? workMinutes : 0,
        })
        .eq("id", session.id);

      if (sessionError) {
        console.error("Error updating attendance session:", sessionError);
        alert("퇴근 처리에 실패했습니다.");
        return;
      }

      // 4. attendance_record의 total_work_minutes 업데이트
      await supabase
        .from("attendance_records")
        .update({
          total_work_minutes: workMinutes > 0 ? workMinutes : 0,
        })
        .eq("id", attendance.id);

      // 5. 출퇴근 데이터 새로고침
      const { data: updatedData } = await supabase
        .from("attendance_records")
        .select(`
          *,
          attendance_sessions (
            id, attendance_record_id, session_number,
            clock_in_time, clock_out_time, work_minutes,
            clock_in_method, clock_out_method
          )
        `)
        .eq("employee_id", currentEmployee.id)
        .eq("work_date", todayStr)
        .eq("is_deleted", false)
        .single();

      if (updatedData) {
        // attendance_sessions가 배열인지 확인하고 처리
        const normalizedData = {
          ...updatedData,
          attendance_sessions: Array.isArray(updatedData.attendance_sessions)
            ? updatedData.attendance_sessions
            : updatedData.attendance_sessions
            ? [updatedData.attendance_sessions]
            : [],
        };
        setAttendance(normalizedData as AttendanceRecord);
      }

      setIsQRScanOpen(false);
      alert("퇴근 처리되었습니다.");
    } catch (error) {
      console.error("Check-out error:", error);
      alert("퇴근 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-start bg-white">
      {isLoading || !currentEmployee ? (
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="text-lg text-gray-500">로딩 중...</div>
        </div>
      ) : (
        <>
          <div className="flex w-full flex-col items-start bg-gradient-to-b from-[#5B5DED] to-[#6F70FA]">
            <StatusBar />
            <TopBar onMenuClick={() => setIsSideMenuOpen(true)} />
            <div className="flex flex-col items-start gap-[18px] self-stretch px-6 pb-6">
              <SelectForm
                value={selectedStore}
                onClick={() => setIsBottomSheetOpen(true)}
              />
              <UserProfile employee={currentEmployee} />
            </div>
          </div>

      <div className="flex flex-col items-start self-stretch">
        <WhaleCalendar
          year={currentYear}
          month={currentMonth}
          data={scheduleData}
          onDayClick={handleDayClick}
        />

        <div className="flex flex-col items-center justify-center self-stretch">
          <div className="flex h-[63px] w-full items-center border-b border-[#DDD] px-6">
            <h2 className="text-lg font-semibold leading-[150%] tracking-[-0.45px] text-[#1A1A1A]">
              {formatDateKorean(selectedDate)}
            </h2>
          </div>

          <div className="flex flex-col items-start gap-2.5 self-stretch">
            {selectedDateSchedule.hasSchedule && (
              <ScheduleItem
                storeName="힘이나는커피생활"
                timeRange={selectedDateSchedule.timeRange}
                showButtons
                divisionColor="#6F70FA"
                isCheckedIn={attendanceButtonState.isCheckedIn}
                isCheckedOut={attendanceButtonState.isCheckedOut}
                isClickable={attendanceButtonState.isClickable}
                onCheckInClick={() => {
                  setQRActiveAction("checkIn");
                  setIsQRScanOpen(true);
                }}
                onCheckOutClick={() => {
                  setQRActiveAction("checkOut");
                  setIsQRScanOpen(true);
                }}
              />
            )}

            {todos.length > 0 ? (
              todos.map((todo) => (
                <ScheduleItem
                  key={todo.id}
                  storeName={todo.category || "TODO"}
                  tag={{
                    label: todo.status === "COMPLETED" ? "완료" : "TO-DO",
                    bgColor: todo.status === "COMPLETED" ? "#90C96E" : "#6F70FA"
                  }}
                  description={`${todo.title}${todo.due_time ? ` (${todo.due_time.slice(0, 5)})` : ""}`}
                  descriptionColor={todo.status === "COMPLETED" ? "#90C96E" : "#2379E4"}
                  divisionColor={getPriorityColor(todo.priority)}
                  onDescriptionClick={() => handleToggleTodo(todo.id, todo.status)}
                />
              ))
            ) : (
              <div className="flex w-full items-center justify-center py-8 text-sm text-gray-400">
                {selectedDate}에 등록된 TODO가 없습니다.
              </div>
            )}
          </div>
        </div>

        <Footer
          employees={employees}
          currentEmployee={currentEmployee}
          onEmployeeChange={setCurrentEmployee}
        />
      </div>

      {isBottomSheetOpen && (
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          title="점포선택"
          options={storeOptions}
          onSelect={setSelectedStore}
        />
      )}

      {isSideMenuOpen && (
        <SideMenu
          isOpen={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
          employee={currentEmployee}
        />
      )}

      {isQRScanOpen && (
        <QRScanPopup
          isOpen={isQRScanOpen}
          activeAction={qrActiveAction}
          onClose={() => setIsQRScanOpen(false)}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />
      )}
        </>
      )}
    </div>
  );
}
