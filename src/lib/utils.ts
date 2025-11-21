import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sample<T>(items: readonly T[]): T {
  if (!items.length) {
    throw new Error('Cannot sample from an empty array');
  }

  const index = Math.floor(Math.random() * items.length);
  return items[index];
}
