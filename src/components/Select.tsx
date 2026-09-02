import type { SelectHTMLAttributes } from 'react'

export function Select({
  children,
  className = '',
  wrapperClassName = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { wrapperClassName?: string }) {
  return (
    <div className={`relative inline-block ${wrapperClassName}`}>
      <select {...props} className={`w-full appearance-none bg-white pr-9 ${className}`}>
        {children}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
