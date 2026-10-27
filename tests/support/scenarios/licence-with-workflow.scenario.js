import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildLicenceEntity from 'water-abstraction-engine/cli/world/entities/licence.entity.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'
import workflowData from 'water-abstraction-engine/cli/world/data/workflow.data.js'

export const title = 'Licence in workflow'
export const description = 'A licence, licence holder (company), and a workflow entry'

export default function (region = null) {
  if (!region) {
    region = regions.SOUTHERN
  }

  const licenceEntity = buildLicenceEntity(region)
  const workflow = workflowData(licenceEntity.licence)

  const internalUserEntity = buildInternalUserEntity()

  return {
    ...licenceEntity,
    workflow,
    ...internalUserEntity
  }
}
