import buildBillRunEntity from '../entities/bill-run.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { regions } from '../default-values.js'
import workflowData from '../data/workflow.data.js'
import { yesterday } from '../helpers/date.helpers.js'

export const title = 'Licence in workflow, and an annual bill run'
export const description =
  'Licence in workflow, and a sent annual bill run, with the workflow entry created before the bill run so it can test supp. flagging behaviour'

/**
 * For a bill run to exist, there needs to be a charge version.
 *
 * This is omitted from the scenario name and description to keep them concise, but is still part of the scenario.
 */
export default function (region = null) {
  if (!region) {
    region = regions.NORTH_EAST
  }

  const {
    billingPeriods: {
      annual: [annualDates]
    }
  } = calculatedDates()

  const licenceEntity = buildLicenceEntity(region)
  const billRunEntity = buildBillRunEntity(licenceEntity, annualDates, region)

  const workflow = workflowData(licenceEntity.licence)

  // The workflow createdAt date is used to show the supplementary billing flag.
  workflow.createdAt = yesterday()
  workflow.updatedAt = yesterday()

  return {
    ...licenceEntity,
    ...billRunEntity,
    workflow
  }
}
