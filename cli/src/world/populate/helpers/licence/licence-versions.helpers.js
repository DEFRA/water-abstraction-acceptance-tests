import addressData from '../../../../../../tests/support/data/address.data.js'
import companyAddressData from '../../../../../../tests/support/data/company-address.data.js'
import companyData from '../../../../../../tests/support/data/company.data.js'
import { formatDateToIso } from '../../../../../../tests/support/helpers/date.helpers.js'
import licenceDocumentRoleData from '../../../../../../tests/support/data/licence-document-role.data.js'
import licenceVersionPurposeConditionData from '../../../../../../tests/support/data/licence-version-purpose-condition.data.js'
import licenceVersionData from '../../../../../../tests/support/data/licence-version.data.js'
import licenceVersionPurposeData from '../../../../../../tests/support/data/licence-version-purpose.data.js'
import licenceVersionPurposePointData from '../../../../../../tests/support/data/licence-version-purpose-point.data.js'
import { addPurpose } from './purposes.helpers.js'
import { conditionExternalId } from './conditions.helpers.js'

/**
 * Give a licence a new licence version because a purpose was added
 *
 * The new version is the next issue. It has every purpose the version before it had, and one more.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} region - the region the licence is in
 *
 * @returns {object} the same licence entity
 */
export function addPurposeToNewVersion(licenceEntity, region) {
  const { previous, current } = _newLicenceVersion(licenceEntity, region)

  current.issue = previous.issue + 1

  addPurpose(licenceEntity, region)

  return licenceEntity
}

/**
 * Give a licence a new licence version because a detail on the last one was wrong
 *
 * The new version is the next increment of the same issue. Nothing else changes.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} region - the region the licence is in
 *
 * @returns {object} the same licence entity
 */
export function correct(licenceEntity, region) {
  const { previous, current } = _newLicenceVersion(licenceEntity, region)

  current.issue = previous.issue
  current.increment = previous.increment + 1

  return licenceEntity
}

/**
 * Give a licence a new licence version because it was transferred to a new licence holder
 *
 * The new version is the next issue, and is for a different company at a different address. The previous licence
 * holder's document role ends when their version does, and the new licence holder's starts when theirs does.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} region - the region the licence is in
 *
 * @returns {object} the same licence entity
 */
export function transfer(licenceEntity, region) {
  const { licenceDocument } = licenceEntity
  const { previous, current } = _newLicenceVersion(licenceEntity, region)

  const company = companyData(region)
  const address = addressData()

  current.issue = previous.issue + 1
  current.companyId = company.id
  current.addressId = address.id

  // A licence is built with one of each. The first time this is called they are put into lists we can add to
  licenceEntity.companies ??= [licenceEntity.company]
  licenceEntity.addresses ??= [licenceEntity.address]
  licenceEntity.companyAddresses ??= [licenceEntity.companyAddress]
  licenceEntity.licenceDocumentRoles ??= [licenceEntity.licenceDocumentRole]

  const previousRole = licenceEntity.licenceDocumentRoles.at(-1)
  const currentRole = licenceDocumentRoleData(licenceDocument, company, address)

  previousRole.endDate = previous.endDate
  currentRole.startDate = current.startDate

  // If the licence has already ended, so has its licence document. The new licence holder's role ends with it
  if (licenceDocument.endDate) {
    currentRole.endDate = licenceDocument.endDate
  }

  licenceEntity.companies.push(company)
  licenceEntity.addresses.push(address)
  licenceEntity.companyAddresses.push(companyAddressData(company, address))
  licenceEntity.licenceDocumentRoles.push(currentRole)

  return licenceEntity
}

function _addDays(date, days) {
  const result = new Date(date)

  result.setUTCDate(result.getUTCDate() + days)

  return formatDateToIso(result)
}

/**
 * Supersede a licence's latest licence version and add a new current one
 *
 * The new version starts 60 days after the one it replaces, which ends the day before. It is for the same licence
 * holder, and has a copy of every purpose the version it replaces had, each linked to the same points and with the same
 * conditions.
 *
 * The caller sets the new version's issue and increment, as that depends on why the version changed.
 *
 * @private
 */
function _newLicenceVersion(licenceEntity, region) {
  const { address, company, licence } = licenceEntity

  // A licence is built with one of each. The first time this is called they are put into lists we can add to
  licenceEntity.licenceVersions ??= [licenceEntity.licenceVersion]
  licenceEntity.licenceVersionPurposes ??= [licenceEntity.licenceVersionPurpose]
  licenceEntity.licenceVersionPurposePoints ??= [licenceEntity.licenceVersionPurposePoint]

  const previous = licenceEntity.licenceVersions.at(-1)
  const current = licenceVersionData(licence, company, address, region)

  current.startDate = _addDays(previous.startDate, 60)
  current.companyId = previous.companyId
  current.addressId = previous.addressId

  previous.status = 'superseded'
  previous.endDate = _addDays(current.startDate, -1)

  const previousPurposes = licenceEntity.licenceVersionPurposes.filter((licenceVersionPurpose) => {
    return licenceVersionPurpose.licenceVersionId === previous.id
  })

  for (const previousPurpose of previousPurposes) {
    const purpose = licenceVersionPurposeData(current, region)

    purpose.purposeId.value = previousPurpose.purposeId.value

    const previousPurposePoints = licenceEntity.licenceVersionPurposePoints.filter((licenceVersionPurposePoint) => {
      return licenceVersionPurposePoint.licenceVersionPurposeId === previousPurpose.id
    })

    for (const previousPurposePoint of previousPurposePoints) {
      licenceEntity.licenceVersionPurposePoints.push(
        licenceVersionPurposePointData(purpose, { id: previousPurposePoint.pointId })
      )
    }

    licenceEntity.licenceVersionPurposes.push(purpose)

    const previousConditions = (licenceEntity.licenceVersionPurposeConditions ?? []).filter((condition) => {
      return condition.licenceVersionPurposeId === previousPurpose.id
    })

    for (const previousCondition of previousConditions) {
      const condition = licenceVersionPurposeConditionData(purpose)

      condition.licenceVersionPurposeConditionTypeId.value =
        previousCondition.licenceVersionPurposeConditionTypeId.value
      condition.externalId = conditionExternalId(licenceEntity, purpose)

      licenceEntity.licenceVersionPurposeConditions.push(condition)
    }
  }

  licenceEntity.licenceVersions.push(current)

  return { previous, current }
}
