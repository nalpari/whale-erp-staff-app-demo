export default function UserProfile() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#8E8FFA]">
        <span className="text-[17px] font-semibold text-white">임</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-[15px] leading-[140%] tracking-[-0.375px] text-white">
          <span className="font-semibold">임꺽정 </span>
          <span className="font-normal">과장</span>
        </div>
        <div className="h-2.5 w-px"></div>
        <div className="text-[15px] font-normal leading-[140%] tracking-[-0.375px] text-white">
          매장 매니저
        </div>
      </div>
    </div>
  );
}
