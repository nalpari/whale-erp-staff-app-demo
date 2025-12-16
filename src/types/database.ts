export interface Employee {
  id: number;
  employee_id: string;
  name: string;
  position: string | null;
  hire_date: string | null;
  phone: string | null;
  email: string | null;
  workplace_name: string | null;
  employment_status: string | null;
}

export interface EmployeeTodo {
  id: number;
  employee_id: number;
  store_id: number | null;
  title: string;
  description: string | null;
  due_date: string | null;
  due_time: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  category: string | null;
  assigned_by: number | null;
  completed_at: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeTodoWithAssigner extends EmployeeTodo {
  assigner?: {
    name: string;
  } | null;
}

export interface ContractWorkSchedule {
  id: number;
  contract_id: number;
  day_type: "WEEKDAY" | "SATURDAY" | "SUNDAY";
  work_start_time: string | null;
  work_end_time: string | null;
  break_start_time: string | null;
  break_end_time: string | null;
  work_days: string | null;
  frequency: "EVERY_WEEK" | "EVERY_OTHER_WEEK" | null;
}

export interface EmploymentContract {
  id: number;
  employee_id: number;
  contract_status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  contract_work_schedules: ContractWorkSchedule[];
}

export interface AttendanceSession {
  id: number;
  attendance_record_id: number;
  session_number: number;
  clock_in_time: string | null;
  clock_out_time: string | null;
  work_minutes: number;
  clock_in_method: string | null;
  clock_out_method: string | null;
}

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  store_id: number | null;
  work_date: string;
  attendance_status: string | null;
  is_absent: boolean;
  total_work_minutes: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  attendance_sessions: AttendanceSession[];
}
