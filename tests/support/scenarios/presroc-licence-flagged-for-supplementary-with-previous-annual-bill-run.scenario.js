import { asArrays } from '../helpers/wire-format.helpers.js'
import buildBillRunEntity from '../entities/bill-run.entity.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildPresrocChargeVersionEntity from '../entities/presroc-charge-version.entity.js'
import buildPresrocLicenceEntity from '../entities/presroc-licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { previousYears } from '../helpers/date.helpers.js'
import { includeInPresrocBilling, includeInSrocSupplementaryBilling } from '../helpers/billing.helpers.js'
import { regions, srocStartDate } from '../default-values.js'

export const title =
  'Presroc licence flagged for presroc and sroc supplementary billing, and a sent annual bill run for the previous year'
export const description =
  'A presroc licence flagged for both the next presroc and sroc supplementary bill runs, plus a sent annual bill run for the year before the current one, so a supplementary bill run has no annual in the current year to pick up from'

export default function () {
  const region = regions.ANGLIAN

  const { currentFinancialYear } = calculatedDates()

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

  const billRunEntity = buildBillRunEntity(
    presrocLicenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    {
      startDate: previousYears(currentFinancialYear.startDate, 1),
      endDate: previousYears(currentFinancialYear.endDate, 1)
    },
    region
  )

  return {
    ...presrocLicenceEntity,
    ...billingAccountEntity,
    ...mergeByKey(
      asArrays(chargeVersionEntity),
      asArrays(additionalChargeEntity),
      asArrays(presrocChargeVersionEntity)
    ),
    ...billRunEntity
  }
}

function _srocChargeVersion(chargeVersionEntity) {
  // the change reason a real presroc-to-sroc transition would have, rather than the "New licence" default
  chargeVersionEntity.chargeVersion.changeReasonId.value = 'Strategic review of charges (SRoC)'
}

function _srocChargeVersionDate(chargeVersionEntity) {
  // Starts on the sroc scheme's first day rather than inheriting the licence's own (pre-sroc) start date
  chargeVersionEntity.chargeVersion.startDate = srocStartDate
}
