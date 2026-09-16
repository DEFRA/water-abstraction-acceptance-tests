import buildBillRunEntities from '../entities/bill-runs.entities.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildPresrocBillRunEntities from '../entities/presroc-bill-runs.entities.js'
import buildPresrocChargeVersionEntity from '../entities/presroc-charge-version.entity.js'
import buildPresrocLicenceEntity from '../entities/presroc-licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { includeInPresrocSupplementaryBilling, includeInSrocSupplementaryBilling } from '../helpers/billing.helpers.js'
import { regions, srocStartDate } from '../default-values.js'

export const title = 'Presroc licence flagged for supplementary billing'
export const description =
  "A presroc licence flagged for both the next presroc and sroc supplementary bill runs, plus sent annual bill runs for every financial year from the charge version's start date to the current one, so a supplementary bill run picks up every outstanding presroc and sroc period"

export default function () {
  const region = regions.SOUTHERN

  const { currentFinancialYear } = calculatedDates()

  const presrocLicenceEntity = buildPresrocLicenceEntity(region)
  const billingAccountEntity = buildBillingAccountEntity(presrocLicenceEntity, region)
  const presrocChargeVersionEntity = buildPresrocChargeVersionEntity(presrocLicenceEntity, billingAccountEntity, region)

  includeInPresrocSupplementaryBilling(presrocLicenceEntity, presrocChargeVersionEntity)

  const presrocBillRunEntities = buildPresrocBillRunEntities(
    presrocLicenceEntity,
    billingAccountEntity,
    presrocChargeVersionEntity,
    currentFinancialYear,
    region
  )

  // Sroc
  const chargeVersionEntity = buildChargeVersionEntity(presrocLicenceEntity, billingAccountEntity, region)
  chargeVersionEntity.chargeVersion.versionNumber = presrocChargeVersionEntity.chargeVersion.versionNumber + 1

  const additionalChargeEntity = includeInSrocSupplementaryBilling(
    presrocLicenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    region
  )

  _srocChargeVersionDate(chargeVersionEntity)
  _srocChargeVersionDate(additionalChargeEntity)
  _srocChargeVersion(chargeVersionEntity)

  const billRunEntities = buildBillRunEntities(
    presrocLicenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    currentFinancialYear,
    region
  )

  return {
    ...presrocLicenceEntity,
    ...billingAccountEntity,
    ...mergeByKey(chargeVersionEntity, additionalChargeEntity, presrocChargeVersionEntity),
    ...mergeByKey(...billRunEntities, ...presrocBillRunEntities)
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
