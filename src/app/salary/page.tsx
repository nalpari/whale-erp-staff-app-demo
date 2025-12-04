"use client";

import { useState } from "react";
import StatusBar from "@/components/StatusBar";
import TopBar from "@/components/TopBar";
import SelectForm from "@/components/SelectForm";
import UserProfile from "@/components/UserProfile";
import SalaryList from "@/components/SalaryList";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";

export default function SalaryPage() {
  const [selectedMonth, setSelectedMonth] = useState("2025년 1월");

  const handleSelectClick = () => {
    // TODO: 월 선택 BottomSheet 열기
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-white md:mx-auto md:my-10 md:min-h-[812px] md:max-w-[375px] md:overflow-hidden md:rounded-[32px] md:shadow-2xl">
      <div className="flex w-full flex-col items-start bg-gradient-to-b from-[#5B5DED] to-[#6F70FA]">
        <StatusBar />
        <TopBar />
        <div className="flex flex-col items-start gap-[18px] self-stretch px-6 pb-6">
          <SelectForm value={selectedMonth} onClick={handleSelectClick} />
          <UserProfile />
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
        <Footer />
      </div>
    </div>
  );
}
