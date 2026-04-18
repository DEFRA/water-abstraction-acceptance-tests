/**
 * Colorize log output for better readability
 *
 * This is a simple wrapper around console.log that adds color and style.
 *
 * It is more common to add a dependency like {@link https://github.com/chalk/chalk|Chalk} in order to color and style
 * your CLI. But we have a very simple CLI as a helper in an acceptance test project. We try to avoid adding
 * dependencies where possible, especially in light of recent supply chain attacks. We can recreate what we would do
 * with chalk via this little module, that uses ANSI escape codes.
 *
 * > See {@link https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797|ANSI escape codes} for more details on
 * > how this works.
 *
 * @module LogLib
 */

const BOLD = '\x1b[1m'
const BLUE = '\x1b[34m'
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const RESET_ALL = '\x1b[0m'
const RESET_BOLD = '\x1b[22m'
const YELLOW = '\x1b[33m'

export function logInfo (message) {
  _log(BLUE, message)
}

export function logError (message) {
  _log(RED, message)
}

export function logSuccess (message) {
  _log(GREEN, message)
}

export function logWarning (message) {
  _log(YELLOW, message)
}

export function styleBold(message) {
  return `${BOLD}${message}${RESET_BOLD}`
}

function _log (color, message) {
  console.log(`${color}${message}${RESET_ALL}`)
}
