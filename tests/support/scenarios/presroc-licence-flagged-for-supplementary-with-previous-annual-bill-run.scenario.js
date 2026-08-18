import billRunData from '../data/bill-run.data.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import presrocLicenceFlaggedForSupplementaryScenario from './presroc-licence-flagged-for-supplementary.scenario.js'

export const title =
  'Presroc licence flagged for presroc and sroc supplementary billing, and a sent annual bill run for the previous year'
export const description =
  'A presroc licence flagged for both the next presroc and sroc supplementary bill runs, plus a sent annual bill run for the year before the current one, so a supplementary bill run has no annual in the current year to pick up from'

export default function () {
  const currentEndYear = new Date(calculatedDates().currentFinancialYear.endDate).getUTCFullYear()

  const licence = presrocLicenceFlaggedForSupplementaryScenario()

  const billRun = billRunData()

  billRun.fromFinancialYearEnding = currentEndYear - 1
  billRun.toFinancialYearEnding = currentEndYear - 1

  return {
    ...licence,
    billRun
  }
}
