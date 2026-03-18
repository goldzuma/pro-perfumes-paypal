
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const calculatePixDiscount = (price) => {
  return price * 0.10;
};

export const calculatePixPrice = (price) => {
  return price * 0.90;
};
