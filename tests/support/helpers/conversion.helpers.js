import Big from 'big.js'

const MAX_DECIMAL = 6

/**
 * Converts a quantity from cubic metres to megalitres
 *
 * We use **Big.js** to mitigate issues with
 * {@link https://en.wikipedia.org/wiki/Floating-point_error_mitigation | floating-point errors}.
 *
 * The classic example of this in JavaScript is `0.1 + 0.2`. You expect `0.3` but in fact the result is
 * `0.30000000000000004`.
 *
 * @param {number} quantity - the quantity in cubic metres to be formatted and converted to megalitres
 *
 * @returns {number|null} The converted quantity or null if the quantity is null or undefined
 */
export function convertCubicMetresToMegalitres(quantity) {
  if (quantity === null || quantity === undefined) {
    return null
  }

  return Big(quantity).times(0.001).round(MAX_DECIMAL, Big.roundHalfUp).toNumber()
}
