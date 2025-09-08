import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// cn() merges Tailwind classes correctly
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
