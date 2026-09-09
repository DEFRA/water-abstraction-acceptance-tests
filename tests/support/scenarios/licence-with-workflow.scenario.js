import buildLicenceEntity from '../entities/licence.entity.js'
import { regions } from '../default-values.js'
import workflowData from '../data/workflow.data.js'

export const title = 'Licence in workflow'
export const description = 'A licence, licence holder (company), and a workflow entry'

export default function (region = null) {
  if (!region) {
    region = regions.SOUTHERN
  }

  const licenceEntity = buildLicenceEntity(region)
  const workflow = workflowData(licenceEntity.licence)

  return {
    ...licenceEntity,
    workflow
  }
}
