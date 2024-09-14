import { DateTime, Duration, DurationLike } from "luxon"

export const TIME_FORMAT = "HH:mm"

export function dateAndTimeToISO(date: string, time: string, offset: DurationLike = {}) {
  const baseDate = DateTime.fromISO(date).startOf("day")
  const { hour, minute } = DateTime.fromFormat(time, "HH:mm:ss")
  return baseDate.set({ hour, minute }).plus(offset).toUTC().toISO({ suppressMilliseconds: true })
}

/**
 * Humanizes an arbitrary number of seconds into minutes with optional rounding
 * @param seconds The number of seconds to transform
 * @param rounded If `true`, the resulting time will be rounded to the nearest minute digit, otherwise will have 3 decimal digits. Defaults to `false`
 * @returns A string containing the humanized time in minutes (for example `45,442 min`)
 */
export function humanizeSeconds(seconds?: number, rounded: boolean = true) {
  if (seconds === undefined || isNaN(seconds)) {
    seconds = 0
  }

  let dur = Duration.fromObject({ seconds }).shiftTo("minutes")
  if (dur.hours === 0) {
    dur = dur.shiftTo("minutes")
  }

  return dur
    .toHuman({
      listStyle: "short",
      unitDisplay: "short",
      minimumFractionDigits: rounded ? 0 : 3,
      maximumFractionDigits: rounded ? 0 : 3,
    })
    .replace(",", ".")
}

export function parseTime(base: DateTime, timeStr: string): DateTime | undefined {
  try {
    const parsedTime = DateTime.fromFormat(timeStr, TIME_FORMAT)

    return base.set({ hour: parsedTime.hour, minute: parsedTime.minute, second: 0 })
  } catch {
    return undefined
  }
}

export function formatLocalDateHumanReadable(date: string | DateTime | undefined | null) {
  if (typeof date === "string") {
    date = DateTime.fromISO(date)
  }

  if (!date || !date.isValid) {
    return "--"
  }

  return date.toLocal().toFormat("dd/MM/yyyy")
}

export function formatLocalDateTimeHumanReadable(time: string | DateTime | undefined | null) {
  if (typeof time === "string") {
    time = DateTime.fromISO(time)
  }

  if (!time || !time.isValid) {
    return "--"
  }

  return time.toLocal().toFormat("dd/MM/yyyy HH:mm")
}

export function formatLocalTimeHumanReadable(time: string | DateTime | undefined | null) {
  if (typeof time === "string") {
    time = DateTime.fromISO(time)
  }

  if (!time || !time.isValid) {
    return "--"
  }

  return time.toLocal().toFormat("HH:mm")
}
