import type { ReactNode } from 'react'

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const PauseIcon = () => (
  <Icon>
    <path d="M9 5v14M15 5v14" />
  </Icon>
)

export const PlayIcon = () => (
  <Icon>
    <path d="M7 5l12 7-12 7z" />
  </Icon>
)

export const UndoIcon = () => (
  <Icon>
    <path d="M9 14L4 9l5-5" />
    <path d="M4 9h11a5 5 0 010 10h-3" />
  </Icon>
)

export const EraserIcon = () => (
  <Icon>
    <path d="M7 21h13" />
    <path d="M3.5 14.5l9-9a2 2 0 012.8 0l3.2 3.2a2 2 0 010 2.8L11 19H7.5l-4-4a.7.7 0 010-.5z" />
  </Icon>
)

export const PencilIcon = () => (
  <Icon>
    <path d="M4 20h4L19 9a2.8 2.8 0 00-4-4L4 16z" />
    <path d="M13.5 6.5l4 4" />
  </Icon>
)

export const MultiSelectIcon = () => (
  <Icon>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <path d="M14 17l2 2 4-4" />
  </Icon>
)

export const BackIcon = () => (
  <Icon>
    <path d="M15 18l-6-6 6-6" />
  </Icon>
)
