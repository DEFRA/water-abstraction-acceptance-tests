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
export function compareDates(dateA, dateB) {
  // Math.sign() clamps the result of the subtraction to a minimum of -1 and a maximum of 1
  return Math.sign(dateA - dateB)
}

/**
 * Formats a date to ISO 8601 date format (YYYY-MM-DD)
 *
 * @param {Date} date - The date to format
 *
 * @returns {string} The date formatted as YYYY-MM-DD
 */
export function formatDateToIso(date) {
  const dateValue = new Date(date)

  return dateValue.toISOString().split('T')[0]
}

/**
 * Formats a date into a human readable day, month and year string, for example, '12 September 2021'
 *
 * @param {Date | string} date - The date to be formatted
 *
 * @returns {string | null} The date formatted as a 'DD MMMM YYYY' string
 */
export function formatLongDate(date) {
  if (!date) {
    return null
  }

  const localDate = new Date(date)

  return localDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
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
export function previousPeriod(period) {
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
export function relativeToToday(numberOfDays) {
  const relative = today()

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
export function today() {
  const todaysDate = new Date()

  todaysDate.setHours(0, 0, 0, 0)

  return todaysDate
}
