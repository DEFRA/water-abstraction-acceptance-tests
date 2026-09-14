import { asArrays } from '../helpers/wire-format.helpers.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildPresrocChargeVersionEntity from '../entities/presroc-charge-version.entity.js'
import buildPresrocLicenceEntity from '../entities/presroc-licence.entity.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { includeInPresrocBilling, includeInSrocSupplementaryBilling } from '../helpers/billing.helpers.js'
import { regions, srocStartDate } from '../default-values.js'

export const title = 'Presroc and sroc licence flagged for presroc and sroc supplementary billing'
export const description =
  'A presroc and sroc licence with both an alcs charge version and a second, ongoing sroc charge version, flagged for both the next presroc and sroc supplementary bill runs'

export default function (region = null) {
  if (!region) {
    region = regions.SOUTH_WEST
  }

  const presrocLicenceEntity = buildPresrocLicenceEntity(region)
  const billingAccountEntity = buildBillingAccountEntity(presrocLicenceEntity, region)
  const presrocChargeVersionEntity = buildPresrocChargeVersionEntity(presrocLicenceEntity, billingAccountEntity, region)

  includeInPresrocBilling(presrocLicenceEntity, presrocChargeVersionEntity)

  // Sroc
  const chargeVersionEntity = buildChargeVersionEntity(presrocLicenceEntity, billingAccountEntity, region)
  const additionalChargeEntity = includeInSrocSupplementaryBilling(
    presrocLicenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    region
  )

  _srocChargeVersionDate(chargeVersionEntity)
  _srocChargeVersionDate(additionalChargeEntity)
  _srocChargeVersion(chargeVersionEntity)

  return mergeByKey(
    asArrays(presrocLicenceEntity),
    asArrays(billingAccountEntity),
    asArrays(chargeVersionEntity),
    asArrays(additionalChargeEntity),
    asArrays(presrocChargeVersionEntity)
  )
}

function _srocChargeVersion(chargeVersionEntity) {
  // the change reason a real presroc-to-sroc transition would have, rather than the "New licence" default
  chargeVersionEntity.chargeVersion.changeReasonId.value = 'Strategic review of charges (SRoC)'
}

function _srocChargeVersionDate(chargeVersionEntity) {
  // Starts on the sroc scheme's first day rather than inheriting the licence's own (pre-sroc) start date
  chargeVersionEntity.chargeVersion.startDate = srocStartDate
}
