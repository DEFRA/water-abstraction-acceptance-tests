import billRunData from '../data/bill-run.data.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import workflowData from '../data/workflow.data.js'
import { today, yesterday } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with a workflow entry, and an annual bill run'
export const description = 'Licence with a workflow entry, and a sent annual bill run'

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
