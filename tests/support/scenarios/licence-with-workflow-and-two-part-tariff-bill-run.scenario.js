import workflowData from '../data/workflow.data.js'
import buildBillRunEntity from '../entities/bill-run.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { yesterday } from '../helpers/date.helpers.js'

export const title = 'Licence in workflow, and a two-part tariff bill run'
export const description =
  "Licence in workflow, and a sent two-part tariff bill run, with the workflow entry created before the bill run's end date so it can test supp. flagging behaviour"

/**
 * For a bill run to exist, there needs to be a charge version.
 *
 * This is omitted from the scenario name and description to keep them concise, but is still part of the scenario.
 */
export default function (calculatedDates) {
  const {
    billingPeriods: {
      twoPartTariff: [twoPartTariffDates]
    }
  } = calculatedDates

  const licenceEntity = buildLicenceEntity()
  const billRunEntity = buildBillRunEntity(licenceEntity, twoPartTariffDates)

  billRunEntity.billRun.batchType = 'two_part_tariff'

  const workflow = workflowData(licenceEntity.licence)

  // The workflow createdAt date is used to show the supplementary billing flag.
  // It should be set to a date before the two-part tariff bill run's end date.
  workflow.createdAt = `${new Date(twoPartTariffDates.endDate).getUTCFullYear()}-01-01`
  workflow.updatedAt = yesterday()

  return {
    ...licenceEntity,
    ...billRunEntity,
    workflow
  }
}
