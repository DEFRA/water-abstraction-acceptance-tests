import { formatDateToIso, relativeToToday, today } from '../../../../../../tests/support/helpers/date.helpers.js'

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
 * End a licence a number of years after it started
 *
 * A licence that has ended is built ending in the last few months. This moves the end back, to a number of years after
 * the licence started.
 *
 * The number comes from the list for how the licence ended: expired, lapsed or revoked. Where it has more than one end
 * date it is the list for the first of them, in that order. The licence takes the number at `first` in the list, going
 * back to the start of the list when it runs out. Where the licence started too recently to have been held for that
 * many years it takes the next number in the list that fits.
 *
 * Where the licence has more than one end date they stay in the same order 30 days apart: expired, then lapsed, then
 * revoked. Its licence document, and the licence holder's document role, end on the first.
 *
 * A licence that has not ended is left alone, and so is an expiry date in the future.
 *
 * Call this after everything has been added to the licence.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} yearsHeld - the lists of how many years after it started a licence ended, for example
 * `{ expired: [9, 5], lapsed: [23, 10], revoked: [14, 5] }`
 * @param {number} first - where in the list the number of years for this licence is
 *
 * @returns {object} the same licence entity
 */
export function endAfter(licenceEntity, yearsHeld, first) {
  const { licence, licenceDocument } = licenceEntity

  if (!licenceDocument.endDate) {
    return licenceEntity
  }

  let yearsHeldForEndType = yearsHeld.revoked

  if (_inThePast(licence.expiredDate)) {
    yearsHeldForEndType = yearsHeld.expired
  } else if (licence.lapsedDate) {
    yearsHeldForEndType = yearsHeld.lapsed
  }

  const endDate = _endDateThatFits(licence, licenceDocument.endDate, yearsHeldForEndType, first)

  if (endDate) {
    _moveEnd(licenceEntity, endDate)
  }

  return licenceEntity
}

/**
 * Revoke a licence on a given date
 *
 * This is for a licence that has already been revoked, to move when it was to a date many licences were revoked on.
 *
 * The licence is left alone unless being revoked is the only way it has ended, so one that has also lapsed or expired
 * is. So is one whose last licence version started on or after the date.
 *
 * Call this after everything has been added to the licence.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {string} date - the date the licence was revoked, for example '2005-03-31'
 *
 * @returns {object} the same licence entity
 */
export function revokeOn(licenceEntity, date) {
  const { licence } = licenceEntity
  const licenceVersions = licenceEntity.licenceVersions ?? [licenceEntity.licenceVersion]

  if (!licence.revokedDate || licence.lapsedDate || _inThePast(licence.expiredDate)) {
    return licenceEntity
  }

  if (licenceVersions.at(-1).startDate >= date) {
    return licenceEntity
  }

  _moveEnd(licenceEntity, new Date(date))

  return licenceEntity
}

/**
 * The first end date, going through the list of years held from `first`, that is earlier than the licence ends now
 *
 * @private
 */
function _endDateThatFits(licence, previousEndDate, yearsHeld, first) {
  for (let i = 0; i < yearsHeld.length; i++) {
    const endDate = new Date(licence.startDate)

    endDate.setUTCFullYear(endDate.getUTCFullYear() + yearsHeld[(first + i) % yearsHeld.length])

    if (formatDateToIso(endDate) < previousEndDate) {
      return endDate
    }
  }

  return null
}

/**
 * Whether an end date is set and is before today
 *
 * @private
 */
function _inThePast(date) {
  return Boolean(date) && date < formatDateToIso(today())
}

/**
 * Move the end of a licence that has ended to the given date
 *
 * The licence document and the licence holder's document role end on the date. So does the first end date the licence
 * has in the past, in the order expired, lapsed, revoked. Any others follow 30 days apart.
 *
 * @private
 */
function _moveEnd(licenceEntity, endDate) {
  const { licence, licenceDocument } = licenceEntity
  const previousEndDate = licenceDocument.endDate
  const licenceDocumentRoles = licenceEntity.licenceDocumentRoles ?? [licenceEntity.licenceDocumentRole]

  for (const licenceDocumentRole of licenceDocumentRoles) {
    if (licenceDocumentRole.endDate === previousEndDate) {
      licenceDocumentRole.endDate = formatDateToIso(endDate)
    }
  }

  licenceDocument.endDate = formatDateToIso(endDate)

  for (const endType of ['expiredDate', 'lapsedDate', 'revokedDate']) {
    if (_inThePast(licence[endType])) {
      licence[endType] = formatDateToIso(endDate)

      endDate.setUTCDate(endDate.getUTCDate() + 30)
    }
  }
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
