import NepaliDate, { dateConfigMap } from "nepali-date-converter";

/**
 * Bikram Sambat helpers.
 *
 * `nepali-date-converter` does the actual AD <-> BS conversion; everything here
 * is presentation glue (names, digits, month grids) so components never have to
 * touch the library directly.
 */

/** Indexed 0 (Baisakh) - 11 (Chaitra), matching `NepaliDate#getMonth()`. */
export const BS_MONTHS_EN = [
  "Baisakh",
  "Jestha",
  "Asar",
  "Shrawan",
  "Bhadra",
  "Aswin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
] as const;

export const BS_MONTHS_NP = [
  "बैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कात्तिक",
  "मंसिर",
  "पुस",
  "माघ",
  "फागुन",
  "चैत",
] as const;

export const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const WEEKDAYS_NP = [
  "आइत",
  "सोम",
  "मंगल",
  "बुध",
  "बिहि",
  "शुक्र",
  "शनि",
];

/**
 * The converter ships month tables for 2000-2090 BS. Reading the length of
 * Chaitra needs the *next* year's table, so navigation stops one year short.
 */
export const BS_MIN_YEAR = 2000;
export const BS_MAX_YEAR = 2089;

const NEPALI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export const toNepaliDigits = (value: number | string) =>
  String(value).replace(/\d/g, (digit) => NEPALI_DIGITS[Number(digit)]);

export type BsDate = {
  year: number;
  /** 0 = Baisakh */
  month: number;
  date: number;
  /** 0 = Sunday */
  day: number;
};

/** A single cell of a month grid. `null` cells pad the first/last week. */
export type BsCalendarCell = {
  bsDate: number;
  adDate: Date;
  isToday: boolean;
  /** Saturday — the weekly holiday in Nepal, shown in red on printed calendars. */
  isHoliday: boolean;
};

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** Converts an AD date to BS parts. Returns `null` outside the supported range. */
export const toBsDate = (date: Date): BsDate | null => {
  if (!isValidDate(date)) return null;

  try {
    const nepaliDate = new NepaliDate(date);
    return {
      year: nepaliDate.getYear(),
      month: nepaliDate.getMonth(),
      date: nepaliDate.getDate(),
      day: nepaliDate.getDay(),
    };
  } catch {
    return null;
  }
};

/** Number of days in a BS month — read straight off the converter's tables. */
export const getBsMonthLength = (year: number, month: number) =>
  dateConfigMap[String(year)]?.[BS_MONTHS_EN[month]] ?? 30;

/** AD date that a given BS day falls on. Returns `null` outside the range. */
export const bsToAd = (year: number, month: number, date: number) => {
  try {
    return new NepaliDate(year, month, date).toJsDate();
  } catch {
    return null;
  }
};

/**
 * "बैशाख १५, २०८३" / "Baisakh 15, 2083"
 */
export const formatBsDate = (bs: BsDate, language: "en" | "np" = "en") =>
  language === "np"
    ? `${BS_MONTHS_NP[bs.month]} ${toNepaliDigits(bs.date)}, ${toNepaliDigits(
        bs.year
      )}`
    : `${BS_MONTHS_EN[bs.month]} ${bs.date}, ${bs.year}`;

/**
 * Builds a Sunday-first month grid for a BS month. Leading/trailing `null`s pad
 * the grid to whole weeks so a `grid-cols-7` layout lines up without offsets.
 */
export const buildBsMonthGrid = (
  year: number,
  month: number,
  today = new Date()
): (BsCalendarCell | null)[] => {
  const firstAd = bsToAd(year, month, 1);
  if (!firstAd) return [];

  const monthLength = getBsMonthLength(year, month);
  const leadingBlanks = firstAd.getDay();

  const cells: (BsCalendarCell | null)[] =
    Array<null>(leadingBlanks).fill(null);

  for (let date = 1; date <= monthLength; date += 1) {
    // Day arithmetic on the AD side: the BS month is contiguous, so stepping
    // the AD date avoids one library call (and one throw risk) per cell.
    const adDate = new Date(
      firstAd.getFullYear(),
      firstAd.getMonth(),
      firstAd.getDate() + date - 1
    );

    cells.push({
      bsDate: date,
      adDate,
      isToday: sameDay(adDate, today),
      isHoliday: adDate.getDay() === 6,
    });
  }

  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
};

/** Steps a BS month by `offset` months, clamped to the supported year range. */
export const shiftBsMonth = (year: number, month: number, offset: number) => {
  const absolute = year * 12 + month + offset;
  const nextYear = Math.floor(absolute / 12);
  const nextMonth = absolute - nextYear * 12;

  if (nextYear < BS_MIN_YEAR) return { year: BS_MIN_YEAR, month: 0 };
  if (nextYear > BS_MAX_YEAR) return { year: BS_MAX_YEAR, month: 11 };

  return { year: nextYear, month: nextMonth };
};
