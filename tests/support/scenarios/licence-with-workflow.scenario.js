import workflowData from '../data/workflow.data.js'
import buildLicenceEntity from '../entities/licence.entity.js'

export const title = 'Licence in workflow'
export const description = 'A licence, licence holder (company), and a workflow entry'

export default function () {
  const licenceEntity = buildLicenceEntity()
  const workflow = workflowData(licenceEntity.licence)

  return {
    ...licenceEntity,
    workflow
  }
}
