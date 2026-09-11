import buildBillRunEntity from '../entities/bill-run.entity.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { previousYears } from '../helpers/date.helpers.js'
import { regions, srocStartDate } from '../default-values.js'
import { convertCubicMetresToMegalitres } from '../helpers/conversion.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { asArrays } from '../helpers/wire-format.helpers.js'

export const title = 'Licence flagged for supplementary billing with previous annual bill run'
export const description =
  'A licence starting on the day the sroc scheme began, with a charge version flagged for the next supplementary bill run, plus a sent annual bill run for the year before the current one, so a supplementary bill run has no annual in the current year to pick up from'

export default function () {
  const region = regions.NORTH_EAST

  const { currentFinancialYear } = calculatedDates()

  const licenceStartDate = previousYears(currentFinancialYear.startDate, 1)

  const licenceEntity = buildLicenceEntity(region)

  licenceEntity.licence.startDate = licenceStartDate
  licenceEntity.licenceVersion.startDate = licenceStartDate
  licenceEntity.licenceDocument.startDate = licenceStartDate
  licenceEntity.licenceDocumentRole.startDate = licenceStartDate

  // This is what flags the licence for the next sroc supplementary bill run — without it, fetch-charge-versions
  // (the query the supplementary engine uses to find what to bill) excludes the licence entirely
  licenceEntity.licence.includeInSrocBilling = true

  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)

  const billRunEntity = buildBillRunEntity(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    {
      startDate: previousYears(currentFinancialYear.startDate, 1),
      endDate: previousYears(currentFinancialYear.endDate, 1)
    },
    region
  )

  chargeVersionEntity.chargeVersion.status = 'superseded'

  const chargeVersionEntity2 = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)

  chargeVersionEntity2.chargeReference.volume = convertCubicMetresToMegalitres(2000)

  chargeVersionEntity2.chargeElement.authorisedAnnualQuantity = convertCubicMetresToMegalitres(2000)

  chargeVersionEntity2.chargeVersion.versionNumber = 101
  chargeVersionEntity2.chargeVersion.changeReasonId = {
    schema: 'public',
    table: 'changeReasons',
    lookup: 'description',
    value: 'Error correction',
    select: 'id'
  }

  return {
    ...licenceEntity,
    ...billingAccountEntity,
    ...mergeByKey(asArrays(chargeVersionEntity), asArrays(chargeVersionEntity2)),
    ...billRunEntity
  }
}

// todo: this can resue across other scnearios
function _reasonForSrocBilling() {}
