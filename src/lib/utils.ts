import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: Date | string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('vi-VN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}


export function formatTime(input: Date | string | number): string {
  const date = new Date(input);
  const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
   return `${timeFormatter.format(date)}`
}