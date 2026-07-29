import workflowData from '../data/workflow.data.js'
import licenceScenario from './licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with workflow entry'
export const description = 'Licence with a sroc workflow entry awaiting review'

export default function () {
  const licence = licenceScenario()

  const workflow = workflowData(licence)

  return mergeByKey(licence, workflow)
}
