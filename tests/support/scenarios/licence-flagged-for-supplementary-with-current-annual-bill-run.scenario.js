import billRunData from '../data/bill-run.data.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'

export const title = 'Licence flagged for supplementary billing, and a sent annual bill run for the current year'
export const description =
  'A licence with a charge version flagged for the next supplementary bill run, plus a sent annual bill run for the current year, so a supplementary bill run picks up the one outstanding sroc period'

export default function (dates) {
  const currentEndYear = new Date(dates.currentFinancialYear.endDate).getUTCFullYear()

  const licence = licenceWithChargeVersionScenario()

  // This is what flags the licence for the next sroc supplementary bill run — without it, fetch-charge-versions
  // (the query the supplementary engine uses to find what to bill) excludes the licence entirely
  licence.licence.includeInSrocBilling = true

  const billRun = billRunData()

  billRun.fromFinancialYearEnding = currentEndYear
  billRun.toFinancialYearEnding = currentEndYear

  return {
    ...licence,
    billRun
  }
}
