import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Convert a BigInt balance to a number
export function parseBalance(value: bigint): number {
    const str = value.toString();
    const sliced = `${str.slice(0, -6)}.${str.slice(-6)}`;
    return Number(sliced);
}

// Serialize function that can handle BigInts
export function serialize<T>(obj: T): string {
    const replacer = (key: string, value: unknown) => (typeof value === "bigint" ? value.toString() : value);
    return JSON.stringify(obj, replacer);
}

// Deserialize function that can handle BigInts
export function deserialize<T>(obj: string): T {
    const reviver = (key: string, value: unknown) => {
        if (typeof value === "string") if (/^\d+n$/.test(value)) return BigInt(value.slice(0, -1));

        if (typeof value === "string") if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}./.test(value)) return new Date(value);

        return value;
    };
    return JSON.parse(obj, reviver) as T;
}
