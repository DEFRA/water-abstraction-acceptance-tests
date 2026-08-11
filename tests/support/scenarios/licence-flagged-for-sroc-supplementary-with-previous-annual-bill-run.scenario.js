import billRunData from '../data/bill-run.data.js'
import { srocStartDate } from '../default-values.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'

export const title =
  'Licence starting on the sroc scheme start date, flagged for sroc supplementary billing, and a sent annual bill run for the previous year'
export const description =
  'A licence starting on the day the sroc scheme began, with an sroc charge version flagged for the next sroc supplementary bill run, plus a sent annual bill run for the year before the current one, so a supplementary bill run has no annual in the current year to pick up from'

export default function (dates) {
  const currentEndYear = new Date(dates.currentFinancialYear.endDate).getUTCFullYear()

  const licenceEntity = buildLicenceEntity()

  licenceEntity.licence.startDate = srocStartDate
  licenceEntity.licenceVersion.startDate = srocStartDate
  licenceEntity.licenceDocument.startDate = srocStartDate
  licenceEntity.licenceDocumentRole.startDate = srocStartDate

  // This is what flags the licence for the next sroc supplementary bill run — without it, fetch-charge-versions
  // (the query the supplementary engine uses to find what to bill) excludes the licence entirely
  licenceEntity.licence.includeInSrocBilling = true

  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity.company,
    licenceEntity.address,
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose
  )

  const billRun = billRunData()

  billRun.fromFinancialYearEnding = currentEndYear - 1
  billRun.toFinancialYearEnding = currentEndYear - 1

  return {
    ...licenceEntity,
    ...chargeVersionEntity,
    billRun
  }
}
