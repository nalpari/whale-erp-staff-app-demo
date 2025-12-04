import SalaryListItem from './SalaryListItem';

const salaryData = [
  { period: '2025년 10월 급여', location: '힘이나는커피생활 을지로3가점', date: '2025.11.05' },
  { period: '2025년 09월 급여', location: '힘이나는커피생활 을지로3가점', date: '2025.11.05' },
  { period: '2025년 08월 급여', location: '힘이나는커피생활 을지로3가점', date: '2025.11.05' },
  { period: '2025년 07월 급여', location: '힘이나는커피생활 을지로3가점', date: '2025.11.05' },
  { period: '2025년 06월 급여', location: '힘이나는커피생활 을지로3가점', date: '2025.11.05' },
  { period: '2025년 05월 급여', location: '힘이나는커피생활 을지로3가점', date: '2025.11.05' },
  { period: '2025년 04월 급여', location: '힘이나는커피생활 을지로3가점', date: '2025.11.05' },
  { period: '2025년 03월 급여', location: '힘이나는커피생활 을지로3가점', date: '2025.11.05' },
  { period: '2025년 02월 급여', location: '힘이나는커피생활 을지로3가점', date: '2025.11.05' },
  { period: '2025년 01월 급여', location: '힘이나는커피생활 을지로3가점', date: '2025.11.05' },
];

export default function SalaryList() {
  return (
    <div className="flex flex-col items-start self-stretch">
      {salaryData.map((item, index) => (
        <SalaryListItem key={index} {...item} />
      ))}
    </div>
  );
}
