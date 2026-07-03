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
