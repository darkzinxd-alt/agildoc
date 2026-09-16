export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <svg viewBox="0 0 40 40" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="#1A2B4C" />
        <path d="M20 12V28M12 20H28" stroke="#00D289" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M23 15L28 20L23 25" stroke="#00D289" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-extrabold text-3xl tracking-tight text-primary-blue">
        Agil<span className="text-action-mint">Doc</span>
      </span>
    </div>
  )
}
