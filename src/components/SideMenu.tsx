"use client";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  if (!isOpen) return null;

  const menuItems = [
    { label: "회원 정보 수정", href: "#" },
    { label: "비밀번호 변경", href: "#" },
    { label: "근무 시간 조회 및 출퇴근 체크", href: "#" },
    { label: "근로계약서", href: "#" },
    { label: "급여명세서", href: "/salary" },
    { label: "TO-DO LIST", href: "#" },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 flex w-[310px] flex-col gap-8 rounded-l-2xl bg-white p-6 animate-slide-in-right shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#8E8FFA]">
              <span className="text-[17px] font-semibold text-white">임</span>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="text-[15px] font-normal leading-6 tracking-[-0.15px] text-[#1A1A1A]">
                <span className="font-semibold">임꺽정</span>님 환영 합니다.
              </div>
              <div className="text-xs font-medium leading-3 tracking-[-0.12px] text-[#777]">
                Interplug corp.
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center"
            aria-label="닫기"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.70708 5.29289C6.31655 4.90237 5.68339 4.90237 5.29286 5.29289C4.90234 5.68342 4.90234 6.31658 5.29286 6.70711L10.5857 12L5.29277 17.2929C4.90225 17.6834 4.90225 18.3166 5.29277 18.7071C5.6833 19.0976 6.31646 19.0976 6.70698 18.7071L11.9999 13.4142L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4141 12L18.707 6.70711C19.0975 6.31658 19.0975 5.68342 18.707 5.29289C18.3165 4.90237 17.6833 4.90237 17.2928 5.29289L11.9999 10.5857L6.70708 5.29289Z"
                fill="#1A1A1A"
              />
            </svg>
          </button>
        </div>

        <button className="flex h-12 items-center justify-center rounded-md bg-[#3C3C3C] text-[15px] font-semibold leading-[150%] tracking-[-0.375px] text-white">
          로그아웃
        </button>

        <div className="flex flex-col">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex h-[54px] flex-col items-start justify-center border-b border-[#EDEDED]"
            >
              <a
                href={item.href}
                className="flex w-full items-center justify-between rounded-lg"
              >
                <span className="flex-1 text-base font-medium leading-[140%] tracking-[-0.4px] text-[#1A1A1A]">
                  {item.label}
                </span>
                <svg
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L5 5L1 9"
                    stroke="#777777"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
