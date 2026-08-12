import billRunData from '../data/bill-run.data.js'
import presrocLicenceFlaggedForSupplementaryScenario from './presroc-licence-flagged-for-supplementary.scenario.js'

export const title =
  'Presroc licence flagged for presroc and sroc supplementary billing, and a sent annual bill run for the previous year'
export const description =
  'A presroc licence flagged for both the next presroc and sroc supplementary bill runs, plus a sent annual bill run for the year before the current one, so a supplementary bill run has no annual in the current year to pick up from'

export default function (dates) {
  const currentEndYear = new Date(dates.currentFinancialYear.endDate).getUTCFullYear()

  const billRun = billRunData()

  billRun.fromFinancialYearEnding = currentEndYear - 1
  billRun.toFinancialYearEnding = currentEndYear - 1

  return {
    ...presrocLicenceFlaggedForSupplementaryScenario(),
    billRun
  }
}
