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
 * Returns the start date of the return cycle for a given return log start date.
 *
 * Summer cycle is November to October. But if the start date is between January and October, the cycle year is the
 * previous year. For example, a return log with a start date of 2024-03-01 would have a return cycle start date of
 * 2023-11-01. A return log with a start date of 2024-11-01 would have a return cycle start date of 2024-11-01.
 *
 * Winter cycle is April to March. But if the start date is between January and March, the cycle year is the previous
 * year. For example, a return log with a start date of 2024-02-01 would have a return cycle start date of 2023-04-01. A
 * return log with a start date of 2024-04-01 would have a return cycle start date of 2024-04-01.
 *
 * @param {string|Date} returnLogStartDate - The start date of the return log
 * @param {boolean} summer - Whether the return cycle is a summer cycle
 *
 * @returns {Date} The start date of the return cycle
 */
export function determineReturnCycleStartDate(returnLogStartDate, summer) {
  // Just in case the date is passed directly from calculate dates response
  const startDate = new Date(returnLogStartDate)
  const startDateMonth = startDate.getUTCMonth()
  const startDateYear = startDate.getUTCFullYear()

  let cycleYear = startDateYear
  let cycleMonth

  if (summer) {
    cycleMonth = '11'

    if (startDateMonth < 11) {
      cycleYear = startDateYear - 1
    }
  } else {
    cycleMonth = '04'

    if (startDateMonth < 3) {
      cycleYear = startDateYear - 1
    }
  }

  return new Date(`${cycleYear}-${cycleMonth}-01`)
}

/*
 * Determines the display status of a return log based on its due date, relative to today
 *
 * A return log is considered 'due' for the 28 days leading up to its due date. Before that window it is 'not due
 * yet', and after the due date has passed it is 'overdue'.
 *
 * @param {Date | string} dueDate - The due date to compare against today
 *
 * @returns {string} 'overdue', 'due', or 'not due yet'
 */
export function dueDateStatusLabel(dueDate) {
  const dueDateValue = new Date(dueDate)
  const now = today()

  const notDueUntil = new Date(dueDateValue)
  notDueUntil.setDate(notDueUntil.getDate() - 27)

  if (now.getTime() > dueDateValue.getTime()) {
    return 'overdue'
  }

  if (now.getTime() < notDueUntil.getTime()) {
    return 'not due yet'
  }

  return 'due'
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
 * The new start date is calculated by subtracting months from the given start date, which is safe because a
 * period's start date is always the 1st of the month. The new end date is then derived as the day before the given
 * period's start date (periods are contiguous), rather than by subtracting months from the given end date directly -
 * doing that would risk overflowing into the next month when the end date's day-of-month (28, 29, 30 or 31) doesn't
 * exist in the target month, for example subtracting 3 months from 31 December lands on 1 October, not 30 September.
 * The due date is then derived as 28 days after the new end date, matching the convention used across return periods.
 *
 * @param {object} period - The return period to calculate the previous period for
 *
 * @return {object} The previous return period to the one provided
 */
export function previousPeriod(period) {
  const startDate = new Date(period.startDate)

  let monthsBack = 12
  if (period.quarterly) {
    monthsBack = 3
  }

  const endDate = new Date(startDate)
  endDate.setUTCDate(endDate.getUTCDate() - 1)

  startDate.setUTCMonth(startDate.getUTCMonth() - monthsBack)

  let dueDate = null
  if (period.dueDate) {
    dueDate = new Date(endDate)
    dueDate.setUTCDate(dueDate.getUTCDate() + 28)
  }

  return {
    dueDate,
    endDate,
    name: period.name,
    quarterly: period.quarterly,
    startDate
  }
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
 * Transforms a return log's start and end dates into a human-readable strings
 *
 * For example, given the following return log:
 *
 * ```javascript
 * {
 *   startDate: new Date('2025-04-01'),
 *   endDate: new Date('2026-03-31'),
 * }
 * ```
 *
 * It will return
 *
 * ```javascript
 * {
 *   startDate: new Date('2025-04-01'),
 *   endDate: new Date('2026-03-31'),
 *   startDateString: '1 April 2025',
 *   endDateString: '31 March 2026',
 *   dateString: '1 April 2025 to 31 March 2026'
 * }
 * ```
 *
 * @param {object} returnLog - An object representing a return log with a `startDate` and `endDate` property
 *
 * @returns the return log's start and end dates formatted as a human-readable strings, plus the original start and
 * end dates
 */
export function returnLogDateDetails(returnLog) {
  const startDateString = formatLongDate(returnLog.startDate)
  const endDateString = formatLongDate(returnLog.endDate)

  return {
    startDate: returnLog.startDate,
    endDate: returnLog.endDate,
    startDateString,
    endDateString,
    dateString: `${startDateString} to ${endDateString}`
  }
}
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
