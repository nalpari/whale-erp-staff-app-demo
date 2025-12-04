"use client";

interface SelectFormProps {
  value: string;
  onClick: () => void;
}

export default function SelectForm({ value, onClick }: SelectFormProps) {
  return (
    <button 
      onClick={onClick}
      className="flex h-12 w-full items-center self-stretch rounded-md bg-white px-4 transition-opacity hover:opacity-90"
    >
      <span className="flex-1 overflow-hidden text-ellipsis text-left text-[15px] font-normal leading-[140%] tracking-[-0.375px] text-[#1A1A1A]">
        {value}
      </span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 9L12 16L5 9" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
