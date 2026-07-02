/**
 * Formats a date into a human readable day, month and year string, for example, '12 September 2021'
 *
 * @param {Date | string } date - The date to be formatted
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
