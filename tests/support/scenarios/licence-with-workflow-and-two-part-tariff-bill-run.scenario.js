import billRunData from '../data/bill-run.data.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import workflowData from '../data/workflow.data.js'
import { today, yesterday } from '../helpers/date.helpers.js'

export const title = 'Licence in workflow, and a two-part tariff bill run'
export const description =
  "Licence in workflow, and a sent two-part tariff bill run, with the workflow entry created before the bill run's end date so it can test supp. flagging behaviour"

/**
 * For a bill run to exist, there needs to be a charge version.
 *
 * This is omitted from the scenario name and description to keep them concise, but is still part of the scenario.
 */
export default function (calculatedDates) {
  const licence = licenceWithChargeVersionScenario()

  const {
    billingPeriods: {
      twoPartTariff: [twoPartTariffDates]
    }
  } = calculatedDates

  const billRun = billRunData()

  billRun.createdAt = today()
  billRun.batchType = 'two_part_tariff'
  billRun.fromFinancialYearEnding = new Date(twoPartTariffDates.endDate).getUTCFullYear()
  billRun.toFinancialYearEnding = new Date(twoPartTariffDates.endDate).getUTCFullYear()

  const workflow = workflowData(licence.licence)

  // The workflow createdAt date is used to show the supplementary billing flag.
  // It should be set to a date before the two-part tariff bill run's end date.
  workflow.createdAt = `${new Date(twoPartTariffDates.endDate).getUTCFullYear()}-01-01`
  workflow.updatedAt = yesterday()

  return {
    ...licence,
    billRun,
    workflow
  }
}
