import billRunData from '../data/bill-run.data.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { regions, srocStartDate } from '../default-values.js'

export const title = 'Licence flagged for supplementary billing with previous annual bill run'
export const description =
  'A licence starting on the day the sroc scheme began, with a charge version flagged for the next supplementary bill run, plus a sent annual bill run for the year before the current one, so a supplementary bill run has no annual in the current year to pick up from'

export default function () {
  const region = regions.NORTH_EAST

  const { currentFinancialYear } = calculatedDates()

  const currentEndYear = new Date(currentFinancialYear.endDate).getUTCFullYear()

  const licenceEntity = buildLicenceEntity(region)

  licenceEntity.licence.startDate = srocStartDate
  licenceEntity.licenceVersion.startDate = srocStartDate
  licenceEntity.licenceDocument.startDate = srocStartDate
  licenceEntity.licenceDocumentRole.startDate = srocStartDate

  // This is what flags the licence for the next sroc supplementary bill run — without it, fetch-charge-versions
  // (the query the supplementary engine uses to find what to bill) excludes the licence entirely
  licenceEntity.licence.includeInSrocBilling = true

  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, region)

  const billRun = billRunData(region)

  billRun.fromFinancialYearEnding = currentEndYear - 1
  billRun.toFinancialYearEnding = currentEndYear - 1

  return {
    ...licenceEntity,
    ...chargeVersionEntity,
    billRun
  }
}
