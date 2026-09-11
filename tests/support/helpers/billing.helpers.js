import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import { convertCubicMetresToMegalitres } from './conversion.helpers.js'

/**
 * Flags a licence for supplementary billing, supersedes the current
 * charge version by reference, and creates a new revised version.
 *
 * @private
 */
export function includeInSrocSupplementaryBilling(licenceEntity, billingAccountEntity, chargeVersionEntity, region) {
  // This is what flags the licence for the next sroc supplementary bill run — without it, fetch-charge-versions
  // (the query the supplementary engine uses to find what to bill) excludes the licence entirely
  licenceEntity.licence.includeInSrocBilling = true

  chargeVersionEntity.chargeVersion.status = 'superseded'

  const additionalChargeEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)

  additionalChargeEntity.chargeReference.volume = convertCubicMetresToMegalitres(2000)

  additionalChargeEntity.chargeElement.authorisedAnnualQuantity = convertCubicMetresToMegalitres(2000)

  additionalChargeEntity.chargeVersion.versionNumber = chargeVersionEntity.chargeVersion.versionNumber + 1
  additionalChargeEntity.chargeVersion.changeReasonId = {
    schema: 'public',
    table: 'changeReasons',
    lookup: 'description',
    value: 'Error correction',
    select: 'id'
  }

  return additionalChargeEntity
}
