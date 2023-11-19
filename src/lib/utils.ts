import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Serialize function that can handle BigInts
export function serialize<T>(obj: T): string {
  const replacer = (key: string, value: unknown) => (typeof value === "bigint" ? value.toString() : value);
  return JSON.stringify(obj, replacer);
}

// Deserialize function that can handle BigInts
export function deserialize<T>(obj: string): T {
  const reviver = (key: string, value: unknown) =>
      typeof value === "string" && /^\d+n$/.test(value) ? BigInt(value.slice(0, -1)) : value;
  return JSON.parse(obj, reviver) as T;
}