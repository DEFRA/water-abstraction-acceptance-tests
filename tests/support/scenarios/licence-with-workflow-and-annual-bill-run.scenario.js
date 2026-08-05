import billRunData from '../data/bill-run.data.js'
import workflowData from '../data/workflow.data.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import licenceEntity from '../entities/licence.entity.js'
import { today, yesterday } from '../helpers/date.helpers.js'

export const title = 'Licence in workflow, and an annual bill run'
export const description =
  'Licence in workflow, and a sent annual bill run, with the workflow entry created before the bill run so it can test supp. flagging behaviour'

/**
 * For a bill run to exist, there needs to be a charge version.
 *
 * This is omitted from the scenario name and description to keep them concise, but is still part of the scenario.
 */
export default function (calculatedDates) {
  const licence = licenceEntity()
  const chargeVersionEntity = buildChargeVersionEntity(
    licence.company,
    licence.address,
    licence.licence,
    licence.licenceVersionPurpose
  )

  const {
    billingPeriods: {
      annual: [annualDates]
    }
  } = calculatedDates

  const billRun = billRunData()

  billRun.createdAt = today()
  billRun.fromFinancialYearEnding = new Date(annualDates.endDate).getUTCFullYear()
  billRun.toFinancialYearEnding = new Date(annualDates.endDate).getUTCFullYear()

  const workflow = workflowData(licence.licence)

  // The workflow createdAt date is used to show the supplementary billing flag.
  workflow.createdAt = yesterday()
  workflow.updatedAt = yesterday()

  return {
    ...licence,
    ...chargeVersionEntity,
    billRun,
    workflow
  }
}
