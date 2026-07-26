/* eslint-disable prettier/prettier */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * `crypto.randomUUID()` only exists in secure contexts (HTTPS, or localhost).
 * Served over plain HTTP — which this app currently is in some environments —
 * `crypto.randomUUID` is simply undefined, and every call site using it
 * directly throws. Use this everywhere a client-side id is needed instead.
 */
export function generateId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}