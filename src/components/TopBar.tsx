interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <div className="flex h-[60px] w-full items-center justify-end gap-2.5 px-6">
      <div className="flex flex-1 items-center justify-center gap-2.5 self-stretch">
        <h1 className="flex-1 text-center text-lg font-bold leading-[150%] tracking-[-0.45px] text-white">
          힘이 나는 커피생활 을지로3가점
        </h1>
      </div>
      <button
        className="flex shrink-0 flex-col items-end gap-1.5 p-[6px_3px]"
        aria-label="메뉴"
        onClick={onMenuClick}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
