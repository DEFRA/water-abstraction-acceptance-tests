import billRunData from '../data/bill-run.data.js'
import presrocLicenceFlaggedForSupplementaryScenario from './presroc-licence-flagged-for-supplementary.scenario.js'

export const title =
  'Presroc licence flagged for presroc and sroc supplementary billing, and a sent annual bill run for the current year'
export const description =
  'A presroc licence flagged for both the next presroc and sroc supplementary bill runs, plus a sent annual bill run for the current year, so a supplementary bill run picks up every outstanding presroc and sroc period'

export default function (dates) {
  const currentEndYear = new Date(dates.currentFinancialYear.endDate).getUTCFullYear()

  const licence = presrocLicenceFlaggedForSupplementaryScenario()

  const billRun = billRunData()

  billRun.fromFinancialYearEnding = currentEndYear
  billRun.toFinancialYearEnding = currentEndYear

  return {
    ...licence,
    billRun
  }
}
