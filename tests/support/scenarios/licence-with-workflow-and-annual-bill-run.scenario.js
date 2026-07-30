import billRunData from '../data/bill-run.data.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import workflowData from '../data/workflow.data.js'
import { today, yesterday } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence in workflow, and an annual bill run'
export const description =
  'Licence in workflow, and a sent annual bill run, with the workflow entry created before the bill run so it can test supp. flagging behaviour'

/**
 * For a bill run to exist, there needs to be a charge version.
 *
 * This is omitted from the scenario name and description to keep them concise, but is still part of the scenario.
 */
export default function (calculatedDates) {
  const licence = licenceWithChargeVersionScenario()

  const {
    billingPeriods: {
      annual: [annualDates]
    }
  } = calculatedDates

  const annualBillRun = billRunData()

  annualBillRun.billRuns[0].createdAt = today()
  annualBillRun.billRuns[0].fromFinancialYearEnding = new Date(annualDates.endDate).getUTCFullYear()
  annualBillRun.billRuns[0].toFinancialYearEnding = new Date(annualDates.endDate).getUTCFullYear()

  const workflow = workflowData(licence)

  // The workflow createdAt date is used to show the supplementary billing flag.
  workflow.workflows[0].createdAt = yesterday()
  workflow.workflows[0].updatedAt = yesterday()

  return mergeByKey(licence, annualBillRun, workflow)
}
