/**
 * Formats a date into a human readable day, month and year string, for example, '12 September 2021'
 *
 * @param {Date} date - The date to be formatted
 *
 * @returns {string} The date formatted as a 'DD MMMM YYYY' string
 */
function formatLongDate (date) {
  return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

module.exports = {
  formatLongDate
}
