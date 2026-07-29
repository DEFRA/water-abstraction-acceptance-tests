import billRunData from '../data/bill-run.data.js'
import workflowData from '../data/workflow.data.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with a charge version and a pre-SRoC draft workflow entry'
export const description =
  'Licence with a current SRoC charge version, sent annual and two-part tariff bill runs, and a pre-SRoC draft charge version workflow entry awaiting review'

export default function () {
  const licence = licenceWithChargeVersionScenario()

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

  // workflow.data.js defaults the draft charge version to sroc, so we override it to alcs (pre-SRoC) for this scenario
  workflow.workflows[0].data.chargeVersion.scheme = 'alcs'

  // workflow.data.js defaults createdAt/updatedAt to today, but today falls outside the bill runs' financial year, which
  // stops the two-part tariff flag from showing, so we override them to match the original cypress scenario instead
  workflow.workflows[0].createdAt = '2020-04-01'
  workflow.workflows[0].updatedAt = '2020-04-01'

  return mergeByKey(licence, annualBillRun, twoPartTariffBillRun, workflow)
}
