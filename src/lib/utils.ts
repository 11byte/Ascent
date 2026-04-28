import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type URLParamLike = {
  get(name: string): string | null;
  entries(): IterableIterator<[string, string]>;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeFromURL(params: URLParamLike | null | undefined) {
  if (!params) return null;

  const candidateValues = ["roadmap", "data", "tree", "payload"]
    .map((key) => params.get(key))
    .filter((value): value is string => Boolean(value));

  if (candidateValues.length === 0) {
    const firstValue = Array.from(params.entries()).map(([, value]) => value).find(Boolean);
    if (firstValue) {
      candidateValues.push(firstValue);
    }
  }

  for (const rawValue of candidateValues) {
    try {
      return JSON.parse(decodeURIComponent(rawValue));
    } catch {
      try {
        return JSON.parse(rawValue);
      } catch {
        // continue trying other candidates
      }
    }
  }

  return null;
}
