import workflowData from '../data/workflow.data.js'
import licenceEntity from '../entities/licence.entity.js'

export const title = 'Licence in workflow'
export const description = 'A licence, licence holder (company), and a workflow entry'

export default function () {
  const licence = licenceEntity()
  const workflow = workflowData(licence.licence)

  return {
    ...licence,
    workflow
  }
}
