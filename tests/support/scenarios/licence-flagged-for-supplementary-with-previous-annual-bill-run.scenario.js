import buildBillRunEntity from '../entities/bill-run.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { regions, srocStartDate } from '../default-values.js'

export const title = 'Licence flagged for supplementary billing with previous annual bill run'
export const description =
  'A licence starting on the day the sroc scheme began, with a charge version flagged for the next supplementary bill run, plus a sent annual bill run for the year before the current one, so a supplementary bill run has no annual in the current year to pick up from'

export default function () {
  const region = regions.NORTH_EAST

  const { currentFinancialYear } = calculatedDates()

  const licenceEntity = buildLicenceEntity(region)

  licenceEntity.licence.startDate = srocStartDate
  licenceEntity.licenceVersion.startDate = srocStartDate
  licenceEntity.licenceDocument.startDate = srocStartDate
  licenceEntity.licenceDocumentRole.startDate = srocStartDate

  // This is what flags the licence for the next sroc supplementary bill run — without it, fetch-charge-versions
  // (the query the supplementary engine uses to find what to bill) excludes the licence entirely
  licenceEntity.licence.includeInSrocBilling = true

  const previousFinancialYear = {
    startDate: _previousYear(currentFinancialYear.startDate),
    endDate: _previousYear(currentFinancialYear.endDate)
  }

  const billRunEntity = buildBillRunEntity(licenceEntity, previousFinancialYear, region)

  return {
    ...licenceEntity,
    ...billRunEntity
  }
}

function _previousYear(currentFinancialYearDate) {
  const date = new Date(currentFinancialYearDate)

  date.setUTCFullYear(date.getUTCFullYear() - 1)

  return date
}
