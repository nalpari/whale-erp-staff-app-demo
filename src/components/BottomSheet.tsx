"use client";

import { useEffect } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  onSelect?: (option: string) => void;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  options,
  onSelect,
}: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        if (document.body) {
          document.body.style.overflow = originalOverflow || "unset";
        }
      };
    }
  }, [isOpen]);

  const handleOptionClick = (option: string) => {
    onSelect?.(option);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="animate-slide-in-bottom relative flex w-full flex-col items-center rounded-t-[32px] bg-white pb-6">
        <div className="mt-3 h-1 w-[50px] rounded-full bg-[#D9D9D9]" />

        <div className="flex w-full flex-col items-center">
          <div className="flex w-full items-center self-stretch border-b border-[#EDEDED] px-6 py-4">
            <h2 className="flex-1 text-lg font-semibold leading-[150%] tracking-[-0.45px] text-[#1A1A1A]">
              {title}
            </h2>
          </div>

          <div className="flex w-full flex-col items-start gap-3 px-6 pt-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="w-full text-left text-[15px] font-medium leading-[140%] tracking-[-0.375px] text-[#444] transition-colors hover:text-[#1A1A1A]"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
