import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PoetryResponse {
  painting_prompt: string;
  interpretation: string;
  mood: string;
}

export interface NavItem {
  id: string;
  title: string;
  subtitle: string;
}
