import billRunData from '../data/bill-run.data.js'
import workflowData from '../data/workflow.data.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { today, yesterday } from '../helpers/date.helpers.js'

export const title = 'Licence with a charge version and a pre-SRoC draft workflow entry'
export const description =
  'Licence with a current SRoC charge version, sent annual and two-part tariff bill runs, and a pre-SRoC draft charge version workflow entry awaiting review'

export default function (calculatedDates) {
  const licence = licenceWithChargeVersionScenario()

  const {
    billingPeriods: {
      twoPartTariff: [twoPartTariffDates]
    }
  } = calculatedDates

  const twoPartTariffBillRun = billRunData()
  twoPartTariffBillRun.billRuns[0].createdAt = today()
  twoPartTariffBillRun.billRuns[0].batchType = 'two_part_tariff'
  twoPartTariffBillRun.billRuns[0].fromFinancialYearEnding = new Date(twoPartTariffDates.endDate).getUTCFullYear()
  twoPartTariffBillRun.billRuns[0].toFinancialYearEnding = new Date(twoPartTariffDates.endDate).getUTCFullYear()

  const workflow = workflowData(licence)

  // The workflow createdAt date is used to show the supplementary billing flag.
  //It should be set to a date within the two-part tariff year.
  workflow.workflows[0].createdAt = `${new Date(twoPartTariffDates.endDate).getUTCFullYear()}-01-01`
  workflow.workflows[0].updatedAt = yesterday()

  return mergeByKey(licence, twoPartTariffBillRun, workflow)
}
