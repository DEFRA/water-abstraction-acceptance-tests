import buildBillRunEntities from '../entities/bill-runs.entities.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { includeInSrocSupplementaryBilling } from '../helpers/billing.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regions, srocStartDate } from '../default-values.js'

export const title = 'Licences flagged for supplementary'
export const description =
  'Three licences, each with a charge version that starts on the sroc scheme start date and its own billing account, flagged for the next sroc supplementary bill run, plus sent annual bill runs for every sroc financial year billing all three.'

export default function (region = null) {
  if (!region) {
    region = regions.NORTH_WEST
  }

  const { currentFinancialYear } = calculatedDates()

  const firstLicence = _flaggedLicence(region, currentFinancialYear)
  const secondLicence = _flaggedLicence(region, currentFinancialYear)
  const thirdLicence = _flaggedLicence(region, currentFinancialYear)

  _billInSameBillRuns(firstLicence.billRunEntities, secondLicence.billRunEntities)
  _billInSameBillRuns(firstLicence.billRunEntities, thirdLicence.billRunEntities)

  return mergeByKey(_scenarioData(firstLicence), _scenarioData(secondLicence), _scenarioData(thirdLicence))
}

/**
 * Moves a licence's bills into the matching year's bill run already built for another licence, and drops its own
 * bill runs, so each financial year has a single annual bill run billing every licence
 *
 * The bill runs are matched by position, which works because every licence's charge version starts on the sroc start
 * date, so each licence's bill runs cover the same financial years in the same order.
 *
 * @private
 */
function _billInSameBillRuns(sharedBillRunEntities, billRunEntities) {
  billRunEntities.forEach((billRunEntity, index) => {
    const { billRun } = sharedBillRunEntities[index]

    billRunEntity.bill.billRunId = billRun.id

    billRun.invoiceCount += billRunEntity.billRun.invoiceCount
    billRun.invoiceValue += billRunEntity.billRun.invoiceValue
    billRun.netTotal += billRunEntity.billRun.netTotal

    delete billRunEntity.billRun
  })
}

/**
 * Builds a licence with its own billing account, a charge version from the sroc start date, sent annual bill runs for
 * every sroc financial year, and the additional charge that flags it for the next sroc supplementary bill run
 *
 * @private
 */
function _flaggedLicence(region, currentFinancialYear) {
  const licenceEntity = buildLicenceEntity(region)

  // Without this, both the licence and its charge version only cover the last year or so (their default start
  // dates), so there's nothing for a supplementary bill run to pick up in earlier sroc periods
  licenceEntity.licence.startDate = srocStartDate
  licenceEntity.licenceVersion.startDate = srocStartDate
  licenceEntity.licenceDocument.startDate = srocStartDate
  licenceEntity.licenceDocumentRole.startDate = srocStartDate

  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)
  const billRunEntities = buildBillRunEntities(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    currentFinancialYear,
    region
  )

  const additionalChargeEntity = includeInSrocSupplementaryBilling(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    region
  )

  return { licenceEntity, billingAccountEntity, chargeVersionEntity, additionalChargeEntity, billRunEntities }
}

/**
 * Flattens a licence built by `_flaggedLicence()` into scenario data, merging its charge versions and bill runs by key
 *
 * @private
 */
function _scenarioData(flaggedLicence) {
  const { licenceEntity, billingAccountEntity, chargeVersionEntity, additionalChargeEntity, billRunEntities } =
    flaggedLicence

  return {
    ...licenceEntity,
    ...billingAccountEntity,
    ...mergeByKey(chargeVersionEntity, additionalChargeEntity),
    ...mergeByKey(...billRunEntities)
  }
}
