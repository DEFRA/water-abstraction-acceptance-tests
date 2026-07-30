import workflowData from '../data/workflow.data.js'
import licenceScenario from './licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence in workflow'
export const description = 'A licence, licence holder (company), and a workflow entry'

export default function () {
  const licence = licenceScenario()

  const workflow = workflowData(licence)

  return mergeByKey(licence, workflow)
}
