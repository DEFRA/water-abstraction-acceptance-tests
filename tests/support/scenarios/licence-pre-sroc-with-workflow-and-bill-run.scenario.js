import billRunData from '../data/bill-run.data.js'
import workflowData from '../data/workflow.data.js'
import licenceWithPreSrocChargeVersionScenario from './licence-with-pre-sroc-charge-version.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with a pre-SRoC charge version and a workflow entry'
export const description =
  'Licence with a current pre-SRoC charge version, sent annual and two-part tariff bill runs, and a charge version workflow entry awaiting review'

export default function () {
  const licence = licenceWithPreSrocChargeVersionScenario()

  const {
    licences: [{ startDate }]
  } = licence

  // The licence's charge version is only eligible for supplementary billing if a bill run has already been sent for
  // the financial year its start date falls in, so we align both bill runs to that year rather than
  // bill-run.data.js's default
  const financialYearEnding = String(new Date(startDate).getUTCFullYear() + 1)

  const annualBillRun = billRunData()
  annualBillRun.billRuns[0].fromFinancialYearEnding = financialYearEnding
  annualBillRun.billRuns[0].toFinancialYearEnding = financialYearEnding

  const twoPartTariffBillRun = billRunData()
  twoPartTariffBillRun.billRuns[0].batchType = 'two_part_tariff'
  twoPartTariffBillRun.billRuns[0].fromFinancialYearEnding = financialYearEnding
  twoPartTariffBillRun.billRuns[0].toFinancialYearEnding = financialYearEnding

  const workflow = workflowData(licence)

  // workflow.data.js defaults the draft charge version to sroc, so we override it to alcs to match this scenario
  workflow.workflows[0].data.chargeVersion.scheme = 'alcs'

  // workflow.data.js defaults createdAt/updatedAt to today, but today falls outside the bill runs' financial year, so we
  // align them to the licence's own start date instead
  workflow.workflows[0].createdAt = '2020-04-01' // two part tariff -
  workflow.workflows[0].updatedAt = '2020-04-01'

  return mergeByKey(licence, annualBillRun, twoPartTariffBillRun, workflow)
}
