/**
 * Compares two dates and returns:
 *
 * -1 if dateA is before dateB
 * 1 if dateA is after dateB
 * 0 if they are the same date
 *
 * This is useful as a helper for sorting dates.
 *
 * @param {Date} dateA - First date to compare
 * @param {Date} dateB - Second date to compare
 *
 * @returns {number} -1 if dateA is before dateB, 1 if dateA is after dateB, 0 if they are the same date
 */
export function compareDates (dateA, dateB) {
  // Math.sign() clamps the result of the subtraction to a minimum of -1 and a maximum of 1
  return Math.sign(dateA - dateB)
}

// We do not control when the tests are run so sometimes we need a date that is within the current financial year when
// they are. For example, when testing billing scenarios we often only want to make charge information changes within
// the current year to avoid additional calculations for previous years.
//
// It defaults to the last possible date. If the current date was 2023-06-05 it would return 2024-03-31. You can
// override the day and month (don't worry about month being zero-indexed - it gets dealt with!) and adjust the year
// by plus or minus as many years as you need.

/**
 * Returns the current financial year (start and end date) amended by the provided day, month, and year adjuster
 *
 * We do not control when the tests are run so sometimes we need a date that is within the _current_ financial year.
 *
 * For example, when testing billing scenarios we often only want to make charge information changes within the current
 * year to avoid additional calculations for previous years.
 *
 * For example, if the current date was 2026-06-05, the current financial year would be 2025-04-01 to 2026-03-31.
 *
 * You can adjust the year with the `yearAdjuster`. So, the came current date but with a year adjuster of -2 would
 * return 2023-04-01 to 2024-03-31, and a year adjuster of +1 would return 2026-04-01 to 2027-03-31.
 *
 * You can alter the end date for the year with the `day` and `month` parameters. So, if you wanted the end date to be
 * 2026-12-31 instead of 2026-03-31, you would set the day to 31 and the month to 12 (or 11 if you forget it's
 * zero-indexed!) The start date will always be the 1st of April.
 *
 * @param {number} [day=31] - The day of the month for the end of the financial year
 * @param {number} [month=3] - The month for the end of the financial year (0-indexed, so March is 2)
 * @param {number} [yearAdjuster=0] - The number of years to adjust the financial year by
 *
 * @returns {object} An object containing the start and end dates of the current financial year, along with their
 * respective day, month, and year components
 */
export function currentFinancialYear (day = 31, month = 3, yearAdjuster = 0) {
  // IMPORTANT! getMonth returns an integer (0-11). So, January is represented as 0 and December as 11. This is why
  // MARCH is 2 rather than 3
  const MARCH = 2

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  let endYear

  if (currentDate.getMonth() <= MARCH) {
    // For example, if currentDate was 2022-02-15 it would fall in financial year 2021-04-01 to 2022-03-31
    endYear = currentYear + yearAdjuster
  } else {
    // For example, if currentDate was 2022-06-15 it would fall in financial year 2022-04-01 to 2023-03-31
    endYear = currentYear + 1 + yearAdjuster
  }

  // Rather than just return the start and end dates, we return them as objects with the both the dates and the date
  // parts so the tests can use them for input fields.
  const result = {
    end: { date: new Date(`${endYear}-${month}-${day}`), day, month, year: endYear },
    start: { date: new Date(`${endYear - 1}-04-01`), day: 1, month: 4, year: endYear - 1 }
  }

  return result
}

/**
 * Formats a date to ISO 8601 date format (YYYY-MM-DD)
 *
 * @param {Date} date - The date to format
 *
 * @returns {string} The date formatted as YYYY-MM-DD
 */
export function formatDateToIso (date) {
  const dateValue = new Date(date)

  return dateValue.toISOString().split('T')[0]
}

/**
 * Given a return period, returns a new period with the same properties but start and end dates moved back 1 period
 *
 * If the given period is quarterly, the dates will be moved back by 3 months. If it's not quarterly, the dates will be
 * moved back by 12 months.
 *
 * @param {object} period - The return period to calculate the previous period for
 *
 * @return {object} The previous return period to the one provided
 */
export function previousPeriod (period) {
  const previousPeriod = {
    dueDate: period.dueDate ? new Date(period.dueDate) : null,
    endDate: new Date(period.endDate),
    name: period.name,
    quarterly: period.quarterly,
    startDate: new Date(period.startDate)
  }

  let monthsBack = 12
  if (period.quarterly) {
    monthsBack = 3
  }

  previousPeriod.endDate.setMonth(previousPeriod.endDate.getMonth() - monthsBack)
  previousPeriod.startDate.setMonth(previousPeriod.startDate.getMonth() - monthsBack)

  if (period.dueDate) {
    previousPeriod.dueDate.setMonth(previousPeriod.dueDate.getMonth() - monthsBack)
  }

  return previousPeriod
}

/**
 * Returns a date relative to today by the specified number of days.
 *
 * If the number of days is positive, it will add that number of days to today. If it is negative, it will subtract that
 * number of days from today.
 *
 * @param {number} numberOfDays - the number of days to add to, or subtract from, today
 *
 * @returns {Date} a date relative to today
 */
export function relativeToToday (numberOfDays) {
  const relative = today()

  // We lean into Math to make this work. Adding two positive numbers, results in a positive value, for example,
  // 12 + +5 = 12 + 5 = 17.
  //
  // However, when you add a negative number to a positive, it will be treated as subtraction, for example,
  // 12 + -5 = 12 - 5 = 7.
  relative.setDate(relative.getDate() + numberOfDays)

  return relative
}

/**
 * Returns today's date with the time set to midnight, for example '2023-01-13T00:00:00.000Z'.
 *
 * A number of dates in our data are held as date-only, and we have to make decisions based on comparing them to
 * today's date. If we don't strip the time when comparing, we get issues where a date is equal to the current date.
 *
 * For example, the return log 'due date' is held in the record as date-only. If we compare it against 'today' without
 * stripping the time, then any return due 'today' would be flagged as overdue when it is still due (just!)
 *
 * This is a handy helper to return 'today' as a date-only value.
 *
 * @returns {Date}
 */
export function today () {
  const todaysDate = new Date()

  todaysDate.setHours(0, 0, 0, 0)

  return todaysDate
}

/**
 * Returns a date object representing tomorrow's date
 *
 * @returns {Date} tomorrow's date
 */
export function tomorrow () {
  const tomorrow = today()

  tomorrow.setDate(tomorrow.getDate() + 1)

  return tomorrow
}

/**
 * Returns a date object representing yesterday's date
 *
 * @returns {Date} yesterday's date
 */
export function yesterday () {
  const yesterday = today()

  yesterday.setDate(yesterday.getDate() - 1)

  return yesterday
}
