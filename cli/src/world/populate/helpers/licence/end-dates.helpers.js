import { formatDateToIso, relativeToToday } from '../../../../../../tests/support/helpers/date.helpers.js'

/**
 * Revoke a licence 30 days ago
 *
 * The most common end date.
 *
 * @param {object} licenceEntity - the licence entity to change
 *
 * @returns {object} the same licence entity
 */
export function revoke(licenceEntity) {
  const revokedDate = formatDateToIso(relativeToToday(-30))

  licenceEntity.licence.revokedDate = revokedDate
  _endDocument(licenceEntity, revokedDate)

  return licenceEntity
}

/**
 * Expire a licence 90 days ago
 *
 * The second most common end date.
 *
 * @param {object} licenceEntity - the licence entity to change
 *
 * @returns {object} the same licence entity
 */
export function expire(licenceEntity) {
  const expiredDate = formatDateToIso(relativeToToday(-90))

  licenceEntity.licence.expiredDate = expiredDate
  _endDocument(licenceEntity, expiredDate)

  return licenceEntity
}

/**
 * Set a licence to expire a year from now
 *
 * Uncommon. The licence has not ended yet, so its licence document and document role are left open.
 *
 * @param {object} licenceEntity - the licence entity to change
 *
 * @returns {object} the same licence entity
 */
export function expireInFuture(licenceEntity) {
  licenceEntity.licence.expiredDate = formatDateToIso(relativeToToday(365))

  return licenceEntity
}

/**
 * Lapse a licence 60 days ago
 *
 * Uncommon.
 *
 * @param {object} licenceEntity - the licence entity to change
 *
 * @returns {object} the same licence entity
 */
export function lapse(licenceEntity) {
  const lapsedDate = formatDateToIso(relativeToToday(-60))

  licenceEntity.licence.lapsedDate = lapsedDate
  _endDocument(licenceEntity, lapsedDate)

  return licenceEntity
}

/**
 * End the licence document and document role on the date the licence ended
 *
 * When a licence has more than one end date they end on the earliest.
 *
 * @private
 */
function _endDocument(licenceEntity, endDate) {
  const { licenceDocument, licenceDocumentRole } = licenceEntity

  if (licenceDocument.endDate && licenceDocument.endDate < endDate) {
    return
  }

  licenceDocument.endDate = endDate
  licenceDocumentRole.endDate = endDate
}
