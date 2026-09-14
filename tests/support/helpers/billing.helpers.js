import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import { convertCubicMetresToMegalitres } from './conversion.helpers.js'
import { mergeByKey } from './scenario.helpers.js'
import { asArrays } from './wire-format.helpers.js'
import { srocStartDate } from '../default-values.js'
import { formatDateToIso } from './date.helpers.js'

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

/**
 *
 * @param presrocLicenceEntity
 * @param presrocChargeVersionEntity
 */
export function includeInPresrocBilling(presrocLicenceEntity, presrocChargeVersionEntity) {
  // This is what flags the licence for the next presroc and sroc supplementary bill runs — without it, each
  // engine's charge version query excludes the licence entirely
  presrocLicenceEntity.licence.includeInPresrocBilling = 'yes'

  // The presroc charge version ends the day before the sroc one below begins, reflecting a licence that was
  // properly superseded at the scheme boundary rather than one left open-ended
  const presrocChargeVersionEndDate = new Date(srocStartDate)

  presrocChargeVersionEndDate.setUTCDate(presrocChargeVersionEndDate.getUTCDate() - 1)

  presrocChargeVersionEntity.chargeVersion.endDate = formatDateToIso(presrocChargeVersionEndDate)
}
