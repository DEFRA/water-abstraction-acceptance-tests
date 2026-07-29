import billRunData from '../data/bill-run.data.js'
import workflowData from '../data/workflow.data.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with a charge version, a bill run and a workflow entry awaiting set up'
export const description =
  'Licence with a current SRoC charge version, sent annual and two-part tariff bill runs, and a workflow entry still awaiting charge information set up'

export default function () {
  const licence = licenceWithChargeVersionScenario()

  const {
    licences: [{ startDate }],
    licenceVersions: [{ id: licenceVersionId }]
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

  // workflow.data.js defaults to a 'review' entry with a draft charge version, but this scenario needs a licence
  // still waiting for its first charge information set up, so we switch it to a 'to_setup' entry pointing at the
  // licence version instead
  delete workflow.workflows[0].data
  workflow.workflows[0].status = 'to_setup'
  workflow.workflows[0].licenceVersionId = licenceVersionId

  // workflow.data.js defaults createdAt/updatedAt to today, but today falls outside the bill runs' financial year, which
  // stops the two-part tariff flag from showing, so we align them to the licence's own start date instead
  workflow.workflows[0].createdAt = startDate
  workflow.workflows[0].updatedAt = startDate

  return mergeByKey(licence, annualBillRun, twoPartTariffBillRun, workflow)
}
