"use client";

import { X } from "lucide-react";

type ActionType = "checkIn" | "checkOut";

interface QRScanPopupProps {
  isOpen: boolean;
  activeAction?: ActionType;
  onClose: () => void;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
}

export default function QRScanPopup({
  isOpen,
  activeAction = "checkIn",
  onClose,
  onCheckIn,
  onCheckOut,
}: QRScanPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div className="relative flex flex-col items-center gap-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <X className="h-5 w-5 text-[#444]" />
        </button>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-6 rounded-[32px] bg-white px-6 py-8">
          {/* Title */}
          <h2 className="text-base font-bold leading-[150%] tracking-[-0.4px] text-[#1A1A1A]">
            카메라로 QR코드를 촬영하세요
          </h2>

          {/* QR Scan Area */}
          <div className="relative flex h-[175px] w-[227px] items-center justify-center rounded-[32px] bg-[#101010]">
            {/* Corner Frame Lines */}
            {/* Top Left */}
            <div className="absolute left-4 top-4">
              <div className="absolute h-[3px] w-8 rounded-full bg-white" />
              <div className="absolute h-8 w-[3px] rounded-full bg-white" />
            </div>
            {/* Top Right */}
            <div className="absolute right-4 top-4">
              <div className="absolute right-0 h-[3px] w-8 rounded-full bg-white" />
              <div className="absolute right-0 h-8 w-[3px] rounded-full bg-white" />
            </div>
            {/* Bottom Left */}
            <div className="absolute bottom-4 left-4">
              <div className="absolute bottom-0 h-[3px] w-8 rounded-full bg-white" />
              <div className="absolute bottom-0 h-8 w-[3px] rounded-full bg-white" />
            </div>
            {/* Bottom Right */}
            <div className="absolute bottom-4 right-4">
              <div className="absolute bottom-0 right-0 h-[3px] w-8 rounded-full bg-white" />
              <div className="absolute bottom-0 right-0 h-8 w-[3px] rounded-full bg-white" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCheckIn}
              className={`flex h-[38px] w-[110px] items-center justify-center rounded-md ${
                activeAction === "checkIn"
                  ? "bg-[#6F70FA]"
                  : "border border-[#E8E8E8]"
              }`}
            >
              <span
                className={`text-sm leading-[150%] tracking-[-0.35px] ${
                  activeAction === "checkIn"
                    ? "font-semibold text-white"
                    : "font-medium text-[#C0C0C0]"
                }`}
              >
                출근하기
              </span>
            </button>
            <button
              onClick={onCheckOut}
              className={`flex h-[38px] w-[110px] items-center justify-center rounded-md ${
                activeAction === "checkOut"
                  ? "bg-[#6F70FA]"
                  : "border border-[#E8E8E8]"
              }`}
            >
              <span
                className={`text-sm leading-[150%] tracking-[-0.35px] ${
                  activeAction === "checkOut"
                    ? "font-semibold text-white"
                    : "font-medium text-[#C0C0C0]"
                }`}
              >
                퇴근하기
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
