import buildBillRunEntities from 'water-abstraction-engine/cli/world/entities/bill-runs.entities.js'
import buildBillingAccountEntity from 'water-abstraction-engine/cli/world/entities/billing-account.entity.js'
import buildChargeVersionEntity from 'water-abstraction-engine/cli/world/entities/charge-version.entity.js'
import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildLicenceEntity from 'water-abstraction-engine/cli/world/entities/licence.entity.js'
import { calculatedDates } from 'water-abstraction-engine/cli/world/helpers/calculated-dates.helpers.js'
import { mergeByKey } from 'water-abstraction-engine/cli/world/helpers/scenario.helpers.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'
import workflowData from 'water-abstraction-engine/cli/world/data/workflow.data.js'
import { yesterday } from 'water-abstraction-engine/cli/world/helpers/date.helpers.js'

export const title = 'Licence in workflow, and annual bill runs'
export const description =
  "Licence in workflow, and sent annual bill runs for every financial year from the charge version's start date to the current one, with the workflow entry created before the bill runs so it can test supp. flagging behaviour"

/**
 * For a bill run to exist, there needs to be a charge version.
 *
 * This is omitted from the scenario name and description to keep them concise, but is still part of the scenario.
 */
export default function (region = null) {
  if (!region) {
    region = regions.SOUTH_WEST
  }

  const {
    billingPeriods: {
      annual: [annualDates]
    }
  } = calculatedDates()

  const licenceEntity = buildLicenceEntity(region)
  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)
  const billRunEntities = buildBillRunEntities(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    annualDates,
    region
  )

  const workflow = workflowData(licenceEntity.licence)

  // The workflow createdAt date is used to show the supplementary billing flag.
  workflow.createdAt = yesterday()
  workflow.updatedAt = yesterday()

  const internalUserEntity = buildInternalUserEntity()

  return {
    ...licenceEntity,
    ...billingAccountEntity,
    ...chargeVersionEntity,
    ...mergeByKey(...billRunEntities),
    workflow,
    ...internalUserEntity
  }
}
