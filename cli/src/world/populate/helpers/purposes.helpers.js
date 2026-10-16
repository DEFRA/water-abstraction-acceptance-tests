import licenceVersionPurposeData from '../../../../../tests/support/data/licence-version-purpose.data.js'
import licenceVersionPurposePointData from '../../../../../tests/support/data/licence-version-purpose-point.data.js'

// A licence is built with one purpose. These are the ones added after it, in order: spray irrigation storage, general
// use, and trickle irrigation direct. All are for agriculture
const PURPOSES_TO_ADD = ['420', '160', '600']

/**
 * Change the purpose a licence is used for
 *
 * A licence is built with a purpose of spray irrigation direct (400), which is two-part tariff. This gives it another,
 * for example general farming and domestic (140), which is not.
 *
 * Call this before anything is added to the licence, as new licence versions copy the purposes of the one before.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {string} purpose - the legacy id of the purpose, for example '140'
 *
 * @returns {object} the same licence entity
 */
export function usedFor(licenceEntity, purpose) {
  licenceEntity.licenceVersionPurpose.purposeId.value = purpose

  return licenceEntity
}

/**
 * Add a purpose to a licence's current licence version
 *
 * The purpose is linked to the licence's point. It is a different purpose from the ones the licence version already
 * has, with the same abstraction period.
 *
 * Call this again to add another, up to three times.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} region - the region the licence is in
 */
export function addPurpose(licenceEntity, region) {
  // A licence is built with one of each. The first time this is called they are put into lists we can add to
  licenceEntity.licenceVersionPurposes ??= [licenceEntity.licenceVersionPurpose]
  licenceEntity.licenceVersionPurposePoints ??= [licenceEntity.licenceVersionPurposePoint]

  // The current licence version is the last one, where the licence has been given more than one
  const licenceVersions = licenceEntity.licenceVersions ?? [licenceEntity.licenceVersion]
  const currentLicenceVersion = licenceVersions.at(-1)

  const existingPurposes = licenceEntity.licenceVersionPurposes.filter((licenceVersionPurpose) => {
    return licenceVersionPurpose.licenceVersionId === currentLicenceVersion.id
  })

  const purpose = licenceVersionPurposeData(currentLicenceVersion, region)

  purpose.purposeId.value = PURPOSES_TO_ADD[existingPurposes.length - 1]

  licenceEntity.licenceVersionPurposes.push(purpose)
  licenceEntity.licenceVersionPurposePoints.push(licenceVersionPurposePointData(purpose, licenceEntity.point))
}

/**
 * The first purpose on the licence's current licence version, which is the last one where it has more than one
 *
 * @param {object} licenceEntity - the licence entity to look in
 *
 * @returns {object} the licence version purpose
 */
export function currentPurpose(licenceEntity) {
  const licenceVersions = licenceEntity.licenceVersions ?? [licenceEntity.licenceVersion]
  const licenceVersionPurposes = licenceEntity.licenceVersionPurposes ?? [licenceEntity.licenceVersionPurpose]
  const currentLicenceVersion = licenceVersions.at(-1)

  return licenceVersionPurposes.find((licenceVersionPurpose) => {
    return licenceVersionPurpose.licenceVersionId === currentLicenceVersion.id
  })
}
