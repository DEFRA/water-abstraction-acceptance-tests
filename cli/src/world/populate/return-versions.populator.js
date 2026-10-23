import buildReturnVersionEntity from '../../../../tests/support/entities/return-version.entity.js'
import { formatDateToIso } from '../../../../tests/support/helpers/date.helpers.js'
import { licenceModel } from './helpers/end-dates.helpers.js'

/**
 * Give the licences their return versions
 *
 * Each licence is given empty lists for its return versions, then its return versions follow its licence versions.
 *
 * Call this after everything else has been added to the licences, as the return versions follow their final licence
 * versions, purposes and points.
 *
 * @param {object[]} licenceEntities - the licence entities to give return versions
 */
export default function returnVersions(licenceEntities) {
  _addReturnLists(licenceEntities)
  _followLicenceVersions(licenceEntities)
}

/**
 * Give every licence empty lists for its return versions, return requirements, and their points and purposes
 *
 * The steps that follow add to them. They are added last, as the load service loads tables in the order their keys
 * first appear, and return versions refer to licences and points.
 *
 * @private
 */
function _addReturnLists(licenceEntities) {
  for (const licenceEntity of licenceEntities) {
    licenceEntity.returnVersions = []
    licenceEntity.returnRequirements = []
    licenceEntity.returnRequirementPoints = []
    licenceEntity.returnRequirementPurposes = []
  }
}

/**
 * Give every licence a return version for each of its licence versions
 *
 * Each licence version that started before the licence ended, or on the day it did, has a return version. It starts
 * when the licence version did and ends when it did. The last one has no end date, even where the licence has ended,
 * as a return version is not ended when its licence is. They are numbered from 100 in order, as NALD numbers them. The
 * first was made for a new licence, and each one after for why its licence version changed.
 *
 * Each has one return requirement for the first purpose on its licence version, from the first point that purpose
 * abstracts from.
 *
 * @private
 */
function _followLicenceVersions(licenceEntities) {
  const FIRST_VERSION = 100

  for (const licenceEntity of licenceEntities) {
    const endDate = _endDate(licenceEntity)
    const licenceVersions = licenceEntity.licenceVersions.filter((licenceVersion) => {
      return !endDate || licenceVersion.startDate <= endDate
    })

    for (let i = 0; i < licenceVersions.length; i++) {
      const licenceVersion = licenceVersions[i]
      const returnVersionEntity = _returnVersionFor(licenceEntity, licenceVersion)
      const { returnVersion } = returnVersionEntity

      returnVersion.startDate = licenceVersion.startDate
      returnVersion.endDate = i < licenceVersions.length - 1 ? licenceVersion.endDate : null
      returnVersion.version = FIRST_VERSION + i
      returnVersion.reason = i === 0 ? 'new-licence' : _reason(licenceVersions[i - 1], licenceVersion)

      licenceEntity.returnVersions.push(returnVersion)
      licenceEntity.returnRequirements.push(returnVersionEntity.returnRequirement)
      licenceEntity.returnRequirementPoints.push(returnVersionEntity.returnRequirementPoint)
      licenceEntity.returnRequirementPurposes.push(returnVersionEntity.returnRequirementPurpose)
    }
  }
}

/**
 * A return version for a licence version, with a return requirement for its first purpose from that purpose's first
 * point
 *
 * @private
 */
function _returnVersionFor(licenceEntity, licenceVersion) {
  const licenceVersionPurpose = licenceEntity.licenceVersionPurposes.find((purpose) => {
    return purpose.licenceVersionId === licenceVersion.id
  })
  const licenceVersionPurposePoint = licenceEntity.licenceVersionPurposePoints.find((purposePoint) => {
    return purposePoint.licenceVersionPurposeId === licenceVersionPurpose.id
  })

  return buildReturnVersionEntity({
    licence: licenceEntity.licence,
    licenceVersionPurpose,
    point: { id: licenceVersionPurposePoint.pointId }
  })
}

/**
 * The reason for a return version, from why its licence version changed from the one before
 *
 * A licence version for a new licence holder is a transfer. One with the same issue is a correction, so a minor change.
 * Any other is a new issue for the same licence holder, which is a purpose being added, so a major change.
 *
 * @private
 */
function _reason(previousLicenceVersion, licenceVersion) {
  if (licenceVersion.companyId !== previousLicenceVersion.companyId) {
    return 'succession-or-transfer-of-licence'
  }

  if (licenceVersion.issue === previousLicenceVersion.issue) {
    return 'minor-change'
  }

  return 'major-change'
}

/**
 * The date a licence ended or will end, which is the earliest of when it expired, lapsed and was revoked
 *
 * @private
 */
function _endDate(licenceEntity) {
  const ends = licenceModel(licenceEntity).$ends()

  return ends ? formatDateToIso(ends.date) : null
}
