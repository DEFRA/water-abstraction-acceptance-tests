import { asArrays } from '../helpers/wire-format.helpers.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import { formatDateToIso } from '../helpers/date.helpers.js'
import { generateAccountNumber } from '../helpers/generators.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import presrocLicenceWithChargeVersionScenario from './presroc-licence-with-charge-version.scenario.js'
import { regions, srocStartDate } from '../default-values.js'
import { includeInSrocBilling } from '../helpers/billing.helpers.js'

export const title = 'Presroc and sroc licence flagged for presroc and sroc supplementary billing'
export const description =
  'A presroc and sroc licence with both an alcs charge version and a second, ongoing sroc charge version, flagged for both the next presroc and sroc supplementary bill runs'

export default function (region = null) {
  if (!region) {
    region = regions.SOUTH_WEST
  }

  const licence = presrocLicenceWithChargeVersionScenario(region)

  // This is what flags the licence for the next presroc and sroc supplementary bill runs — without it, each
  // engine's charge version query excludes the licence entirely
  licence.licence.includeInPresrocBilling = 'yes'

  // The presroc charge version ends the day before the sroc one below begins, reflecting a licence that was
  // properly superseded at the scheme boundary rather than one left open-ended
  const presrocChargeVersionEndDate = new Date(srocStartDate)

  presrocChargeVersionEndDate.setUTCDate(presrocChargeVersionEndDate.getUTCDate() - 1)

  licence.chargeVersion.endDate = formatDateToIso(presrocChargeVersionEndDate)

  const billingAccountEntity = buildBillingAccountEntity(licence, region)
  billingAccountEntity.billingAccount.accountNumber = generateAccountNumber(region)

  const chargeVersionEntity = buildChargeVersionEntity(licence, billingAccountEntity, region)

  const additionalChargeEntity = includeInSrocBilling(licence, billingAccountEntity, chargeVersionEntity, region)

  _srocChargeVersionDate(chargeVersionEntity)
  _srocChargeVersionDate(additionalChargeEntity)
  _srocChargeVersion(chargeVersionEntity)

  return mergeByKey(
    asArrays(licence),
    asArrays(billingAccountEntity),
    asArrays(chargeVersionEntity),
    asArrays(additionalChargeEntity)
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
