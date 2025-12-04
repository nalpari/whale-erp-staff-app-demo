"use client";

import { useState } from "react";
import StatusBar from "@/components/StatusBar";
import TopBar from "@/components/TopBar";
import SelectForm from "@/components/SelectForm";
import UserProfile from "@/components/UserProfile";
import Calendar from "@/components/Calendar";
import ScheduleItem from "@/components/ScheduleItem";
import Footer from "@/components/Footer";
import BottomSheet from "@/components/BottomSheet";
import SideMenu from "@/components/SideMenu";

const storeOptions = [
  "힘이나는커피생활 을지로3가점",
  "메가커피 종로점",
  "바나프레소무교점"
];

export default function Home() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(storeOptions[0]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-start bg-white md:mx-auto md:my-10 md:min-h-[812px] md:max-w-[375px] md:overflow-hidden md:rounded-[32px] md:shadow-2xl">
      <div className="flex w-full flex-col items-start bg-gradient-to-b from-[#5B5DED] to-[#6F70FA]">
        <StatusBar />
        <TopBar onMenuClick={() => setIsSideMenuOpen(true)} />
        <div className="flex flex-col items-start gap-[18px] self-stretch px-6 pb-6">
          <SelectForm
            value={selectedStore}
            onClick={() => setIsBottomSheetOpen(true)}
          />
          <UserProfile />
        </div>
      </div>

      <div className="flex flex-col items-start self-stretch">
        <Calendar />

        <div className="flex flex-col items-center justify-center self-stretch">
          <div className="flex h-[63px] w-full items-center border-b border-[#DDD] px-6">
            <h2 className="text-lg font-semibold leading-[150%] tracking-[-0.45px] text-[#1A1A1A]">
              12월 7일 금요일
            </h2>
          </div>

          <div className="flex flex-col items-start gap-2.5 self-stretch">
            <ScheduleItem 
              storeName="힘이나는커피생활"
              timeRange="10:00-18:00"
              showButtons
              divisionColor="#6F70FA"
            />

            <ScheduleItem 
              storeName="힘이나는커피생활"
              tag={{ label: "TO-DO", bgColor: "#6F70FA" }}
              description="머신 청소 확인(홍길동 님과 함께)"
              descriptionColor="#2379E4"
              divisionColor="#90C96E"
            />

            <ScheduleItem 
              storeName="바나프레소"
              tag={{ label: "공휴일", bgColor: "#F34A5A" }}
              description="한글날"
              descriptionColor="#F34A5A"
              divisionColor="#E8C368"
            />
          </div>
        </div>

        <Footer />
      </div>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="점포선택"
        options={storeOptions}
        onSelect={setSelectedStore}
      />

      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
      />
    </div>
  );
}
