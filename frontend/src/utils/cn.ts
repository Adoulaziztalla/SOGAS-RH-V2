import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fonction utilitaire pour combiner des classes CSS conditionnelles
 * Utilise clsx pour la logique conditionnelle et tailwind-merge pour éviter les conflits
 * 
 * @param inputs - Classes CSS à combiner
 * @returns String de classes CSS mergées
 * 
 * @example
 * cn('px-2 py-1', isActive && 'bg-blue-500', 'text-white')
 * cn('px-2', { 'py-1': true, 'bg-blue-500': isActive })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}