import { formatDateToIso } from '../../../../tests/support/helpers/date.helpers.js'
import licenceVersionData from '../../../../tests/support/data/licence-version.data.js'
import licenceVersionPurposeData from '../../../../tests/support/data/licence-version-purpose.data.js'
import licenceVersionPurposePointData from '../../../../tests/support/data/licence-version-purpose-point.data.js'

/**
 * Add a licence version to a licence
 *
 * The licence's latest version becomes superseded, and ends the day before the new one starts. The new version is the
 * current one. It is the next issue, starts 60 days after the one it replaces and is for the same licence holder. It has
 * a purpose of its own, linked to the licence's point.
 *
 * Call this again to add another.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} region - the region the licence is in
 */
export function addLicenceVersion(licenceEntity, region) {
  const { address, company, licence, point } = licenceEntity

  // A licence is built with one of each. The first time this is called they are put into lists we can add to
  licenceEntity.licenceVersions ??= [licenceEntity.licenceVersion]
  licenceEntity.licenceVersionPurposes ??= [licenceEntity.licenceVersionPurpose]
  licenceEntity.licenceVersionPurposePoints ??= [licenceEntity.licenceVersionPurposePoint]

  const previous = licenceEntity.licenceVersions.at(-1)
  const current = licenceVersionData(licence, company, address, region)

  current.issue = previous.issue + 1
  current.startDate = _addDays(previous.startDate, 60)

  previous.status = 'superseded'
  previous.endDate = _addDays(current.startDate, -1)

  const purpose = licenceVersionPurposeData(current, region)

  licenceEntity.licenceVersions.push(current)
  licenceEntity.licenceVersionPurposes.push(purpose)
  licenceEntity.licenceVersionPurposePoints.push(licenceVersionPurposePointData(purpose, point))
}

function _addDays(date, days) {
  const result = new Date(date)

  result.setUTCDate(result.getUTCDate() + days)

  return formatDateToIso(result)
}
