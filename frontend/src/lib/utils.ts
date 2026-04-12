import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Polish pluralization function. Eg. 1 mleko, 22 mleka, 35 mlek */
export const polishPlural = (
  singularNominativ: string,
  pluralNominativ: string,
  pluralGenitive: string,
  value: number
) => {
  if (value === 1) {
    return singularNominativ
  } else if (value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20)) {
    return pluralNominativ
  } else {
    return pluralGenitive
  }
}

export const getVw = (baseSize: number, baseVw?: number) => {
  const BASE_VW = baseVw || 1440
  const vw = (baseSize / BASE_VW) * 100

  return `min(${vw}vw,${baseSize}px)`
}