// A minimal stand-in for a dependency like Chalk, using ANSI escape codes directly to avoid adding another
// dependency to this project (see recent supply chain attacks via npm packages)

const BOLD = '\x1b[1m'
const BLUE = '\x1b[34m'
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const RESET_ALL = '\x1b[0m'
const RESET_BOLD = '\x1b[22m'
const YELLOW = '\x1b[33m'

/**
 * Log a message in blue, for general info
 *
 * @param {string} message - the message to log
 */
export function logInfo(message) {
  _log(BLUE, message)
}

/**
 * Log a message in red, for errors
 *
 * @param {string} message - the message to log
 */
export function logError(message) {
  _log(RED, message)
}

/**
 * Log a message in green, for success
 *
 * @param {string} message - the message to log
 */
export function logSuccess(message) {
  _log(GREEN, message)
}

/**
 * Log a message in yellow, for warnings
 *
 * @param {string} message - the message to log
 */
export function logWarning(message) {
  _log(YELLOW, message)
}

/**
 * Wrap a message in bold ANSI codes
 *
 * @param {string} message - the message to style
 * @returns {string} the message wrapped in bold
 */
export function styleBold(message) {
  return `${BOLD}${message}${RESET_BOLD}`
}

function _log(color, message) {
  console.log(`${color}${message}${RESET_ALL}`)
}
