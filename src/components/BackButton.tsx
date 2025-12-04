export default function BackButton() {
  return (
    <button className="h-8 w-8 rounded-full bg-white" aria-label="뒤로가기">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" transform="matrix(0 -1 -1 0 32 32)" fill="white"/>
        <circle cx="16" cy="16" r="15.5556" transform="matrix(0 -1 -1 0 32 32)" fill="white" stroke="#E2E2E2" strokeWidth="0.888889"/>
        <path d="M12 14.5L16 18.5L20 14.5" stroke="#777777" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
